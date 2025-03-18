import Header from "../components/Header";
import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Search query:", query);
    // Implement search functionality here
    const response = await fetch(
      "https://api.data.gov.sg/v1/transport/carpark-availability",
      {
        // Updated to the correct signup endpoint
        method: "GET",
      },
    );
    const data = await response.json();
    console.log(response, data);
  };

  return (
    <header>
      <Header></Header>
      <form onSubmit={handleSubmit} className="mx-auto max-w-md">
        <label htmlFor="search-input" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
            <svg
              className="h-4 w-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="search-input"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Search Location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
          <button
            type="submit"
            className="absolute end-2.5 bottom-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </form>
    </header>
  );
}
