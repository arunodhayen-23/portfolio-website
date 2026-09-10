const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', (req, res) => {
  const skills = db.prepare('SELECT * FROM skills ORDER BY category, name').all();
  res.json(skills);
});

module.exports = router;
