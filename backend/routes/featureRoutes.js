const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/featureController");

router.get("/dashboard/:userId", ctrl.getDashboard);
router.get("/learning-twin/:userId", ctrl.getLearningTwin);
router.put("/learning-twin/:userId", ctrl.updateLearningTopics);
router.post("/career-roadmap", ctrl.getCareerRoadmap);
router.post("/skill-gap", ctrl.analyzeSkillGap);
router.get("/mentor/:userId", ctrl.getMentorHistory);
router.post("/mentor/:userId", ctrl.mentorChat);
router.get("/burnout/:userId", ctrl.getBurnoutAnalysis);
router.post("/burnout/:userId", ctrl.logBurnout);
router.post("/exam-predictor", ctrl.predictExam);
router.post("/project-generator", ctrl.generateProject);
router.get("/study-groups/:userId", ctrl.matchStudyGroups);
router.post("/youtube-learning", ctrl.curateYouTube);

module.exports = router;
