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

let cookie = "";

async function call(label, method, path, body) {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: { "Content-Type": "application/json", cookie },
    body: body && JSON.stringify(body),
  });
  const data = response.status === 204 ? "(no content)" : await response.json();
  console.log(`${label}: ${response.status}`, data);
  return { response, data };
}

const testProject = {
  title: "Test Project",
  tagline: "Made by tryAdmin",
  description: "A temporary project to test adding, editing and deleting.",
  tech: ["Node.js", "PostgreSQL"],
};

await call("1. Add without logging in", "POST", "/api/projects", testProject);

const login = await call("2. Log in", "POST", "/api/login", { email, password });
cookie = login.response.headers.get("set-cookie")?.split(";")[0] ?? "";

await call("3. Add with a bad link", "POST", "/api/projects", { ...testProject, github: "not a link" });
const { data: created } = await call("4. Add", "POST", "/api/projects", testProject);
await call("5. Edit", "PUT", `/api/projects/${created.id}`, { ...testProject, tagline: "Edited!" });
await call("6. Delete", "DELETE", `/api/projects/${created.id}`);
await call("7. Delete again", "DELETE", `/api/projects/${created.id}`);
await call("8. Log out", "POST", "/api/logout");