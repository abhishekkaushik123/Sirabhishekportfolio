CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  tech TEXT[] NOT NULL DEFAULT '{}',
  github TEXT NOT NULL DEFAULT '',
  live TEXT NOT NULL DEFAULT '',
  position INTEGER NOT NULL DEFAULT 0
);