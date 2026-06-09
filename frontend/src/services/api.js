const API = '/api';

async function request(url, options = {}) {
  const res = await fetch(`${API}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const authAPI = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
};

export const featuresAPI = {
  dashboard: (userId) => request(`/dashboard/${userId}`),
  learningTwin: (userId) => request(`/learning-twin/${userId}`),
  careerRoadmap: (career) => request('/career-roadmap', { method: 'POST', body: JSON.stringify({ career }) }),
  skillGap: (resumeText, targetJob) => request('/skill-gap', { method: 'POST', body: JSON.stringify({ resumeText, targetJob }) }),
  mentorHistory: (userId) => request(`/mentor/${userId}`),
  mentorChat: (userId, message) => request(`/mentor/${userId}`, { method: 'POST', body: JSON.stringify({ message }) }),
  burnout: (userId) => request(`/burnout/${userId}`),
  logBurnout: (userId, record) => request(`/burnout/${userId}`, { method: 'POST', body: JSON.stringify(record) }),
  examPredictor: (subject) => request('/exam-predictor', { method: 'POST', body: JSON.stringify({ subject }) }),
  projectGenerator: (skills, interests) => request('/project-generator', { method: 'POST', body: JSON.stringify({ skills, interests }) }),
  studyGroups: (userId) => request(`/study-groups/${userId}`),
  youtubeLearning: (topic) => request('/youtube-learning', { method: 'POST', body: JSON.stringify({ topic }) }),
};

export function getUser() {
  const raw = localStorage.getItem('edumind_user');
  return raw ? JSON.parse(raw) : null;
}

export function setUser(user) {
  localStorage.setItem('edumind_user', JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem('edumind_user');
}
