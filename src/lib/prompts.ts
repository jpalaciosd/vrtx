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

  const bases: Record<string, string> = {
    vertex: `Embroidery design for a black snapback cap, top-down flat view of the front panel only.
Geometric futuristic style. Sacred geometry meets circuit board aesthetics.
Central composition built around triangular shapes and the VRTX vertex triangle symbol.
${elementDesc}
${textLine}
Primary color: ${colorName}. Secondary accent: ${secName}.
Intensity: ${intensityDesc}.
Black background. Max 3 thread colors. Clean vector line art suitable for embroidery.
No gradients, no photorealism, no shading. Solid fills and outlines only.
Style reference: tech-wear brand aesthetic, premium streetwear.`,

    wave: `Embroidery design for a black snapback cap, top-down flat view of the front panel only.
Fluid topographic style. Flowing contour lines like terrain maps mixed with ocean waves.
Organic curves that create depth and movement across the cap panel.
${elementDesc}
${textLine}
Primary color: ${colorName}. Secondary accent: ${secName}.
Intensity: ${intensityDesc}.
Black background. Max 3 thread colors. Clean vector lines suitable for embroidery.
No gradients, no photorealism. Continuous line art only.
Style reference: topographic maps, Japanese wave art, modern minimalism.`,

    glitch: `Embroidery design for a black snapback cap, top-down flat view of the front panel only.
Cyberpunk glitch style. Digital distortion, scan lines, data corruption aesthetic.
The design looks like a digital image breaking apart with horizontal shift artifacts.
${elementDesc}
${textLine}
Primary color: ${colorName}. Secondary accent: ${secName}.
Intensity: ${intensityDesc}.
Black background. Max 3 thread colors. Designed for thread embroidery.
No gradients. Sharp edges, horizontal lines, pixel-like blocks.
Style reference: cyberpunk 2077, vaporwave, digital decay.`,

    heritage: `Embroidery design for a black snapback cap, top-down flat view of the front panel only.
Premium heritage style. Classic emblem aesthetic with modern edge.
Shield or crest composition with clean symmetry and refined details.
${elementDesc}
${textLine}
Include subtle laurel branches, stars, or geometric ornaments framing the design.
Primary color: ${colorName}. Secondary accent: ${secName}.
Intensity: ${intensityDesc}.
Black background. Max 3 thread colors. Vector line art for embroidery.
No gradients, no photorealism. Heraldic flat style.
Style reference: luxury fashion house crests, modern coat of arms, Ralph Lauren meets tech.`,

    primal: `Embroidery design for a black snapback cap, top-down flat view of the front panel only.
Primal street style. Raw, bold, aggressive urban energy.
Thick strokes, sharp angles, graffiti-influenced but clean enough for embroidery.
${elementDesc}
${textLine}
Primary color: ${colorName}. Secondary accent: ${secName}.
Intensity: ${intensityDesc}.
Black background. Max 3 thread colors. Designed for thread embroidery.
No gradients. Thick outlines, solid fills, sharp points.
Style reference: streetwear brands, tattoo flash art, urban murals.`,
  };

  return bases[estilo] || bases.vertex;
}
