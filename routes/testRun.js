const express = require('express');
const router = express.Router();
const TestRun = require('../models/testRun');
const moment = require('moment');


router.get('/', async(req, res) => {
  try{
     const result = await TestRun.find()
     res.send(result)
  }
  catch (err){
    res.send(err.message)
    console.log(err)
  }
})

// POST a new test run
router.post('/', async (req, res) => {
  try {
    
    const {testSetName, finalDuration, finalStatus } = req.body;
    let testSets =  req.body.testSet
    // console.log("Body", testCases)

    for (const testSett of testSets) {
        const existingTestCase = await TestRun.findOne({ "testSet.testCaseName": testSett.testCaseName });
        if (existingTestCase) {
          return res.status(400).json({ message: `Test case '${testSett.testCaseName}' already exists in another test run` });
        }
      }

    if (!testSets || testSets.length === 0) {
        return res.status(400).json({ message: "Test cases cannot be empty" });
      }
    
      const newTestSets = testSets.map(testCase => {
        const startTimeString = testCase.startTime
        const stopTimeString = testCase.stopTime
        const pauseTimeString = testCase.pauseTime;

        // const startTime = new Date(startTimeString);
        // const stopTime = new Date(stopTimeString);
        // const pauseTime = new Date(pauseTimeString);

        const startTime = moment.utc(startTimeString, "HH:mm:ss");
        const stopTime = moment.utc(stopTimeString, "HH:mm:ss");
        const pauseTime = moment.utc(pauseTimeString, "HH:mm:ss");

        // const totalDuration = stopTime.getTime() - startTime.getTime();
        // const pauseDuration = pauseTime.getTime() - startTime.getTime();
        // const actualDuration = totalDuration - pauseDuration;
        
        // const duration = actualDuration / 1000 / 60 ;
        // // const duration = actualDuration / (1000 * 60);

        // testCase.duration = duration

        const totalDuration = moment.duration(stopTime.diff(startTime));
        const pauseDuration = moment.duration(pauseTime.diff(startTime));
        const actualDuration = moment.duration(totalDuration - pauseDuration);
        
        const duration = actualDuration.asMinutes();
      
        testCase.duration = duration;


        return {
          testCaseName: testCase.testCaseName,
          testSteps: testCase.testSteps,
          startTime: startTime.format("HH:mm:ss"),
          pauseTime: pauseTime.format("HH:mm:ss"),
          stopTime: stopTime.format("HH:mm:ss"),
          duration: duration,
          status: testCase.status
        };
      });

      // const totalDuration = newTestSets.reduce((acc, testCase) => {
      //   return acc + testCase.duration;
      // }, 0);

      const totalDuration = moment.duration(newTestSets.reduce((acc, testCase) => {
        return acc + testCase.duration;
      }, 0), "minutes").asMinutes();
  

    const newTestRun = new TestRun({
        testSet: newTestSets,
        testSetName,
      finalDuration : totalDuration,
      finalStatus
    });
    const savedTestRun = await newTestRun.save();
    res.status(201).json(savedTestRun);
    console.log(testSets)
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error)
  }
});

router.post('/delete', async (req, res) => {
  try{
   let result = await TestRun.deleteOne({_id: req.body._id})
   res.send(result)
  }
  catch(err){
   console.log(err.message)
  }
 })

//  router.post('/update/:id/:testSetId', async (req, res) => {
//   try{

// const { startTime, pauseTime, stopTime, status, testSteps } = req.body;
// const testSetId = req.params.testSetId
// const id = req.params.id

// const startTimeString = startTime
//         const stopTimeString = stopTime
//         const pauseTimeString = pauseTime;

//         const newstartTime = new Date(startTimeString);
//         const newstopTime = new Date(stopTimeString);
//         const newpauseTime = new Date(pauseTimeString);

//         const totalDuration = newstopTime.getTime() - newstartTime.getTime();
//         const pauseDuration = newpauseTime.getTime() - newstartTime.getTime();
//         const actualDuration = totalDuration - pauseDuration;
        
//         const duration = actualDuration / 1000 / 60 ;
//         // const duration = actualDuration / (1000 * 60);

    

//     const data = await TestRun.findOneAndUpdate(
//       { _id : id, testSet: { $elemMatch: { _id: testSetId } } },
//       {
//         $set: {
//           "testSet.$.testSteps": testSteps,
//           "testSet.$.startTime": startTime,
//           "testSet.$.pauseTime": pauseTime,
//           "testSet.$.stopTime": stopTime,
//           "testSet.$.status": status,
//           "testSet.$.duration": duration,


//         },
//       },
//       {
//         new: true,
//       }
//     );

//     res.status(200).send(data);
//     console.log(data)
//  }
//  catch(err){
//     res.send(err.message)
//     console.log(err)
//   }
  
// })

// router.post('/mainupdate/:id', async (req, res) => {
//    try {
//     const id = req.params.id
//     const  mainid = await TestRun.findOne({_id: id})

// const red = mainid.testSet

// let durations = red.reduce((total, mainid) => {
//   return total + mainid.duration;
// }, 0);

// let finalDuration = parseFloat(durations.toFixed(2));

// const finalstatus = {
//   $cond: {
//     if: {
//       $anyElementTrue: {
//         $map: {
//           input: "$testSet[0].status",
//           in: {
//             $eq: ["$$this.status", "failed"]
//           }
//         }
//       }
//     },
//     then: "failed",
//     else: "passed"
//   }
// };


// mainUpdate = await TestRun.updateOne(
//   { "_id": id },
//   { $set: { "finalDuration": finalDuration }
//  }
// );


// res.send(mainid)
// console.log(mainid) 
//    }
//    catch (err) {
//   console.log(err)
//    }
// })

router.post('/update', async (req,res) => {
  try{
    const {_id, testSet,startTime, pauseTime, stopTime, ...rest } = req.body;

    function calculateDuration(startTime, pauseTime, stopTime) {
      const start = moment.utc(startTime, 'HH:mm:ss');
      const pause = moment.utc(pauseTime, 'HH:mm:ss');
      const stop = moment.utc(stopTime, 'HH:mm:ss');
      const duration = moment.duration(stop.diff(start));
      if (pause.isValid()) {
        const pauseDuration = moment.duration(pause.diff(start));
        duration.subtract(pauseDuration);
      }
      return duration.asMinutes();
    }

    const updatedTestSet = testSet.map(item => {
      const { startTime, pauseTime, stopTime, ...itemRest } = item;
      const duration = calculateDuration(moment.utc(startTime, 'HH:mm:ss').format(), moment.utc(pauseTime, 'HH:mm:ss').format(), moment.utc(stopTime, 'HH:mm:ss').format());
      return { startTime, pauseTime, stopTime, duration, ...itemRest };
    });

      const totalDuration = updatedTestSet.reduce((acc, item) => acc + item.duration, 0);
      // const totalDurationInMinutes = totalDuration / (60 * 1000);

  const result = await TestRun.updateMany({_id:_id}, {$set: {finalDuration: totalDuration, testSet: updatedTestSet, ...rest}})
    res.send(result)

  }
  catch(err){
    res.send(err.message)
    console.log(err)
  }


})

module.exports = router;


