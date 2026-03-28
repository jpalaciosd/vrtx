import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request, { params }: { params: { chipId: string } }) {
  const { chipId } = params;

  // Try by chip_id UUID first, then by serial_number
  let chipQuery = supabase.from('chips').select('*');
  
  // Check if it's a UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(chipId)) {
    chipQuery = chipQuery.eq('chip_id', chipId);
  } else {
    // Try serial number (case insensitive)
    chipQuery = chipQuery.ilike('serial_number', chipId);
  }

  const { data: chip, error: chipError } = await chipQuery.maybeSingle();

  if (chipError || !chip) {
    return NextResponse.json({ error: 'Chip no encontrado' }, { status: 404 });
  }

  // Get owner
  let owner = null;
  if (chip.owner_id) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', chip.owner_id)
      .maybeSingle();
    owner = data;
    // Remove sensitive fields
    if (owner) {
      delete owner.password_hash;
      delete owner.spotify_token;
      delete owner.spotify_refresh;
    }
  }

  // Get scans
  const { data: scans } = await supabase
    .from('scans')
    .select('*')
    .eq('chip_id', chip.chip_id)
    .order('scanned_at', { ascending: false })
    .limit(100);

  return NextResponse.json({
    chip,
    owner,
    scans: scans || [],
  });
}
