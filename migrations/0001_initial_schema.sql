CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  partner_name TEXT NOT NULL DEFAULT 'My Princess',
  user_name TEXT NOT NULL DEFAULT 'Your Handsome',
  hero_title TEXT NOT NULL DEFAULT 'To My One and Only Love',
  hero_subtitle TEXT NOT NULL DEFAULT 'Every single second with you feels like a beautiful dream.',
  romantic_quote TEXT DEFAULT 'You are my today and all of my tomorrows.',
  anniversary_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  theme_id TEXT NOT NULL DEFAULT 'lovely_pink',
  primary_color TEXT,
  font_style TEXT,
  secret_code TEXT NOT NULL DEFAULT 'LOVE',
  bg_music_url TEXT,
  enabled_components TEXT NOT NULL DEFAULT '{"hero":true,"plushie":true,"countdown":true,"timeline":true,"reasons":true,"gallery":true,"notes":true,"bucketlist":true,"quiz":true,"lovejar":true,"music":true}',
  section_order TEXT NOT NULL DEFAULT '["hero","plushie","countdown","timeline","reasons","gallery","notes","bucketlist","quiz","lovejar"]',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS timeline_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  event_date TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  image_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery_memories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  caption TEXT,
  image_url TEXT NOT NULL,
  date_taken TEXT,
  is_favorite INTEGER NOT NULL DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS love_reasons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reason TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'love',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS love_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_secret INTEGER NOT NULL DEFAULT 0,
  unlock_code TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_by_gf INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS bucket_list (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'dreams',
  completed INTEGER NOT NULL DEFAULT 0,
  completed_date TEXT,
  target_date TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  options TEXT NOT NULL DEFAULT '[]',
  correct_index INTEGER NOT NULL DEFAULT 0,
  explanation TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gf_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender TEXT NOT NULL DEFAULT 'GF',
  message TEXT NOT NULL,
  sentiment TEXT NOT NULL DEFAULT 'heart',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO site_settings (id, anniversary_date)
VALUES (1, datetime('now', '-1 year'));