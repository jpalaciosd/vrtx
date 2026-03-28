export interface DesignOptions {
  estilo: string;
  elemento: string;
  texto: string;
  colorDominante: string;
  colorSecundario: string;
  intensidad: string;
}

export const estilos = [
  { id: "vertex", name: "VERTEX", icon: "🔺", desc: "Geométrico futurista · Triángulos · Circuitos" },
  { id: "wave", name: "WAVE", icon: "🌊", desc: "Fluido topográfico · Ondas · Contornos" },
  { id: "glitch", name: "GLITCH", icon: "⚡", desc: "Cyberpunk · Distorsión digital · Glitch" },
  { id: "heritage", name: "HERITAGE", icon: "🏛️", desc: "Escudo premium · Clásico · Elegante" },
  { id: "primal", name: "PRIMAL", icon: "🔥", desc: "Street urbano · Agresivo · Bold" },
];

export const elementos = [
  { id: "none", name: "Ninguno", icon: "🔺" },
  { id: "wolf", name: "Lobo", icon: "🐺" },
  { id: "eagle", name: "Águila", icon: "🦅" },
  { id: "snake", name: "Serpiente", icon: "🐍" },
  { id: "lion", name: "León", icon: "🦁" },
  { id: "owl", name: "Búho", icon: "🦉" },
];

export const coloresDominantes = [
  { id: "cyan", name: "Cian", hex: "#00d4ff" },
  { id: "gold", name: "Dorado", hex: "#d4a843" },
  { id: "neon-green", name: "Verde neón", hex: "#39ff14" },
  { id: "neon-pink", name: "Rosa neón", hex: "#ff2d7b" },
  { id: "white", name: "Blanco", hex: "#ffffff" },
];

export const coloresSecundarios = [
  { id: "none", name: "Ninguno", hex: "transparent" },
  { id: "silver", name: "Gris plata", hex: "#a8b2c1" },
  { id: "red", name: "Rojo", hex: "#ff3333" },
  { id: "orange", name: "Naranja", hex: "#ff8800" },
  { id: "violet", name: "Violeta", hex: "#9b59b6" },
];

export const intensidades = [
  { id: "subtle", name: "Sutil", desc: "Elegante, minimalista" },
  { id: "balanced", name: "Equilibrado", desc: "Balance perfecto" },
  { id: "bold", name: "Bold", desc: "Máximo impacto" },
];

function getIntensityDesc(intensidad: string, estilo: string): string {
  const map: Record<string, Record<string, string>> = {
    vertex: {
      subtle: "Minimal linework, breathing space, elegant",
      balanced: "Balanced composition with clear focal point",
      bold: "Dense pattern, aggressive, maximum detail",
    },
    wave: {
      subtle: "Few sparse lines, zen-like calm, lots of negative space",
      balanced: "Medium density, natural rhythm",
      bold: "Dense layered contours, maximum visual texture",
    },
    glitch: {
      subtle: "Subtle glitch, mostly clean with small disruptions",
      balanced: "Visible glitch effects but still readable composition",
      bold: "Heavy corruption, aggressive fragmentation, chaotic energy",
    },
    heritage: {
      subtle: "Clean crest, minimal ornaments, sophisticated",
      balanced: "Classic balance of detail and elegance",
      bold: "Ornate, detailed crest with full framing elements",
    },
    primal: {
      subtle: "Clean bold strokes, controlled aggression, spacious",
      balanced: "Strong presence but balanced composition",
      bold: "Maximum impact, filled, loud, in-your-face",
    },
  };
  return map[estilo]?.[intensidad] || "Balanced composition";
}

function getElementDesc(elemento: string, estilo: string): string {
  if (elemento === "none") {
    const defaults: Record<string, string> = {
      vertex: "Pure geometric pattern with concentric triangles and the VRTX vertex triangle symbol at center.",
      wave: "The VRTX triangle symbol sits at the center where all contour lines converge.",
      glitch: "The VRTX triangle symbol fragmenting and glitching across the panel.",
      heritage: "The VRTX triangle as the central emblem inside a geometric shield frame.",
      primal: "The VRTX triangle transformed into an aggressive tribal/urban mark with sharp spikes radiating outward.",
    };
    return defaults[estilo] || "";
  }

  const animalMap: Record<string, string> = {
    wolf: "wolf", eagle: "eagle", snake: "serpent", lion: "lion", owl: "owl",
  };
  const animal = animalMap[elemento] || elemento;

  const templates: Record<string, string> = {
    vertex: `Incorporate a stylized geometric ${animal} made of triangular facets and circuit-like details.`,
    wave: `A stylized ${animal} emerges from the flowing lines, integrated into the topography.`,
    glitch: `A ${animal} rendered in glitch style — fragmented, with horizontal displacement and RGB split effect using thread colors.`,
    heritage: `A ${animal} as the central heraldic figure inside a modernized shield or crest frame.`,
    primal: `A fierce ${animal} in attack pose, stylized with sharp angular strokes and street art influence.`,
  };
  return templates[estilo] || "";
}

export function buildPrompt(options: DesignOptions): string {
  const { estilo, elemento, texto, colorDominante, colorSecundario, intensidad } = options;

  const colorName = coloresDominantes.find((c) => c.id === colorDominante)?.name || "Cyan";
  const secName = coloresSecundarios.find((c) => c.id === colorSecundario)?.name || "none";
  const intensityDesc = getIntensityDesc(intensidad, estilo);
  const elementDesc = getElementDesc(elemento, estilo);
  const textLine = texto.trim()
    ? `Include the text "${texto.trim().toUpperCase()}" integrated into the design with style-appropriate lettering.`
    : "";

  const photoBase = `Professional product photography of a single black premium snapback cap with flat brim, sitting on a dark matte display stand. Shot with a 50mm lens, shallow depth of field, soft studio lighting with dramatic rim light. The cap is shown from a 3/4 front angle, complete and fully visible. The front panel features a ${colorName}-colored thread embroidery design.`;

  const photoEnd = `The embroidery uses max 3 thread colors on the black fabric: ${colorName}${secName !== "none" ? ` and ${secName}` : ""}. ${textLine} The cap looks real, tangible, premium. Single image, single cap, no duplicates, no split compositions. Dark moody background with subtle bokeh. Style reference: high-end streetwear product photography, magazine quality.`;

  const bases: Record<string, string> = {
    vertex: `${photoBase}
The embroidery style is geometric futuristic — sacred geometry meets circuit board aesthetics. Triangular shapes and angular patterns form the composition.
${elementDesc}
Intensity: ${intensityDesc}.
${photoEnd}`,

    wave: `${photoBase}
The embroidery style is fluid topographic — flowing contour lines like terrain maps mixed with ocean waves. Organic curves creating depth and movement.
${elementDesc}
Intensity: ${intensityDesc}.
${photoEnd}`,

    glitch: `${photoBase}
The embroidery style is cyberpunk glitch — digital distortion, scan lines, data corruption aesthetic. Horizontal shift artifacts and fragmented shapes.
${elementDesc}
Intensity: ${intensityDesc}.
${photoEnd}`,

    heritage: `${photoBase}
The embroidery style is premium heritage — classic emblem with modern edge. Shield or crest composition with clean symmetry. Includes subtle ornamental framing.
${elementDesc}
Intensity: ${intensityDesc}.
${photoEnd}`,

    primal: `${photoBase}
The embroidery style is primal street — raw, bold, aggressive urban energy. Thick strokes, sharp angles, graffiti-influenced but clean embroidery.
${elementDesc}
Intensity: ${intensityDesc}.
${photoEnd}`,
  };

  return bases[estilo] || bases.vertex;
}
