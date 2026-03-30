-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'free',
  created_at INTEGER NOT NULL
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  expires_at INTEGER NOT NULL
);

-- Progress table
CREATE TABLE IF NOT EXISTS progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  level TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  questions_seen INTEGER NOT NULL DEFAULT 0,
  correct INTEGER NOT NULL DEFAULT 0,
  last_seen INTEGER
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  level TEXT NOT NULL,
  type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  answer TEXT NOT NULL,
  distractors TEXT NOT NULL,
  created_at INTEGER NOT NULL
);