import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { featuresAPI, getUser } from '../services/api';

export default function LearningTwin() {
  const user = getUser();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    featuresAPI.learningTwin(user._id)
      .then(setData)
      .finally(() => setLoading(false));
  }, [user?._id]);

  if (loading) return <Layout emoji="🧠" title="AI Learning Twin"><div className="loading">Building your learning profile...</div></Layout>;

  const { twin, revisionSchedule } = data || {};

  return (
    <Layout emoji="🧠" title="AI Learning Twin" subtitle="Your digital brain — tracks how you learn, predicts struggles & schedules revision before you forget">
      <div className="tabs">
        <button className={`tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>Learning Profile</button>
        <button className={`tab ${tab === 'struggles' ? 'active' : ''}`} onClick={() => setTab('struggles')}>Struggle Predictions</button>
        <button className={`tab ${tab === 'forgetting' ? 'active' : ''}`} onClick={() => setTab('forgetting')}>Forgetting & Revision</button>
      </div>

      {tab === 'profile' && (
        <div className="grid grid-2">
          <div className="card">
            <h3>Comprehension by Topic</h3>
            <ul className="topic-list">
              {twin?.profile?.map((p, i) => (
                <li key={i}>
                  <span>{p.topic}</span>
                  <span>
                    <span className={`badge badge-${p.comprehensionSpeed}`}>{p.comprehensionSpeed}</span>
                    {' '}{p.comprehensionScore}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h3>Overall Profile</h3>
            <div className="stat-value" style={{ marginBottom: 16 }}>{twin?.avgComprehension}%</div>
            <p style={{ fontSize: '.9rem', color: 'var(--text-muted)' }}>
              Average comprehension across all topics. Your twin learns from every study session to refine predictions.
            </p>
            <div className="progress-bar" style={{ marginTop: 16 }}>
              <div className="progress-fill" style={{ width: `${twin?.avgComprehension}%` }} />
            </div>
          </div>
        </div>
      )}

      {tab === 'struggles' && (
        <div className="card">
          <h3>Predicted Struggle Areas</h3>
          {twin?.predictedStruggles?.length ? twin.predictedStruggles.map((s, i) => (
            <div key={i} style={{ padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{s.chapter}</strong>
                <span className={`badge badge-${s.risk}`}>{s.risk} risk</span>
              </div>
              <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', margin: '8px 0' }}>{s.reason}</p>
              <p style={{ fontSize: '.85rem' }}><strong>Recommended:</strong> {s.recommendedAction}</p>
            </div>
          )) : <p>No struggles predicted — great job!</p>}
        </div>
      )}

      {tab === 'forgetting' && (
        <div className="card">
          <h3>Spaced Revision Schedule</h3>
          <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>
            Uses Ebbinghaus forgetting curve to predict when you'll forget each topic and schedules revision before it happens.
          </p>
          <ul className="topic-list">
            {revisionSchedule?.map((r, i) => (
              <li key={i}>
                <div>
                  <strong>{r.topic}</strong>
                  <div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>
                    Retention: {r.currentRetention}% · Revise by: {new Date(r.revisionDue).toLocaleDateString()}
                  </div>
                </div>
                <span className={`badge badge-${r.urgency}`}>{r.urgency}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Layout>
  );
}
