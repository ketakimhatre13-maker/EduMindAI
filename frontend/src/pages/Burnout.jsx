import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { featuresAPI, getUser } from '../services/api';

export default function Burnout() {
  const user = getUser();
  const [analysis, setAnalysis] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ studyHours: 5, mood: 7, performance: 70, notes: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!user?._id) return;
    featuresAPI.burnout(user._id)
      .then((d) => { setAnalysis(d.analysis); setRecords(d.records || []); })
      .finally(() => setLoading(false));
  };

  useEffect(load, [user?._id]);

  const logSession = async () => {
    setSaving(true);
    try {
      const data = await featuresAPI.logBurnout(user._id, form);
      setAnalysis(data.analysis);
      load();
      setForm({ studyHours: 5, mood: 7, performance: 70, notes: '' });
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  const riskColor = { high: 'var(--danger)', medium: 'var(--warning)', low: 'var(--success)' };

  if (loading) return <Layout emoji="🔋" title="Burnout Detector"><div className="loading">Analyzing your study patterns...</div></Layout>;

  return (
    <Layout emoji="🔋" title="Burnout & Motivation Detector" subtitle="Detects when you're burning out, tracks mood & suggests lighter study schedules">
      <div className="grid grid-4" style={{ marginBottom: 28 }}>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: riskColor[analysis?.risk] }}>{analysis?.risk}</div>
          <div className="stat-label">Burnout Risk</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{analysis?.avgMood}/10</div>
          <div className="stat-label">Avg Mood</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{analysis?.avgHours}h</div>
          <div className="stat-label">Avg Study Hours</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{analysis?.consistency}%</div>
          <div className="stat-label">Consistency</div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Recommendations</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {analysis?.suggestions?.map((s, i) => (
              <li key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '.9rem' }}>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3>Log Session</h3>
          <div className="form-group">
            <label>Study Hours: {form.studyHours}</label>
            <input type="range" min="0" max="12" value={form.studyHours} onChange={(e) => setForm({ ...form, studyHours: +e.target.value })} />
          </div>
          <div className="form-group">
            <label>Mood (1-10): {form.mood}</label>
            <input type="range" min="1" max="10" value={form.mood} onChange={(e) => setForm({ ...form, mood: +e.target.value })} />
          </div>
          <div className="form-group">
            <label>Performance (1-100): {form.performance}</label>
            <input type="range" min="0" max="100" value={form.performance} onChange={(e) => setForm({ ...form, performance: +e.target.value })} />
          </div>
          <button className="btn btn-accent" onClick={logSession} disabled={saving}>
            {saving ? 'Saving...' : 'Log Session'}
          </button>
        </div>
      </div>

      {analysis?.lighterSchedule?.length > 0 && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3>Adjusted Schedule</h3>
          <ul className="topic-list">
            {analysis.lighterSchedule.map((d, i) => (
              <li key={i}>
                <span>{new Date(d.day).toLocaleDateString()} — {d.focus}</span>
                <span>{d.originalHours}h → <strong>{d.suggestedHours}h</strong></span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Layout>
  );
}
