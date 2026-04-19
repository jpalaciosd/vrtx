import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { secret } = await req.json();
    if (secret !== "vrtx-migrate-2026") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use pg to run DDL directly
    const { Pool } = require("pg");
    const dbUrl = (process.env.DATABASE_URL || "").replace(/[?&]sslmode=[^&]*/g, "");
    const pool = new Pool({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
    });

    const sqls = [
      `ALTER TABLE designs ADD COLUMN IF NOT EXISTS prompt TEXT`,
      `ALTER TABLE designs ADD COLUMN IF NOT EXISTS style TEXT DEFAULT 'cyber'`,
      `ALTER TABLE designs ADD COLUMN IF NOT EXISTS image_url TEXT`,
      `ALTER TABLE designs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now()`,
      `INSERT INTO designs (user_id, prompt, style, image_url) VALUES ('638e9284-3752-4fed-b926-60f23c5846d7', 'Gorra negra snapback con bordado IMPOSSIBLE en hilo gris/plata, diseño minimalista premium', 'cyber', '/caps/cap-impossible-black.jpg')`,
    ];

    const results: string[] = [];
    for (const sql of sqls) {
      try {
        await pool.query(sql);
        results.push(`OK: ${sql.substring(0, 60)}...`);
      } catch (e: any) {
        results.push(`ERR: ${sql.substring(0, 40)}... → ${e.message}`);
      }
    }

    await pool.end();
    return NextResponse.json({ results });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
