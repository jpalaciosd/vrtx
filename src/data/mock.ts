import { ThemeName, ModeName, TierName } from "@/lib/themes";

export interface MockUser {
  id: string;
  name: string;
  handle: string;
  bio: string;
  avatar: string;
  theme: ThemeName;
  activeMode: ModeName;
  tier: TierName;
  bloodType: string;
  allergies: string[];
  emergencyContact: { name: string; phone: string; relation: string };
  socialLinks: {
    instagram?: string;
    tiktok?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    spotify?: string;
    github?: string;
    behance?: string;
    custom?: { label: string; url: string };
  };
  phone: string;
  email: string;
  sport: {
    mainSport: string;
    level: string;
    steps: number;
    calories: number;
    hydration: number;
    sleep: number;
    streak: number;
    records: { name: string; value: string }[];
    challenge: string;
  };
  portfolio: {
    title: string;
    image: string;
    link: string;
    category: string;
  }[];
  store: {
    name: string;
    price: number;
    image: string;
    description: string;
  }[];
  spotifyNowPlaying: {
    track: string;
    artist: string;
    album: string;
    albumArt: string;
    progress: number;
    duration: number;
  };
}

export interface MockChip {
  chipId: string;
  serialNumber: string;
  tier: TierName;
  ownerId: string;
  activatedAt: string;
  designName: string;
  colorway: string;
  isAuthentic: boolean;
}

export interface MockScan {
  id: string;
  chipId: string;
  city: string;
  country: string;
  scannedAt: string;
  lat: number;
  lng: number;
}

// === MOCK USER ===
export const mockUser: MockUser = {
  id: "usr-001",
  name: "Santiago Restrepo",
  handle: "@santiago.vrtx",
  bio: "Diseñador UX · Runner · Cali, Colombia 🇨🇴",
  avatar: "",
  theme: "cyber",
  activeMode: "todo",
  tier: "LINKED",
  bloodType: "O+",
  allergies: ["Penicilina", "Maní"],
  emergencyContact: {
    name: "María Restrepo",
    phone: "+57 312 456 7890",
    relation: "Madre",
  },
  socialLinks: {
    instagram: "https://instagram.com/santirestrepo",
    tiktok: "https://tiktok.com/@santirestrepo",
    linkedin: "https://linkedin.com/in/santiagorestrepo",
    twitter: "https://x.com/santirestrepo",
    spotify: "https://open.spotify.com/user/santirestrepo",
    github: "https://github.com/santirestrepo",
    behance: "https://behance.net/santirestrepo",
  },
  phone: "+573001234567",
  email: "santiago@vrtxco.com",
  sport: {
    mainSport: "Crossfit",
    level: "Intermedio",
    steps: 8743,
    calories: 2150,
    hydration: 2.3,
    sleep: 7.2,
    streak: 12,
    records: [
      { name: "Deadlift", value: "140 kg" },
      { name: "5K Run", value: "22:30 min" },
      { name: "Bench Press", value: "90 kg" },
    ],
    challenge: "¿Puedes hacer 100 burpees en menos de 10 minutos? 🔥",
  },
  portfolio: [
    { title: "App VRTX", image: "", link: "#", category: "Diseño" },
    { title: "Branding Studio", image: "", link: "#", category: "Diseño" },
    { title: "E-Commerce UX", image: "", link: "#", category: "Código" },
    { title: "Motion Reel", image: "", link: "#", category: "Video" },
    { title: "NFT Collection", image: "", link: "#", category: "Arte" },
    { title: "Podcast Cover", image: "", link: "#", category: "Diseño" },
  ],
  store: [
    { name: "Consultoría UX (1h)", price: 150000, image: "", description: "Sesión de consultoría de diseño UX/UI" },
    { name: "Logo + Branding", price: 800000, image: "", description: "Diseño de marca completo" },
    { name: "Gorra VRTX CORE", price: 120000, image: "", description: "Gorra VRTX con NFC integrado" },
  ],
  spotifyNowPlaying: {
    track: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    albumArt: "",
    progress: 127,
    duration: 200,
  },
};

// === MOCK CHIP ===
export const mockChip: MockChip = {
  chipId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  serialNumber: "VRTX-2026-001",
  tier: "LINKED",
  ownerId: "usr-001",
  activatedAt: "2026-03-15T10:30:00Z",
  designName: "NOVA",
  colorway: "Midnight Carbon",
  isAuthentic: true,
};

// === MOCK SCANS ===
export const mockScans: MockScan[] = [
  { id: "s1", chipId: mockChip.chipId, city: "Cali", country: "CO", scannedAt: "2026-03-25T14:30:00Z", lat: 3.4516, lng: -76.5320 },
  { id: "s2", chipId: mockChip.chipId, city: "Cali", country: "CO", scannedAt: "2026-03-24T09:15:00Z", lat: 3.4372, lng: -76.5225 },
  { id: "s3", chipId: mockChip.chipId, city: "Bogotá", country: "CO", scannedAt: "2026-03-22T18:45:00Z", lat: 4.7110, lng: -74.0721 },
  { id: "s4", chipId: mockChip.chipId, city: "Medellín", country: "CO", scannedAt: "2026-03-20T11:00:00Z", lat: 6.2442, lng: -75.5812 },
  { id: "s5", chipId: mockChip.chipId, city: "Cali", country: "CO", scannedAt: "2026-03-18T16:20:00Z", lat: 3.4516, lng: -76.5320 },
  { id: "s6", chipId: mockChip.chipId, city: "Pereira", country: "CO", scannedAt: "2026-03-15T08:30:00Z", lat: 4.8087, lng: -75.6906 },
  { id: "s7", chipId: mockChip.chipId, city: "Bogotá", country: "CO", scannedAt: "2026-03-12T20:10:00Z", lat: 4.6486, lng: -74.0980 },
  { id: "s8", chipId: mockChip.chipId, city: "Cali", country: "CO", scannedAt: "2026-03-10T13:45:00Z", lat: 3.4200, lng: -76.5410 },
  { id: "s9", chipId: mockChip.chipId, city: "Barranquilla", country: "CO", scannedAt: "2026-03-08T10:00:00Z", lat: 10.9685, lng: -74.7813 },
  { id: "s10", chipId: mockChip.chipId, city: "Cartagena", country: "CO", scannedAt: "2026-03-05T15:30:00Z", lat: 10.3910, lng: -75.5144 },
];

// Computed stats
export const mockStats = {
  totalScans: mockScans.length,
  uniqueCities: Array.from(new Set(mockScans.map((s) => s.city))).length,
  streak: 5,
  lastScan: mockScans[0],
  scansByCity: Object.entries(
    mockScans.reduce((acc, s) => {
      acc[s.city] = (acc[s.city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count),
};

// Heatmap data (7 weeks × 7 days)
export const mockHeatmap: number[] = Array.from({ length: 49 }, () =>
  Math.random() > 0.6 ? Math.floor(Math.random() * 5) : 0
);
