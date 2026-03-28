import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vrtx: {
          black: "#060810",
          dark: "#0a0e1a",
          card: "#0f1526",
          cyan: "#00d4ff",
          gray: "#8899bb",
          white: "#ffffff",
          gold: "#d4a843",
          neon: "#39ff14",
          rose: "#ff2d7b",
        },
      },
      fontFamily: {
        display: ["Bebas Neue", "sans-serif"],
        body: ["Rajdhani", "sans-serif"],
        mono: ["Share Tech Mono", "monospace"],
      },
      borderRadius: {
        card: "6px",
        pill: "20px",
      },
      animation: {
        "nfc-pulse": "nfcPulse 2s ease-in-out infinite",
        "scan-line": "scanLine 1.5s ease-in-out infinite",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "glow": "glow 2s ease-in-out infinite alternate",
        "breathe": "breathe 4s ease-in-out infinite",
      },
      keyframes: {
        nfcPulse: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.15)", opacity: "1" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px var(--accent), 0 0 10px var(--accent)" },
          "100%": { boxShadow: "0 0 20px var(--accent), 0 0 40px var(--accent)" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.03)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
