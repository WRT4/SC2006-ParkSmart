import Header from "../components/Header";
import { AuthContext } from "../auth/AuthWrapper";
import { useState, useContext, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import SearchResult from "../components/SearchResult";
import SVY21 from "../utils/SVY21.js";
import DisplayResult from "../components/DisplayResult.jsx";
// import { orderByDistance, getDistance } from "geolib";
// import { sortByDistance } from "sort-by-distance";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [records, setRecords] = useState([]);
  const { user } = useContext(AuthContext);

  const mapUrl =
    "https://www.onemap.gov.sg/minimap/minimap.html?mapStyle=Default&zoomLevel=15";
  const mapSrc = lat && lng ? `${mapUrl}&latLng=${lat},${lng}` : mapUrl;

  if (!user) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const authToken = process.env.ONEMAP_API_KEY;

    const timeoutId = setTimeout(() => {
      const url = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${query}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;

      fetch(url, {
        method: "GET",
        headers: {
          Authorization: `${authToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setSearchResults(data.results || []);
        })
        .catch((error) => console.error("Error:", error));
    }, 500); // 500ms debounce delay, API rate limit is 260/min

    return () => clearTimeout(timeoutId); // Cleanup previous timeout
  }, [query]);

  function handleClick(e) {
    e.stopPropagation();
    const longitude = e.currentTarget.getAttribute("data-longitude");
    const latitude = e.currentTarget.getAttribute("data-latitude");
    const x = e.currentTarget.getAttribute("data-x");
    const y = e.currentTarget.getAttribute("data-y");
    setLat(latitude);
    setLng(longitude);
    setQuery("");
    const svy21 = new SVY21();

    fetch(
      "https://data.gov.sg/api/action/datastore_search?resource_id=d_23f946fa557947f93a8043bbef41dd09&limit=5000",
      {
        method: "GET",
      },
    )
      .then((response) => response.json())
      .then((data) => {
        let records = data.result.records;
        records = records.map((record) => {
          record.x_coord = parseFloat(record.x_coord);
          record.y_coord = parseFloat(record.y_coord);
          const { lat, lon } = svy21.computeLatLon(
            record.x_coord,
            record.y_coord,
          );
          record.latitude = lat;
          record.longitude = lon;
          record.distance = Math.sqrt(
            (x - record.x_coord) ** 2 + (y - record.y_coord) ** 2,
          );
          return record;
        });

        records.sort((a, b) => a.distance - b.distance);
        console.log(records);
        setRecords(records);

        // const orderedRecords = orderByDistance(
        //   { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
        //   records,
        // );
        // console.log(latitude, longitude, records, orderedRecords);
        // console.log(
        //   { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
        //   records,
        // );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Header></Header>
      <main className="grid gap-5 p-4">
        <section className="rounded-lg bg-blue-50 p-4">
          <form onSubmit={handleSubmit} className="relative mx-auto max-w-md">
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
            <section
              id="search-results"
              className="absolute top-20 overflow-hidden rounded-lg border-1 border-[#dee2e6] bg-white shadow-md empty:border-0"
            >
              {searchResults.slice(0, 5).map((result, index) => (
                <SearchResult
                  key={index}
                  title={result.SEARCHVAL}
                  address={result.ADDRESS}
                  lat={result.LATITUDE}
                  lng={result.LONGITUDE}
                  x={result.X}
                  y={result.Y}
                  handleClick={handleClick}
                />
              ))}
            </section>
          </form>
        </section>
        <iframe
          src={mapSrc}
          width="1000px"
          height="1000px"
          scrolling="no"
          frameBorder="0"
          allowFullScreen="allowfullscreen"
          className="h-[250px] w-[70vw] justify-self-center rounded-md shadow-md"
        ></iframe>
        <section className="grid gap-4 border-t-1 border-gray-200 p-4">
          <p className="text-xl font-semibold">Available Parking Lots</p>
          <div className="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] justify-items-center gap-4">
            {records.slice(0, 5).map((record) => (
              <DisplayResult></DisplayResult>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
