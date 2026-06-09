import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { featuresAPI, getUser } from '../services/api';

export default function StudyGroup() {
  const user = getUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    featuresAPI.studyGroups(user._id)
      .then(setData)
      .finally(() => setLoading(false));
  }, [user?._id]);

  if (loading) return <Layout emoji="👥" title="Study Groups"><div className="loading">Finding your study partners...</div></Layout>;

  return (
    <Layout emoji="👥" title="Study Group Matching" subtitle="Find students with similar goals & complementary strengths — coder + designer, etc.">
      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Your Profile</h3>
        <p style={{ fontSize: '.9rem', color: 'var(--text-muted)' }}>Goal: <strong>{data?.yourProfile?.goal}</strong></p>
        <div className="tag-list">
          <span className="tag tag-success">
            Strengths: {data?.yourProfile?.strengths?.join(', ')}
          </span>
          <span className="tag tag-danger">
            Weaknesses: {data?.yourProfile?.weaknesses?.join(', ')}
          </span>
        </div>
      </div>

      <p className="section-title">🤝 Best Matches For You</p>
      {data?.matches?.map((m, i) => (
        <div key={i} className="match-card">
          <div>
            <strong>{m.name}</strong>
            <p style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>{m.reason}</p>
            <div className="tag-list" style={{ marginTop: 8 }}>
              {m.strengths.map((s) => <span key={s} className="tag tag-success">{s}</span>)}
              {m.weaknesses.map((w) => <span key={w} className="tag tag-warning">Needs: {w}</span>)}
            </div>
            <p style={{ fontSize: '.8rem', marginTop: 8, color: 'var(--text-muted)' }}>{m.goal} · {m.availability}</p>
          </div>
          <div className="match-score">{m.matchScore}%</div>
        </div>
      ))}
    </Layout>
  );
}
