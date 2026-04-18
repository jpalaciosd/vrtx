import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// In the future, this will use image recognition (OpenAI Vision, TensorFlow, etc.)
// to identify VRTX cap designs and match them to users.
// For now, it simulates detection for demo purposes.

export async function POST(req: NextRequest) {
  try {
    // Get the frame from the request
    const formData = await req.formData();
    const frame = formData.get("frame") as Blob | null;
    
    if (!frame) {
      return NextResponse.json({ error: "No frame" }, { status: 400 });
    }

    // TODO: Future implementation
    // 1. Send frame to OpenAI Vision API or custom ML model
    // 2. Detect VRTX cap design pattern in the image
    // 3. Match design to a chip/user in the database
    // 4. Return the profile with privacy filters applied
    
    // For now, we check if the request has a demo header
    // Real implementation would use image recognition here
    
    // Simulate: no detection by default
    // The client-side demo mode handles showing profiles
    return NextResponse.json({ detected: false, profile: null });
    
  } catch (e) {
    console.error("Vision scan error:", e);
    return NextResponse.json({ error: "Scan failed" }, { status: 500 });
  }
}

// GET — fetch a profile by chip ID for AR overlay (called after detection)
export async function GET(req: NextRequest) {
  const chipId = req.nextUrl.searchParams.get("chipId");
  if (!chipId) {
    return NextResponse.json({ error: "chipId required" }, { status: 400 });
  }

  // Get chip → user
  const { data: chip } = await supabase
    .from("chips")
    .select("user_id")
    .eq("id", chipId)
    .maybeSingle();

  if (!chip?.user_id) {
    return NextResponse.json({ error: "Chip not found" }, { status: 404 });
  }

  // Get user profile
  const { data: user } = await supabase
    .from("users")
    .select("name, handle, bio, avatar_url, theme, active_mode, social_links, main_sport, interests, ar_privacy")
    .eq("id", chip.user_id)
    .maybeSingle();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Apply privacy settings
  const privacy = user.ar_privacy || {
    showBio: true,
    showSocial: true,
    showSport: true,
    showInterests: true,
  };

  const profile = {
    name: user.name,
    handle: user.handle ? `@${user.handle}` : "",
    bio: privacy.showBio ? (user.bio || "") : "",
    avatar_url: user.avatar_url || "",
    theme: user.theme || "cyber",
    active_mode: user.active_mode || "todo",
    social_links: privacy.showSocial ? (user.social_links || {}) : {},
    main_sport: privacy.showSport ? (user.main_sport || "") : "",
    interests: privacy.showInterests ? (user.interests || []) : [],
    privacy,
  };

  return NextResponse.json({ detected: true, profile });
}
