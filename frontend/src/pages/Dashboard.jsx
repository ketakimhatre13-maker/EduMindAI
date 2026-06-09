import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { featuresAPI, getUser } from '../services/api';

const features = [
  { path: '/learning-twin', emoji: '🧠', color: 'purple', title: 'AI Learning Twin', desc: 'Digital profile that learns how fast you understand topics and predicts struggles' },
  { path: '/career-roadmap', emoji: '🎯', color: 'blue', title: 'Career Roadmap', desc: 'AI adapts your study plan for Google, UPSC, Police, MBA & more' },
  { path: '/skill-gap', emoji: '📊', color: 'green', title: 'Skill Gap Detector', desc: 'Analyze resume, find missing skills, get auto learning path' },
  { path: '/mentor-chat', emoji: '💬', color: 'pink', title: 'AI Mentor Chat', desc: 'Smart mentor that knows your marks, weaknesses & goals' },
  { path: '/burnout', emoji: '🔋', color: 'orange', title: 'Burnout Detector', desc: 'Detects performance drops and suggests lighter schedules' },
  { path: '/exam-predictor', emoji: '📝', color: 'red', title: 'Exam Predictor', desc: 'Predicts important topics and generates mock tests' },
  { path: '/project-generator', emoji: '🚀', color: 'indigo', title: 'Project Generator', desc: 'Unique project ideas with roadmap, resources & timeline' },
  { path: '/study-group', emoji: '👥', color: 'teal', title: 'Study Groups', desc: 'Find partners with similar goals & complementary skills' },
  { path: '/youtube-learning', emoji: '▶️', color: 'rose', title: 'YouTube Learning', desc: 'Enter a topic — get videos, notes, quizzes & roadmap' },
];

const statEmojis = ['📈', '⚠️', '🔋', '📅'];

export default function Dashboard() {
  const user = getUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) { setLoading(false); return; }
    featuresAPI.dashboard(user._id)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [user?._id]);

  const burnoutClass = data?.stats?.burnoutRisk === 'high' ? 'danger' : 'success';
  const stats = [
    { value: `${data?.stats?.avgComprehension ?? '—'}%`, label: 'Comprehension', class: 'accent' },
    { value: data?.stats?.struggleCount ?? 0, label: 'Risk Areas', class: '' },
    { value: data?.stats?.burnoutRisk ?? 'low', label: 'Burnout Risk', class: burnoutClass },
    { value: data?.stats?.revisionsDue ?? 0, label: 'Revisions Due', class: '' },
  ];

  return (
    <Layout
      emoji="👋"
      title={`Hey ${user?.name || 'Student'}, ready to learn?`}
      subtitle="Your personal AI command center — track progress and explore all modules"
    >
      {loading ? (
        <div className="loading">Loading your dashboard...</div>
      ) : (
        <>
          <div className="hero-banner">
            <div className="hero-banner-text">
              <h2>🌟 Learn Smarter with AI</h2>
              <p>10 intelligent modules working together to help you study better, predict exams, and reach your goals faster.</p>
            </div>
            <div className="hero-banner-emojis">
              <span>🧠</span><span>🎯</span><span>💬</span><span>🚀</span>
            </div>
          </div>

          <div className="grid grid-4 mb-6">
            {stats.map((s, i) => (
              <div key={s.label} className="card stat-card">
                <div className="stat-emoji">{statEmojis[i]}</div>
                <div className={`stat-value ${s.class}`}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {data?.predictedStruggles?.length > 0 && (
            <div className="card mb-6 alert-card">
              <h3>⚠️ Heads Up — Predicted Struggles</h3>
              <ul className="topic-list">
                {data.predictedStruggles.map((s, i) => (
                  <li key={i}>
                    <span><strong>{s.chapter}</strong> — {s.reason}</span>
                    <span className={`badge badge-${s.risk}`}>{s.risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="section-title">🚀 Explore All Features</p>
          <div className="feature-grid">
            {features.map((f) => (
              <Link key={f.path} to={f.path} className={`feature-card feature-${f.color}`}>
                <div className="feature-card-emoji">{f.emoji}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <span className="feature-arrow">Explore →</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}
