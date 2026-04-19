import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const OPENAI_KEY = process.env.OPENAI_API_KEY || "";

const VISION_PROMPT = `Analiza esta imagen y determina si hay una GORRA o CAP visible.

Una gorra VRTX es una gorra/cap con diseños artísticos, bordados, o patrones únicos. Puede ser cualquier estilo de gorra (snapback, dad hat, fitted, trucker).

Responde ÚNICAMENTE en este formato JSON exacto (sin markdown, sin backticks):
{"detected": true/false, "confidence": 0-100, "description": "descripción breve del diseño de la gorra", "colors": ["color1", "color2"], "style": "tipo de gorra"}

Si NO hay gorra en la imagen, responde:
{"detected": false, "confidence": 0, "description": "no cap detected", "colors": [], "style": "none"}

Sé estricto: solo marca detected=true si claramente ves una gorra/cap en la imagen.`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const frame = formData.get("frame") as Blob | null;

    if (!frame || !OPENAI_KEY) {
      return NextResponse.json({ error: "Missing frame or API key" }, { status: 400 });
    }

    // Convert image to base64
    const buffer = await frame.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const mimeType = frame.type || "image/jpeg";

    // Send to OpenAI Vision
    const visionRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: VISION_PROMPT },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64}`,
                  detail: "low", // Save tokens
                },
              },
            ],
          },
        ],
        max_tokens: 200,
        temperature: 0.1,
      }),
    });

    if (!visionRes.ok) {
      const err = await visionRes.text();
      console.error("OpenAI Vision error:", err);
      return NextResponse.json({ detected: false, error: "Vision API failed" });
    }

    const visionData = await visionRes.json();
    const content = visionData.choices?.[0]?.message?.content || "";

    // Parse the JSON response
    let analysis;
    try {
      // Clean potential markdown wrapping
      const clean = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      analysis = JSON.parse(clean);
    } catch {
      console.error("Failed to parse vision response:", content);
      return NextResponse.json({ detected: false, error: "Parse failed" });
    }

    if (!analysis.detected || analysis.confidence < 40) {
      return NextResponse.json({
        detected: false,
        analysis,
        message: "No se detectó una gorra VRTX en la imagen",
      });
    }

    // Cap detected! Now find matching user profile
    // For now, search by design similarity (future: ML matching)
    // Current approach: find users with designs and return the best match

    // Get all users with designs
    const { data: designs } = await supabase
      .from("designs")
      .select("id, owner_id, prompt_used, estilo, image_url, name")
      .order("created_at", { ascending: false })
      .limit(20);

    let matchedUserId: string | null = null;

    if (designs && designs.length > 0) {
      // Try to match by color/style similarity using OpenAI
      const designDescriptions = designs.map((d, i) => 
        `${i}: style="${d.estilo}", name="${d.name}", prompt="${d.prompt_used}"`
      ).join("\n");

      const matchRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: `La gorra detectada tiene esta descripción: "${analysis.description}", colores: ${JSON.stringify(analysis.colors)}, estilo: "${analysis.style}".

Estos son los diseños registrados en VRTX:
${designDescriptions}

¿Cuál diseño es el más similar? Responde SOLO con el número del índice (0, 1, 2...). Si ninguno se parece, responde -1.`,
            },
          ],
          max_tokens: 10,
          temperature: 0,
        }),
      });

      if (matchRes.ok) {
        const matchData = await matchRes.json();
        const matchIdx = parseInt(matchData.choices?.[0]?.message?.content?.trim() || "-1");
        if (matchIdx >= 0 && matchIdx < designs.length) {
          matchedUserId = designs[matchIdx].owner_id;
        }
      }
    }

    // If no design match, get the first active user (demo fallback)
    if (!matchedUserId) {
      const { data: chips } = await supabase
        .from("chips")
        .select("user_id")
        .not("user_id", "is", null)
        .limit(1);
      if (chips?.[0]) matchedUserId = chips[0].user_id;
    }

    if (!matchedUserId) {
      return NextResponse.json({
        detected: true,
        analysis,
        profile: null,
        message: "Gorra detectada pero no se encontró perfil asociado",
      });
    }

    // Get user profile
    const { data: user } = await supabase
      .from("users")
      .select("name, handle, bio, avatar_url, theme, active_mode, social_links, main_sport, interests")
      .eq("id", matchedUserId)
      .maybeSingle();

    if (!user) {
      return NextResponse.json({ detected: true, analysis, profile: null });
    }

    const profile = {
      name: user.name || "VRTX User",
      handle: user.handle ? `@${user.handle}` : "",
      bio: user.bio || "",
      avatar_url: user.avatar_url || "",
      theme: user.theme || "cyber",
      active_mode: user.active_mode || "todo",
      social_links: user.social_links || {},
      main_sport: user.main_sport || "",
      interests: user.interests || [],
      privacy: { showBio: true, showSocial: true, showSport: true, showInterests: true },
    };

    return NextResponse.json({
      detected: true,
      analysis,
      profile,
    });
  } catch (e) {
    console.error("Vision scan error:", e);
    return NextResponse.json({ error: "Scan failed", detected: false }, { status: 500 });
  }
}
