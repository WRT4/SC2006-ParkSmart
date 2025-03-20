import { useState } from "react";

export default function Filters2() {
  const [paymentTypes, setPaymentTypes] = useState({
    cash: false,
    card: false,
    electronic: false,
  });
  const [operatingHours, setOperatingHours] = useState("24 Hours");
  const [heightRestriction, setHeightRestriction] = useState("All Heights");
  const [carParkTypes, setCarParkTypes] = useState({
    shortTerm: false,
    free: false,
    night: false,
  });

  const togglePaymentType = (type) => {
    setPaymentTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const toggleCarParkType = (type) => {
    setCarParkTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleOperatingHoursChange = (hours) => {
    setOperatingHours(hours);
  };

  const handleHeightRestrictionChange = (restriction) => {
    setHeightRestriction(restriction);
  };

  return (
    <div className="w-72 rounded-xl bg-white p-4 shadow-md">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-semibold">Filters</h2>
      </div>

      {/* Operating Hours */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Operating Hours</label>
        <div
          onClick={() => handleOperatingHoursChange("24 Hours")}
          className={`cursor-pointer rounded-md p-2 text-sm ${
            operatingHours === "24 Hours" ? "" : "bg-gray-100 text-gray-700"
          }`}
        >
          24 Hours
        </div>
        <div
          onClick={() => handleOperatingHoursChange("Daytime")}
          className={`cursor-pointer rounded-md p-2 text-sm ${
            operatingHours === "Daytime" ? "" : "bg-gray-100 text-gray-700"
          }`}
        >
          Daytime
        </div>
      </div>

      {/* Payment Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Payment Type</label>
        <div className="mt-1 space-y-2">
          {Object.keys(paymentTypes).map((type) => (
            <div
              key={type}
              className="flex cursor-pointer items-center gap-2"
              onClick={() => togglePaymentType(type)}
            >
              <input
                type="checkbox"
                checked={paymentTypes[type]}
                onChange={() => togglePaymentType(type)}
                className="form-checkbox text-blue-500"
              />
              <span className="text-sm capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Car Park Types */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Car Park Type</label>
        <div className="mt-1 space-y-2">
          {Object.keys(carParkTypes).map((type) => (
            <div
              key={type}
              className="flex cursor-pointer items-center gap-2"
              onClick={() => toggleCarParkType(type)}
            >
              <input
                type="checkbox"
                checked={carParkTypes[type]}
                onChange={() => toggleCarParkType(type)}
                className="form-checkbox text-blue-500"
              />
              <span className="text-sm capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Height Restriction */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Height Restriction</label>
        <div
          onClick={() => handleHeightRestrictionChange("All Heights")}
          className={`cursor-pointer rounded-md p-2 text-sm ${
            heightRestriction === "All Heights"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          All Heights
        </div>
        <div
          onClick={() => handleHeightRestrictionChange("Low Clearance")}
          className={`cursor-pointer rounded-md p-2 text-sm ${
            heightRestriction === "Low Clearance"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Low Clearance
        </div>
      </div>
    </div>
  );
}
