// Rule-based AI engine — swap with OpenAI/LLM when API key is available

const CAREER_ROADMAPS = {
  google: {
    title: 'Software Engineer at Google',
    phases: [
      { phase: 'Foundation', duration: '3 months', topics: ['Data Structures', 'Algorithms', 'Time Complexity', 'Big-O Analysis'] },
      { phase: 'Core CS', duration: '4 months', topics: ['System Design', 'OS Concepts', 'Networking', 'Databases'] },
      { phase: 'Interview Prep', duration: '2 months', topics: ['LeetCode Medium/Hard', 'Behavioral (STAR)', 'Googleyness'] },
      { phase: 'Mock & Apply', duration: '1 month', topics: ['Mock Interviews', 'Resume Polish', 'Referrals'] },
    ],
    dailyHours: 6,
    keySkills: ['Python/Java', 'Algorithms', 'System Design', 'Problem Solving'],
  },
  upsc: {
    title: 'UPSC Civil Services (IAS/IPS)',
    phases: [
      { phase: 'Prelims Foundation', duration: '6 months', topics: ['History', 'Geography', 'Polity', 'Economy', 'Current Affairs'] },
      { phase: 'Mains Preparation', duration: '8 months', topics: ['Essay Writing', 'GS Papers I-IV', 'Optional Subject'] },
      { phase: 'Answer Writing', duration: '3 months', topics: ['Daily Answer Practice', 'Previous Year Papers', 'Test Series'] },
      { phase: 'Interview', duration: '1 month', topics: ['DAF Preparation', 'Current Affairs', 'Personality Test'] },
    ],
    dailyHours: 10,
    keySkills: ['Answer Writing', 'Current Affairs', 'Analytical Thinking', 'Discipline'],
  },
  police: {
    title: 'Police / SSC / Government Jobs',
    phases: [
      { phase: 'General Awareness', duration: '2 months', topics: ['Indian History', 'Geography', 'Polity', 'Science'] },
      { phase: 'Quantitative Aptitude', duration: '2 months', topics: ['Arithmetic', 'Algebra', 'Geometry', 'Data Interpretation'] },
      { phase: 'Reasoning', duration: '2 months', topics: ['Logical Reasoning', 'Verbal Reasoning', 'Non-Verbal'] },
      { phase: 'Physical & Mock Tests', duration: '1 month', topics: ['Physical Training', 'Full Mock Tests', 'Time Management'] },
    ],
    dailyHours: 5,
    keySkills: ['Speed Math', 'Logical Reasoning', 'GK', 'Physical Fitness'],
  },
  mba: {
    title: 'MBA (CAT / GMAT)',
    phases: [
      { phase: 'Quantitative Aptitude', duration: '3 months', topics: ['Arithmetic', 'Algebra', 'Geometry', 'Modern Math'] },
      { phase: 'Verbal Ability', duration: '3 months', topics: ['Reading Comprehension', 'Para Jumbles', 'Vocabulary', 'Grammar'] },
      { phase: 'Data Interpretation & LR', duration: '2 months', topics: ['DI Sets', 'Logical Reasoning', 'Puzzles'] },
      { phase: 'Mocks & GD-PI', duration: '2 months', topics: ['Full Mocks', 'GD Practice', 'PI Preparation'] },
    ],
    dailyHours: 5,
    keySkills: ['Quant', 'Verbal', 'DI/LR', 'Business Awareness'],
  },
};

const JOB_SKILL_REQUIREMENTS = {
  'software engineer': ['JavaScript', 'React', 'Node.js', 'Data Structures', 'Git', 'SQL', 'REST APIs'],
  'data scientist': ['Python', 'Machine Learning', 'Statistics', 'Pandas', 'SQL', 'Deep Learning', 'Data Visualization'],
  'product manager': ['Product Strategy', 'User Research', 'Agile', 'Analytics', 'Communication', 'Roadmapping'],
  'ui/ux designer': ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Accessibility'],
  'devops engineer': ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux', 'Terraform', 'Monitoring'],
};

const EXAM_TOPIC_WEIGHTS = {
  mathematics: [
    { topic: 'Calculus', weight: 22, trend: 'rising' },
    { topic: 'Linear Algebra', weight: 18, trend: 'stable' },
    { topic: 'Probability & Statistics', weight: 20, trend: 'rising' },
    { topic: 'Differential Equations', weight: 15, trend: 'stable' },
    { topic: 'Complex Numbers', weight: 12, trend: 'declining' },
    { topic: 'Matrices', weight: 13, trend: 'stable' },
  ],
  physics: [
    { topic: 'Mechanics', weight: 25, trend: 'stable' },
    { topic: 'Electromagnetism', weight: 22, trend: 'rising' },
    { topic: 'Optics', weight: 15, trend: 'stable' },
    { topic: 'Thermodynamics', weight: 18, trend: 'stable' },
    { topic: 'Modern Physics', weight: 20, trend: 'rising' },
  ],
  chemistry: [
    { topic: 'Organic Chemistry', weight: 28, trend: 'rising' },
    { topic: 'Physical Chemistry', weight: 24, trend: 'stable' },
    { topic: 'Inorganic Chemistry', weight: 22, trend: 'stable' },
    { topic: 'Electrochemistry', weight: 14, trend: 'rising' },
    { topic: 'Coordination Compounds', weight: 12, trend: 'stable' },
  ],
};

function ebbinghausRetention(daysSinceStudy, strength = 1) {
  const stability = 2.5 * strength;
  return Math.exp(-daysSinceStudy / stability) * 100;
}

function predictForgettingDate(lastStudied, strength = 1, threshold = 40) {
  let days = 0;
  while (ebbinghausRetention(days, strength) > threshold && days < 90) days++;
  const forgetDate = new Date(lastStudied);
  forgetDate.setDate(forgetDate.getDate() + days);
  return { daysUntilForget: days, forgetDate, retentionAtRevision: ebbinghausRetention(days - 1, strength) };
}

exports.buildLearningProfile = (topics) => {
  const profile = topics.map((t) => {
    const speed = t.timeSpent / Math.max(t.questionsCorrect, 1);
    const comprehension = Math.min(100, (t.questionsCorrect / Math.max(t.questionsAttempted, 1)) * 100);
    return {
      topic: t.topic,
      comprehensionSpeed: speed < 2 ? 'fast' : speed < 4 ? 'moderate' : 'slow',
      comprehensionScore: Math.round(comprehension),
      struggleRisk: comprehension < 50 ? 'high' : comprehension < 70 ? 'medium' : 'low',
    };
  });

  const predictedStruggles = profile
    .filter((p) => p.struggleRisk !== 'low')
    .sort((a, b) => a.comprehensionScore - b.comprehensionScore)
    .map((p) => ({
      chapter: p.topic,
      risk: p.struggleRisk,
      reason: p.comprehensionScore < 50
        ? 'Low comprehension score — needs focused revision'
        : 'Moderate understanding — may struggle under exam pressure',
      recommendedAction: p.comprehensionScore < 50 ? 'Re-learn fundamentals + practice problems' : 'Timed practice tests',
    }));

  return { profile, predictedStruggles, avgComprehension: Math.round(profile.reduce((s, p) => s + p.comprehensionScore, 0) / profile.length) };
};

exports.generateRevisionSchedule = (topics) => {
  const now = new Date();
  return topics.map((t) => {
    const lastStudied = new Date(t.lastStudied || now);
    const strength = (t.comprehensionScore || 70) / 100;
    const { daysUntilForget, forgetDate } = predictForgettingDate(lastStudied, strength);
    const revisionDate = new Date(forgetDate);
    revisionDate.setDate(revisionDate.getDate() - 2);

    const currentRetention = Math.round(ebbinghausRetention(
      Math.floor((now - lastStudied) / (1000 * 60 * 60 * 24)),
      strength
    ));

    return {
      topic: t.topic,
      lastStudied,
      currentRetention,
      revisionDue: revisionDate < now ? now : revisionDate,
      urgency: currentRetention < 40 ? 'critical' : currentRetention < 60 ? 'soon' : 'scheduled',
      daysUntilForget,
    };
  }).sort((a, b) => a.currentRetention - b.currentRetention);
};

exports.generateCareerRoadmap = (career) => {
  const key = career.toLowerCase().replace(/\s+/g, '');
  const roadmap = CAREER_ROADMAPS[key] || CAREER_ROADMAPS.google;
  return { ...roadmap, career: key, generatedAt: new Date() };
};

exports.analyzeSkillGap = (resumeText, targetJob) => {
  const jobKey = Object.keys(JOB_SKILL_REQUIREMENTS).find((k) => targetJob.toLowerCase().includes(k)) || 'software engineer';
  const required = JOB_SKILL_REQUIREMENTS[jobKey];
  const resumeLower = resumeText.toLowerCase();

  const present = required.filter((s) => resumeLower.includes(s.toLowerCase()));
  const missing = required.filter((s) => !resumeLower.includes(s.toLowerCase()));

  const learningPath = missing.map((skill, i) => ({
    skill,
    priority: i < 2 ? 'high' : i < 4 ? 'medium' : 'low',
    resources: [`${skill} — Official Documentation`, `${skill} — YouTube Crash Course`, `${skill} — Practice Project`],
    estimatedWeeks: i < 2 ? 3 : 2,
  }));

  return {
    targetJob: jobKey,
    matchScore: Math.round((present.length / required.length) * 100),
    skillsPresent: present,
    skillsMissing: missing,
    learningPath,
  };
};

exports.generateMentorResponse = (message, context) => {
  const msg = message.toLowerCase();
  const { marks = {}, weaknesses = [], goals = '', projects = [] } = context;

  if (msg.includes('weak') || msg.includes('struggle') || msg.includes('hard')) {
    const weak = weaknesses.slice(0, 2).join(', ') || 'your recent topics';
    return `I see you're finding ${weak} challenging. Based on your marks (${JSON.stringify(marks)}), I recommend breaking these into 20-minute focused sessions. Your goal is "${goals}" — mastering these weak areas will directly help you get there.`;
  }
  if (msg.includes('exam') || msg.includes('test')) {
    return `For your upcoming exam, focus on high-weightage topics first. Your weakest areas are ${weaknesses.join(', ') || 'none identified yet'}. I suggest 2 mock tests this week and revisiting chapters where your scores dropped below 60%.`;
  }
  if (msg.includes('project')) {
    const proj = projects[0] || 'a portfolio project';
    return `Great that you're thinking about projects! You already have ${projects.length ? projects.join(', ') : 'no projects yet'}. I'd suggest building something that fills your skill gaps while supporting your goal: ${goals}. Want me to suggest a project idea?`;
  }
  if (msg.includes('motivat') || msg.includes('tired') || msg.includes('burnout')) {
    return `I notice you might be feeling drained. That's normal — consistency beats intensity. Try a lighter 2-hour study block today focusing only on your strongest topic. Your ${goals} dream is a marathon, not a sprint.`;
  }
  return `Based on your profile — goals: "${goals}", weaknesses: ${weaknesses.join(', ') || 'being assessed'}, projects: ${projects.length || 0} — I'd suggest prioritizing your weakest subject today. What specific topic would you like help with?`;
};

exports.detectBurnout = (records) => {
  if (!records.length) return { risk: 'low', score: 0, suggestions: ['Start logging your study sessions to get personalized insights.'] };

  const recent = records.slice(-7);
  const avgHours = recent.reduce((s, r) => s + r.studyHours, 0) / recent.length;
  const avgMood = recent.reduce((s, r) => s + r.mood, 0) / recent.length;
  const avgPerformance = recent.reduce((s, r) => s + r.performance, 0) / recent.length;

  const prev = records.slice(-14, -7);
  const prevPerf = prev.length ? prev.reduce((s, r) => s + r.performance, 0) / prev.length : avgPerformance;
  const performanceDrop = prevPerf - avgPerformance;

  let score = 0;
  if (avgMood < 5) score += 30;
  if (avgHours > 8) score += 25;
  if (performanceDrop > 15) score += 35;
  if (avgPerformance < 50) score += 20;

  const risk = score > 60 ? 'high' : score > 30 ? 'medium' : 'low';
  const suggestions = [];

  if (risk === 'high') {
    suggestions.push('Take a half-day break — your performance has dropped significantly');
    suggestions.push('Switch to lighter topics or revision-only mode for 2 days');
    suggestions.push('Try 25-min Pomodoro sessions instead of long blocks');
  } else if (risk === 'medium') {
    suggestions.push('Reduce daily study hours by 1-2 hours this week');
    suggestions.push('Add a 30-minute walk or exercise between study blocks');
  } else {
    suggestions.push('Great consistency! Maintain your current rhythm');
    suggestions.push('Consider adding one challenging topic to push growth');
  }

  const lighterSchedule = recent.map((r) => ({
    day: r.date,
    originalHours: r.studyHours,
    suggestedHours: Math.max(2, r.studyHours - (risk === 'high' ? 3 : 1)),
    focus: risk === 'high' ? 'Revision only' : 'Mixed — 70% revision, 30% new',
  }));

  return {
    risk,
    score: Math.min(100, score),
    avgMood: Math.round(avgMood * 10) / 10,
    avgHours: Math.round(avgHours * 10) / 10,
    performanceDrop: Math.round(performanceDrop),
    consistency: Math.round((recent.filter((r) => r.studyHours > 0).length / 7) * 100),
    suggestions,
    lighterSchedule,
  };
};

exports.predictExamTopics = (subject) => {
  const key = subject.toLowerCase();
  const topics = EXAM_TOPIC_WEIGHTS[key] || EXAM_TOPIC_WEIGHTS.mathematics;
  const highPriority = topics.filter((t) => t.weight >= 18);

  const mockTest = {
    title: `${subject} — Personalized Mock Test`,
    duration: 60,
    questions: highPriority.flatMap((t) => [
      { q: `Conceptual question on ${t.topic}`, topic: t.topic, marks: 4 },
      { q: `Numerical problem — ${t.topic}`, topic: t.topic, marks: 6 },
    ]).slice(0, 10),
    totalMarks: 50,
  };

  return { subject, predictedTopics: topics, highPriority, mockTest, analysisNote: 'Based on 10-year paper pattern analysis' };
};

exports.generateProject = (skills, interests = '') => {
  const skillList = skills.split(',').map((s) => s.trim()).filter(Boolean);
  const templates = [
    { title: 'Smart Study Tracker', desc: 'AI-powered app that tracks study sessions and predicts burnout', stack: ['React', 'Node.js', 'MongoDB'] },
    { title: 'Peer Learning Platform', desc: 'Match students by complementary skills for group projects', stack: ['React', 'Socket.io', 'Express'] },
    { title: 'Resume Skill Analyzer', desc: 'Upload resume and get skill gap analysis with learning paths', stack: ['Python', 'NLP', 'React'] },
    { title: 'Exam Paper Predictor', desc: 'ML model predicting high-probability exam topics', stack: ['Python', 'scikit-learn', 'Flask'] },
    { title: 'YouTube Learning Curator', desc: 'Auto-generate notes and quizzes from educational videos', stack: ['React', 'YouTube API', 'OpenAI'] },
  ];

  const match = templates.find((t) => t.stack.some((s) => skillList.some((sk) => sk.toLowerCase().includes(s.toLowerCase())))) || templates[0];

  return {
    project: match.title,
    description: match.desc,
    uniqueness: `Combines your skills (${skillList.join(', ')}) with ${interests || 'education tech'}`,
    roadmap: [
      { week: 1, tasks: ['Research & wireframes', 'Set up project structure'] },
      { week: 2, tasks: ['Core feature development', 'Database schema'] },
      { week: 3, tasks: ['UI polish', 'API integration'] },
      { week: 4, tasks: ['Testing', 'Deploy & document'] },
    ],
    resources: [
      { type: 'Tutorial', url: 'https://www.freecodecamp.org', title: 'FreeCodeCamp Full Stack Course' },
      { type: 'Docs', url: 'https://react.dev', title: 'React Official Docs' },
      { type: 'Inspiration', url: 'https://github.com/topics/education', title: 'GitHub Education Projects' },
    ],
    timeline: '4 weeks',
    difficulty: skillList.length >= 3 ? 'intermediate' : 'beginner',
  };
};

exports.matchStudyGroups = (userProfile) => {
  const pool = [
    { name: 'Priya S.', strengths: ['Coding', 'Algorithms'], weaknesses: ['Design', 'UI'], goal: 'Google SWE', availability: 'Evenings' },
    { name: 'Rahul M.', strengths: ['Design', 'Figma'], weaknesses: ['Backend', 'Databases'], goal: 'Google SWE', availability: 'Evenings' },
    { name: 'Ananya K.', strengths: ['Writing', 'Current Affairs'], weaknesses: ['Math', 'Reasoning'], goal: 'UPSC', availability: 'Mornings' },
    { name: 'Vikram P.', strengths: ['Math', 'Reasoning'], weaknesses: ['Essay', 'English'], goal: 'UPSC', availability: 'Mornings' },
    { name: 'Sneha R.', strengths: ['Python', 'ML'], weaknesses: ['Statistics', 'Deployment'], goal: 'Data Scientist', availability: 'Flexible' },
    { name: 'Arjun T.', strengths: ['Statistics', 'SQL'], weaknesses: ['Deep Learning', 'Python'], goal: 'Data Scientist', availability: 'Flexible' },
  ];

  return pool
    .filter((p) => !userProfile.goal || p.goal.toLowerCase().includes(userProfile.goal.toLowerCase().split(' ')[0]))
    .map((p) => {
      const complementary = p.strengths.some((s) => userProfile.weaknesses?.includes(s));
      const sharedWeak = p.weaknesses.some((w) => userProfile.strengths?.includes(w));
      const score = (complementary ? 40 : 0) + (sharedWeak ? 30 : 0) + (p.goal === userProfile.goal ? 30 : 15);
      return { ...p, matchScore: score, reason: complementary ? 'Complementary strengths — you can teach each other!' : 'Similar goals — study together' };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
};

exports.curateYouTubeLearning = (topic) => {
  const slug = topic.toLowerCase().replace(/\s+/g, '+');
  return {
    topic,
    videos: [
      { title: `${topic} — Full Course for Beginners`, channel: 'freeCodeCamp', duration: '3:45:00', url: `https://www.youtube.com/results?search_query=${slug}+full+course` },
      { title: `${topic} Explained Simply`, channel: 'CrashCourse', duration: '12:30', url: `https://www.youtube.com/results?search_query=${slug}+explained` },
      { title: `${topic} — Practice Problems Walkthrough`, channel: 'Khan Academy', duration: '25:00', url: `https://www.youtube.com/results?search_query=${slug}+practice` },
    ],
    notes: [
      `## ${topic} — Key Concepts\n- Definition and core principles\n- Important formulas and theorems\n- Common misconceptions to avoid`,
      `## ${topic} — Study Tips\n- Start with visual explanations\n- Practice 10 problems daily\n- Connect theory to real-world applications`,
    ],
    quiz: [
      { question: `What is the fundamental concept of ${topic}?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], correct: 0 },
      { question: `Which approach is best for mastering ${topic}?`, options: ['Memorization only', 'Practice + Understanding', 'Skip basics', 'One-time study'], correct: 1 },
      { question: `How does ${topic} apply in real life?`, options: ['No application', 'Limited use', 'Wide applications', 'Only theoretical'], correct: 2 },
    ],
    roadmap: [
      { step: 1, title: 'Foundations', duration: '2 days', tasks: [`Watch intro video on ${topic}`, 'Read summary notes'] },
      { step: 2, title: 'Deep Dive', duration: '3 days', tasks: ['Full course video', 'Take notes', 'Solve 5 problems'] },
      { step: 3, title: 'Practice', duration: '2 days', tasks: ['Practice walkthrough video', 'Complete quiz', 'Review mistakes'] },
      { step: 4, title: 'Mastery', duration: '1 day', tasks: ['Teach concept to someone', 'Attempt advanced problems'] },
    ],
  };
};
