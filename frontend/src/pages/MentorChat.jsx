import { useEffect, useState, useRef } from 'react';
import Layout from '../components/Layout';
import { featuresAPI, getUser } from '../services/api';

const suggestions = [
  'What are my weakest subjects?',
  'How should I prepare for my exam?',
  'Suggest a project for my portfolio',
  'I feel tired and unmotivated',
];

export default function MentorChat() {
  const user = getUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!user?._id) return;
    featuresAPI.mentorHistory(user._id)
      .then((d) => setMessages(d.history || []))
      .catch(() => {});
  }, [user?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    if (!text.trim() || !user?._id) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const data = await featuresAPI.mentorChat(user._id, text);
      setMessages(data.history || []);
    } catch {
      setMessages((prev) => [...prev, { role: 'mentor', content: 'Sorry, I could not respond. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout emoji="💬" title="AI Mentor Chat" subtitle="Not a normal chatbot — knows your marks, weaknesses, goals & full learning history">
      <div className="card">
        <div className="chat-container">
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="chat-empty">
                <div className="mentor-avatar">🤖</div>
                <p>Hey {user?.name}! I'm your AI mentor — I know your goals, weak spots & progress. Ask me anything!</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role === 'user' ? 'user' : 'mentor'}`}>
                {m.content}
              </div>
            ))}
            {loading && <div className="chat-bubble mentor">Thinking...</div>}
            <div ref={bottomRef} />
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {suggestions.map((s) => (
              <button key={s} className="btn btn-outline" style={{ fontSize: '.8rem', padding: '6px 12px' }} onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>

          <div className="chat-input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(input)}
              placeholder="Ask your mentor..."
              disabled={loading}
            />
            <button className="btn btn-accent" onClick={() => send(input)} disabled={loading || !input.trim()}>Send 💬</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
