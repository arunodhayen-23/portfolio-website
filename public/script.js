document.getElementById('year').textContent = new Date().getFullYear();

async function loadSkills() {
  const container = document.getElementById('skills-container');
  try {
    const res = await fetch('/api/skills');
    const skills = await res.json();
    if (!skills.length) { container.innerHTML = '<p class="loading">No skills added yet.</p>'; return; }
    container.innerHTML = skills.map(s => `<div class="skill-pill"><span>${s.category}:</span> ${escapeHtml(s.name)}</div>`).join('');
  } catch (err) { container.innerHTML = '<p class="loading">Could not load skills.</p>'; }
}

async function loadProjects() {
  const container = document.getElementById('projects-container');
  try {
    const res = await fetch('/api/projects');
    const projects = await res.json();
    if (!projects.length) { container.innerHTML = '<p class="loading">No projects added yet.</p>'; return; }
    container.innerHTML = projects.map(renderProjectCard).join('');
  } catch (err) { container.innerHTML = '<p class="loading">Could not load projects. Is the server running?</p>'; }
}

function renderProjectCard(p) {
  const tags = p.tech_stack.split(',').map(t => `<span>${escapeHtml(t.trim())}</span>`).join('');
  const links = [];
  if (p.repo_url) links.push(`<a href="${escapeHtml(p.repo_url)}" target="_blank" rel="noopener">Code</a>`);
  if (p.live_url) links.push(`<a href="${escapeHtml(p.live_url)}" target="_blank" rel="noopener">Live Demo</a>`);
  return `<div class="project-card">${p.featured ? '<span class="featured-badge">Featured</span>' : ''}<h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.description)}</p><div class="tech-tags">${tags}</div><div class="project-links">${links.join('')}</div></div>`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

document.getElementById('project-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('project-form-status');
  const data = Object.fromEntries(new FormData(form).entries());
  data.featured = form.featured.checked;
  try {
    const res = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Request failed');
    status.textContent = 'Project saved!'; status.style.color = '#4ade80'; form.reset(); loadProjects();
  } catch (err) { status.textContent = 'Could not save project. Please try again.'; status.style.color = '#f87171'; }
});

document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('contact-form-status');
  const data = Object.fromEntries(new FormData(form).entries());
  try {
    const res = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Request failed');
    status.textContent = 'Message sent — thank you!'; status.style.color = '#4ade80'; form.reset();
  } catch (err) { status.textContent = 'Could not send message. Please try again.'; status.style.color = '#f87171'; }
});

loadSkills();
loadProjects();
