const User = require("../models/User");
const ai = require("../services/aiEngine");

const getUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  return user;
};

exports.getLearningTwin = async (req, res) => {
  try {
    const user = await getUser(req.params.userId);
    const topics = user.learningTopics?.length ? user.learningTopics : [
      { topic: "Calculus", timeSpent: 3, questionsAttempted: 20, questionsCorrect: 14, lastStudied: new Date(), comprehensionScore: 70 },
      { topic: "Linear Algebra", timeSpent: 5, questionsAttempted: 15, questionsCorrect: 6, lastStudied: new Date(Date.now() - 5 * 86400000), comprehensionScore: 40 },
      { topic: "Probability", timeSpent: 2, questionsAttempted: 25, questionsCorrect: 20, lastStudied: new Date(), comprehensionScore: 80 },
      { topic: "Organic Chemistry", timeSpent: 4, questionsAttempted: 18, questionsCorrect: 8, lastStudied: new Date(Date.now() - 3 * 86400000), comprehensionScore: 44 },
    ];
    const twin = ai.buildLearningProfile(topics);
    const revisionSchedule = ai.generateRevisionSchedule(topics);
    res.json({ twin, revisionSchedule, student: { name: user.name, goal: user.goal } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateLearningTopics = async (req, res) => {
  try {
    const user = await getUser(req.params.userId);
    user.learningTopics = req.body.topics;
    await user.save();
    res.json({ message: "Topics updated", twin: ai.buildLearningProfile(user.learningTopics) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCareerRoadmap = async (req, res) => {
  try {
    const { career } = req.body;
    const roadmap = ai.generateCareerRoadmap(career || "google");
    res.json(roadmap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.analyzeSkillGap = async (req, res) => {
  try {
    const { resumeText, targetJob } = req.body;
    const analysis = ai.analyzeSkillGap(resumeText || "", targetJob || "software engineer");
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.mentorChat = async (req, res) => {
  try {
    const user = await getUser(req.params.userId);
    const { message } = req.body;
    const context = {
      marks: Object.fromEntries(user.marks || []),
      weaknesses: user.weaknesses || [],
      goals: user.goal || "",
      projects: user.projects || [],
    };
    const reply = ai.generateMentorResponse(message, context);
    user.mentorMessages.push({ role: "user", content: message });
    user.mentorMessages.push({ role: "mentor", content: reply });
    await user.save();
    res.json({ reply, history: user.mentorMessages.slice(-20) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMentorHistory = async (req, res) => {
  try {
    const user = await getUser(req.params.userId);
    res.json({ history: user.mentorMessages || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logBurnout = async (req, res) => {
  try {
    const user = await getUser(req.params.userId);
    user.burnoutRecords.push(req.body);
    await user.save();
    const analysis = ai.detectBurnout(user.burnoutRecords);
    res.json({ message: "Logged", analysis });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBurnoutAnalysis = async (req, res) => {
  try {
    const user = await getUser(req.params.userId);
    const records = user.burnoutRecords?.length ? user.burnoutRecords : [
      { date: new Date(Date.now() - 6 * 86400000), studyHours: 6, mood: 7, performance: 75 },
      { date: new Date(Date.now() - 5 * 86400000), studyHours: 7, mood: 6, performance: 70 },
      { date: new Date(Date.now() - 4 * 86400000), studyHours: 8, mood: 5, performance: 60 },
      { date: new Date(Date.now() - 3 * 86400000), studyHours: 9, mood: 4, performance: 55 },
      { date: new Date(Date.now() - 2 * 86400000), studyHours: 7, mood: 5, performance: 50 },
      { date: new Date(Date.now() - 1 * 86400000), studyHours: 5, mood: 6, performance: 58 },
      { date: new Date(), studyHours: 4, mood: 7, performance: 62 },
    ];
    const analysis = ai.detectBurnout(records);
    res.json({ analysis, records });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.predictExam = async (req, res) => {
  try {
    const { subject } = req.body;
    const prediction = ai.predictExamTopics(subject || "mathematics");
    res.json(prediction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.generateProject = async (req, res) => {
  try {
    const { skills, interests } = req.body;
    const project = ai.generateProject(skills || "React, Node.js", interests);
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.matchStudyGroups = async (req, res) => {
  try {
    const user = await getUser(req.params.userId);
    const profile = {
      goal: user.goal || req.body.goal || "Google SWE",
      strengths: user.strengths?.length ? user.strengths : ["Coding", "Algorithms"],
      weaknesses: user.weaknesses?.length ? user.weaknesses : ["Design", "UI"],
    };
    const matches = ai.matchStudyGroups(profile);
    res.json({ matches, yourProfile: profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.curateYouTube = async (req, res) => {
  try {
    const { topic } = req.body;
    const pack = ai.curateYouTubeLearning(topic || "Machine Learning");
    res.json(pack);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const user = await getUser(req.params.userId);
    const topics = user.learningTopics?.length ? user.learningTopics : [
      { topic: "Calculus", timeSpent: 3, questionsAttempted: 20, questionsCorrect: 14, comprehensionScore: 70 },
      { topic: "Linear Algebra", timeSpent: 5, questionsAttempted: 15, questionsCorrect: 6, comprehensionScore: 40 },
    ];
    const twin = ai.buildLearningProfile(topics);
    const burnout = ai.detectBurnout(user.burnoutRecords || []);
    const revisions = ai.generateRevisionSchedule(topics).filter((r) => r.urgency !== "scheduled").slice(0, 3);
    res.json({
      user: { name: user.name, goal: user.goal, email: user.email },
      stats: {
        avgComprehension: twin.avgComprehension,
        struggleCount: twin.predictedStruggles.length,
        burnoutRisk: burnout.risk,
        revisionsDue: revisions.length,
      },
      upcomingRevisions: revisions,
      predictedStruggles: twin.predictedStruggles.slice(0, 3),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
