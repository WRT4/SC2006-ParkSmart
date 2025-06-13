const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
  _id: Number,
  car_park_no: String,
  address: String,
  x_coord: String,
  y_coord: String,
  car_park_type: String,
  type_of_parking_system: String,
  short_term_parking: String,
  free_parking: String,
  night_parking: String,
  car_park_decks: String,
  gantry_height: String,
  car_park_basement: String,
  distance: Number,
  latitude: String,
  longitude: String,
  title: String,
  fetchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Record", RecordSchema);