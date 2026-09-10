const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', (req, res) => {
  const projects = db.prepare('SELECT * FROM projects ORDER BY featured DESC, created_at DESC').all();
  res.json(projects);
});

router.get('/:id', (req, res) => {
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

router.post('/', (req, res) => {
  const { title, description, tech_stack, image_url, repo_url, live_url, featured } = req.body;
  if (!title || !description || !tech_stack) {
    return res.status(400).json({ error: 'title, description, and tech_stack are required' });
  }

  const stmt = db.prepare(`
    INSERT INTO projects (title, description, tech_stack, image_url, repo_url, live_url, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    title, description, tech_stack,
    image_url || '', repo_url || '', live_url || '',
    featured ? 1 : 0
  );

  const newProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newProject);
});

router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Project not found' });

  const merged = { ...existing, ...req.body };
  db.prepare(`
    UPDATE projects
    SET title = ?, description = ?, tech_stack = ?, image_url = ?, repo_url = ?, live_url = ?, featured = ?
    WHERE id = ?
  `).run(
    merged.title, merged.description, merged.tech_stack,
    merged.image_url, merged.repo_url, merged.live_url,
    merged.featured ? 1 : 0, req.params.id
  );

  res.json(db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Project not found' });
  res.status(204).send();
});

module.exports = router;
