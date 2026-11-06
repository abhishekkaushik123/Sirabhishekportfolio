import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { pool } from "./db.js";
import { hashPassword } from "./auth.js";

const rl = createInterface({ input: stdin });
const lines = rl[Symbol.asyncIterator]();

// Show a question, then wait for the next line typed in the terminal.
async function ask(question) {
  stdout.write(question);
  const { value } = await lines.next();
  return value ?? "";
}

const email = (await ask("Admin email: ")).trim().toLowerCase();
const password = await ask("Password (at least 12 characters): ");
rl.close();

if (!email.includes("@") || password.length < 12) {
  console.log("Not saved: use a real email and a password of at least 12 characters.");
  process.exit(1);
}

// Running this again with the same email changes the password and logs out old sessions.
const { rows } = await pool.query(
  `INSERT INTO admins (email, password_hash) VALUES ($1, $2)
   ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
   RETURNING id`,
  [email, await hashPassword(password)],
);
await pool.query("DELETE FROM sessions WHERE admin_id = $1", [rows[0].id]);

console.log(`Admin saved for ${email}`);
await pool.end();