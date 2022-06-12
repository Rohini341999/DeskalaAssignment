const mongoose = require("mongoose");

const Candidate = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    dob: { type: String, required: true },
    state: { type: String, required: true },
    age: { type: Number, required: true },
    pincode: { type: Number, required: true },
    index: { type: Number },
    result: { type: String },
  },
  { collection: "CandidateDetails" }
);

const model = mongoose.model("Candidate Data", Candidate);

module.exports = model;
