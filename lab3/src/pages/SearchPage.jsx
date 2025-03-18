import Header from "../components/Header";
import { AuthContext } from "../auth/AuthWrapper";
import { useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { searchForWorkspaceRoot } from "vite";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${query}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;
    const authToken = process.env.ONEMAP_API_KEY;

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `${authToken}`, // API token for authorization
      },
    })
      .then((response) => response.json()) // Parse response as JSON
      .then((data) => {
        console.log(data);
        const searchResults = document.querySelector("#search-results");
        searchResults.innerHTML = "";
      }) // Log the data to the console
      .catch((error) => console.error("Error:", error)); // Log any errors
  };

  return (
    <header>
      <Header></Header>
      <main className="grid gap-1 p-4">
        <section className="rounded-lg bg-blue-50 p-4">
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
                placeholder="Search Location"
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
        </section>
        <section
          id="search-results"
          className="overflow-hidden rounded-lg border-1 border-[#dee2e6] shadow-md"
        ></section>
      </main>
      {/* <iframe
        src="https://www.onemap.gov.sg/minimap/minimap.html?mapStyle=Default&zoomLevel=15"
        width="450px"
        height="450px"
        scrolling="no"
        frameBorder="0"
        allowFullScreen="allowfullscreen"
      ></iframe> */}
    </header>
  );
}
