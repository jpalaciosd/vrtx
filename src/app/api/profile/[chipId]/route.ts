import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request, { params }: { params: { chipId: string } }) {
  const { chipId } = params;

  // Get chip with owner
  const { data: chip, error: chipError } = await supabase
    .from('chips')
    .select('*, owner:users(*), design:designs(*)')
    .eq('chip_id', chipId)
    .single();

  if (chipError || !chip) {
    return NextResponse.json({ error: 'Chip no encontrado' }, { status: 404 });
  }

  // Get scans
  const { data: scans } = await supabase
    .from('scans')
    .select('*')
    .eq('chip_id', chipId)
    .order('scanned_at', { ascending: false })
    .limit(50);

  // Get owner's portfolio and store
  let portfolio = [];
  let store = [];
  if (chip.owner_id) {
    const { data: p } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('owner_id', chip.owner_id)
      .order('created_at', { ascending: false });
    portfolio = p || [];

    const { data: s } = await supabase
      .from('store_items')
      .select('*')
      .eq('owner_id', chip.owner_id)
      .eq('active', true)
      .order('created_at', { ascending: false });
    store = s || [];
  }

  return NextResponse.json({
    chip,
    owner: chip.owner || null,
    design: chip.design || null,
    scans: scans || [],
    portfolio,
    store,
  });
}
