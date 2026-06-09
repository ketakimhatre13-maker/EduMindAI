const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  goal: { type: String, default: "" },
  strengths: [String],
  weaknesses: [String],
  marks: { type: Map, of: Number, default: {} },
  projects: [String],
  learningTopics: [{
    topic: String,
    timeSpent: Number,
    questionsAttempted: Number,
    questionsCorrect: Number,
    lastStudied: Date,
    comprehensionScore: Number,
  }],
  burnoutRecords: [{
    date: { type: Date, default: Date.now },
    studyHours: Number,
    mood: Number,
    performance: Number,
    notes: String,
  }],
  mentorMessages: [{
    role: String,
    content: String,
    timestamp: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
