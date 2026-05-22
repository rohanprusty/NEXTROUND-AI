import mongoose from "mongoose";

const questionsSchema = new mongoose.Schema({
     question: String,
  questionType: { type: String, enum: ['conceptual', 'coding'], default: 'conceptual' },
  codeSnippet: { type: String, default: "" },
  difficulty: String,
  timeLimit: Number,
  answer: String,
  feedback: String,
  body_language_feedback: String,
  score: { type: Number, default: 0 },
  confidence: { type: Number, default: 0 },
communication: { type: Number, default: 0 },
correctness: { type: Number, default: 0 },
cheatingDetected: { type: Boolean, default: false },
cheatingDetails: { type: [String], default: [] }
})


const interviewSchema = new mongoose.Schema({
    targetCompany: { type: String, default: 'General' },
    interviewMode: { type: String, enum: ['Practice', 'Strict'], default: 'Practice' },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    role:{
        type:String,
        required:true
    },
    experience:{
        type:String,
        required:true
    },
    mode:{
        type:String,
        enum:["HR" ,"Technical"],
        required:true
    },
    resumeText:{
     type:String
    },
    questions:[questionsSchema],

    finalScore: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["Incompleted", "completed"],
      default: "Incompleted",
    }
},{timestamps:true})

const Interview = mongoose.model("Interview" , interviewSchema)


export default Interview