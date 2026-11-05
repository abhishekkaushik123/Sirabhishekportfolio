import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
const PORT = 5000;

// Only these websites may call this API from a browser.
app.use(
  cors({
    origin: ["http://localhost:5173", "https://sirabhishekportfolio.vercel.app"],
  }),
);

// Read the projects from the database and send them back as JSON.
app.get("/api/projects", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, title, tagline, description, tech, github, live
     FROM projects
     ORDER BY position`,
  );

  res.json(rows);
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "My first API!" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});