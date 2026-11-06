import { Router } from "express";
import { pool } from "./db.js";
import { requireAdmin } from "./auth.js";

export const projectsRouter = Router();

const COLUMNS = "id, title, tagline, description, tech, github, live";

function isWebAddress(value) {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

// Check everything the admin sends before it gets anywhere near the database.
function readProject(body) {
  const text = (value) => (typeof value === "string" ? value.trim() : "");
  const project = {
    title: text(body?.title),
    tagline: text(body?.tagline),
    description: text(body?.description),
    tech: Array.isArray(body?.tech) ? body.tech.map(text).filter(Boolean) : [],
    github: text(body?.github),
    live: text(body?.live),
  };

  if (!project.title || project.title.length > 80) return { error: "Title is required (up to 80 characters)" };
  if (!project.tagline || project.tagline.length > 60) return { error: "Tagline is required (up to 60 characters)" };
  if (!project.description || project.description.length > 500) {
    return { error: "Description is required (up to 500 characters)" };
  }
  if (project.tech.length > 12 || project.tech.some((item) => item.length > 30)) {
    return { error: "Use up to 12 technologies, each up to 30 characters" };
  }
  for (const field of ["github", "live"]) {
    if (project[field] && !isWebAddress(project[field])) {
      return { error: `The ${field} link must start with https://` };
    }
  }

  return { project };
}

// Turn "AI Cold Email Generator" into "ai-cold-email-generator", adding -2, -3... if it's taken.
async function uniqueId(title) {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "project";
  let id = base;

  for (let n = 2; (await pool.query("SELECT 1 FROM projects WHERE id = $1", [id])).rowCount > 0; n++) {
    id = `${base}-${n}`;
  }
  return id;
}

// Anyone can read the projects.
projectsRouter.get("/", async (req, res) => {
  const { rows } = await pool.query(`SELECT ${COLUMNS} FROM projects ORDER BY position`);
  res.json(rows);
});

// Only the admin can add, change or delete them.
projectsRouter.post("/", requireAdmin, async (req, res) => {
  const { project, error } = readProject(req.body);
  if (error) return res.status(400).json({ error });

  const { rows } = await pool.query(
    `INSERT INTO projects (id, title, tagline, description, tech, github, live, position)
     VALUES ($1, $2, $3, $4, $5, $6, $7, (SELECT COALESCE(MAX(position), -1) + 1 FROM projects))
     RETURNING ${COLUMNS}`,
    [
      await uniqueId(project.title),
      project.title,
      project.tagline,
      project.description,
      project.tech,
      project.github,
      project.live,
    ],
  );

  res.status(201).json(rows[0]);
});

projectsRouter.put("/:id", requireAdmin, async (req, res) => {
  const { project, error } = readProject(req.body);
  if (error) return res.status(400).json({ error });

  const { rows } = await pool.query(
    `UPDATE projects
     SET title = $2, tagline = $3, description = $4, tech = $5, github = $6, live = $7
     WHERE id = $1
     RETURNING ${COLUMNS}`,
    [
      req.params.id,
      project.title,
      project.tagline,
      project.description,
      project.tech,
      project.github,
      project.live,
    ],
  );
  if (rows.length === 0) return res.status(404).json({ error: "Project not found" });

  res.json(rows[0]);
});

projectsRouter.delete("/:id", requireAdmin, async (req, res) => {
  const { rowCount } = await pool.query("DELETE FROM projects WHERE id = $1", [req.params.id]);
  if (rowCount === 0) return res.status(404).json({ error: "Project not found" });

  res.status(204).end();
});