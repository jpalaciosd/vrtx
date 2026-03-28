export type ThemeName = "cyber" | "gold" | "neon" | "rose" | "white";

export const themes: Record<ThemeName, { label: string; accent: string; preview: string }> = {
  cyber: { label: "Cyber", accent: "#00d4ff", preview: "Negro + Cian eléctrico" },
  gold: { label: "Gold", accent: "#d4a843", preview: "Negro + Dorado frío" },
  neon: { label: "Neon", accent: "#39ff14", preview: "Negro + Verde neón" },
  rose: { label: "Rose", accent: "#ff2d7b", preview: "Negro + Rosa neón" },
  white: { label: "White", accent: "#1a1a2e", preview: "Blanco minimalista" },
};

export type ModeName = "todo" | "trabajo" | "deporte" | "parche" | "negocio";

export const modes: Record<ModeName, { label: string; icon: string; description: string }> = {
  todo: { label: "TODO", icon: "⚡", description: "Muestra todo" },
  trabajo: { label: "TRABAJO", icon: "💼", description: "LinkedIn, portfolio, email" },
  deporte: { label: "DEPORTE", icon: "🏋️", description: "Métricas fitness, gym" },
  parche: { label: "PARCHE", icon: "🎉", description: "Instagram, TikTok, Spotify" },
  negocio: { label: "NEGOCIO", icon: "🏪", description: "Tienda, catálogo, pagos" },
};

export type TierName = "CORE" | "LINKED" | "LEGENDARY";

export const tiers: Record<TierName, { color: string; label: string }> = {
  CORE: { color: "#00d4ff", label: "CORE" },
  LINKED: { color: "#d4a843", label: "LINKED" },
  LEGENDARY: { color: "#ff2d7b", label: "LEGENDARY" },
};
