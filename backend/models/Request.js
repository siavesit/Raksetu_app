const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    hospitalName: {
      type: String,
      required: true
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    unitsNeeded: {
      type: Number,
      required: true
    },
    urgency: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium"
    },
    location: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["open", "fulfilled"],
      default: "open"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Request", requestSchema);