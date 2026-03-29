"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import VrtxLogo from "@/components/VrtxLogo";
import { useAuth } from "@/contexts/AuthContext";
import { tiers, themes, modes } from "@/lib/themes";
import type { DbUser, DbChip, DbScan } from "@/lib/supabase";

// ==================== RADAR COMPONENT ====================
interface RadarPlace {
  name: string;
  type: string;
  icon: string;
  distance: number;
  tags: Record<string, string>;
  lat: number;
  lng: number;
}

function VrtxRadar({ mode }: { mode: string }) {
  const [places, setPlaces] = useState<RadarPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetch(`/api/radar?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}&mode=${mode}`)
          .then((r) => r.json())
          .then((data) => {
            setPlaces(data.places || []);
            setLoading(false);
          })
          .catch(() => {
            setError("Error cargando recomendaciones");
            setLoading(false);
          });
      },
      () => {
        setLocationDenied(true);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [mode]);

  if (locationDenied) {
    return (
      <div className="bg-card border border-white/5 rounded-card p-5 text-center">
        <p className="text-2xl mb-2">📍</p>
        <p className="text-[#8899bb] text-sm">Permite el acceso a tu ubicación para ver recomendaciones cerca de ti.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-card border border-white/5 rounded-card p-6 text-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-[#8899bb]">Buscando lugares cerca...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card border border-white/5 rounded-card p-5 text-center">
        <p className="text-[#8899bb] text-sm">{error}</p>
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="bg-card border border-white/5 rounded-card p-5 text-center">
        <p className="text-2xl mb-2">🔍</p>
        <p className="text-[#8899bb] text-sm">No encontramos lugares cerca para este modo. Intenta con otro.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {places.map((place, i) => (
        <a
          key={i}
          href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-vrtx-black/50 border border-white/5 rounded-card px-4 py-3 hover:border-accent/30 transition-colors"
        >
          <span className="text-2xl">{place.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{place.name}</p>
            <p className="text-xs text-muted">
              {place.type}
              {place.tags.address && ` · ${place.tags.address}`}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-accent font-mono text-sm">
              {place.distance < 1000 ? `${place.distance}m` : `${(place.distance / 1000).toFixed(1)}km`}
            </p>
            <p className="text-[10px] text-muted">Maps →</p>
          </div>
        </a>
      ))}
    </div>
  );
}

// ==================== NFC ACTIVATION OVERLAY ====================
function NfcActivation({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="nfc-activation animate-fade-in">
      <div className="flex flex-col items-center gap-6">
        <div className="animate-nfc-pulse">
          <VrtxLogo size={100} animated={false} />
        </div>
        <p className="font-mono text-accent text-sm tracking-[0.3em] animate-pulse">
          CONECTANDO...
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-card border border-white/5 rounded-card p-5 animate-slide-up">
      <h2 className="font-display text-xl text-accent tracking-wide mb-4">{title}</h2>
      {children}
    </section>
  );
}

function StatBox({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="bg-vrtx-black/50 rounded-card p-3 text-center">
      <p className="font-display text-2xl text-accent">{value}</p>
      <p className="font-mono text-xs text-muted mt-1">{label}</p>
    </div>
  );
}

function SocialButton({ icon, label, href }: { icon: string; label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 bg-vrtx-black/50 rounded-card px-4 py-3 hover:border-accent/30 border border-transparent transition-colors"
    >
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-body">{label}</span>
      <span className="ml-auto text-accent text-xs">→</span>
    </a>
  );
}

const socialIcons: Record<string, { icon: string; label: string; prefix: string }> = {
  instagram: { icon: "📸", label: "Instagram", prefix: "" },
  tiktok: { icon: "🎵", label: "TikTok", prefix: "" },
  linkedin: { icon: "💼", label: "LinkedIn", prefix: "" },
  twitter: { icon: "𝕏", label: "X / Twitter", prefix: "" },
  spotify: { icon: "🎧", label: "Spotify", prefix: "" },
  github: { icon: "🐙", label: "GitHub", prefix: "" },
  behance: { icon: "🎨", label: "Behance", prefix: "" },
};

export default function ProfilePage() {
  const params = useParams();
  const chipId = params.chipId as string;

  const { profile } = useAuth();
  const [showActivation, setShowActivation] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [owner, setOwner] = useState<DbUser | null>(null);
  const [chip, setChip] = useState<DbChip | null>(null);
  const [scans, setScans] = useState<DbScan[]>([]);
  const [scanRegistered, setScanRegistered] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!chipId) return;

    fetch(`/api/profile/${chipId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setOwner(data.owner);
          setChip(data.chip);
          setScans(data.scans || []);
          // Check if logged-in user is the chip owner
          if (profile && data.owner && profile.id === data.owner.id) {
            setIsOwner(true);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Error cargando perfil");
        setLoading(false);
      });
  }, [chipId]);

  // Register scan
  useEffect(() => {
    if (!chip || scanRegistered) return;
    setScanRegistered(true);

    // Get approximate location via IP
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((geo) => {
        fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chip_id: chip.chip_id,
            latitude: geo.latitude,
            longitude: geo.longitude,
            city: geo.city,
            country: geo.country_name,
          }),
        });
      })
      .catch(() => {
        // Register scan without location
        fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chip_id: chip.chip_id }),
        });
      });
  }, [chip, scanRegistered]);

  if (showActivation) {
    return <NfcActivation onComplete={() => setShowActivation(false)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060810] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !owner || !chip) {
    return (
      <div className="min-h-screen bg-[#060810] flex flex-col items-center justify-center px-4 text-center">
        <VrtxLogo size={60} animated={false} />
        <h1 className="font-display text-3xl mt-6 text-white">Chip no encontrado</h1>
        <p className="text-[#8899bb] mt-2">Este perfil no existe o no ha sido activado.</p>
        <a href="/" className="mt-6 px-6 py-2 bg-[#00d4ff] text-black font-bold rounded-full text-sm">
          Ir a VRTX
        </a>
      </div>
    );
  }

  const socialLinks = (owner.social_links || {}) as Record<string, string>;
  const tierKey = chip.tier as keyof typeof tiers;
  const tierInfo = tiers[tierKey];
  const themeKey = (owner.theme || "cyber") as keyof typeof themes;

  // Compute stats from scans
  const totalScans = scans.length;
  const cities = [...new Set(scans.filter((s) => s.city).map((s) => s.city))];
  const uniqueCities = cities.length;
  const lastScan = scans[0];

  // Scans by city
  const scansByCity = cities
    .map((city) => ({
      city: city!,
      count: scans.filter((s) => s.city === city).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div data-theme={themeKey} className="min-h-screen bg-vrtx-black pb-8">
      {/* === HEADER === */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--accent)" strokeWidth="0.3" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center pt-12 pb-8 px-4">
          {owner.avatar_url ? (
            <img
              src={owner.avatar_url}
              alt={owner.name}
              className="w-24 h-24 rounded-full border-2 border-accent shadow-accent object-cover"
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full border-2 border-accent flex items-center justify-center text-3xl font-display shadow-accent"
              style={{ background: "rgba(var(--accent-rgb), 0.1)" }}
            >
              {owner.name.charAt(0)}
            </div>
          )}

          <h1 className="font-display text-3xl mt-4 tracking-wide">{owner.name}</h1>
          <p className="font-mono text-accent text-sm">@{owner.handle}</p>

          {owner.bio && (
            <p className="text-muted text-sm text-center mt-2 max-w-xs">{owner.bio}</p>
          )}

          <span
            className="mt-3 px-4 py-1 rounded-pill text-xs font-mono font-bold tracking-wider"
            style={{
              backgroundColor: `${tierInfo.color}20`,
              color: tierInfo.color,
              border: `1px solid ${tierInfo.color}40`,
            }}
          >
            {tierInfo.label}
          </span>

          <p className="font-mono text-xs text-muted mt-2">
            {chip.serial_number} · {chip.colorway}
          </p>
        </div>
      </div>

      {/* === CONTENT === */}
      <div className="max-w-md mx-auto px-4 space-y-4 mt-2">

        {/* STATS */}
        <div className="grid grid-cols-3 gap-3">
          <StatBox value={totalScans} label="Escaneos" />
          <StatBox value={uniqueCities} label="Ciudades" />
          <StatBox value={chip.tier} label="Tier" />
        </div>

        {/* LAST SCAN */}
        {lastScan && (
          <div className="bg-card border border-white/5 rounded-card p-4 flex items-center gap-3">
            <span className="text-accent text-lg">📍</span>
            <div>
              <p className="text-xs text-muted font-mono">Último escaneo</p>
              <p className="text-sm font-body">
                {lastScan.city || "Ubicación desconocida"} ·{" "}
                {new Date(lastScan.scanned_at).toLocaleDateString("es-CO", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        )}

        {/* REDES SOCIALES */}
        {Object.keys(socialLinks).some((k) => socialLinks[k]) && (
          <Section title="REDES">
            <div className="space-y-2">
              {Object.entries(socialLinks).map(([network, url]) => {
                if (!url) return null;
                const info = socialIcons[network];
                if (!info) return null;
                return <SocialButton key={network} icon={info.icon} label={info.label} href={url} />;
              })}
            </div>
          </Section>
        )}

        {/* CONTACTO */}
        <Section title="CONTACTO">
          <div className="space-y-2">
            {owner.phone && (
              <a
                href={`https://wa.me/${owner.phone.replace(/\D/g, "")}`}
                className="flex items-center gap-3 bg-[#25D366]/10 border border-[#25D366]/20 rounded-card px-4 py-3 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
              >
                <span className="text-xl">💬</span>
                <span className="text-sm font-body">WhatsApp</span>
              </a>
            )}
            <a
              href={`mailto:${owner.email}`}
              className="flex items-center gap-3 bg-vrtx-black/50 border border-white/5 rounded-card px-4 py-3 hover:border-accent/30 transition-colors"
            >
              <span className="text-xl">✉️</span>
              <span className="text-sm font-body">{owner.email}</span>
            </a>
          </div>
        </Section>

        {/* SPORT */}
        {(owner.main_sport || owner.sport_level) && (
          <Section title="SPORT">
            <div className="flex items-center gap-2">
              {owner.main_sport && (
                <span className="px-3 py-1 rounded-pill bg-accent/10 border border-accent/20 text-accent text-xs font-mono">
                  {owner.main_sport}
                </span>
              )}
              {owner.sport_level && (
                <span className="px-3 py-1 rounded-pill bg-accent/10 border border-accent/20 text-accent text-xs font-mono">
                  {owner.sport_level}
                </span>
              )}
            </div>
          </Section>
        )}

        {/* FICHA MÉDICA */}
        {(owner.blood_type || owner.emergency_name) && (
          <section className="bg-red-950/30 border border-red-500/30 rounded-card p-5">
            <h2 className="font-display text-xl text-red-400 tracking-wide mb-4 flex items-center gap-2">
              🏥 EMERGENCIA
            </h2>
            <div className="space-y-3">
              {owner.blood_type && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted">Tipo de sangre</span>
                  <span className="text-sm font-bold text-red-400">{owner.blood_type}</span>
                </div>
              )}
              {owner.allergies && owner.allergies.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted">Alergias</span>
                  <span className="text-sm">{owner.allergies.join(", ")}</span>
                </div>
              )}
              {owner.emergency_name && (
                <div className="border-t border-red-500/20 pt-3">
                  <p className="text-xs text-muted font-mono mb-1">CONTACTO DE EMERGENCIA</p>
                  <p className="text-sm">
                    {owner.emergency_name}
                    {owner.emergency_relation && ` (${owner.emergency_relation})`}
                  </p>
                  {owner.emergency_phone && (
                    <a href={`tel:${owner.emergency_phone}`} className="text-red-400 text-sm font-mono">
                      {owner.emergency_phone}
                    </a>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ESCANEOS POR CIUDAD */}
        {scansByCity.length > 0 && (
          <Section title="ESCANEOS POR CIUDAD">
            <div className="space-y-2">
              {scansByCity.map((s) => (
                <div key={s.city} className="flex items-center gap-3">
                  <span className="text-sm flex-1">{s.city}</span>
                  <div className="flex-1 bg-vrtx-black/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${(s.count / Math.max(totalScans, 1)) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-accent w-6 text-right">{s.count}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* VRTX RADAR — only for chip owner */}
        {isOwner && owner && (
          <section className="bg-card border border-accent/20 rounded-card p-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">📡</span>
              <h2 className="font-display text-xl text-accent tracking-wide">VRTX RADAR</h2>
            </div>
            <p className="text-xs text-muted mb-4">
              Recomendaciones cerca de ti · Modo:{" "}
              <span className="text-accent font-semibold">
                {modes[owner.active_mode as keyof typeof modes]?.icon}{" "}
                {modes[owner.active_mode as keyof typeof modes]?.label || owner.active_mode}
              </span>
            </p>
            <VrtxRadar mode={owner.active_mode || "todo"} />
          </section>
        )}

        {/* FOOTER */}
        <div className="text-center py-8">
          <VrtxLogo size={30} animated={false} />
          <p className="font-mono text-xs text-muted mt-3">VRTX · WEAR YOUR VERTEX</p>
          <p className="font-mono text-[10px] text-muted mt-1">
            {chip.serial_number} · {chip.is_authentic ? "✅ Auténtico" : "⚠️ No verificado"}
          </p>
          <a href="/" className="inline-block mt-3 text-xs text-accent hover:underline">
            ¿Quieres tu VRTX? →
          </a>
        </div>
      </div>
    </div>
  );
}
