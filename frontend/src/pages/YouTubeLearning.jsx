import { useState } from 'react';
import Layout from '../components/Layout';
import { featuresAPI } from '../services/api';

export default function YouTubeLearning() {
  const [topic, setTopic] = useState('');
  const [pack, setPack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('videos');

  const search = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const data = await featuresAPI.youtubeLearning(topic);
      setPack(data);
      setTab('videos');
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  return (
    <Layout emoji="▶️" title="YouTube Learning" subtitle="Enter any topic — AI finds videos, notes, quizzes & a full learning roadmap">
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search()}
            placeholder="Enter a topic... e.g. Machine Learning, Organic Chemistry"
            style={{ flex: 1 }}
          />
          <button className="btn btn-accent" onClick={search} disabled={loading}>
            {loading ? 'Curating...' : 'Learn'}
          </button>
        </div>
      </div>

      {pack && (
        <>
          <div className="tabs">
            <button className={`tab ${tab === 'videos' ? 'active' : ''}`} onClick={() => setTab('videos')}>Videos</button>
            <button className={`tab ${tab === 'notes' ? 'active' : ''}`} onClick={() => setTab('notes')}>Notes</button>
            <button className={`tab ${tab === 'quiz' ? 'active' : ''}`} onClick={() => setTab('quiz')}>Quiz</button>
            <button className={`tab ${tab === 'roadmap' ? 'active' : ''}`} onClick={() => setTab('roadmap')}>Roadmap</button>
          </div>

          {tab === 'videos' && (
            <div className="grid grid-3">
              {pack.videos?.map((v, i) => (
                <div key={i} className="card">
                  <h3 style={{ fontSize: '.9rem' }}>{v.title}</h3>
                  <p style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{v.channel} · {v.duration}</p>
                  <a href={v.url} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ marginTop: 12, fontSize: '.8rem' }}>
                    Watch on YouTube
                  </a>
                </div>
              ))}
            </div>
          )}

          {tab === 'notes' && pack.notes?.map((note, i) => (
            <div key={i} className="card" style={{ marginBottom: 12, whiteSpace: 'pre-wrap', fontSize: '.9rem' }}>
              {note}
            </div>
          ))}

          {tab === 'quiz' && (
            <div className="card">
              {pack.quiz?.map((q, i) => (
                <div key={i} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                  <p><strong>Q{i + 1}.</strong> {q.question}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
                    {q.options.map((opt, j) => (
                      <button key={j} className="btn btn-outline" style={{ fontSize: '.8rem', justifyContent: 'center' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'roadmap' && pack.roadmap?.map((step) => (
            <div key={step.step} className="roadmap-phase card" style={{ marginBottom: 12 }}>
              <h4>Step {step.step}: {step.title} <span className="duration">({step.duration})</span></h4>
              <ul style={{ paddingLeft: 20, fontSize: '.85rem', color: 'var(--text-muted)' }}>
                {step.tasks.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
          ))}
        </>
      )}
    </Layout>
  );
}
