const mongoose = require("mongoose");

const VerificationCodeSchema = new mongoose.Schema({
  phoneNum: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: false },
  creationTime: { type: Date, required: true },
});
module.exports = mongoose.model("VerificationCode", VerificationCodeSchema);
