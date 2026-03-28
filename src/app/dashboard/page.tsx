"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import VrtxLogo from "@/components/VrtxLogo";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase-browser";
import { themes, modes, ThemeName, ModeName } from "@/lib/themes";

type Tab = "perfil" | "analytics" | "sport" | "tienda" | "config";

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("perfil");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Local editable state
  const [form, setForm] = useState({
    name: "",
    handle: "",
    bio: "",
    email: "",
    phone: "",
    social_links: {} as Record<string, string>,
    blood_type: "",
    allergies: [] as string[],
    emergency_name: "",
    emergency_phone: "",
    emergency_relation: "",
    main_sport: "",
    sport_level: "",
  });

  const [currentTheme, setCurrentTheme] = useState<ThemeName>("cyber");
  const [currentMode, setCurrentMode] = useState<ModeName>("todo");

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  // Load profile into form
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        handle: profile.handle || "",
        bio: profile.bio || "",
        email: profile.email || "",
        phone: profile.phone || "",
        social_links: (profile.social_links as Record<string, string>) || {},
        blood_type: profile.blood_type || "",
        allergies: profile.allergies || [],
        emergency_name: profile.emergency_name || "",
        emergency_phone: profile.emergency_phone || "",
        emergency_relation: profile.emergency_relation || "",
        main_sport: profile.main_sport || "",
        sport_level: profile.sport_level || "",
      });
      setCurrentTheme((profile.theme as ThemeName) || "cyber");
      setCurrentMode((profile.active_mode as ModeName) || "todo");
    }
  }, [profile]);

  const saveProfile = async (extra?: Record<string, unknown>) => {
    if (!profile) return;
    setSaving(true);
    setSaveMsg("");
    const { error } = await supabase
      .from("users")
      .update({ ...form, ...extra, updated_at: new Date().toISOString() })
      .eq("id", profile.id);
    setSaving(false);
    if (error) {
      setSaveMsg("Error al guardar");
    } else {
      setSaveMsg("✓ Guardado");
      await refreshProfile();
      setTimeout(() => setSaveMsg(""), 2000);
    }
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "perfil", label: "Perfil", icon: "👤" },
    { id: "analytics", label: "Analytics", icon: "📊" },
    { id: "sport", label: "Sport", icon: "🏋️" },
    { id: "tienda", label: "Tienda", icon: "🛍️" },
    { id: "config", label: "Config", icon: "⚙️" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060810] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#8899bb] text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) return null;

  return (
    <div data-theme={currentTheme} className="min-h-screen bg-vrtx-black text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-vrtx-black/80 backdrop-blur-md border-b border-white/5 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <VrtxLogo size={22} animated={false} />
          <span className="font-display text-lg tracking-wider">VRTX</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-accent hidden sm:inline">@{profile.handle}</span>
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full border border-accent" />
          ) : (
            <div className="w-8 h-8 rounded-full border border-accent flex items-center justify-center text-sm font-display" style={{ background: "rgba(var(--accent-rgb), 0.1)" }}>
              {profile.name.charAt(0)}
            </div>
          )}
          <button onClick={signOut} className="text-xs text-[#8899bb] hover:text-white transition-colors">
            Salir
          </button>
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
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full mt-1 bg-vrtx-black border border-white/10 rounded-card px-4 py-2.5 text-white font-body focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-muted font-mono">HANDLE</label>
                <input
                  value={form.handle}
                  onChange={(e) => setForm({ ...form, handle: e.target.value })}
                  className="w-full mt-1 bg-vrtx-black border border-white/10 rounded-card px-4 py-2.5 text-white font-body focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-muted font-mono">BIO (máx 120 chars)</label>
                <textarea
                  value={form.bio}
                  maxLength={120}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full mt-1 bg-vrtx-black border border-white/10 rounded-card px-4 py-2.5 text-white font-body focus:border-accent focus:outline-none resize-none h-20"
                />
                <p className="text-xs text-muted text-right">{form.bio.length}/120</p>
              </div>
              <div>
                <label className="text-xs text-muted font-mono">EMAIL</label>
                <input
                  value={form.email}
                  disabled
                  className="w-full mt-1 bg-vrtx-black border border-white/10 rounded-card px-4 py-2.5 text-[#8899bb]/50 font-body cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-xs text-muted font-mono">WHATSAPP</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full mt-1 bg-vrtx-black border border-white/10 rounded-card px-4 py-2.5 text-white font-body focus:border-accent focus:outline-none"
                />
              </div>

              <button
                onClick={() => saveProfile()}
                disabled={saving}
                className="w-full py-3 bg-accent text-vrtx-black font-bold rounded-pill hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
              {saveMsg && <p className="text-center text-sm text-accent">{saveMsg}</p>}
            </div>

            {/* Social links */}
            <div className="bg-card border border-white/5 rounded-card p-5 space-y-3">
              <h3 className="font-display text-lg text-accent">Redes sociales</h3>
              {["instagram", "tiktok", "linkedin", "twitter", "spotify", "github", "behance"].map((network) => (
                <div key={network}>
                  <label className="text-xs text-muted font-mono uppercase">{network}</label>
                  <input
                    value={form.social_links[network] || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        social_links: { ...form.social_links, [network]: e.target.value },
                      })
                    }
                    placeholder={`https://${network}.com/...`}
                    className="w-full mt-1 bg-vrtx-black border border-white/10 rounded-card px-4 py-2.5 text-white font-body focus:border-accent focus:outline-none text-sm"
                  />
                </div>
              ))}
              <button
                onClick={() => saveProfile()}
                disabled={saving}
                className="w-full py-3 bg-accent text-vrtx-black font-bold rounded-pill hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar redes"}
              </button>
              {saveMsg && <p className="text-center text-sm text-accent">{saveMsg}</p>}
            </div>
          </>
        )}

        {/* ===== ANALYTICS TAB ===== */}
        {activeTab === "analytics" && (
          <>
            <h2 className="font-display text-2xl text-accent">Analytics</h2>
            <div className="bg-card border border-white/5 rounded-card p-8 text-center">
              <p className="text-4xl mb-3">📊</p>
              <p className="text-[#8899bb]">Las estadísticas se activarán cuando tu chip NFC esté vinculado.</p>
              <p className="text-xs text-[#8899bb]/50 mt-2">Cada escaneo de tu gorra aparecerá aquí con ubicación y hora.</p>
            </div>
          </>
        )}

        {/* ===== SPORT TAB ===== */}
        {activeTab === "sport" && (
          <>
            <h2 className="font-display text-2xl text-accent">Sport & Bienestar</h2>
            <div className="bg-card border border-white/5 rounded-card p-5 space-y-4">
              <div>
                <label className="text-xs text-muted font-mono">DEPORTE PRINCIPAL</label>
                <input
                  value={form.main_sport}
                  onChange={(e) => setForm({ ...form, main_sport: e.target.value })}
                  placeholder="Ej: Running, CrossFit, Fútbol..."
                  className="w-full mt-1 bg-vrtx-black border border-white/10 rounded-card px-4 py-2.5 text-white font-body focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-muted font-mono">NIVEL</label>
                <select
                  value={form.sport_level}
                  onChange={(e) => setForm({ ...form, sport_level: e.target.value })}
                  className="w-full mt-1 bg-vrtx-black border border-white/10 rounded-card px-4 py-2.5 text-white font-body focus:border-accent focus:outline-none"
                >
                  <option value="">Seleccionar</option>
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                  <option value="Profesional">Profesional</option>
                </select>
              </div>
              <button
                onClick={() => saveProfile()}
                disabled={saving}
                className="w-full py-3 bg-accent text-vrtx-black font-bold rounded-pill hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
              {saveMsg && <p className="text-center text-sm text-accent">{saveMsg}</p>}
            </div>
            <div className="bg-card border border-white/5 rounded-card p-8 text-center">
              <p className="text-4xl mb-3">🏋️</p>
              <p className="text-[#8899bb]">Métricas de salud próximamente.</p>
              <p className="text-xs text-[#8899bb]/50 mt-2">Integración con wearables en desarrollo.</p>
            </div>
          </>
        )}

        {/* ===== TIENDA TAB ===== */}
        {activeTab === "tienda" && (
          <>
            <h2 className="font-display text-2xl text-accent">Mi Tienda</h2>
            <div className="bg-card border border-white/5 rounded-card p-8 text-center">
              <p className="text-4xl mb-3">🛍️</p>
              <p className="text-[#8899bb]">Tu tienda personal se habilitará con tu gorra VRTX.</p>
              <p className="text-xs text-[#8899bb]/50 mt-2">Podrás vender productos y servicios desde tu perfil NFC.</p>
            </div>
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
                    onClick={() => {
                      setCurrentTheme(t);
                      saveProfile({ theme: t });
                    }}
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
                    onClick={() => {
                      setCurrentMode(m);
                      saveProfile({ active_mode: m });
                    }}
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
                    value={form.blood_type}
                    onChange={(e) => setForm({ ...form, blood_type: e.target.value })}
                    className="w-full mt-1 bg-vrtx-black border border-red-500/20 rounded-card px-4 py-2.5 text-white font-body focus:border-red-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted font-mono">ALERGIAS (separadas por coma)</label>
                  <input
                    value={form.allergies.join(", ")}
                    onChange={(e) => setForm({ ...form, allergies: e.target.value.split(",").map((a) => a.trim()).filter(Boolean) })}
                    className="w-full mt-1 bg-vrtx-black border border-red-500/20 rounded-card px-4 py-2.5 text-white font-body focus:border-red-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted font-mono">CONTACTO DE EMERGENCIA — NOMBRE</label>
                  <input
                    value={form.emergency_name}
                    onChange={(e) => setForm({ ...form, emergency_name: e.target.value })}
                    className="w-full mt-1 bg-vrtx-black border border-red-500/20 rounded-card px-4 py-2.5 text-white font-body focus:border-red-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted font-mono">TELÉFONO DE EMERGENCIA</label>
                  <input
                    value={form.emergency_phone}
                    onChange={(e) => setForm({ ...form, emergency_phone: e.target.value })}
                    className="w-full mt-1 bg-vrtx-black border border-red-500/20 rounded-card px-4 py-2.5 text-white font-body focus:border-red-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted font-mono">RELACIÓN</label>
                  <input
                    value={form.emergency_relation}
                    onChange={(e) => setForm({ ...form, emergency_relation: e.target.value })}
                    placeholder="Ej: Madre, Padre, Pareja..."
                    className="w-full mt-1 bg-vrtx-black border border-red-500/20 rounded-card px-4 py-2.5 text-white font-body focus:border-red-400 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => saveProfile()}
                  disabled={saving}
                  className="w-full py-3 bg-red-500/80 text-white font-bold rounded-pill hover:bg-red-500 transition-colors disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Guardar ficha médica"}
                </button>
                {saveMsg && <p className="text-center text-sm text-red-400">{saveMsg}</p>}
              </div>
            </div>

            {/* Spotify */}
            <div className="bg-card border border-white/5 rounded-card p-5">
              <h3 className="font-display text-lg text-accent mb-3">🎧 Spotify</h3>
              <button disabled className="w-full py-3 bg-[#1DB954]/50 text-white/50 font-bold rounded-pill cursor-not-allowed">
                Conectar Spotify (próximamente)
              </button>
              <p className="text-xs text-muted text-center mt-2">Muestra tu canción actual en tu perfil</p>
            </div>

            {/* Cerrar sesión */}
            <button
              onClick={signOut}
              className="w-full py-3 border border-red-500/30 text-red-400 rounded-pill hover:bg-red-500/10 transition-colors"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </main>
    </div>
  );
}
