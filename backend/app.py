import vertexai
from vertexai.preview.language_models import ChatModel, InputOutputTextPair
from fastapi import FastAPI
import requests
import json
import os
import subprocess
from fastapi.middleware.cors import CORSMiddleware

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./key.json"


GEN_APP_ES_URL = "<YOUR GEN APP BUILDER ENDPOINT HERE>"

vertexai.init(project="account-pocs", location="us-central1")
chat_model = ChatModel.from_pretrained("chat-bison@001")
parameters = {
    "temperature": 0.2,
    "max_output_tokens": 256,
    "top_p": 0.8,
    "top_k": 40
}


app = FastAPI()

origins = ['*']


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def getCorrectedText(input):
    chat = chat_model.start_chat(
        context="""You are a salesman of an e-commerce store which sells
        furniture,home decor and mattress.
        Sometimes you are given a wrong spelling and your task is to give
        the corrected output with the right spelling and word.
        The input words might be abbreviations or phonetically sounding
        similar to the actual word within the domain.If anything is provided
        out of this context, respond back with \"Unknown\"""",
        examples=[
            InputOutputTextPair(
                input_text="""eng""",
                output_text="""engineered"""
            ),
            InputOutputTextPair(
                input_text="""wod""",
                output_text="""wood"""
            ),
            InputOutputTextPair(
                input_text="""sfa""",
                output_text="""sofa"""
            ),
            InputOutputTextPair(
                input_text="""steal bad""",
                output_text="""steel bed"""
            )
        ]
    )
    response = chat.send_message(f"""{input}""", **parameters)
    return response.text


token = ""


@app.get("/")
async def server_status():
    return {"status": "RUNNING"}


@app.get("/correct/{search_query}")
async def correct(search_query):
    response = getCorrectedText(search_query)
    proc = subprocess.run(['gcloud', 'auth', 'print-access-token'],
                          encoding='utf-8',
                          stdout=subprocess.PIPE)
    bearer_token = proc.stdout
    payload = {
        "query": response,
        "pageSize": 10000,
        "queryExpansionSpec": {"condition": "AUTO"},
        "spellCorrectionSpec": {"mode": "AUTO"},
        "safeSearch": "false"
    }
    headers = {"Content-Type": "application/json",
               "Authorization": "Bearer {}".format(str(bearer_token).strip())}
    res = requests.post(GEN_APP_ES_URL, data=json.dumps(payload), headers=headers)
    return {"corrected_text": response, "search_result": res.json()}
