const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.post('/', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email, and message are required' });
  }

  const stmt = db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)');
  const result = stmt.run(name, email, message);

  res.status(201).json({ id: result.lastInsertRowid, name, email, message });
});

router.get('/', (req, res) => {
  const messages = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
  res.json(messages);
});

module.exports = router;
