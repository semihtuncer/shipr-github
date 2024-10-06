const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    phoneNum: { type: String, required: true, unique: true },
    gender: { type: Number, required: true },
    birthday: { type: String, required: true },
    location: { type: String },
    interests: { type: [String], required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
