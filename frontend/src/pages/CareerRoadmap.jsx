import { useState } from 'react';
import Layout from '../components/Layout';
import { featuresAPI } from '../services/api';

const careers = [
  { id: 'google', label: '💻 Software Engineer' },
  { id: 'upsc', label: '🏛️ UPSC / IAS' },
  { id: 'police', label: '🚔 Police / SSC' },
  { id: 'mba', label: '📈 MBA / CAT' },
];

export default function CareerRoadmap() {
  const [selected, setSelected] = useState('google');
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async (career) => {
    setSelected(career);
    setLoading(true);
    try {
      const data = await featuresAPI.careerRoadmap(career);
      setRoadmap(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  return (
    <Layout emoji="🎯" title="Career Roadmap" subtitle="Pick your dream career — AI builds a complete study roadmap just for you">
      <div className="btn-group">
        {careers.map((c) => (
          <button key={c.id} className={`btn ${selected === c.id ? 'btn-accent' : 'btn-outline'}`} onClick={() => generate(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      {loading ? <div className="loading">Generating your personalized roadmap...</div> : roadmap && (
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3>{roadmap.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>
              Recommended daily study: <strong>{roadmap.dailyHours} hours</strong>
            </p>
            <div className="tag-list">
              {roadmap.keySkills?.map((s) => <span key={s} className="tag">{s}</span>)}
            </div>
          </div>

          {roadmap.phases?.map((phase, i) => (
            <div key={i} className="roadmap-phase card" style={{ marginBottom: 16 }}>
              <h4>Phase {i + 1}: {phase.phase}</h4>
              <span className="duration">{phase.duration}</span>
              <div className="tag-list">
                {phase.topics.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {!roadmap && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: 'var(--text-muted)' }}>Select a career goal above to generate your AI-powered study roadmap</p>
        </div>
      )}
    </Layout>
  );
}
