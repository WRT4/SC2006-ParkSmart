import Header from "../components/Header";
import { AuthContext } from "../auth/AuthWrapper";
import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import SearchResult from "../components/SearchResult";
import DisplayResult from "../components/DisplayResult.jsx";
import { getDistance } from "geolib";
import { Slider } from "@mui/material";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [records, setRecords] = useState([]);
  const [avail, setAvail] = useState([]);
  const { user } = useContext(AuthContext);
  const firstAvailCall = useRef(true);
  const timeoutId = useRef(null);
  const [limit, setLimit] = useState(10);

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

  const fetchCarparkAvailability = () => {
    const url = `https://api.data.gov.sg/v1/transport/carpark-availability`;
    fetch(url, { method: "GET", mode: "cors" })
      .then(async (response) => {
        return response.json();
      })
      .then((data) => {
        setAvail(data.items[0].carpark_data);
      })
      .catch((error) => {
        console.error("Error retrieving availability", error);
      });
  };

  useEffect(() => {
    if (firstAvailCall.current) {
      firstAvailCall.current = false;
      fetchCarparkAvailability();
      return;
    }
    const timeoutId = setTimeout(() => {
      if (records.length === 0) {
        return;
      }
      fetchCarparkAvailability();
    }, 60000); // 60s debounce delay, API rate limit is 1000/hour

    return () => clearTimeout(timeoutId); // Cleanup previous timeout
  }, [records]);

  function handleClick(e) {
    e.stopPropagation();
    const longitude = e.currentTarget.getAttribute("data-longitude");
    const latitude = e.currentTarget.getAttribute("data-latitude");
    const x = e.currentTarget.getAttribute("data-x");
    const y = e.currentTarget.getAttribute("data-y");
    setLat(latitude);
    setLng(longitude);
    setQuery("");

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
          const wgsCoord = SVYtoWGS(record.x_coord, record.y_coord);
          const lat = wgsCoord.latitude;
          const lon = wgsCoord.longitude;
          record.latitude = lat;
          record.longitude = lon;
          record.distance = getDistance(
            { latitude, longitude },
            { latitude: lat, longitude: lon },
          );
          // record.distance = WGSDist(latitude, longitude, lat, lon);
          const title = record.address
            .split(" ")
            .filter(
              (word) =>
                word !== "BLK" &&
                !(word.charAt(0) >= "0" && word.charAt(0) <= "9"),
            )
            .join(" ");
          record.title = title;
          return record;
        });

        records.sort((a, b) => a.distance - b.distance);
        setRecords(records);
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
              {searchResults.slice(0, 5).map((result) => (
                <SearchResult
                  key={result.ADDRESS}
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
          <Slider
            aria-label="carparkAmount"
            defaultValue={10}
            aria-valuetext={`${limit} Carparks Showing`}
            valueLabelDisplay="auto"
            shiftStep={10}
            step={5}
            min={5}
            max={100}
            onChange={(e) => {
              setLimit(e.target.value);
            }}
          ></Slider>
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] justify-items-center gap-4">
            {records.slice(0, limit).map((record) => (
              <DisplayResult
                key={record.car_park_no}
                distance={getDistance(
                  { latitude: lat, longitude: lng },
                  { latitude: record.latitude, longitude: record.longitude },
                )}
                title={record.title}
                address={record.address}
                // IIFE for conditional rendering
                operatingHours={(() => {
                  if (record.short_term_parking === "WHOLE DAY") {
                    return "24 hours";
                  }
                  if (record.short_term_parking === "NO") {
                    return "Seasonal Parking";
                  }
                  return record.short_term_parking;
                })()}
                gantryHeight={record.gantry_height}
                paymentType={toTitleCase(record.type_of_parking_system)}
                totalLots={(() => {
                  const carpark = avail.find(
                    (el) => el.carpark_number === record.car_park_no,
                  );
                  return carpark ? carpark.carpark_info[0].total_lots : carpark;
                })()}
                lotsAvailable={(() => {
                  const carpark = avail.find(
                    (el) => el.carpark_number === record.car_park_no,
                  );
                  return carpark
                    ? carpark.carpark_info[0].lots_available
                    : carpark;
                })()}
                freeParking={record.free_parking}
              ></DisplayResult>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

function toTitleCase(text) {
  return text.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
  );
}

function SVYtoWGS(x, y) {
  // SVY21 projection parameters
  const refLat = 1.366666,
    refLong = 103.833333;
  const originX = 38744.572,
    originY = 28001.642; // False Easting in meters
  const k0 = 1.0; // Scale factor
  const a = 6378137; // Semi-major axis of WGS84 ellipsoid
  const f = 1 / 298.257223563; // Flattening of WGS84 ellipsoid
  const e2 = 2 * f - f * f; // Eccentricity squared
  const A0 = 1 - e2 / 4 - (3 * e2 ** 2) / 64 - (5 * e2 ** 3) / 256;
  const A2 = (3 / 8) * (e2 + e2 ** 2 / 4 + (15 * e2 ** 3) / 128);
  const A4 = (15 / 256) * (e2 ** 2 + (3 * e2 ** 3) / 4);
  const A6 = (35 * e2 ** 3) / 3072;
  const lat0 = (refLat * Math.PI) / 180;
  const long0 = (refLong * Math.PI) / 180;
  const E = x - originY,
    N = y - originX;
  const M0 =
    a *
    (A0 * lat0 -
      A2 * Math.sin(2 * lat0) +
      A4 * Math.sin(4 * lat0) -
      A6 * Math.sin(6 * lat0));
  const M = M0 + N / k0;
  const mu = M / (a * A0);
  const e1 = (1 - Math.sqrt(1 - e2)) / (1 + Math.sqrt(1 - e2));
  const J1 = (3 / 2) * e1 - (27 / 32) * e1 ** 3;
  const J2 = (21 / 16) * e1 ** 2 - (55 / 32) * e1 ** 4;
  const J3 = (151 / 96) * e1 ** 3;
  const J4 = (1097 / 512) * e1 ** 4;
  const fp_lat =
    mu +
    J1 * Math.sin(2 * mu) +
    J2 * Math.sin(4 * mu) +
    J3 * Math.sin(6 * mu) +
    J4 * Math.sin(8 * mu);
  const e2_prime = e2 / (1 - e2);
  const C1 = e2_prime * Math.cos(fp_lat) ** 2;
  const T1 = Math.tan(fp_lat) ** 2;
  const R1 = (a * (1 - e2)) / (1 - e2 * Math.sin(fp_lat) ** 2) ** 1.5;
  const N1 = a / Math.sqrt(1 - e2 * Math.sin(fp_lat) ** 2);
  const D = E / (N1 * k0);
  const lat_rad =
    fp_lat -
    ((N1 * Math.tan(fp_lat)) / R1) *
      (D ** 2 / 2 -
        ((5 + 3 * T1 + 10 * C1 - 4 * C1 ** 2 - 9 * e2_prime) * D ** 4) / 24 +
        ((61 +
          90 * T1 +
          298 * C1 +
          45 * T1 ** 2 -
          252 * e2_prime -
          3 * C1 ** 2) *
          D ** 6) /
          720);
  const long_rad =
    long0 +
    (D -
      ((1 + 2 * T1 + C1) * D ** 3) / 6 +
      ((5 - 2 * C1 + 28 * T1 - 3 * C1 ** 2 + 8 * e2_prime + 24 * T1 ** 2) *
        D ** 5) /
        120) /
      Math.cos(fp_lat);
  const latitude = (lat_rad * 180) / Math.PI;
  const longitude = (long_rad * 180) / Math.PI;
  return { latitude, longitude };
}
