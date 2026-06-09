import { useState } from 'react';
import Layout from '../components/Layout';
import { featuresAPI } from '../services/api';

export default function ExamPredictor() {
  const [subject, setSubject] = useState('mathematics');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMock, setShowMock] = useState(false);

  const predict = async () => {
    setLoading(true);
    try {
      const result = await featuresAPI.examPredictor(subject);
      setData(result);
      setShowMock(false);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  return (
    <Layout emoji="📝" title="Smart Exam Predictor" subtitle="Analyzes past papers, predicts important topics & generates personalized mock tests">
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'end' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Subject</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="mathematics">Mathematics</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
            </select>
          </div>
          <button className="btn btn-accent" onClick={predict} disabled={loading}>
            {loading ? 'Analyzing...' : 'Predict Topics'}
          </button>
        </div>
      </div>

      {data && (
        <>
          <div className="grid grid-2">
            <div className="card">
              <h3>Predicted Topic Weights</h3>
              <p style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginBottom: 16 }}>{data.analysisNote}</p>
              <ul className="topic-list">
                {data.predictedTopics?.map((t, i) => (
                  <li key={i}>
                    <span>{t.topic} <span style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>({t.trend})</span></span>
                    <span>
                      <strong>{t.weight}%</strong>
                      <div className="progress-bar" style={{ width: 80, display: 'inline-block', marginLeft: 8, verticalAlign: 'middle' }}>
                        <div className="progress-fill" style={{ width: `${t.weight * 3}%` }} />
                      </div>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h3>High Priority Topics</h3>
              <div className="tag-list">
                {data.highPriority?.map((t) => (
                  <span key={t.topic} className="tag tag-danger">
                    {t.topic} ({t.weight}%)
                  </span>
                ))}
              </div>
              <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setShowMock(true)}>
                Generate Mock Test
              </button>
            </div>
          </div>

          {showMock && data.mockTest && (
            <div className="card" style={{ marginTop: 20 }}>
              <h3>{data.mockTest.title}</h3>
              <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                Duration: {data.mockTest.duration} min · Total: {data.mockTest.totalMarks} marks
              </p>
              {data.mockTest.questions?.map((q, i) => (
                <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <p><strong>Q{i + 1}.</strong> {q.q} <span className="tag">{q.topic}</span></p>
                  <p style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{q.marks} marks</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
