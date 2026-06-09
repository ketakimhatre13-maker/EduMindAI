import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, setUser } from '../services/api';
import Logo from '../components/Logo';

const highlights = [
  { emoji: '🧠', text: 'AI predicts what you\'ll struggle with' },
  { emoji: '📊', text: 'Analyze skills & build learning paths' },
  { emoji: '👥', text: 'Find perfect study partners' },
  { emoji: '▶️', text: 'Learn anything from YouTube instantly' },
];

const floatEmojis = ['🚀', '⭐', '📖', '🎯', '💪', '🌟'];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', goal: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.register(form);
      const data = await authAPI.login({ email: form.email, password: form.password });
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-floats">
        {floatEmojis.map((e, i) => (
          <span key={i} className={`float-emoji float-${i}`}>{e}</span>
        ))}
      </div>
      <div className="auth-panel auth-panel-left">
        <div className="auth-panel-content">
          <div className="auth-hero-emoji">🚀</div>
          <Logo size="lg" />
          <h2>Start Learning Smarter Today</h2>
          <p>Join thousands of students using AI to ace exams, build skills & reach career goals.</p>
          <div className="auth-features">
            {highlights.map((item) => (
              <div key={item.text} className="auth-feature">
                <span className="auth-feature-emoji">{item.emoji}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="auth-panel auth-panel-right">
        <div className="auth-card">
          <div className="auth-card-emoji">✨</div>
          <h1>Create Account</h1>
          <p className="subtitle">Set up your free AI-powered learning profile</p>
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>👤 Full name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Your name" />
            </div>
            <div className="form-group">
              <label>📧 Email address</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label>🔒 Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required placeholder="Create a strong password" />
            </div>
            <div className="form-group">
              <label>🎯 Career goal</label>
              <select value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}>
                <option value="">Select your goal</option>
                <option value="Google SWE">💻 Software Engineer</option>
                <option value="UPSC">🏛️ UPSC Civil Services</option>
                <option value="Police">🚔 Government / Police</option>
                <option value="MBA">📈 MBA (CAT/GMAT)</option>
                <option value="Data Scientist">🔬 Data Scientist</option>
              </select>
            </div>
            <button type="submit" className="btn btn-accent" disabled={loading}>
              {loading ? 'Creating...' : '🎓 Get Started Free'}
            </button>
          </form>
          <p className="auth-link">Already have an account? <Link to="/login">Sign in →</Link></p>
        </div>
      </div>
    </div>
  );
}
