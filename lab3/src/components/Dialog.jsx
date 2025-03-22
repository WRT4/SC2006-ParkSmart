import MuiDialog from "@mui/material/Dialog";
import MuiDialogTitle from "@mui/material/DialogTitle";

export default function Dialog({
  open,
  setOpen,
  record,
  availabilityLimit = 0.5,
}) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <MuiDialog onClose={handleClose} open={open} className="relative">
        <button
          onClick={handleClose}
          type="button"
          className="absolute top-1 right-1 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-gray-500 focus:outline-none focus:ring-inset"
        >
          <span className="sr-only">Close menu</span>
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {(() => {
          if (record) {
            return (
              <div
                data-address={record.address}
                className="flex h-[350px] w-full max-w-[350px] flex-col rounded-md border-1 border-gray-200 p-4 shadow-md"
              >
                <div className="grid justify-items-start gap-2 pb-3">
                  <div className="grid w-full justify-items-center gap-2">
                    <p className="font-medium">{record.title}</p>
                    {(() => {
                      if (record.lotsAvailable && record.totalLots) {
                        if (
                          record.lotsAvailable / record.totalLots >=
                          availabilityLimit
                        ) {
                          return (
                            <p className="rounded-xl bg-green-200 px-2.5 py-1 text-sm text-green-600">
                              Available
                            </p>
                          );
                        }
                        if (record.lotsAvailable > 0) {
                          return (
                            <p className="rounded-xl bg-amber-200 px-2.5 py-1 text-sm text-amber-600">
                              Limited
                            </p>
                          );
                        }
                        if (record.lotsAvailable === 0) {
                          return (
                            <p className="rounded-xl bg-red-200 px-2.5 py-1 text-sm text-red-600">
                              Full
                            </p>
                          );
                        }
                      }
                      return (
                        <p className="rounded-xl bg-red-200 px-2.5 py-1 text-sm text-red-600">
                          Error
                        </p>
                      );
                    })()}
                  </div>
                  <div className="">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="#9ca3af"
                        className="bi bi-geo-alt-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                      </svg>

                      <div className="grid justify-items-start">
                        <p className="text-sm">{record.address}</p>
                        <p className="text-xs text-gray-600">
                          {Math.round((record.distance / 1000) * 10) / 10} km
                          away
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="#9ca3af"
                      className="bi bi-p-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.5 4.002V12h1.283V9.164h1.668C10.033 9.164 11 8.08 11 6.586c0-1.482-.955-2.584-2.538-2.584zm2.77 4.072c.893 0 1.419-.545 1.419-1.488s-.526-1.482-1.42-1.482H6.778v2.97z" />
                    </svg>
                    <p
                      className={`text-sm ${!record.lotsAvailable || !record.totalLots ? "text-red-600" : ""}`}
                    >
                      {record.lotsAvailable !== undefined &&
                      record.totalLots != undefined ? (
                        <>
                          <span
                            className={
                              record.lotsAvailable / record.totalLots >=
                              availabilityLimit
                                ? "text-green-600"
                                : record.lotsAvailable > 0
                                  ? "text-amber-600"
                                  : "text-red-600"
                            }
                          >
                            {record.lotsAvailable}
                          </span>{" "}
                          /{" "}
                          <span className="font-bold">{record.totalLots}</span>{" "}
                          spots available
                        </>
                      ) : (
                        "Unable to retrieve lot information"
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="#9ca3af"
                      className="bi bi-clock-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                    </svg>

                    <p className="text-sm">{}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrows-vertical"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.354 14.854a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 13.293V2.707L6.354 3.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 2.707v10.586l1.146-1.147a.5.5 0 0 1 .708.708z" />
                    </svg>
                    <p className="text-sm">
                      Height limit: {record.gantry_height}m
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="#9ca3af"
                      className="bi bi-credit-card"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z" />
                      <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                    </svg>
                    <p className="text-sm">{record.type_of_parking_system}</p>
                  </div>
                </div>
              </div>
            );
          }
        })()}
      </MuiDialog>
    </>
  );
}
