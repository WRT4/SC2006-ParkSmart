export default class RecordRepository {
  constructor(records) {
    this.records = records;
  }

  filterByFreeParking = () => {
    this.records = this.records.filter(
      (record) => record.free_parking !== "NO",
    );
  };

  filterByNightParking = () => {
    this.records = this.records.filter(
      (record) => record.night_parking === "YES",
    );
  };

  filterByAvailability = (availFilter, avail, availabilityLimit) => {
    if (!availFilter.available) {
      this.records = this.records.filter((record) => {
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
      this.records = this.records.filter((record) => {
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
      this.records = this.records.filter((record) => {
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
  };

  filterByHeightRestriction = (heightRestriction) => {
    this.records = this.records.filter(
      (record) => parseFloat(record.gantry_height) >= heightRestriction,
    );
  };

  filter = ({
    freeParking,
    availFilter,
    nightParking,
    heightRestriction,
    avail,
    availabilityLimit,
  }) => {
    if (freeParking) {
      this.filterByFreeParking();
    }
    if (nightParking === "yes") {
      this.filterByNightParking();
    }

    this.filterByAvailability(availFilter, avail, availabilityLimit);

    if (heightRestriction > 0) {
      this.records = this.records.filter(
        (record) => parseFloat(record.gantry_height) >= heightRestriction,
      );
    }
    return this.records;
  };
}
