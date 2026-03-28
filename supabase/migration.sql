-- VRTX Database Setup — Pegar en Supabase SQL Editor
-- Idempotente: se puede ejecutar múltiples veces sin error

-- Enums
DO $$ BEGIN CREATE TYPE theme AS ENUM ('cyber', 'gold', 'neon', 'rose', 'white'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE mode AS ENUM ('todo', 'trabajo', 'deporte', 'parche', 'negocio'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE tier AS ENUM ('CORE', 'LINKED', 'LEGENDARY'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  bio VARCHAR(120),
  avatar_url TEXT,
  phone TEXT,
  theme theme DEFAULT 'cyber',
  active_mode mode DEFAULT 'todo',
  social_links JSONB DEFAULT '{}',
  main_sport TEXT,
  sport_level TEXT,
  blood_type TEXT,
  allergies TEXT[] DEFAULT '{}',
  emergency_name TEXT,
  emergency_phone TEXT,
  emergency_relation TEXT,
  interests TEXT[] DEFAULT '{}',
  spotify_token TEXT,
  spotify_refresh TEXT,
  password_hash TEXT,
  google_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Designs
CREATE TABLE IF NOT EXISTS designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  collection TEXT,
  image_url TEXT NOT NULL,
  prompt_used TEXT,
  estilo TEXT,
  elemento TEXT,
  color_dominante TEXT,
  intensidad TEXT,
  edition_number INT,
  total_edition INT,
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Chips
CREATE TABLE IF NOT EXISTS chips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chip_id UUID UNIQUE NOT NULL,
  serial_number TEXT UNIQUE NOT NULL,
  tier tier DEFAULT 'CORE',
  colorway TEXT DEFAULT 'Midnight Carbon',
  is_authentic BOOLEAN DEFAULT true,
  nft_token_id TEXT,
  activated_at TIMESTAMPTZ,
  owner_id UUID REFERENCES users(id),
  design_id UUID REFERENCES designs(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Scans
CREATE TABLE IF NOT EXISTS scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chip_id UUID NOT NULL REFERENCES chips(chip_id),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  city TEXT,
  country TEXT,
  mode_shown mode DEFAULT 'todo',
  scanned_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_scans_chip_date ON scans(chip_id, scanned_at);

-- Portfolio
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT,
  link TEXT,
  category TEXT DEFAULT 'Otro',
  owner_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Store
CREATE TABLE IF NOT EXISTS store_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INT NOT NULL,
  image_url TEXT,
  payment_link TEXT,
  active BOOLEAN DEFAULT true,
  owner_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Preorders
CREATE TABLE IF NOT EXISTS preorders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  tier tier DEFAULT 'CORE',
  design_id TEXT,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chips ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE preorders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (safe)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public profiles" ON users;
  DROP POLICY IF EXISTS "Public chips" ON chips;
  DROP POLICY IF EXISTS "Scans insert" ON scans;
  DROP POLICY IF EXISTS "Scans read" ON scans;
  DROP POLICY IF EXISTS "Designs read" ON designs;
  DROP POLICY IF EXISTS "Portfolio read" ON portfolio_items;
  DROP POLICY IF EXISTS "Store read" ON store_items;
  DROP POLICY IF EXISTS "Preorders insert" ON preorders;
  DROP POLICY IF EXISTS "Users update" ON users;
  DROP POLICY IF EXISTS "Users insert" ON users;
  DROP POLICY IF EXISTS "Designs insert" ON designs;
  DROP POLICY IF EXISTS "Portfolio insert" ON portfolio_items;
  DROP POLICY IF EXISTS "Store insert" ON store_items;
END $$;

-- Policies: public read
CREATE POLICY "Public profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Public chips" ON chips FOR SELECT USING (true);
CREATE POLICY "Scans insert" ON scans FOR INSERT WITH CHECK (true);
CREATE POLICY "Scans read" ON scans FOR SELECT USING (true);
CREATE POLICY "Designs read" ON designs FOR SELECT USING (true);
CREATE POLICY "Portfolio read" ON portfolio_items FOR SELECT USING (true);
CREATE POLICY "Store read" ON store_items FOR SELECT USING (true);
CREATE POLICY "Preorders insert" ON preorders FOR INSERT WITH CHECK (true);

-- Policies: owner write
CREATE POLICY "Users update" ON users FOR UPDATE USING (true);
CREATE POLICY "Users insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Designs insert" ON designs FOR INSERT WITH CHECK (true);
CREATE POLICY "Portfolio insert" ON portfolio_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Store insert" ON store_items FOR INSERT WITH CHECK (true);
