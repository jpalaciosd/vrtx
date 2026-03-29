import { NextResponse } from 'next/server';

// Map VRTX modes to OpenStreetMap categories
const modeCategories: Record<string, string[]> = {
  deporte: [
    '"leisure"="fitness_centre"',
    '"leisure"="sports_centre"',
    '"leisure"="park"',
    '"sport"',
    '"leisure"="swimming_pool"',
  ],
  trabajo: [
    '"amenity"="cafe"',
    '"office"="coworking"',
    '"amenity"="library"',
    '"office"',
  ],
  parche: [
    '"amenity"="restaurant"',
    '"amenity"="bar"',
    '"amenity"="pub"',
    '"amenity"="nightclub"',
    '"amenity"="cinema"',
  ],
  negocio: [
    '"tourism"="hotel"',
    '"amenity"="conference_centre"',
    '"office"="coworking"',
    '"amenity"="restaurant"',
  ],
  todo: [
    '"amenity"="cafe"',
    '"amenity"="restaurant"',
    '"leisure"="park"',
    '"amenity"="bar"',
    '"leisure"="fitness_centre"',
  ],
};

const modeIcons: Record<string, Record<string, string>> = {
  deporte: { fitness_centre: "🏋️", sports_centre: "🏟️", park: "🌳", swimming_pool: "🏊", default: "⚽" },
  trabajo: { cafe: "☕", coworking: "💻", library: "📚", default: "🏢" },
  parche: { restaurant: "🍽️", bar: "🍺", pub: "🍻", nightclub: "🪩", cinema: "🎬", default: "🎉" },
  negocio: { hotel: "🏨", conference_centre: "🎤", coworking: "💻", restaurant: "🍽️", default: "🤝" },
  todo: { cafe: "☕", restaurant: "🍽️", park: "🌳", bar: "🍺", fitness_centre: "🏋️", default: "📍" },
};

interface Place {
  name: string;
  type: string;
  icon: string;
  lat: number;
  lng: number;
  distance: number;
  tags: Record<string, string>;
}

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
  const radius = parseInt(searchParams.get('radius') || '1500'); // meters

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat y lng requeridos' }, { status: 400 });
  }

  const categories = modeCategories[mode] || modeCategories.todo;
  const icons = modeIcons[mode] || modeIcons.todo;

  // Build Overpass query
  const filters = categories.map((cat) => `node[${cat}](around:${radius},${lat},${lng});`).join('\n');
  const query = `
    [out:json][timeout:10];
    (
      ${filters}
    );
    out body 15;
  `;

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Error consultando lugares' }, { status: 502 });
    }

    const data = await res.json();
    const elements = data.elements || [];

    const places: Place[] = elements
      .filter((el: any) => el.tags?.name)
      .map((el: any) => {
        const tags = el.tags || {};
        const type =
          tags.amenity || tags.leisure || tags.tourism || tags.office || tags.sport || 'place';
        return {
          name: tags.name,
          type,
          icon: icons[type] || icons.default || '📍',
          lat: el.lat,
          lng: el.lon,
          distance: Math.round(haversine(lat, lng, el.lat, el.lon)),
          tags: {
            ...(tags.cuisine && { cuisine: tags.cuisine }),
            ...(tags.phone && { phone: tags.phone }),
            ...(tags.website && { website: tags.website }),
            ...(tags['opening_hours'] && { hours: tags['opening_hours'] }),
            ...(tags['addr:street'] && { address: `${tags['addr:street']} ${tags['addr:housenumber'] || ''}`.trim() }),
          },
        };
      })
      .sort((a: Place, b: Place) => a.distance - b.distance)
      .slice(0, 10);

    return NextResponse.json({ places, mode, total: places.length });
  } catch (e) {
    console.error('Radar error:', e);
    return NextResponse.json({ error: 'Error obteniendo recomendaciones' }, { status: 500 });
  }
}
