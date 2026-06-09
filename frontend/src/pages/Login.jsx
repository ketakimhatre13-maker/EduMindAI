import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, setUser } from '../services/api';
import Logo from '../components/Logo';

const highlights = [
  { emoji: '🧠', text: 'AI Learning Twin & smart predictions' },
  { emoji: '🎯', text: 'Career roadmaps & skill gap analysis' },
  { emoji: '💬', text: 'Personal AI mentor that knows you' },
  { emoji: '🚀', text: '10 powerful learning modules' },
];

const floatEmojis = ['📚', '🎓', '✨', '🧠', '💡', '🏆'];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authAPI.login({ email, password });
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
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
          <div className="auth-hero-emoji">🎓</div>
          <Logo size="lg" />
          <h2>Your AI Study Companion</h2>
          <p>Learn faster with personalized AI tools — predictions, mentors, roadmaps & more!</p>
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
          <div className="auth-card-emoji">👋</div>
          <h1>Welcome Back!</h1>
          <p className="subtitle">Sign in and continue your learning journey</p>
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>📧 Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label>🔒 Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" />
            </div>
            <button type="submit" className="btn btn-accent" disabled={loading}>
              {loading ? 'Signing in...' : '🚀 Sign In'}
            </button>
          </form>
          <p className="auth-link">New here? <Link to="/register">Create free account →</Link></p>
        </div>
      </div>
    </div>
  );
}
