import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { pool } from "./db.js";

const scryptAsync = promisify(scrypt);

// Deliberately slow settings: fine for one login, very costly for someone guessing millions.
const SCRYPT_OPTIONS = { N: 2 ** 15, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };
const SESSION_DAYS = 7;

export const SESSION_COOKIE = "admin_session";

export const cookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

// Store a random salt with the hash, so two equal passwords never look the same.
export async function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, 64, SCRYPT_OPTIONS);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export async function verifyPassword(password, stored) {
  const [saltHex, hashHex] = stored.split(":");
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scryptAsync(password, Buffer.from(saltHex, "hex"), expected.length, SCRYPT_OPTIONS);
  return timingSafeEqual(actual, expected);
}

// Checked when an email doesn't exist, so a wrong email takes as long as a wrong password.
export const DUMMY_HASH = await hashPassword(randomBytes(16).toString("hex"));

// Only a hash of each session token is stored, so a leaked database can't be used to log in.
const hashToken = (token) => createHash("sha256").update(token).digest("hex");

export async function createSession(adminId) {
  const token = randomBytes(32).toString("base64url");

  await pool.query("DELETE FROM sessions WHERE expires_at < now()");
  await pool.query(
    `INSERT INTO sessions (token_hash, admin_id, expires_at)
     VALUES ($1, $2, now() + make_interval(days => $3))`,
    [hashToken(token), adminId, SESSION_DAYS],
  );

  return token;
}

export async function deleteSession(token) {
  await pool.query("DELETE FROM sessions WHERE token_hash = $1", [hashToken(token)]);
}

// Put this in front of any route that only the admin may use.
export async function requireAdmin(req, res, next) {
  const token = req.cookies[SESSION_COOKIE];
  if (!token) return res.status(401).json({ error: "Please log in" });

  const { rows } = await pool.query(
    `SELECT admins.id, admins.email
     FROM sessions
     JOIN admins ON admins.id = sessions.admin_id
     WHERE sessions.token_hash = $1 AND sessions.expires_at > now()`,
    [hashToken(token)],
  );
  if (rows.length === 0) return res.status(401).json({ error: "Please log in" });

  req.admin = rows[0];
  next();
}