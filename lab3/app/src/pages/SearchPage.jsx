import Header from "../components/Header";
import { AuthContext } from "../auth/AuthWrapper";
import { useState, useContext, useEffect, useRef, useReducer } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import SearchResult from "../components/SearchResult";
import DisplayResult from "../components/DisplayResult.jsx";
import { getDistance } from "geolib";
import { Slider } from "@mui/material";
import Filters from "../components/Filters.jsx";
import Footer from "../components/Footer.jsx";
import Dialog from "../components/Dialog.jsx";
import { useTranslation } from "react-i18next";

export default function SearchPage() {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [records, setRecords] = useState([]);
  const [avail, setAvail] = useState([]);
  const { user } = useContext(AuthContext);
  const firstAvailCall = useRef(true);
  const firstLoad = useRef(true);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();
  const mapUrl =
    "https://www.onemap.gov.sg/minimap/minimap.html?mapStyle=Default&zoomLevel=15";
  const mapSrc = lat && lng ? `${mapUrl}&latLng=${lat},${lng}` : mapUrl;
  const availabilityLimit = 0.5;
  const [open, setOpen] = useState(false);
  const [record, setRecord] = useState(null);

  const [freeParking, setFreeParking] = useState(false);
  const [nightParking, setNightParking] = useState("any");
  const [availFilter, setAvailFilter] = useState({
    available: true,
    limited: true,
    full: true,
  });
  const [heightRestriction, setHeightRestriction] = useState(0);

  // Allow users not signed in to search
  // if (!user) {
  //   return <Navigate to="/login" />;
  // }search__selectMinHeight
  const { t } = useTranslation();

  function filter(records) {
    if (freeParking) {
      records = records.filter((record) => record.free_parking !== "NO");
    }
    if (nightParking === "yes") {
      records = records.filter((record) => record.night_parking === "YES");
    }

    if (!availFilter.available) {
      records = records.filter((record) => {
        const carpark = avail.find(
          (el) => el.carpark_number === record.car_park_no,
        );
        if (carpark) {
          const lotsAvailable = carpark.carpark_info[0].lots_available;
          const totalLots = carpark.carpark_info[0].total_lots;
          if (lotsAvailable / totalLots >= availabilityLimit) {
            return false;
          }
        }
        return true;
      });
    }

    if (!availFilter.limited) {
      records = records.filter((record) => {
        const carpark = avail.find(
          (el) => el.carpark_number === record.car_park_no,
        );
        if (carpark) {
          const lotsAvailable = carpark.carpark_info[0].lots_available;
          const totalLots = carpark.carpark_info[0].total_lots;
          if (
            lotsAvailable / totalLots > 0 &&
            lotsAvailable / totalLots < availabilityLimit
          ) {
            return false;
          }
        }
        return true;
      });
    }

    if (!availFilter.full) {
      records = records.filter((record) => {
        const carpark = avail.find(
          (el) => el.carpark_number === record.car_park_no,
        );
        if (carpark) {
          const lotsAvailable = carpark.carpark_info[0].lots_available;
          if (parseInt(lotsAvailable) === 0) {
            return false;
          }
        }
        return true;
      });
    }

    if (heightRestriction > 0) {
      records = records.filter(
        (record) => parseFloat(record.gantry_height) >= heightRestriction,
      );
    }
    return records;
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

  if (firstLoad.current) {
    firstLoad.current = false;
    navigator.geolocation.getCurrentPosition((position) => {
      if (document.querySelectorAll("[data-address]").length === 0) {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        // fetchRecords(position.coords.latitude, position.coords.longitude);
        // fetchCarparkAvailability();
        firstLoadFetch(position.coords.latitude, position.coords.longitude);
      }
    });
  }

  function firstLoadFetch(latitude, longitude) {
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
        return records;
      })
      .then((records) => {
        const url = `https://api.data.gov.sg/v1/transport/carpark-availability`;
        fetch(url, { method: "GET", mode: "cors" })
          .then((response) => response.json())
          .then((data) => {
            setAvail(data.items[0].carpark_data);
            if (records.length > 0) {
              setRecords(
                records.map((record) => {
                  const carpark = data.items[0].carpark_data.find(
                    (el) => el.carpark_number === record.car_park_no,
                  );
                  if (carpark) {
                    record.totalLots = parseInt(
                      carpark.carpark_info[0].total_lots,
                    );
                    record.lotsAvailable = parseInt(
                      carpark.carpark_info[0].lots_available,
                    );
                  }
                  return record;
                }),
              );
            }
            forceUpdate();
          })
          .catch((error) => {
            console.error("Error retrieving availability", error);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const fetchCarparkAvailability = () => {
    const url = `https://api.data.gov.sg/v1/transport/carpark-availability`;
    fetch(url, { method: "GET", mode: "cors" })
      .then((response) => response.json())
      .then((data) => {
        setAvail(data.items[0].carpark_data);

        if (records.length > 0) {
          setRecords(
            records.map((rec) => {
              const carpark = avail.find(
                (el) => el.carpark_number === rec.car_park_no,
              );
              if (carpark) {
                rec.totalLots = carpark.carpark_info[0].total_lots;
                rec.lotsAvailable = carpark.carpark_info[0].lots_available;
              }
              if (rec.address === record.address) {
                setRecord(rec);
              }
              return rec;
            }),
          );
        }
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
  }, [firstLoad, records]);

  function fetchRecords(latitude, longitude) {
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

  function handleClick(e) {
    e.stopPropagation();
    const longitude = e.currentTarget.getAttribute("data-longitude");
    const latitude = e.currentTarget.getAttribute("data-latitude");
    const x = e.currentTarget.getAttribute("data-x");
    const y = e.currentTarget.getAttribute("data-y");
    setLat(latitude);
    setLng(longitude);
    setQuery("");

    fetchRecords(latitude, longitude);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Header></Header>
      <main className="grid gap-5 p-4 dark:bg-gray-800 dark:text-white">
        <section className="flex flex-col items-center justify-evenly gap-4 rounded-lg bg-blue-50 p-4 min-[400px]:flex-row dark:bg-gray-700">
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-md min-w-[250px]"
          >
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
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder={t("search__searchLocation")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
              />
              <button
                type="submit"
                className="absolute end-2.5 bottom-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {t("search__search")}
              </button>
            </div>
            <section
              id="search-results"
              className="absolute top-20 z-20 overflow-hidden rounded-lg border-1 border-[#dee2e6] bg-white shadow-md empty:border-0 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
        <div className="flex flex-col items-center gap-5 lg:flex-row">
          <div className="flex justify-center">
            <Filters
              availFilter={availFilter}
              setAvailFilter={setAvailFilter}
              freeParking={freeParking}
              nightParking={nightParking}
              setNightParking={setNightParking}
              setFreeParking={setFreeParking}
              heightRestriction={heightRestriction}
              setHeightRestriction={setHeightRestriction}
            ></Filters>
          </div>
          <div className="relative rounded-md overflow-hidden shadow-md">
            {/* Very light transparent overlay */}
            <div 
              className="absolute inset-0 mix-blend-multiply pointer-events-none z-10 hidden dark:block"
              style={{ backgroundColor: 'rgba(30, 41, 59, 0.35)' }}
            ></div>
            
            <iframe
              src={mapSrc}
              width="1000px"
              height="1000px"
              scrolling="no"
              frameBorder="0"
              allowFullScreen="allowfullscreen"
              className="h-[250px] w-[70vw] justify-self-center rounded-md lg:h-[500px]"
            ></iframe>
          </div>
        </div>
        <section className="grid gap-4 border-t-1 border-gray-200 p-4 dark:border-gray-700">
          <div className="flex flex-col justify-items-center gap-4 md:flex-row md:items-center">
            <p className="text-center text-xl font-semibold">
              {t("search__availableParkingLots")}
            </p>
            <div className="flex flex-col items-center md:ms-auto">
              <label htmlFor="slider">
                {t("search__show")}
                <span className="font-bold">{limit}</span>
                {t("search__carparksWord")}
              </label>
              <Slider
                className="max-w-[256px]"
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
                id={"slider"}
              ></Slider>
            </div>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] justify-items-center gap-4">
            {filter(records)
              .slice(0, limit)
              .map((record) => (
                <DisplayResult
                  key={record.car_park_no}
                  viewResult={(e) => {
                    const address =
                      e.target.parentNode.parentNode.getAttribute(
                        "data-address",
                      );
                    const newRecords = records.map((rec) => {
                      const carpark = avail.find(
                        (el) => el.carpark_number === rec.car_park_no,
                      );
                      if (carpark) {
                        rec.totalLots = carpark.carpark_info[0].total_lots;
                        rec.lotsAvailable =
                          carpark.carpark_info[0].lots_available;
                      }
                      if (rec.address === record.address) {
                        setRecord(rec);
                      }
                      return rec;
                    });
                    setRecords(newRecords);
                    setRecord(
                      newRecords.find((record) => record.address === address),
                    );
                    setOpen(true);
                  }}
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
                    return carpark
                      ? carpark.carpark_info[0].total_lots
                      : carpark;
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
      <section className="grid items-center justify-items-center gap-6 bg-gray-100 p-6 min-[900px]:grid-cols-3 dark:bg-gray-700 dark:text-white [&>.card]:h-[200px] [&>.card]:w-[min(100%,350px)]">
        <div className="card grid gap-2 rounded-md border-1 border-gray-200 bg-white p-4 shadow-md dark:bg-gray-800 dark:border-gray-600">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#2563eb"
              className="bi bi-car-front-fill"
              viewBox="0 0 16 16"
            >
              <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17s3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z" />
            </svg>
            <p className="text-lg font-bold">{t("search__whyChooseUs")}</p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t("search__findCarparksNear")}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t("search__viewCarparkTypes")}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{t("search__checkRealTime")}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t("search__getNightParkingInfo")}
          </p>
        </div>
        <div className="card grid gap-2 rounded-md border-1 border-gray-200 bg-white p-4 shadow-md dark:bg-gray-800 dark:border-gray-600">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#2563eb"
              className="bi bi-info-circle-fill"
              viewBox="0 0 16 16"
            >
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
            </svg>
            <p className="text-lg font-bold">{t("search__howItWorks")}</p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t("search__searchForDesired")}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t("search__choosePreferred")}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{t("search__viewRealTime")}</p>
        </div>
        <div className="card grid flex-row gap-2 rounded-md border-1 border-gray-200 bg-white p-4 shadow-md dark:bg-gray-800 dark:border-gray-600">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#2563eb"
              className="bi bi-telephone-fill"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"
              />
            </svg>
            <p className="text-lg font-bold">{t("search__needHelp")}</p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{t("search__haveQuestion")}</p>
          <button
            onClick={() => {
              navigate("/support");
            }}
            type="button"
            className="me-2 mb-2 cursor-pointer rounded-lg border border-blue-700 px-5 py-2.5 text-center text-sm font-medium text-blue-700 transition hover:bg-blue-800 hover:text-white focus:ring-4 focus:ring-blue-300 focus:outline-none dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
          >
            {t("search__contactSupport")}
          </button>
        </div>
      </section>
      <Dialog open={open} setOpen={setOpen} record={record}></Dialog>
      <Footer></Footer>
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