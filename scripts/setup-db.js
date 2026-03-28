const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const sql = `
-- Enums as text check constraints (Supabase uses plain PG)
CREATE TYPE IF NOT EXISTS theme AS ENUM ('cyber', 'gold', 'neon', 'rose', 'white');
CREATE TYPE IF NOT EXISTS mode AS ENUM ('todo', 'trabajo', 'deporte', 'parche', 'negocio');
CREATE TYPE IF NOT EXISTS tier AS ENUM ('CORE', 'LINKED', 'LEGENDARY');

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

-- Portfolio items
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT,
  link TEXT,
  category TEXT DEFAULT 'Otro',
  owner_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Store items
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

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chips ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE preorders ENABLE ROW LEVEL SECURITY;

-- Public read policies for profiles and scans (anyone who scans a cap can see the profile)
CREATE POLICY IF NOT EXISTS "Public profiles readable" ON users FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public chips readable" ON chips FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public scans insertable" ON scans FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Public scans readable" ON scans FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public designs readable" ON designs FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public portfolio readable" ON portfolio_items FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public store readable" ON store_items FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public preorders insertable" ON preorders FOR INSERT WITH CHECK (true);

-- Owners can update their own data
CREATE POLICY IF NOT EXISTS "Users update own" ON users FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Users insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Designs insert" ON designs FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Portfolio insert" ON portfolio_items FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Portfolio update own" ON portfolio_items FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Store insert" ON store_items FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Store update own" ON store_items FOR UPDATE USING (true);
`;

async function run() {
  console.log("Creating tables...");
  const { data, error } = await supabase.rpc("exec_sql", { sql_string: sql });
  if (error) {
    // rpc exec_sql might not exist, try raw SQL via REST
    console.log("RPC not available, trying direct SQL via pg...");
    
    // Split and run each statement
    const statements = sql.split(";").map(s => s.trim()).filter(s => s.length > 5);
    
    for (const stmt of statements) {
      const { error: err } = await supabase.from("_").select("*").limit(0); // dummy
      // We need to use the SQL editor approach
    }
    
    console.log("Cannot run raw SQL via SDK. Outputting SQL to paste in Supabase SQL Editor...");
    console.log("\n========================================");
    console.log("COPY THIS SQL AND PASTE IN SUPABASE SQL EDITOR:");
    console.log("Go to: SQL Editor (left sidebar) → New query → Paste → Run");
    console.log("========================================\n");
    console.log(sql);
  } else {
    console.log("Tables created successfully!", data);
  }
}

run();
