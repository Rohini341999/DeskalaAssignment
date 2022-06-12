const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    phoneNo: { type: Number, required: true },
    password: { type: String, required: true },
  },
  { collection: "RegistrationLoginDetails" }
);

const model = mongoose.model("UserData", User);

module.exports = model;
