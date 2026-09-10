# Personal Portfolio Website

A full-stack personal portfolio to showcase projects and skills.

- **Frontend:** HTML, CSS, JavaScript (vanilla, no build step)
- **Backend:** Node.js + Express (REST API)
- **Database:** SQLite via better-sqlite3
- **Deployment:** Render, Railway, or Heroku

## Features

- Home / About / Skills / Projects / Contact sections
- Projects and skills loaded dynamically from the database
- Add new projects through the website
- Contact form storing messages in SQLite
- Full CRUD REST API for projects

## Project structure

```text
portfolio-website/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server/
│   ├── server.js
│   ├── db/
│   │   └── db.js
│   └── routes/
│       ├── projects.js
│       ├── skills.js
│       └── messages.js
├── package.json
├── Procfile
└── README.md
```

## Running locally

```bash
npm install
npm start
```

Then open `http://localhost:3000`.

The SQLite database is created automatically on first run and seeded with sample projects and skills.

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/projects` | List all projects |
| GET | `/api/projects/:id` | Get one project |
| POST | `/api/projects` | Create a project |
| PUT | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete a project |
| GET | `/api/skills` | List all skills |
| POST | `/api/messages` | Submit a contact message |
| GET | `/api/messages` | List contact messages |

## Deployment

For Render or Railway, connect this GitHub repository, use `npm install` as the build command and `npm start` as the start command.

Because the project uses a file-based SQLite database, use a host with persistent disk storage for production data.

## Customizing

- Update the seed data in `server/db/db.js`.
- Edit the hero/about text in `public/index.html`.
- Customize colors and fonts in `public/style.css`.
