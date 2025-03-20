import { useState } from "react";
import { Slider } from "@mui/material";

export default function Filters({
  paymentTypes,
  setPaymentTypes,
  freeParking,
  setFreeParking,
  nightParking,
  setNightParking,
  heightRestriction,
  setHeightRestriction,
}) {
  const toggleFreeParking = (type) => {
    setFreeParking((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="w-72 rounded-xl bg-white p-4 shadow-md">
      <div className="mb-4 flex items-center gap-2">
        <span className="font-semibold text-blue-500">Filters</span>
      </div>

      <div className="mb-4 flex flex-col gap-1">
        <label className="block text-sm font-medium">Free Parking</label>
        <div className="mt-1 space-y-2">
          {Object.keys(freeParking).map((type) => (
            <div key={type} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={type}
                checked={freeParking[type]}
                onChange={() => toggleFreeParking(type)}
                className="h-4 w-4 cursor-pointer accent-blue-500"
              />
              <label
                htmlFor={type}
                className="cursor-pointer text-sm capitalize"
              >
                {type}
              </label>
            </div>
          ))}
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
        <label className="block text-sm font-medium">Payment Type</label>
        <div
          onClick={() => {
            setPaymentTypes("any");
          }}
          className={`cursor-pointer rounded-md p-2 text-sm text-gray-700 hover:bg-gray-200 active:bg-gray-300 ${paymentTypes === "any" ? "bg-gray-100 font-semibold" : ""}`}
        >
          Any
        </div>
        <div
          onClick={() => {
            setPaymentTypes("electronic");
          }}
          className={`cursor-pointer rounded-md p-2 text-sm text-gray-700 hover:bg-gray-200 active:bg-gray-300 ${paymentTypes === "electronic" ? "bg-gray-100 font-semibold" : ""}`}
        >
          Electronic
        </div>
        <div
          onClick={() => {
            setPaymentTypes("coupon");
          }}
          className={`cursor-pointer rounded-md p-2 text-sm text-gray-700 hover:bg-gray-200 active:bg-gray-300 ${paymentTypes === "coupon" ? "bg-gray-100 font-semibold" : ""}`}
        >
          Coupon
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
