"use client";

import { useState } from "react";
import VrtxLogo from "@/components/VrtxLogo";
import { mockUser, mockChip, mockStats, mockScans, mockHeatmap } from "@/data/mock";
import { themes, modes, ThemeName, ModeName } from "@/lib/themes";

type Tab = "perfil" | "analytics" | "sport" | "tienda" | "config";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("perfil");
  const [user, setUser] = useState(mockUser);
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(mockUser.theme);
  const [currentMode, setCurrentMode] = useState<ModeName>(mockUser.activeMode);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "perfil", label: "Perfil", icon: "👤" },
    { id: "analytics", label: "Analytics", icon: "📊" },
    { id: "sport", label: "Sport", icon: "🏋️" },
    { id: "tienda", label: "Tienda", icon: "🛍️" },
    { id: "config", label: "Config", icon: "⚙️" },
  ];

  return (
    <div data-theme={currentTheme} className="min-h-screen bg-vrtx-black text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-vrtx-black/80 backdrop-blur-md border-b border-white/5 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <VrtxLogo size={22} animated={false} />
          <span className="font-display text-lg tracking-wider">VRTX</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-accent">{mockChip.serialNumber}</span>
          <div className="w-8 h-8 rounded-full border border-accent flex items-center justify-center text-sm font-display" style={{ background: "rgba(var(--accent-rgb), 0.1)" }}>
            {user.name.charAt(0)}
          </div>
        </div>
      </header>

      {/* Tab navigation */}
      <nav className="sticky top-14 z-40 bg-vrtx-dark border-b border-white/5 px-2 flex overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-body whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-white"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* ===== PERFIL TAB ===== */}
        {activeTab === "perfil" && (
          <>
            <h2 className="font-display text-2xl text-accent">Editar Perfil</h2>

            <div className="bg-card border border-white/5 rounded-card p-5 space-y-4">
              <div>
                <label className="text-xs text-muted font-mono">NOMBRE</label>
                <input
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full mt-1 bg-vrtx-black border border-white/10 rounded-card px-4 py-2.5 text-white font-body focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-muted font-mono">HANDLE</label>
                <input
                  value={user.handle}
                  onChange={(e) => setUser({ ...user, handle: e.target.value })}
                  className="w-full mt-1 bg-vrtx-black border border-white/10 rounded-card px-4 py-2.5 text-white font-body focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-muted font-mono">BIO (máx 120 chars)</label>
                <textarea
                  value={user.bio}
                  maxLength={120}
                  onChange={(e) => setUser({ ...user, bio: e.target.value })}
                  className="w-full mt-1 bg-vrtx-black border border-white/10 rounded-card px-4 py-2.5 text-white font-body focus:border-accent focus:outline-none resize-none h-20"
                />
                <p className="text-xs text-muted text-right">{user.bio.length}/120</p>
              </div>
              <div>
                <label className="text-xs text-muted font-mono">EMAIL</label>
                <input
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full mt-1 bg-vrtx-black border border-white/10 rounded-card px-4 py-2.5 text-white font-body focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-muted font-mono">WHATSAPP</label>
                <input
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  className="w-full mt-1 bg-vrtx-black border border-white/10 rounded-card px-4 py-2.5 text-white font-body focus:border-accent focus:outline-none"
                />
              </div>

              <button className="w-full py-3 bg-accent text-vrtx-black font-bold rounded-pill hover:opacity-90 transition-opacity">
                Guardar cambios
              </button>
            </div>

            {/* Social links */}
            <div className="bg-card border border-white/5 rounded-card p-5 space-y-3">
              <h3 className="font-display text-lg text-accent">Redes sociales</h3>
              {(["instagram", "tiktok", "linkedin", "twitter", "spotify", "github", "behance"] as const).map((network) => (
                <div key={network}>
                  <label className="text-xs text-muted font-mono uppercase">{network}</label>
                  <input
                    value={(user.socialLinks as Record<string, string>)[network] || ""}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        socialLinks: { ...user.socialLinks, [network]: e.target.value },
                      })
                    }
                    placeholder={`https://${network}.com/...`}
                    className="w-full mt-1 bg-vrtx-black border border-white/10 rounded-card px-4 py-2.5 text-white font-body focus:border-accent focus:outline-none text-sm"
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* ===== ANALYTICS TAB ===== */}
        {activeTab === "analytics" && (
          <>
            <h2 className="font-display text-2xl text-accent">Analytics</h2>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-card border border-white/5 rounded-card p-4 text-center">
                <p className="font-display text-3xl text-accent">{mockStats.totalScans}</p>
                <p className="text-xs text-muted font-mono">Escaneos</p>
              </div>
              <div className="bg-card border border-white/5 rounded-card p-4 text-center">
                <p className="font-display text-3xl text-accent">{mockStats.uniqueCities}</p>
                <p className="text-xs text-muted font-mono">Ciudades</p>
              </div>
              <div className="bg-card border border-white/5 rounded-card p-4 text-center">
                <p className="font-display text-3xl text-accent">{mockStats.streak}</p>
                <p className="text-xs text-muted font-mono">Racha</p>
              </div>
            </div>

            {/* Heatmap */}
            <div className="bg-card border border-white/5 rounded-card p-5">
              <h3 className="font-display text-lg text-accent mb-3">Actividad semanal</h3>
              <div className="flex flex-wrap gap-1">
                {mockHeatmap.map((level, i) => (
                  <div key={i} className={`heatmap-cell level-${level}`} />
                ))}
              </div>
            </div>

            {/* Scans por ciudad */}
            <div className="bg-card border border-white/5 rounded-card p-5">
              <h3 className="font-display text-lg text-accent mb-3">Por ciudad</h3>
              <div className="space-y-3">
                {mockStats.scansByCity.map((s) => (
                  <div key={s.city} className="flex items-center gap-3">
                    <span className="text-sm w-24">{s.city}</span>
                    <div className="flex-1 bg-vrtx-black rounded-full h-3 overflow-hidden">
                      <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(s.count / mockStats.totalScans) * 100}%` }} />
                    </div>
                    <span className="font-mono text-sm text-accent w-8 text-right">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent scans */}
            <div className="bg-card border border-white/5 rounded-card p-5">
              <h3 className="font-display text-lg text-accent mb-3">Últimos escaneos</h3>
              <div className="space-y-2">
                {mockScans.slice(0, 5).map((scan) => (
                  <div key={scan.id} className="flex items-center justify-between bg-vrtx-black/50 rounded-card px-4 py-3">
                    <div>
                      <p className="text-sm">📍 {scan.city}</p>
                      <p className="text-xs text-muted font-mono">
                        {new Date(scan.scannedAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ===== SPORT TAB ===== */}
        {activeTab === "sport" && (
          <>
            <h2 className="font-display text-2xl text-accent">Sport & Bienestar</h2>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🚶", val: user.sport.steps.toLocaleString(), label: "Pasos" },
                { icon: "🔥", val: user.sport.calories.toString(), label: "Calorías" },
                { icon: "💧", val: `${user.sport.hydration}L`, label: "Agua" },
                { icon: "😴", val: `${user.sport.sleep}h`, label: "Sueño" },
              ].map((m) => (
                <div key={m.label} className="bg-card border border-white/5 rounded-card p-4 text-center">
                  <p className="text-2xl">{m.icon}</p>
                  <p className="font-display text-2xl text-accent mt-1">{m.val}</p>
                  <p className="text-xs text-muted font-mono">{m.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-card border border-white/5 rounded-card p-5">
              <h3 className="font-display text-lg text-accent mb-3">Récords personales</h3>
              {user.sport.records.map((r) => (
                <div key={r.name} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                  <span>{r.name}</span>
                  <span className="text-accent font-mono">{r.value}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ===== TIENDA TAB ===== */}
        {activeTab === "tienda" && (
          <>
            <h2 className="font-display text-2xl text-accent">Mi Tienda</h2>
            <div className="space-y-3">
              {user.store.map((item) => (
                <div key={item.name} className="bg-card border border-white/5 rounded-card p-5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-card bg-accent/10 flex items-center justify-center text-2xl">🛍️</div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-muted">{item.description}</p>
                  </div>
                  <span className="font-mono text-accent">${item.price.toLocaleString("es-CO")}</span>
                </div>
              ))}
            </div>
            <button className="w-full py-3 border border-accent/30 text-accent rounded-pill hover:bg-accent/10 transition-colors font-body">
              + Agregar producto
            </button>
          </>
        )}

        {/* ===== CONFIG TAB ===== */}
        {activeTab === "config" && (
          <>
            <h2 className="font-display text-2xl text-accent">Configuración</h2>

            {/* Temas */}
            <div className="bg-card border border-white/5 rounded-card p-5">
              <h3 className="font-display text-lg text-accent mb-3">Tema visual</h3>
              <div className="grid grid-cols-5 gap-2">
                {(Object.keys(themes) as ThemeName[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setCurrentTheme(t)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-card border transition-colors ${
                      currentTheme === t ? "border-accent bg-accent/10" : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: themes[t].accent }} />
                    <span className="text-[10px] font-mono uppercase">{t}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Modos */}
            <div className="bg-card border border-white/5 rounded-card p-5">
              <h3 className="font-display text-lg text-accent mb-3">Modo activo</h3>
              <div className="space-y-2">
                {(Object.keys(modes) as ModeName[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setCurrentMode(m)}
                    className={`w-full flex items-center gap-3 p-3 rounded-card border transition-colors text-left ${
                      currentMode === m ? "border-accent bg-accent/10" : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    <span className="text-xl">{modes[m].icon}</span>
                    <div>
                      <p className="text-sm font-semibold">{modes[m].label}</p>
                      <p className="text-xs text-muted">{modes[m].description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Ficha médica */}
            <div className="bg-red-950/30 border border-red-500/30 rounded-card p-5">
              <h3 className="font-display text-lg text-red-400 mb-3">🏥 Ficha médica de emergencia</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted font-mono">TIPO DE SANGRE</label>
                  <input
                    value={user.bloodType}
                    onChange={(e) => setUser({ ...user, bloodType: e.target.value })}
                    className="w-full mt-1 bg-vrtx-black border border-red-500/20 rounded-card px-4 py-2.5 text-white font-body focus:border-red-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted font-mono">ALERGIAS (separadas por coma)</label>
                  <input
                    value={user.allergies.join(", ")}
                    onChange={(e) => setUser({ ...user, allergies: e.target.value.split(",").map((a) => a.trim()) })}
                    className="w-full mt-1 bg-vrtx-black border border-red-500/20 rounded-card px-4 py-2.5 text-white font-body focus:border-red-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted font-mono">CONTACTO DE EMERGENCIA</label>
                  <input
                    value={user.emergencyContact.name}
                    onChange={(e) => setUser({ ...user, emergencyContact: { ...user.emergencyContact, name: e.target.value } })}
                    placeholder="Nombre"
                    className="w-full mt-1 bg-vrtx-black border border-red-500/20 rounded-card px-4 py-2.5 text-white font-body focus:border-red-400 focus:outline-none"
                  />
                  <input
                    value={user.emergencyContact.phone}
                    onChange={(e) => setUser({ ...user, emergencyContact: { ...user.emergencyContact, phone: e.target.value } })}
                    placeholder="Teléfono"
                    className="w-full mt-2 bg-vrtx-black border border-red-500/20 rounded-card px-4 py-2.5 text-white font-body focus:border-red-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Spotify */}
            <div className="bg-card border border-white/5 rounded-card p-5">
              <h3 className="font-display text-lg text-accent mb-3">🎧 Spotify</h3>
              <button className="w-full py-3 bg-[#1DB954] text-white font-bold rounded-pill hover:opacity-90 transition-opacity">
                Conectar Spotify
              </button>
              <p className="text-xs text-muted text-center mt-2">Muestra tu canción actual en tu perfil</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
