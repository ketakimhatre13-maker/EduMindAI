import { useState } from 'react';
import Layout from '../components/Layout';
import { featuresAPI } from '../services/api';

export default function SkillGap() {
  const [resume, setResume] = useState('');
  const [targetJob, setTargetJob] = useState('software engineer');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const data = await featuresAPI.skillGap(resume, targetJob);
      setAnalysis(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  return (
    <Layout emoji="📊" title="Skill Gap Detector" subtitle="Paste your resume — AI finds missing skills and builds your learning path automatically">
      <div className="grid grid-2">
        <div className="card">
          <div className="form-group">
            <label>Target Job</label>
            <select value={targetJob} onChange={(e) => setTargetJob(e.target.value)}>
              <option value="software engineer">Software Engineer</option>
              <option value="data scientist">Data Scientist</option>
              <option value="product manager">Product Manager</option>
              <option value="ui/ux designer">UI/UX Designer</option>
              <option value="devops engineer">DevOps Engineer</option>
            </select>
          </div>
          <div className="form-group">
            <label>Resume / Skills (paste text)</label>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume or list your skills here...&#10;e.g. JavaScript, React, Python, HTML, CSS"
            />
          </div>
          <button className="btn btn-accent" onClick={analyze} disabled={loading || !resume.trim()}>
            {loading ? 'Analyzing...' : 'Analyze Skill Gap'}
          </button>
        </div>

        {analysis && (
          <div className="card">
            <h3>Match Score: {analysis.matchScore}%</h3>
            <div className="progress-bar" style={{ marginBottom: 20 }}>
              <div className="progress-fill" style={{ width: `${analysis.matchScore}%` }} />
            </div>
            <p><strong>✅ You have:</strong></p>
            <div className="tag-list" style={{ marginBottom: 16 }}>
              {analysis.skillsPresent.map((s) => <span key={s} className="tag tag-success">{s}</span>)}
            </div>
            <p><strong>❌ Missing:</strong></p>
            <div className="tag-list">
              {analysis.skillsMissing.map((s) => <span key={s} className="tag tag-danger">{s}</span>)}
            </div>
          </div>
        )}
      </div>

      {analysis?.learningPath && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3>Generated Learning Path</h3>
          {analysis.learningPath.map((item, i) => (
            <div key={i} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{item.skill}</strong>
                <span className={`badge badge-${item.priority === 'high' ? 'high' : item.priority === 'medium' ? 'medium' : 'low'}`}>
                  {item.priority} · {item.estimatedWeeks} weeks
                </span>
              </div>
              <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginTop: 6 }}>
                {item.resources.join(' · ')}
              </p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
