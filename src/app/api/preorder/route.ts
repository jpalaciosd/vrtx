import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { name, email, phone, tier, notes } = await req.json();

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Nombre, email y teléfono requeridos' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('preorders')
      .insert({ name, email, phone, tier: tier || 'CORE', notes })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Error guardando preventa' }, { status: 500 });
    }

    return NextResponse.json({ success: true, preorder: data });
  } catch (e) {
    console.error('Preorder error:', e);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
