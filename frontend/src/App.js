/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import "./App.css";
import Home from "./components/home";
import axios from "axios";
const URL = "http://127.0.0.1:8000/correct/sfaset";
const BASE_URL = "http://127.0.0.1:8000/correct/";

function App() {
  const [correctedSearchTerm, setCorrectedSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      const response = await axios.get(URL);
      console.log("🚀 ~ file: App.js:15 ~ fetchProducts ~ search Query:", URL);

      setProducts(response.data.search_result.results);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  async function searchProducts(searchTerm) {
    setProducts([]);
    setLoading(true);
    const response = await axios.get(BASE_URL + searchTerm.target.value);
    setCorrectedSearchTerm(response.data.corrected_text);
    console.log(
      "🚀 ~ file: App.js:14 ~ searchProducts ~ Search Term:",
      searchTerm.target.value
    );
    setProducts(response.data.search_result.results);
    setLoading(false);
  }

  return (
    <div className="App px-8 py-8">
      <div>
        <label
          for="default-search"
          class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            onChange={(value) => setSearchTerm(value)}
            class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-violet-500 dark:focus:border-violet-500"
            placeholder="Search Furnitures, Mattress and many more..."
            required
          />
          <button
            onClick={() => {
              searchProducts(searchTerm);
            }}
            class="text-white absolute right-2.5 bottom-2.5 bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </div>

      {searchTerm && searchTerm !== "" ? (
        <div className="ml-2 mt-4">
          <p className="normalcase text-s text-left justify-start">
            You are searching for{" "}
            <span className="font-bold text-m text-violet-950	">
              {correctedSearchTerm}
            </span>
          </p>
        </div>
      ) : null}
      {loading ? (
        <div className="spinner-container content-center justify-center text-center flex item-center mt-10">
          <div className="loading-spinner content-center justify-center text-center"></div>
        </div>
      ) : null}
      {products && products.length > 0 ? <Home products={products} /> : null}
      {products && products.length == 0 ? (
        <div>
          {loading ? (
            <p className="text-2xl font-bold text-center justify-center">
              Searching...
            </p>
          ) : (
            <p className="text-2xl font-bold text-center justify-center">
              No results found
            </p>
          )}
        </div>
      ) : null}
      {!products ? (
        <p className="text-2xl font-bold text-center justify-center">
          No results found
        </p>
      ) : null}
    </div>
  );
}

export default App;
