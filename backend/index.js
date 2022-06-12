const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/user.model");
const Candidate = require("./models/candidate.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();

const port = process.env.PORT || 8000;

mongoose.connect(process.env.CONNECT_APPLICATION_STRING);

// For registration Post call
app.post("/api/register", async (req, res) => {
  try {
    const newPassword = await bcrypt.hash(req.body.userPasswordInput, 10);
    await User.create({
      email: req.body.userEmailInput,
      phoneNo: req.body.userPhoneNoInput,
      password: newPassword,
    });
    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "error", error: "Error" });
  }
});

// For login post call
app.post("/api/userLogin", async (req, res) => {
  const user = await User.findOne({
    email: req.body.userLoggedinEmailInput,
  });

  if (!user) {
    return { status: "error", error: "Invalid login creds" };
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.userLoggedinPasswordInput,
    user.password
  );

  if (isPasswordValid) {
    const token = jwt.sign(
      {
        email: user.email,
        password: user.password,
      },
      "secret123"
    );

    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
});

// For new candidate post call
app.post("/api/createNewCandidate", (req, res) => {
  try {
    Candidate.create({
      name: req.body.candidateNameInput,
      email: req.body.candidateEmailInput,
      dob: req.body.candidateDateOfBirthInput,
      state: req.body.candidateStateInput,
      age: req.body.candidateAgeInput,
      pincode: req.body.candidatePinCodeInput,
    });
    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "error", error: "Error" });
  }
});

// show already list of candidates in database.

app.get("/api/displayAllCandidates", async (req, res) => {
  Candidate.find({}, function (err, candidates) {
    res.send(candidates);
  });
});

// edit the result field on dropdown in list of candidates
app.post("/api/candidateResult", async (req, res) => {
  console.log("candidate updateone", req.body.index, req.body.value);
  const candidate = await Candidate.findByIdAndUpdate(
    { index: req.body.index },
    { $set: { result: req.body.value } }
  );

  if (!candidate) {
    return { status: "error", error: "Invalid login creds" };
  } else {
    await res.json({ status: "ok" });
  }
});

app.delete("/api/delete", (req, res) => {
  console.log(req.body, "req.body.delIndex");
  Candidate.findByIdAndRemove({
    index: req.body,
  });
});

app.listen(port, () => {
  console.log("Listening on port", port);
});
