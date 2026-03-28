import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side client with service_role key (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
  }

  const { error } = await supabase
    .from('designs')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: 'Error eliminando diseño' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
