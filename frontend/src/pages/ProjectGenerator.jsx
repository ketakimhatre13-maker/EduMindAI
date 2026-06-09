import { useState } from 'react';
import Layout from '../components/Layout';
import { featuresAPI } from '../services/api';

export default function ProjectGenerator() {
  const [skills, setSkills] = useState('React, Node.js, MongoDB');
  const [interests, setInterests] = useState('education technology');
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const data = await featuresAPI.projectGenerator(skills, interests);
      setProject(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  return (
    <Layout emoji="🚀" title="Project Generator" subtitle="AI suggests unique project ideas with roadmap, resources & timeline based on your skills">
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="grid grid-2">
          <div className="form-group">
            <label>Your Skills (comma-separated)</label>
            <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Python, ML..." />
          </div>
          <div className="form-group">
            <label>Interests</label>
            <input value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="education, health, finance..." />
          </div>
        </div>
        <button className="btn btn-accent" onClick={generate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Project Idea'}
        </button>
      </div>

      {project && (
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3>{project.project}</h3>
            <p style={{ margin: '8px 0', color: 'var(--text-muted)' }}>{project.description}</p>
            <p style={{ fontSize: '.85rem' }}><strong>Why unique:</strong> {project.uniqueness}</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <span className="tag">{project.timeline}</span>
              <span className="tag">{project.difficulty}</span>
            </div>
          </div>

          <div className="grid grid-2">
            <div className="card">
              <h3>Implementation Roadmap</h3>
              {project.roadmap?.map((week) => (
                <div key={week.week} className="roadmap-phase">
                  <h4>Week {week.week}</h4>
                  <ul style={{ paddingLeft: 20, fontSize: '.85rem', color: 'var(--text-muted)' }}>
                    {week.tasks.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </div>
              ))}
            </div>

            <div className="card">
              <h3>Resources</h3>
              {project.resources?.map((r, i) => (
                <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span className="tag">{r.type}</span>
                  <p style={{ marginTop: 6 }}><a href={r.url} target="_blank" rel="noreferrer">{r.title}</a></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
