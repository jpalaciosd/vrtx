"use client";

import { useState, useEffect } from "react";
import VrtxLogo from "@/components/VrtxLogo";
import { mockUser, mockChip, mockStats, mockHeatmap } from "@/data/mock";
import { tiers } from "@/lib/themes";

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

// ==================== SECTION CARD ====================
function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="bg-card border border-white/5 rounded-card p-5 animate-slide-up">
      <h2 className="font-display text-xl text-accent tracking-wide mb-4">{title}</h2>
      {children}
    </section>
  );
}

// ==================== STAT BOX ====================
function StatBox({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="bg-vrtx-black/50 rounded-card p-3 text-center">
      <p className="font-display text-2xl text-accent">{value}</p>
      <p className="font-mono text-xs text-muted mt-1">{label}</p>
    </div>
  );
}

// ==================== SOCIAL BUTTON ====================
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

// ==================== MAIN PROFILE PAGE ====================
export default function ProfilePage() {
  const [showActivation, setShowActivation] = useState(true);
  const user = mockUser;
  const chip = mockChip;
  const stats = mockStats;
  const tierInfo = tiers[chip.tier];

  if (showActivation) {
    return <NfcActivation onComplete={() => setShowActivation(false)} />;
  }

  return (
    <div data-theme={user.theme} className="min-h-screen bg-vrtx-black pb-8">
      {/* === HEADER === */}
      <div className="relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--accent)" strokeWidth="0.3" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center pt-12 pb-8 px-4">
          {/* Avatar */}
          <div
            className="w-24 h-24 rounded-full border-2 border-accent flex items-center justify-center text-3xl font-display shadow-accent"
            style={{ background: "rgba(var(--accent-rgb), 0.1)" }}
          >
            {user.name.charAt(0)}
          </div>

          {/* Name + Handle */}
          <h1 className="font-display text-3xl mt-4 tracking-wide">{user.name}</h1>
          <p className="font-mono text-accent text-sm">{user.handle}</p>

          {/* Bio */}
          <p className="text-muted text-sm text-center mt-2 max-w-xs">{user.bio}</p>

          {/* Tier badge */}
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

          {/* Chip serial */}
          <p className="font-mono text-xs text-muted mt-2">{chip.serialNumber} · {chip.colorway}</p>
        </div>
      </div>

      {/* === CONTENT === */}
      <div className="max-w-md mx-auto px-4 space-y-4 mt-2">

        {/* STATS */}
        <div className="grid grid-cols-3 gap-3">
          <StatBox value={stats.totalScans} label="Escaneos" />
          <StatBox value={stats.uniqueCities} label="Ciudades" />
          <StatBox value={`${stats.streak}d`} label="Racha" />
        </div>

        {/* LAST SCAN */}
        <div className="bg-card border border-white/5 rounded-card p-4 flex items-center gap-3">
          <span className="text-accent text-lg">📍</span>
          <div>
            <p className="text-xs text-muted font-mono">Último escaneo</p>
            <p className="text-sm font-body">
              {stats.lastScan.city} · {new Date(stats.lastScan.scannedAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>

        {/* REDES SOCIALES */}
        <Section title="REDES">
          <div className="space-y-2">
            {user.socialLinks.instagram && <SocialButton icon="📸" label="Instagram" href={user.socialLinks.instagram} />}
            {user.socialLinks.tiktok && <SocialButton icon="🎵" label="TikTok" href={user.socialLinks.tiktok} />}
            {user.socialLinks.linkedin && <SocialButton icon="💼" label="LinkedIn" href={user.socialLinks.linkedin} />}
            {user.socialLinks.twitter && <SocialButton icon="𝕏" label="X / Twitter" href={user.socialLinks.twitter} />}
            {user.socialLinks.spotify && <SocialButton icon="🎧" label="Spotify" href={user.socialLinks.spotify} />}
            {user.socialLinks.github && <SocialButton icon="🐙" label="GitHub" href={user.socialLinks.github} />}
            {user.socialLinks.behance && <SocialButton icon="🎨" label="Behance" href={user.socialLinks.behance} />}
          </div>
        </Section>

        {/* CONTACTO */}
        <Section title="CONTACTO">
          <div className="space-y-2">
            <a
              href={`https://wa.me/${user.phone.replace(/\D/g, "")}`}
              className="flex items-center gap-3 bg-[#25D366]/10 border border-[#25D366]/20 rounded-card px-4 py-3 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
            >
              <span className="text-xl">💬</span>
              <span className="text-sm font-body">WhatsApp</span>
            </a>
            <a
              href={`mailto:${user.email}`}
              className="flex items-center gap-3 bg-vrtx-black/50 border border-white/5 rounded-card px-4 py-3 hover:border-accent/30 transition-colors"
            >
              <span className="text-xl">✉️</span>
              <span className="text-sm font-body">{user.email}</span>
            </a>
            <button className="w-full flex items-center gap-3 bg-accent/10 border border-accent/20 rounded-card px-4 py-3 text-accent hover:bg-accent/20 transition-colors">
              <span className="text-xl">📇</span>
              <span className="text-sm font-body">Descargar contacto (vCard)</span>
            </button>
          </div>
        </Section>

        {/* SPOTIFY NOW PLAYING */}
        <Section title="NOW PLAYING">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-card bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl">
              🎵
            </div>
            <div className="flex-1">
              <p className="font-body text-sm font-semibold">{user.spotifyNowPlaying.track}</p>
              <p className="text-xs text-muted">{user.spotifyNowPlaying.artist} · {user.spotifyNowPlaying.album}</p>
              <div className="spotify-progress mt-2">
                <div
                  className="spotify-progress-bar"
                  style={{ width: `${(user.spotifyNowPlaying.progress / user.spotifyNowPlaying.duration) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* SPORT & BIENESTAR */}
        <Section title="SPORT & BIENESTAR">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-pill bg-accent/10 border border-accent/20 text-accent text-xs font-mono">
              {user.sport.mainSport} · {user.sport.level}
            </span>
            <span className="px-3 py-1 rounded-pill bg-accent/10 border border-accent/20 text-accent text-xs font-mono">
              🔥 {user.sport.streak} días
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-vrtx-black/50 rounded-card p-3 text-center">
              <p className="text-xl">🚶</p>
              <p className="font-display text-lg text-accent">{user.sport.steps.toLocaleString()}</p>
              <p className="text-xs text-muted font-mono">Pasos</p>
            </div>
            <div className="bg-vrtx-black/50 rounded-card p-3 text-center">
              <p className="text-xl">🔥</p>
              <p className="font-display text-lg text-accent">{user.sport.calories}</p>
              <p className="text-xs text-muted font-mono">Calorías</p>
            </div>
            <div className="bg-vrtx-black/50 rounded-card p-3 text-center">
              <p className="text-xl">💧</p>
              <p className="font-display text-lg text-accent">{user.sport.hydration}L</p>
              <p className="text-xs text-muted font-mono">Agua</p>
            </div>
            <div className="bg-vrtx-black/50 rounded-card p-3 text-center">
              <p className="text-xl">😴</p>
              <p className="font-display text-lg text-accent">{user.sport.sleep}h</p>
              <p className="text-xs text-muted font-mono">Sueño</p>
            </div>
          </div>

          {/* Records */}
          <p className="font-mono text-xs text-muted mb-2">RÉCORDS PERSONALES</p>
          <div className="space-y-1">
            {user.sport.records.map((r) => (
              <div key={r.name} className="flex justify-between bg-vrtx-black/50 rounded-card px-3 py-2">
                <span className="text-sm">{r.name}</span>
                <span className="text-sm text-accent font-mono">{r.value}</span>
              </div>
            ))}
          </div>

          {/* Challenge */}
          <div className="mt-4 bg-accent/10 border border-accent/20 rounded-card p-4 text-center">
            <p className="text-xs text-muted font-mono mb-1">RETO ACTIVO</p>
            <p className="text-sm">{user.sport.challenge}</p>
          </div>
        </Section>

        {/* FICHA MÉDICA DE EMERGENCIA */}
        <section className="bg-red-950/30 border border-red-500/30 rounded-card p-5">
          <h2 className="font-display text-xl text-red-400 tracking-wide mb-4 flex items-center gap-2">
            🏥 EMERGENCIA
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted">Tipo de sangre</span>
              <span className="text-sm font-bold text-red-400">{user.bloodType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted">Alergias</span>
              <span className="text-sm">{user.allergies.join(", ")}</span>
            </div>
            <div className="border-t border-red-500/20 pt-3">
              <p className="text-xs text-muted font-mono mb-1">CONTACTO DE EMERGENCIA</p>
              <p className="text-sm">{user.emergencyContact.name} ({user.emergencyContact.relation})</p>
              <a href={`tel:${user.emergencyContact.phone}`} className="text-red-400 text-sm font-mono">
                {user.emergencyContact.phone}
              </a>
            </div>
          </div>
        </section>

        {/* HEATMAP */}
        <Section title="ACTIVIDAD">
          <div className="flex flex-wrap gap-1">
            {mockHeatmap.map((level, i) => (
              <div key={i} className={`heatmap-cell level-${level}`} />
            ))}
          </div>
          <p className="text-xs text-muted font-mono mt-3 text-right">Últimas 7 semanas</p>
        </Section>

        {/* ESCANEOS POR CIUDAD */}
        <Section title="ESCANEOS POR CIUDAD">
          <div className="space-y-2">
            {stats.scansByCity.map((s) => (
              <div key={s.city} className="flex items-center gap-3">
                <span className="text-sm flex-1">{s.city}</span>
                <div className="flex-1 bg-vrtx-black/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${(s.count / stats.totalScans) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-accent w-6 text-right">{s.count}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* PORTFOLIO */}
        <Section title="PORTFOLIO">
          <div className="grid grid-cols-3 gap-2">
            {user.portfolio.map((p) => (
              <a
                key={p.title}
                href={p.link}
                className="bg-vrtx-black/50 border border-white/5 rounded-card p-3 text-center hover:border-accent/30 transition-colors aspect-square flex flex-col items-center justify-center"
              >
                <span className="text-2xl mb-1">
                  {p.category === "Diseño" ? "🎨" : p.category === "Código" ? "💻" : p.category === "Video" ? "🎬" : "🖼️"}
                </span>
                <span className="text-xs font-body line-clamp-2">{p.title}</span>
                <span className="text-[10px] text-muted font-mono mt-1">{p.category}</span>
              </a>
            ))}
          </div>
        </Section>

        {/* TIENDA */}
        <Section title="TIENDA">
          <div className="space-y-3">
            {user.store.map((item) => (
              <div key={item.name} className="bg-vrtx-black/50 border border-white/5 rounded-card p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-card bg-accent/10 flex items-center justify-center text-xl">🛍️</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-muted">{item.description}</p>
                </div>
                <span className="font-mono text-accent text-sm">
                  ${item.price.toLocaleString("es-CO")}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* FOOTER */}
        <div className="text-center py-8">
          <VrtxLogo size={30} animated={false} />
          <p className="font-mono text-xs text-muted mt-3">VRTX · WEAR YOUR VERTEX</p>
          <p className="font-mono text-[10px] text-muted mt-1">
            Chip {chip.serialNumber} · {chip.isAuthentic ? "✅ Auténtico" : "⚠️ No verificado"}
          </p>
        </div>
      </div>
    </div>
  );
}
