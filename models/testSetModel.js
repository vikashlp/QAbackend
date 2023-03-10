const mongoose = require("mongoose");

const testSetSchema = new mongoose.Schema({
  testsetname: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  testcases: {
    type: Array,
  },
  assigntoproject: {
    type: String,
  },
});

const TestSet = mongoose.model("testset", testSetSchema);
module.exports = TestSet;
