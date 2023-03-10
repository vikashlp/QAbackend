const mongoose = require("mongoose");

const stepSchema = new mongoose.Schema({
  steps: {
    type: String,
  },
});

const Stepcase = mongoose.model("step", stepSchema);
module.exports = Stepcase;
