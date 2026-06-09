import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LearningTwin from './pages/LearningTwin';
import CareerRoadmap from './pages/CareerRoadmap';
import SkillGap from './pages/SkillGap';
import MentorChat from './pages/MentorChat';
import Burnout from './pages/Burnout';
import ExamPredictor from './pages/ExamPredictor';
import ProjectGenerator from './pages/ProjectGenerator';
import StudyGroup from './pages/StudyGroup';
import YouTubeLearning from './pages/YouTubeLearning';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/learning-twin" element={<ProtectedRoute><LearningTwin /></ProtectedRoute>} />
        <Route path="/career-roadmap" element={<ProtectedRoute><CareerRoadmap /></ProtectedRoute>} />
        <Route path="/skill-gap" element={<ProtectedRoute><SkillGap /></ProtectedRoute>} />
        <Route path="/mentor-chat" element={<ProtectedRoute><MentorChat /></ProtectedRoute>} />
        <Route path="/burnout" element={<ProtectedRoute><Burnout /></ProtectedRoute>} />
        <Route path="/exam-predictor" element={<ProtectedRoute><ExamPredictor /></ProtectedRoute>} />
        <Route path="/project-generator" element={<ProtectedRoute><ProjectGenerator /></ProtectedRoute>} />
        <Route path="/study-group" element={<ProtectedRoute><StudyGroup /></ProtectedRoute>} />
        <Route path="/youtube-learning" element={<ProtectedRoute><YouTubeLearning /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;