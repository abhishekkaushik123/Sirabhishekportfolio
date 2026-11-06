import express from "express";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import { pool } from "./db.js";
import {
  SESSION_COOKIE,
  cookieOptions,
  createSession,
  deleteSession,
  getDummyHash,
  requireAdmin,
  verifyPassword,
} from "./auth.js";
import { projectsRouter } from "./projects.js";

const app = express();

// Online, requests reach the app through Vercel's proxy. This makes req.ip the visitor's address.
app.set("trust proxy", 1);
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
  const valid = await verifyPassword(password, admin?.password_hash ?? (await getDummyHash()));

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

// Any error a route throws ends up here. Log the details, but never show them to visitors.
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status ?? 500).json({ error: error.expose ? error.message : "Something went wrong" });
});

export default app;