const mongoose = require("mongoose");
const User = require("./User").schema;

const ShipSchema = new mongoose.Schema(
  {
    man: { type: String, required: true },
    woman: { type: String, required: true },
    count: { type: Number, required: true },
    shippers: { type: [String], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ship", ShipSchema);
