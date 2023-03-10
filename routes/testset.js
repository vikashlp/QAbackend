const express = require("express");
const router = express.Router();
const auth = require("../middleware/check-auth");
const TestSet = require("../models/testSetModel");

router.post("/", async (req, res) => {
  try {
    let Testset = await new TestSet({
      testsetname: req.body.testsetname,
      testcases: req.body.testcases,
      assigntoproject: req.body.assigntoproject,
    });

    const TestSett = await Testset.save();
    //console.log(Testy);
    res.send(TestSett);
  } catch (err) {
    console.log(err.message);
    let obj = {
      status: "FAILED",
      err: err.message,
    };
    res.status(226).send(obj);
  }
});

router.get("/gettestsetbyid", async (req, res) => {
  let id = req.query.id;
  try {
    let Result = await TestSet.findById(id);

    res.send(Result);
  } catch (err) {
    console.log(err.message);
    let obj = {
      status: "FAILED",
      err: err.message,
    };
    res.status(226).send(obj);
  }
});

router.post("/inserttestsbyid", async (req, res) => {
  // console.log(req.body);
  console.log("testset-id===>", req.body[0].id);
  console.log("test-cases====>", req.body[1].testcaseinfo);
  let id = req.body[0].id;
  let data = req.body[1].testcaseinfo;
  console.log("type", typeof data, "WHy am i called");
  try {
    let Result = await TestSet.findById(id);
    Result.testcases.push(data);
    await Result.save();
    // console.log("new", Result);
    // return Result;
    res.send(Result);
  } catch (err) {
    //console.log(err.message);
    let obj = {
      status: "FAILED",
      err: err.message,
    };
    res.status(226).send(obj);
  }
});

router.get("/gettestsets", async (req, res) => {
  const itemsPerPage = 5;
  const page = req.query.page || 1;
  const counter = await TestSet.countDocuments();
  // console.log("hii");
  try {
    // let Result = await TestSet.find({});
    let Result = await TestSet.find({})
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);
    let Paginated = { Result, counter };
    res.send(Paginated);
  } catch (err) {
    //console.log(err.message);
    let obj = {
      status: "FAILED",
      err: err.message,
    };
    res.status(226).send(obj);
  }
});

router.delete("/deltestsetbyid", async (req, res) => {
  console.log(req.body.id);
  let id = req.body.id;
  console.log(id);
  try {
    let Result = await TestSet.findByIdAndDelete(id);

    res.send(Result);
  } catch (err) {
    //console.log(err.message);
    let obj = {
      status: "FAILED",
      err: err.message,
    };
    res.status(226).send(obj);
  }
});

router.post("/deltestfromid", async (req, res) => {
  // console.log(req.body.data.id);
  let id = req.body.data.testsetId;
  let testid = req.body.data.id;
  // console.log("hii", testid, id);
  try {
    let Result = await TestSet.updateOne(
      { _id: id },
      { $pull: { testcases: { _id: testid } } }
    );

    res.send(Result);
  } catch (err) {
    //console.log(err.message);
    let obj = {
      status: "FAILED",
      err: err.message,
    };
    res.status(226).send(obj);
  }
});

router.post("/delstepfromtestset", async (req, res) => {
  let id = req.body.data.testsetId;
  let stepid = req.body.data.id;
  let testid = req.body.data.testid;
  try {
    let Result = await TestSet.updateOne(
      { _id: id },
      { $pull: { "testcases.$[i].stepArr": { _id: stepid } } },
      { arrayFilters: [{ "i._id": testid }] }
    );

    res.send(Result);
  } catch (err) {
    //console.log(err.message);
    let obj = {
      status: "FAILED",
      err: err.message,
    };
    res.status(226).send(obj);
  }
});

router.post("/updatewithid", async (req, res) => {
  let id = req.body.data.id;
  let data = req.body.data.data;
  console.log(req.body.data.data);
  try {
    let Result = await TestSet.findByIdAndUpdate(id, data);
    const response = await Result.save();
    console.log(response);
    res.send(response);
  } catch (error) {
    let obj = {
      err: "typeerror",
      error: error,
    };
    res.send(obj);
    console.log("error", error);
  }
});

router.get("/searchtestset", async (req, res) => {
  const { q } = req.query;

  try {
    const results = await TestSet.find({
      $or: [
        { testsetname: { $regex: q, $options: "i" } },
        { assigntoproject: { $regex: q, $options: "i" } },
      ],
    });
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

// task.subtasks.push(subtask);
// await task.save();
// return task;
