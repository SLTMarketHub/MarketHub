const mongoose = require("mongoose");

const HubSchema = new mongoose.Schema({
  callback: { type: String, required: true },
  query: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Hub", HubSchema);
