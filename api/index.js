import app from "../server/app.js";

// vercel.json sends every /api/... request here as /api?path=...
// Put the original address back, so Express sees /api/projects as usual.
export default function handler(req, res) {
  const url = new URL(req.url, "http://localhost");
  const path = url.searchParams.get("path");

  if (path !== null && !url.pathname.startsWith("/api/")) {
    url.searchParams.delete("path");
    req.url = `/api/${path}${url.search}`;
  }

  return app(req, res);
}