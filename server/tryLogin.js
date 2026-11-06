import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const API = "http://localhost:5000";
const rl = createInterface({ input: stdin });
const lines = rl[Symbol.asyncIterator]();

// Show a question, then wait for the next line typed in the terminal.
async function ask(question) {
  stdout.write(question);
  const { value } = await lines.next();
  return value ?? "";
}

const email = await ask("Admin email: ");
const password = await ask("Password: ");
rl.close();

async function call(label, path, options = {}) {
  const response = await fetch(`${API}${path}`, options);
  console.log(`${label}: ${response.status}`, await response.json());
  return response;
}

const login = await call("1. Log in", "/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

// A browser keeps this cookie by itself. Here we pass it along by hand.
const cookie = login.headers.get("set-cookie")?.split(";")[0] ?? "";

await call("2. Protected route, logged in", "/api/me", { headers: { cookie } });
await call("3. Log out", "/api/logout", { method: "POST", headers: { cookie } });
await call("4. Same cookie after logout", "/api/me", { headers: { cookie } });