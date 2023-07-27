import React from "react";

function Home(props) {
  return (
    <div class="grid grid-cols-6 pad2x pad2y mr-4 mt-4">
      {props.products.map((result) => {
        return (
          <div class="max-w-sm rounded overflow-hidden shadow-lg  pad2x pad2y mr-6 mt-8 justify-start content-start bg-slate-200">
            <img
              class="w-full"
              src={result.document.structData.image_url_link}
              alt="Sunset in the mountains"
            />
            <div class="px-6 py-4">
              <div class="font-bold text-l mb-2 text-left">
                {result.document.structData.product_title}
              </div>
              <p class="text-gray-700 text-l text-left">
                {result.document.structData.product_category}
              </p>
            </div>
            <div class="px-6 pt-4 pb-2">
              <span class="inline-block  bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                {result.document.structData.product_type}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
