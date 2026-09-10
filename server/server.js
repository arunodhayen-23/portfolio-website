const express = require('express');
const cors = require('cors');
const path = require('path');

const projectsRouter = require('./routes/projects');
const skillsRouter = require('./routes/skills');
const messagesRouter = require('./routes/messages');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/projects', projectsRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/messages', messagesRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Portfolio server running at http://localhost:${PORT}`);
});
