import { NavLink, useNavigate } from 'react-router-dom';
import { getUser, clearUser } from '../services/api';
import Logo from './Logo';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', emoji: '🏠' },
  { path: '/learning-twin', label: 'Learning Twin', emoji: '🧠' },
  { path: '/career-roadmap', label: 'Career Roadmap', emoji: '🎯' },
  { path: '/skill-gap', label: 'Skill Gap', emoji: '📊' },
  { path: '/mentor-chat', label: 'AI Mentor', emoji: '💬' },
  { path: '/burnout', label: 'Burnout Detector', emoji: '🔋' },
  { path: '/exam-predictor', label: 'Exam Predictor', emoji: '📝' },
  { path: '/project-generator', label: 'Project Generator', emoji: '🚀' },
  { path: '/study-group', label: 'Study Groups', emoji: '👥' },
  { path: '/youtube-learning', label: 'YouTube Learning', emoji: '▶️' },
];

function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function Layout({ children, title, subtitle, emoji }) {
  const user = getUser();
  const navigate = useNavigate();

  const logout = () => {
    clearUser();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Logo size="sm" />
          <div>
            <h2>EduMindAI</h2>
            <p>🎓 Learn Smarter</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          <span className="nav-label">✨ Features</span>
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-emoji">{item.emoji}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-block">
            <div className="user-avatar">{getInitials(user?.name)}</div>
            <div className="user-info">
              <p className="user-name">{user?.name || 'Student'}</p>
              <p className="user-role">{user?.goal || '📚 Learner'}</p>
            </div>
          </div>
          <button onClick={logout} className="btn-logout">👋 Sign out</button>
        </div>
      </aside>

      <div className="main-wrapper">
        <header className="top-bar">
          <div className="top-bar-inner">
            <span className="top-bar-title">🌟 EduMindAI Platform</span>
            <span className="status-dot">● Live & Ready</span>
          </div>
        </header>
        <main className="main-content">
          <div className="page-container">
            {(title || subtitle) && (
              <header className="page-header">
                {emoji && <div className="page-emoji">{emoji}</div>}
                {title && <h1>{title}</h1>}
                {subtitle && <p>{subtitle}</p>}
              </header>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
