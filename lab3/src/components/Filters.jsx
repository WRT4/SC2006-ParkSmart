import { useState } from "react";
import { Slider, Switch } from "@mui/material";

export default function Filters({
  freeParking,
  setFreeParking,
  availFilter,
  setAvailFilter,
  heightRestriction,
  setHeightRestriction,
  nightParking,
  setNightParking,
}) {
  const toggleAvailFilter = (type) => {
    setAvailFilter((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="w-72 rounded-xl bg-white p-4 shadow-md">
      <div className="mb-4 flex items-center gap-2">
        <span className="font-semibold text-blue-500">Filters</span>
      </div>

      <div className="mb-4 flex flex-col gap-1">
        <label className="block text-sm font-medium">Free Parking</label>
        <div className="flex items-center">
          <Switch
            checked={freeParking}
            onChange={(e) => {
              setFreeParking(e.target.checked);
            }}
          ></Switch>
          <p
            className={
              "text-sm " + `${freeParking ? "font-semibold" : "text-gray-600"}`
            }
          >
            Only free parking
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-1">
        <label className="block text-sm font-medium">Night Parking</label>
        <div className="flex flex-col">
          <div
            onClick={() => {
              setNightParking("any");
            }}
            className={`cursor-pointer rounded-md p-2 text-sm text-gray-700 hover:bg-gray-200 active:bg-gray-300 ${nightParking === "any" ? "bg-gray-100 font-semibold" : ""}`}
          >
            Any
          </div>
          <div
            onClick={() => {
              setNightParking("yes");
            }}
            className={`cursor-pointer rounded-md p-2 text-sm text-gray-700 hover:bg-gray-200 active:bg-gray-300 ${nightParking === "yes" ? "bg-gray-100 font-semibold" : ""}`}
          >
            Available
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-1">
        <label className="block text-sm font-medium">Availability</label>
        <div className="mt-1 space-y-2">
          {Object.keys(availFilter).map((type) => (
            <div key={type} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={availFilter[type]}
                onChange={() => toggleAvailFilter(type)}
                className="form-checkbox cursor-pointer text-blue-500"
              />
              <span className="text-sm capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="block text-sm font-medium">Height Restriction</label>
        <p className="text-sm text-gray-600">Select a minimum height (m).</p>
        <Slider
          className=""
          aria-label="heightRestriction"
          defaultValue={0}
          aria-valuetext={`At least ${heightRestriction}m`}
          valueLabelDisplay="auto"
          step={1}
          min={0}
          max={9}
          onChange={(e) => {
            setHeightRestriction(e.target.value);
          }}
          id={"slider"}
        ></Slider>
      </div>
    </div>
  );
}
