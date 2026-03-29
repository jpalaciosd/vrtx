// User preference categories for personalized Radar
export interface PreferenceCategory {
  id: string;
  label: string;
  icon: string;
  options: { id: string; label: string; icon: string; osmTags: string[] }[];
}

export const preferenceCategories: PreferenceCategory[] = [
  {
    id: "food",
    label: "Comida",
    icon: "🍽️",
    options: [
      { id: "sushi", label: "Sushi / Japonesa", icon: "🍣", osmTags: ['"cuisine"~"sushi|japanese"'] },
      { id: "pizza", label: "Pizza / Italiana", icon: "🍕", osmTags: ['"cuisine"~"pizza|italian"'] },
      { id: "burger", label: "Hamburguesas", icon: "🍔", osmTags: ['"cuisine"~"burger|american"'] },
      { id: "mexican", label: "Mexicana", icon: "🌮", osmTags: ['"cuisine"~"mexican"'] },
      { id: "chinese", label: "China / Asiática", icon: "🥟", osmTags: ['"cuisine"~"chinese|asian|thai|vietnamese"'] },
      { id: "colombian", label: "Colombiana", icon: "🇨🇴", osmTags: ['"cuisine"~"colombian|latin|regional"'] },
      { id: "vegan", label: "Vegana / Vegetariana", icon: "🥗", osmTags: ['"cuisine"~"vegan|vegetarian"', '"diet:vegan"="yes"'] },
      { id: "coffee", label: "Café especial", icon: "☕", osmTags: ['"cuisine"~"coffee"', '"amenity"="cafe"'] },
      { id: "seafood", label: "Mariscos", icon: "🦐", osmTags: ['"cuisine"~"seafood|fish"'] },
      { id: "bakery", label: "Panadería / Postres", icon: "🧁", osmTags: ['"shop"="bakery"', '"cuisine"~"pastry|dessert"'] },
    ],
  },
  {
    id: "drinks",
    label: "Bebidas",
    icon: "🥂",
    options: [
      { id: "cocktails", label: "Coctelería", icon: "🍸", osmTags: ['"amenity"="bar"'] },
      { id: "craft-beer", label: "Cerveza artesanal", icon: "🍺", osmTags: ['"craft"="brewery"', '"microbrewery"="yes"'] },
      { id: "wine", label: "Vinos", icon: "🍷", osmTags: ['"amenity"="bar"'] },
      { id: "juice", label: "Jugos naturales", icon: "🧃", osmTags: ['"cuisine"~"juice"', '"shop"="beverages"'] },
    ],
  },
  {
    id: "activities",
    label: "Actividades",
    icon: "⚡",
    options: [
      { id: "gym", label: "Gimnasio", icon: "🏋️", osmTags: ['"leisure"="fitness_centre"'] },
      { id: "yoga", label: "Yoga / Pilates", icon: "🧘", osmTags: ['"sport"="yoga"', '"leisure"="fitness_centre"'] },
      { id: "swimming", label: "Natación", icon: "🏊", osmTags: ['"leisure"="swimming_pool"'] },
      { id: "running", label: "Running / Parques", icon: "🏃", osmTags: ['"leisure"="park"', '"leisure"="track"'] },
      { id: "climbing", label: "Escalada", icon: "🧗", osmTags: ['"sport"="climbing"'] },
      { id: "cycling", label: "Ciclismo", icon: "🚴", osmTags: ['"shop"="bicycle"', '"amenity"="bicycle_rental"'] },
      { id: "martial-arts", label: "Artes marciales", icon: "🥋", osmTags: ['"sport"~"martial_arts|boxing|mma"'] },
      { id: "dance", label: "Baile / Salsa", icon: "💃", osmTags: ['"leisure"="dance"', '"sport"="dance"'] },
    ],
  },
  {
    id: "vibe",
    label: "Ambiente",
    icon: "✨",
    options: [
      { id: "coworking", label: "Coworking", icon: "💻", osmTags: ['"office"="coworking"'] },
      { id: "library", label: "Bibliotecas", icon: "📚", osmTags: ['"amenity"="library"'] },
      { id: "rooftop", label: "Rooftop / Terrazas", icon: "🌇", osmTags: ['"amenity"="restaurant"', '"amenity"="bar"'] },
      { id: "live-music", label: "Música en vivo", icon: "🎵", osmTags: ['"amenity"="nightclub"', '"amenity"="music_venue"'] },
      { id: "art", label: "Galerías / Arte", icon: "🎨", osmTags: ['"tourism"="gallery"', '"tourism"="museum"'] },
      { id: "nature", label: "Naturaleza", icon: "🌿", osmTags: ['"leisure"="park"', '"leisure"="garden"', '"leisure"="nature_reserve"'] },
      { id: "spa", label: "Spa / Bienestar", icon: "🧖", osmTags: ['"leisure"="spa"', '"shop"="beauty"'] },
      { id: "gaming", label: "Gaming / E-sports", icon: "🎮", osmTags: ['"leisure"="amusement_arcade"'] },
    ],
  },
];

// Get all selected preference tags as OSM queries
export function getOsmTagsForPreferences(interests: string[]): string[] {
  const tags: string[] = [];
  for (const cat of preferenceCategories) {
    for (const opt of cat.options) {
      if (interests.includes(opt.id)) {
        tags.push(...opt.osmTags);
      }
    }
  }
  return [...new Set(tags)]; // deduplicate
}

// Get all preference options flat
export function getAllOptions() {
  return preferenceCategories.flatMap((cat) =>
    cat.options.map((opt) => ({ ...opt, category: cat.id, categoryLabel: cat.label }))
  );
}
