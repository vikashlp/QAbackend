const mongoose = require("mongoose");
const moment = require('moment');

// const testRunSchema = new mongoose.Schema({
//     testSet: [
//         {
//         testCaseName: {type:String, required: true, unique:true},
//         testSteps: [
//             {   type: Object,
//                 stepName: {type:String},
//                 stepstatus: {type:String, enum: ['passed', 'failed']},
//                 stepStartTime: {type: Date },
//                 stepPauseTime: {type: Date },
//                 stepStopTime: {type: Date},
//                 stepDuration: {type: Number},
//                 description: {type:String} 
//             } 
//         ],
//         startTime: { type: String, required: true },
//         pauseTime: { type: String },
//         stopTime: { type: String },
//         duration: { type: Number },
//         status: { type: String, enum: ['passed', 'failed'],
//         required: true,
//     required: true}
//     }
//     ],
//     testSetName: {type: String, required: true},
//     finalDuration: { type: Number },
//     finalStatus: {
//         type: String,
//         enum: ['passed', 'failed'],
//         required: true,
//         required: true
//     }
// })

// const testRun = mongoose.model("testruns", testRunSchema);
// module.exports = testRun;


//newSchema
const testRunSchema = new mongoose.Schema({
    testsetname: {type: String, unique: true},
   testCases : [
    {
        testname: {
            type: String, unique: true
        },
        status: {
            type: String,
        },
        testlevel: {
            type: String,
        },
        testinfo: {
            type: String,
        },
        stepArr:[
            {
                steps:{
                   type:String 
                },
                result:{

                    status:{
                        type:String,
                        },
                    description:{
                        type:String,
                        },
                    checktime:{
                        type:String,
                        }
                }
            }
        ],
        Timeid : {type:String},
        counttesterTime: [
           {
           time: {type:String},
           type:{type:String}
           }
        ],
       duration: {type:Number}
    }
   ],
   runStartTime:{type:String},
   runEndtime:{type:String},
   finalDuration:{type:Number},
   finalStatus:{type:String}

})

const testRun = mongoose.model("testruns", testRunSchema);
module.exports = testRun;
