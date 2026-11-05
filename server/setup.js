import { readFile } from "node:fs/promises";
import { pool } from "./db.js";
import { projects } from "../src/data/projects.js";

// Create the table, then copy each project into it.
const schema = await readFile(new URL("./schema.sql", import.meta.url), "utf8");
await pool.query(schema);

for (const [position, project] of projects.entries()) {
  // $1, $2... keep the values separate from the SQL, which blocks SQL injection.
  await pool.query(
    `INSERT INTO projects (id, title, tagline, description, tech, github, live, position)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (id) DO UPDATE SET
       title = EXCLUDED.title,
       tagline = EXCLUDED.tagline,
       description = EXCLUDED.description,
       tech = EXCLUDED.tech,
       github = EXCLUDED.github,
       live = EXCLUDED.live,
       position = EXCLUDED.position`,
    [
      project.id,
      project.title,
      project.tagline,
      project.description,
      project.tech,
      project.github,
      project.live,
      position,
    ],
  );
}

const { rows } = await pool.query("SELECT COUNT(*) FROM projects");
console.log(`Database ready with ${rows[0].count} projects`);

await pool.end();