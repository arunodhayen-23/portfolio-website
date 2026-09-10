const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'portfolio.db');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT NOT NULL,
    image_url TEXT,
    repo_url TEXT,
    live_url TEXT,
    featured INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

const projectCount = db.prepare('SELECT COUNT(*) AS count FROM projects').get().count;

if (projectCount === 0) {
  const insertProject = db.prepare(`
    INSERT INTO projects (title, description, tech_stack, image_url, repo_url, live_url, featured)
    VALUES (@title, @description, @tech_stack, @image_url, @repo_url, @live_url, @featured)
  `);

  const seedProjects = [
    {
      title: 'Fire Safety Inspection System',
      description: 'An AI-assisted inspection platform built for a hackathon to detect and log fire safety compliance issues in buildings.',
      tech_stack: 'React, Node.js, Express, SQLite', image_url: '', repo_url: '', live_url: '', featured: 1
    },
    {
      title: 'Indian Sign Language Translator',
      description: 'A thesis project translating Indian Sign Language gestures into text/speech using computer vision and machine learning.',
      tech_stack: 'Python, TensorFlow, OpenCV', image_url: '', repo_url: '', live_url: '', featured: 1
    },
    {
      title: 'Exam-Prep Obsidian Vault',
      description: 'A structured, sellable Obsidian vault product designed to help students organize and speed-run exam preparation.',
      tech_stack: 'Obsidian, Markdown', image_url: '', repo_url: '', live_url: '', featured: 0
    }
  ];

  const insertMany = db.transaction((projects) => {
    for (const p of projects) insertProject.run(p);
  });
  insertMany(seedProjects);
}

const skillCount = db.prepare('SELECT COUNT(*) AS count FROM skills').get().count;

if (skillCount === 0) {
  const insertSkill = db.prepare('INSERT INTO skills (name, category) VALUES (?, ?)');
  const seedSkills = [
    ['JavaScript', 'Language'], ['Python', 'Language'], ['React.js', 'Frontend'], ['HTML/CSS', 'Frontend'],
    ['Node.js/Express', 'Backend'], ['Flask/Django', 'Backend'], ['MongoDB', 'Database'], ['PostgreSQL', 'Database'],
    ['SQLite', 'Database'], ['Embedded Systems', 'Hardware'], ['Robotics', 'Hardware'], ['Git/GitHub', 'Tools'], ['Docker', 'Tools']
  ];
  const insertMany = db.transaction((skills) => {
    for (const [name, category] of skills) insertSkill.run(name, category);
  });
  insertMany(seedSkills);
}

module.exports = db;
