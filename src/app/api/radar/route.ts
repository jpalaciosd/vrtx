import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getOsmTagsForPreferences } from '@/lib/preferences';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Fallback categories by mode (when user has no preferences set)
const modeFallback: Record<string, string[]> = {
  deporte: [
    'node["leisure"="fitness_centre"]',
    'node["leisure"="sports_centre"]',
    'node["leisure"="park"]',
    'node["sport"]',
  ],
  trabajo: [
    'node["amenity"="cafe"]',
    'node["office"="coworking"]',
    'node["amenity"="library"]',
  ],
  parche: [
    'node["amenity"="restaurant"]',
    'node["amenity"="bar"]',
    'node["amenity"="nightclub"]',
  ],
  negocio: [
    'node["tourism"="hotel"]',
    'node["office"="coworking"]',
    'node["amenity"="restaurant"]',
  ],
  todo: [
    'node["amenity"="cafe"]',
    'node["amenity"="restaurant"]',
    'node["leisure"="park"]',
    'node["amenity"="bar"]',
    'node["leisure"="fitness_centre"]',
  ],
};

const typeIcons: Record<string, string> = {
  fitness_centre: "🏋️", sports_centre: "🏟️", park: "🌳", swimming_pool: "🏊",
  cafe: "☕", coworking: "💻", library: "📚", restaurant: "🍽️", bar: "🍺",
  pub: "🍻", nightclub: "🪩", cinema: "🎬", hotel: "🏨", gallery: "🎨",
  museum: "🎨", spa: "🧖", garden: "🌿", bakery: "🧁", dance: "💃",
  bicycle_rental: "🚴", nature_reserve: "🌿", amusement_arcade: "🎮",
  music_venue: "🎵",
};

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lng = parseFloat(searchParams.get('lng') || '0');
  const mode = searchParams.get('mode') || 'todo';
  const userId = searchParams.get('userId') || '';
  const radius = parseInt(searchParams.get('radius') || '2000');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat y lng requeridos' }, { status: 400 });
  }

  // Get user preferences
  let userInterests: string[] = [];
  if (userId) {
    const { data } = await supabase
      .from('users')
      .select('interests')
      .eq('id', userId)
      .maybeSingle();
    if (data?.interests) {
      userInterests = data.interests;
    }
  }

  // Build Overpass queries
  let osmFilters: string[];

  if (userInterests.length > 0) {
    // Personalized: use user's preferences
    const prefTags = getOsmTagsForPreferences(userInterests);
    osmFilters = prefTags.map((tag) => `node[${tag}](around:${radius},${lat},${lng});`);
    
    // Also add some mode-specific if few preferences
    if (osmFilters.length < 3) {
      const fallback = modeFallback[mode] || modeFallback.todo;
      osmFilters.push(...fallback.map((f) => `${f}(around:${radius},${lat},${lng});`));
    }
  } else {
    // No preferences: use mode-based fallback
    const fallback = modeFallback[mode] || modeFallback.todo;
    osmFilters = fallback.map((f) => `${f}(around:${radius},${lat},${lng});`);
  }

  // Limit to avoid too large queries
  osmFilters = osmFilters.slice(0, 8);

  const query = `
    [out:json][timeout:10];
    (
      ${osmFilters.join('\n')}
    );
    out body 20;
  `;

  try {
    // Try primary, then fallback Overpass server
    const servers = [
      'https://overpass-api.de/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter',
    ];

    let data: any = null;
    for (const server of servers) {
      try {
        const res = await fetch(server, {
          method: 'POST',
          body: `data=${encodeURIComponent(query)}`,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          signal: AbortSignal.timeout(12000),
        });
        if (res.ok) {
          data = await res.json();
          break;
        }
      } catch {
        continue;
      }
    }

    if (!data) {
      return NextResponse.json({ error: 'Servidores de mapas ocupados, intenta en unos segundos' }, { status: 502 });
    }
    const elements = data.elements || [];

    // Score places based on user preferences
    const places = elements
      .filter((el: any) => el.tags?.name)
      .map((el: any) => {
        const tags = el.tags || {};
        const type = tags.amenity || tags.leisure || tags.tourism || tags.office || tags.sport || tags.shop || 'place';
        const cuisine = tags.cuisine || '';
        
        // Calculate relevance score
        let score = 0;
        if (userInterests.length > 0) {
          // Boost places that match user interests
          if (userInterests.includes('coffee') && type === 'cafe') score += 10;
          if (userInterests.includes('sushi') && cuisine.match(/sushi|japanese/i)) score += 15;
          if (userInterests.includes('pizza') && cuisine.match(/pizza|italian/i)) score += 15;
          if (userInterests.includes('burger') && cuisine.match(/burger|american/i)) score += 15;
          if (userInterests.includes('mexican') && cuisine.match(/mexican/i)) score += 15;
          if (userInterests.includes('chinese') && cuisine.match(/chinese|asian|thai/i)) score += 15;
          if (userInterests.includes('colombian') && cuisine.match(/colombian|latin|regional/i)) score += 15;
          if (userInterests.includes('vegan') && (cuisine.match(/vegan|vegetarian/i) || tags['diet:vegan'] === 'yes')) score += 15;
          if (userInterests.includes('seafood') && cuisine.match(/seafood|fish/i)) score += 15;
          if (userInterests.includes('cocktails') && type === 'bar') score += 10;
          if (userInterests.includes('craft-beer') && (tags.craft === 'brewery' || tags.microbrewery === 'yes')) score += 15;
          if (userInterests.includes('gym') && type === 'fitness_centre') score += 10;
          if (userInterests.includes('yoga') && tags.sport === 'yoga') score += 15;
          if (userInterests.includes('running') && type === 'park') score += 10;
          if (userInterests.includes('art') && (type === 'gallery' || type === 'museum')) score += 10;
          if (userInterests.includes('nature') && (type === 'park' || type === 'garden')) score += 10;
          if (userInterests.includes('spa') && type === 'spa') score += 10;
          if (userInterests.includes('coworking') && tags.office === 'coworking') score += 10;
          if (userInterests.includes('live-music') && (type === 'nightclub' || type === 'music_venue')) score += 10;
          if (userInterests.includes('dance') && tags.sport === 'dance') score += 15;
        }

        const distance = Math.round(haversine(lat, lng, el.lat, el.lon));

        return {
          name: tags.name,
          type,
          cuisine: cuisine || undefined,
          icon: typeIcons[type] || '📍',
          lat: el.lat,
          lng: el.lon,
          distance,
          score,
          tags: {
            ...(cuisine && { cuisine }),
            ...(tags.phone && { phone: tags.phone }),
            ...(tags.website && { website: tags.website }),
            ...(tags['opening_hours'] && { hours: tags['opening_hours'] }),
            ...(tags['addr:street'] && {
              address: `${tags['addr:street']} ${tags['addr:housenumber'] || ''}`.trim(),
            }),
          },
        };
      })
      // Sort by: score (desc) then distance (asc)
      .sort((a: any, b: any) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.distance - b.distance;
      })
      // Deduplicate by name
      .filter((place: any, index: number, arr: any[]) =>
        arr.findIndex((p: any) => p.name.toLowerCase() === place.name.toLowerCase()) === index
      )
      .slice(0, 10);

    return NextResponse.json(
      { places, mode, personalized: userInterests.length > 0, total: places.length },
      { headers: { 'Cache-Control': 'private, max-age=120' } } // cache 2 min
    );
  } catch (e) {
    console.error('Radar error:', e);
    return NextResponse.json({ error: 'Error obteniendo recomendaciones' }, { status: 500 });
  }
}
