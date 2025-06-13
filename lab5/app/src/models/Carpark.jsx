const mongoose = require("mongoose");

const CarparkInfoSchema = new mongoose.Schema({
  total_lots: String,
  lot_type: String,
  lots_available: String,
});

const CarparkSchema = new mongoose.Schema({
  carpark_number: String,
  update_datetime: String,
  carpark_info: [CarparkInfoSchema],
});

module.exports = mongoose.model("Carpark", CarparkSchema);

