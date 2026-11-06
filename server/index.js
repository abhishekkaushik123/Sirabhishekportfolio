import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import { pool } from "./db.js";
import {
  DUMMY_HASH,
  SESSION_COOKIE,
  cookieOptions,
  createSession,
  deleteSession,
  requireAdmin,
  verifyPassword,
} from "./auth.js";
import { projectsRouter } from "./projects.js";

const app = express();
const PORT = 5000;

// Only these websites may call this API from a browser.
app.use(
  cors({
    origin: ["http://localhost:5173", "https://sirabhishekportfolio.vercel.app"],
  }),
);
app.use(express.json());
app.use(cookieParser());

// After 5 wrong passwords, the same visitor must wait 15 minutes.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many attempts. Try again in 15 minutes." },
});

// Every /api/projects route lives in projects.js.
app.use("/api/projects", projectsRouter);

app.post("/api/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== "string" || typeof password !== "string" || password.length > 200) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const { rows } = await pool.query("SELECT id, password_hash FROM admins WHERE email = $1", [
    email.trim().toLowerCase(),
  ]);
  const admin = rows[0];
  const valid = await verifyPassword(password, admin?.password_hash ?? DUMMY_HASH);

  // The same message for both mistakes, so nobody can find out which emails exist.
  if (!admin || !valid) return res.status(401).json({ error: "Wrong email or password" });

  const token = await createSession(admin.id);
  res.cookie(SESSION_COOKIE, token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ message: "Logged in" });
});

app.post("/api/logout", async (req, res) => {
  const token = req.cookies[SESSION_COOKIE];
  if (token) await deleteSession(token);

  res.clearCookie(SESSION_COOKIE, cookieOptions);
  res.json({ message: "Logged out" });
});

// Only works while logged in, so it shows whether the login protection works.
app.get("/api/me", requireAdmin, (req, res) => {
  res.json({ email: req.admin.email });
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "My first API!" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});