import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { chip_id, latitude, longitude, city, country, mode_shown } = await req.json();

    if (!chip_id) {
      return NextResponse.json({ error: 'chip_id requerido' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('scans')
      .insert({ chip_id, latitude, longitude, city, country, mode_shown: mode_shown || 'todo' })
      .select()
      .single();

    if (error) {
      console.error('Scan error:', error);
      return NextResponse.json({ error: 'Error registrando scan' }, { status: 500 });
    }

    return NextResponse.json({ success: true, scan: data });
  } catch (e) {
    console.error('Scan error:', e);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// Get scans for a chip
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const chipId = searchParams.get('chip_id');

  if (!chipId) {
    return NextResponse.json({ error: 'chip_id requerido' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('chip_id', chipId)
    .order('scanned_at', { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: 'Error obteniendo scans' }, { status: 500 });
  }

  return NextResponse.json({ scans: data });
}
