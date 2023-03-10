const express = require('express');
const router = express.Router();
const TestRun = require('../models/testRun');
const moment = require('moment');

router.post("/", async (req, res) => {
  
    try {
        const {testsetname, finalDuration, finalStatus,runStartTime,  runEndTime } = req.body;
        let testcases =  req.body.testCases


        // validation   
        const existingTestSet = await TestRun.findOne({ testsetname });
        if (existingTestSet) {
          return res.status(400).json({ message: `Test set '${testsetname}' already exists` });
        }

        
              const newcases = testcases.map(testCase => {

                


    
                
        return {
            testname: testCase.testname,
            status: testCase.status,
            testlevel:testCase.testlevel,
            testinfo:testCase.testinfo,
            stepArr: testCase.stepArr,
            counttesterTime: testCase.counttesterTime,
            Timeid: testCase.Timeid,
            duration: testCase.duration,
          };
        });

        const newTestRun = new TestRun({
            testsetname: testsetname,
            testCases: newcases,
            runStartTime: runStartTime,
            runEndtime: runEndTime,
          finalDuration : finalDuration,
          finalStatus: finalStatus
        });
            

        const savedTestRun = await newTestRun.save();
        res.status(201).json(savedTestRun);
        console.log(savedTestRun)


    } catch (error) {
      res.status(400).json({ message: error.message });
      console.log(error);
    }
  });
  
  router.get("/getruns", async (req, res) => {
    try {
      const result = await TestRun.find({});
      res.send(result);
    } catch (err) {
      res.send(err.message);
      console.log(err);
    }
  });
  router.get("/getrunbyid", async (req, res) => {
    let { runid } = req.query;
    // console.log(req.query.runid);
    try {
      const result = await TestRun.findById(runid);
      res.send(result);
    } catch (error) {
      res.send(error.message);
      console.log(err);
    }
  });
  router.delete("/deleteruns", async (req, res) => {
    try {
      let result = await TestRun.deleteOne({ _id: req.body.id });
      res.send(result);
    } catch (err) {
      console.log(err.message);
    }
  });
  
  // router.post("/updatesteps", async (req, res) => {
  //   let { data, runid } = req.body.data;
  
  //   try {
  
  //     const update = { $set: { "testRun.testcases.$": data } };
  //     const Result = await TestRun.updateOne(
  //       {
  //         _id: runid,
  //         "testRun.testcases._id": data._id,
  //       },
  //       update
  //     );
  
  //     res.send(Result);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // });
  
  router.post("/updatesteps", async (req, res) => {
    let { data, runid } = req.body.data;
    console.log(data);
    console.log(runid);
    try {
      const update = { $set: { testRun: data } };
      const Result = await TestRun.updateOne(
        {
          _id: runid,
        },
        update
      );
  
      res.send(Result);
    } catch (error) {
      console.log(error.message);
    }
  });


router.post('/update', async (req,res) => {
    try{
        let {_id,testCases,runStartTime,runEndTime,...rest} = req.body
      
        // console.log('smith',testcases);
        let startTime, pauseTime, resumeTime, stopTime;
        
        for (let i = 0; i < testCases.length; i++) {

          const testCase = testCases[i];
        //   console.log("smith",testCase)
          const countTesterTimes = testCase.counttesterTime;
        //   console.log(countTesterTimes,'vikash')
        
          for (let j = 0; j < countTesterTimes.length; j++) {
            const countTesterTime = countTesterTimes[j];
            const { type, time } = countTesterTime;
        
            if (type === 'isStarted' && time) {
              startTime = time;
            } else if (type === 'isPaused' && startTime && time) {
              pauseTime = time;
            } else if (type === 'isResumed' && pauseTime && time) {
              resumeTime = time;
            } else if (type === 'isStopped' && resumeTime && time) {
              stopTime = time;
            }
          }
        }
        
        console.log('startTime:', startTime);
        console.log('pauseTime:', pauseTime);
        console.log('resumeTime:', resumeTime);
        console.log ('stopTime:', stopTime);

        if (!startTime || !stopTime) {
            throw new Error('Cannot calculate duration: missing start or stop time');
          }

          const start = moment.utc(startTime, "HH:mm:ss");
        //   console.log(start)
          const pause = moment.utc(pauseTime, "HH:mm:ss");
        //   console.log(pause)
          const resume = moment.utc(resumeTime, "HH:mm:ss");
        //   console.log(resume)
          const stop = moment.utc(stopTime, "HH:mm:ss");
        //   console.log(typeof stop)

          const totalDuration = moment.duration(stop.diff(start));
          const pauseDuration = moment.duration(pause.diff(start));
          const resumeDuration = moment.duration(resume.diff(start));
          const actualDuration = moment.duration(totalDuration - pauseDuration + resumeDuration);
          const duration = actualDuration.asMinutes();

        
        //   console.log(duration)

          function calculateDuration(startTime, pauseTime, resumeTime, stopTime) {
            const start = moment.utc(startTime, "HH:mm:ss");
        //   console.log(start)
          const pause = moment.utc(pauseTime, "HH:mm:ss");
        //   console.log(pause)
          const resume = moment.utc(resumeTime, "HH:mm:ss");
        //   console.log(resume)
          const stop = moment.utc(stopTime, "HH:mm:ss");
        //   console.log(stop)
            
            const totalDuration = moment.duration(stop.diff(start));
            const pauseDuration = moment.duration(pause.diff(start));
            const resumeDuration = moment.duration(resume.diff(start));
            const actualDuration = moment.duration(totalDuration - pauseDuration + resumeDuration);
            const duration = actualDuration.asMinutes();
            
            return duration;
          }
          
          const updatedtestcases = testCases.map(item => {
            // console.log('item',item )
            let startTime, pauseTime, resumeTime, stopTime 
            const {...itemrest} = item
            // const { startTime, pauseTime, resumeTime, stopTime } = item;
            const restime = item.counttesterTime
            // console.log('restime',restime)
            for(i=0;i<restime.length;i++){
                if (restime[i].type === 'isStarted') {
                    startTime = restime[i].time;
                  } else if (restime[i].type  === 'isPaused' ) {
                    pauseTime = restime[i].time;;
                  } else if (restime[i].type  === 'isResumed' ) {
                    resumeTime = restime[i].time;;
                  } else if (restime[i].type  === 'isStopped' ) {
                    stopTime = restime[i].time;
                  }
            }
            console.log('Vikash',startTime, resumeTime, pauseTime, stopTime)
            // const counttestertimer = [];
            
            if (startTime) {
              restime.push({
                time: moment.utc(startTime, 'HH:mm:ss').format(),
                type: 'isStarted'
              });
            }
            
            if (pauseTime) {
              restime.push({
                time: moment.utc(pauseTime, 'HH:mm:ss').format(),
                type: 'isPaused'
              });
            }
            
            if (resumeTime) {
              restime.push({
                time: moment.utc(resumeTime, 'HH:mm:ss').format(),
                type: 'isResumed'
              });
            }
            
            if (stopTime) {
              restime.push({
                time: moment.utc(stopTime, 'HH:mm:ss').format(),
                type: 'isStopped'
              });
            }
            
            const duration = calculateDuration(
              moment.utc(startTime, 'HH:mm:ss').format(),
              moment.utc(pauseTime, 'HH:mm:ss').format(),
              moment.utc(resumeTime, 'HH:mm:ss').format(),
              moment.utc(stopTime, 'HH:mm:ss').format()
            );
            
            // console.log(counttestertimer,'counttestertimer')
            console.log(duration,'duration')
           item.duration = duration
        //    item.push(duration) 
        //    console.log("my item",item)
        //    console.log(item.duration,'itemduration')
            // item.counttestertimer = counttestertimer;
            return {  counttesterTime: restime, duration, ...itemrest};
          });
          
        //   console.log(duration,'durationoutside')
          console.log('updatedtestcases',updatedtestcases)
          
          
          const totalDurationn = updatedtestcases.reduce((acc, item) => acc + item.duration, 0);

          const runstart = moment.utc(runStartTime);
          const runend = moment.utc(runEndTime);

          console.log('runstart',runstart)
          console.log('runend',runend)

        //   const runtotal = moment.utc(runend.diff(runstart)).format('HH:mm:ss');
        const runtotal = moment.duration(moment(runend).diff(moment(runstart))).asMilliseconds() / 60000;

        
          console.log('runtotal',runtotal)
          
          const grandtotal = totalDurationn + runtotal
          
           
        const result = await TestRun.updateOne({_id:_id},{$set: {testCases:  updatedtestcases}, finalDuration: grandtotal, runStartTime: runStartTime, runEndtime:runEndTime, ...rest})

          res.send(result)
        
         
  
    }
    catch(err){
      res.send(err.message)
      console.log(err)
    }
  
  
  })

  module.exports = router