import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types matching our DB schema
export interface DbUser {
  id: string;
  email: string;
  name: string;
  handle: string;
  bio?: string;
  avatar_url?: string;
  phone?: string;
  theme: 'cyber' | 'gold' | 'neon' | 'rose' | 'white';
  active_mode: 'todo' | 'trabajo' | 'deporte' | 'parche' | 'negocio';
  social_links: Record<string, string>;
  main_sport?: string;
  sport_level?: string;
  blood_type?: string;
  allergies: string[];
  emergency_name?: string;
  emergency_phone?: string;
  emergency_relation?: string;
  interests: string[];
  spotify_token?: string;
  spotify_refresh?: string;
  google_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DbChip {
  id: string;
  chip_id: string;
  serial_number: string;
  tier: 'CORE' | 'LINKED' | 'LEGENDARY';
  colorway: string;
  is_authentic: boolean;
  nft_token_id?: string;
  activated_at?: string;
  owner_id?: string;
  design_id?: string;
  created_at: string;
}

export interface DbScan {
  id: string;
  chip_id: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
  mode_shown: string;
  scanned_at: string;
}

export interface DbDesign {
  id: string;
  name?: string;
  collection?: string;
  image_url: string;
  prompt_used?: string;
  estilo?: string;
  elemento?: string;
  color_dominante?: string;
  intensidad?: string;
  edition_number?: number;
  total_edition?: number;
  owner_id?: string;
  created_at: string;
}

export interface DbPreorder {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'CORE' | 'LINKED' | 'LEGENDARY';
  design_id?: string;
  status: string;
  notes?: string;
  created_at: string;
}

export interface DbPortfolioItem {
  id: string;
  title: string;
  image_url?: string;
  link?: string;
  category: string;
  owner_id: string;
  created_at: string;
}

export interface DbStoreItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  payment_link?: string;
  active: boolean;
  owner_id: string;
  created_at: string;
}
