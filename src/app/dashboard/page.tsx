"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VrtxLogo from "@/components/VrtxLogo";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase-browser";
import { themes, modes, ThemeName, ModeName } from "@/lib/themes";
import { preferenceCategories } from "@/lib/preferences";

type Tab = "radar" | "perfil" | "disenos" | "analytics" | "sport" | "tienda" | "config";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const initialTab = (searchParams.get('tab') as Tab) || "radar";
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
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
    interests: [] as string[],
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
        interests: profile.interests || [],
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

  const [designs, setDesigns] = useState<Array<{ id: string; name: string; image_url: string; estilo: string; created_at: string }>>([]);
  const [chip, setChip] = useState<{ chip_id: string; serial_number: string; tier: string; colorway: string } | null>(null);
  const [scans, setScans] = useState<Array<{ id: string; city: string | null; country: string | null; scanned_at: string }>>([]);

  // Load user designs
  useEffect(() => {
    if (profile) {
      supabase
        .from('designs')
        .select('id, name, image_url, estilo, created_at')
        .eq('owner_id', profile.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => { if (data) setDesigns(data); });
    }
  }, [profile, activeTab]);

  // Load chip + scans
  useEffect(() => {
    if (profile) {
      supabase
        .from('chips')
        .select('chip_id, serial_number, tier, colorway')
        .eq('owner_id', profile.id)
        .limit(1)
        .maybeSingle()
        .then(({ data: c }) => {
          if (c) {
            setChip(c);
            supabase
              .from('scans')
              .select('id, city, country, scanned_at')
              .eq('chip_id', c.chip_id)
              .order('scanned_at', { ascending: false })
              .limit(200)
              .then(({ data: s }) => { if (s) setScans(s); });
          }
        });
    }
  }, [profile]);

  const [radarPlaces, setRadarPlaces] = useState<Array<{ name: string; type: string; icon: string; distance: number; lat: number; lng: number; tags: Record<string, string>; cuisine?: string; score?: number }>>([]);
  const [radarLoading, setRadarLoading] = useState(false);
  const [radarError, setRadarError] = useState("");
  const [radarPersonalized, setRadarPersonalized] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [radarLoadedMode, setRadarLoadedMode] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Get GPS once
  useEffect(() => {
    if (userCoords || locationDenied) return;
    if (!navigator.geolocation) {
      setRadarError("Tu navegador no soporta geolocalización");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocationDenied(true),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [userCoords, locationDenied]);

  // Load radar when tab active + coords available + mode changed
  useEffect(() => {
    if (activeTab !== "radar" || !userCoords || !profile) return;
    if (radarLoadedMode === currentMode) return; // already loaded for this mode

    setRadarLoading(true);
    setRadarError("");
    fetch(`/api/radar?lat=${userCoords.lat}&lng=${userCoords.lng}&mode=${currentMode}&userId=${profile.id}`)
      .then((r) => r.json())
      .then((data) => {
        setRadarPlaces(data.places || []);
        setRadarPersonalized(data.personalized || false);
        setRadarLoading(false);
        setRadarLoadedMode(currentMode);
      })
      .catch(() => {
        setRadarError("Error cargando recomendaciones");
        setRadarLoading(false);
      });
  }, [activeTab, userCoords, profile, currentMode, radarLoadedMode]);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "radar", label: "Radar", icon: "📡" },
    { id: "perfil", label: "Perfil", icon: "👤" },
    { id: "disenos", label: "Diseños", icon: "🎨" },
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

        {/* ===== RADAR TAB ===== */}
        {activeTab === "radar" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl text-accent flex items-center gap-2">
                  📡 VRTX Radar
                </h2>
                <p className="text-xs text-muted mt-1">
                  Lugares cerca de ti · Modo:{" "}
                  <span className="text-accent font-semibold">
                    {(modes[currentMode] as any)?.icon} {(modes[currentMode] as any)?.label}
                  </span>
                </p>
              </div>
            </div>

            {/* Mode quick switch */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {(Object.keys(modes) as ModeName[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setCurrentMode(m);
                    saveProfile({ active_mode: m });
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-pill text-xs font-medium whitespace-nowrap transition-all ${
                    currentMode === m
                      ? "bg-accent text-vrtx-black font-bold"
                      : "bg-white/5 text-muted hover:bg-white/10"
                  }`}
                >
                  <span>{modes[m].icon}</span>
                  {modes[m].label}
                </button>
              ))}
            </div>

            {/* Radar results */}
            {radarLoading && (
              <div className="bg-card border border-white/5 rounded-card p-8 text-center">
                <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-muted">Buscando lugares cerca...</p>
                <p className="text-xs text-muted/50 mt-1">Esto puede tomar unos segundos</p>
              </div>
            )}

            {locationDenied && (
              <div className="bg-card border border-white/5 rounded-card p-8 text-center">
                <p className="text-3xl mb-3">📍</p>
                <p className="text-[#8899bb]">Permite el acceso a tu ubicación para ver recomendaciones.</p>
                <button
                  onClick={() => {
                    setLocationDenied(false);
                    setRadarLoaded(false);
                  }}
                  className="mt-4 px-5 py-2 bg-accent text-vrtx-black font-bold text-sm rounded-pill"
                >
                  Reintentar
                </button>
              </div>
            )}

            {radarError && (
              <div className="bg-card border border-white/5 rounded-card p-6 text-center">
                <p className="text-red-400 text-sm">{radarError}</p>
              </div>
            )}

            {!radarLoading && !locationDenied && !radarError && radarPlaces.length === 0 && radarLoadedMode && (
              <div className="bg-card border border-white/5 rounded-card p-8 text-center">
                <p className="text-3xl mb-3">🔍</p>
                <p className="text-[#8899bb]">No encontramos lugares cerca para el modo <span className="text-accent">{(modes[currentMode] as any)?.label}</span>.</p>
                <p className="text-xs text-muted mt-2">Prueba cambiando de modo.</p>
              </div>
            )}

            {radarPlaces.length > 0 && (
              <>
                {radarPersonalized ? (
                  <div className="flex items-center gap-2 px-3 py-2 bg-accent/10 border border-accent/20 rounded-pill">
                    <span className="text-xs">🎯</span>
                    <span className="text-xs text-accent font-medium">Personalizado según tus gustos</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-pill">
                    <span className="text-xs">💡</span>
                    <span className="text-xs text-muted">
                      Configura tus gustos en <button onClick={() => setActiveTab("config")} className="text-accent underline">Config → Mis Gustos</button> para resultados personalizados
                    </span>
                  </div>
                )}
                <div className="space-y-2">
                  {radarPlaces.map((place, i) => (
                    <a
                      key={i}
                      href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 bg-card border rounded-card px-4 py-3 hover:border-accent/30 transition-colors ${
                        place.score && place.score > 0 ? "border-accent/20" : "border-white/5"
                      }`}
                    >
                      <span className="text-2xl">{place.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold truncate">{place.name}</p>
                          {place.score && place.score > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-accent/20 text-accent rounded-pill font-mono">MATCH</span>
                          )}
                        </div>
                        <p className="text-xs text-muted">
                          {place.cuisine || place.type}
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
              </>
            )}
          </>
        )}

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

        {/* ===== DISEÑOS TAB ===== */}
        {activeTab === "disenos" && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-accent">Mis Diseños</h2>
              <a
                href="/disenar"
                className="px-4 py-2 bg-accent text-vrtx-black font-bold text-sm rounded-pill hover:opacity-90 transition-opacity"
              >
                + Crear diseño
              </a>
            </div>

            {designs.length === 0 ? (
              <div className="bg-card border border-white/5 rounded-card p-8 text-center">
                <p className="text-4xl mb-3">🎨</p>
                <p className="text-[#8899bb]">Aún no tienes diseños.</p>
                <a
                  href="/disenar"
                  className="inline-block mt-4 px-6 py-2 bg-accent text-vrtx-black font-bold text-sm rounded-pill hover:opacity-90 transition-opacity"
                >
                  Crear mi primer diseño
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {designs.map((d) => (
                  <div key={d.id} className="bg-card border border-white/5 rounded-card overflow-hidden relative group">
                    <img src={d.image_url} alt={d.name || 'Diseño VRTX'} className="w-full aspect-square object-cover" />
                    <button
                      onClick={async () => {
                        if (!confirm('¿Eliminar este diseño?')) return;
                        await fetch(`/api/designs/${d.id}`, { method: 'DELETE' });
                        setDesigns(designs.filter((x) => x.id !== d.id));
                      }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-red-400 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                    >
                      ✕
                    </button>
                    <div className="p-3">
                      <p className="text-sm font-semibold truncate">{d.name || 'Sin nombre'}</p>
                      <p className="text-xs text-muted font-mono mt-1">
                        {d.estilo?.toUpperCase()} · {new Date(d.created_at).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ===== ANALYTICS TAB ===== */}
        {activeTab === "analytics" && (
          <>
            <h2 className="font-display text-2xl text-accent">Analytics</h2>

            {!chip ? (
              <div className="bg-card border border-white/5 rounded-card p-8 text-center">
                <p className="text-4xl mb-3">📊</p>
                <p className="text-[#8899bb]">No tienes un chip VRTX vinculado aún.</p>
              </div>
            ) : (
              <>
                {/* Chip info */}
                <div className="bg-card border border-white/5 rounded-card p-4 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs text-muted">TU CHIP</p>
                    <p className="text-sm font-semibold">{chip.serial_number}</p>
                  </div>
                  <span className="px-3 py-1 rounded-pill bg-accent/10 text-accent text-xs font-mono font-bold">
                    {chip.tier}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-card border border-white/5 rounded-card p-4 text-center">
                    <p className="font-display text-3xl text-accent">{scans.length}</p>
                    <p className="text-xs text-muted font-mono">Escaneos</p>
                  </div>
                  <div className="bg-card border border-white/5 rounded-card p-4 text-center">
                    <p className="font-display text-3xl text-accent">
                      {[...new Set(scans.filter(s => s.city).map(s => s.city))].length}
                    </p>
                    <p className="text-xs text-muted font-mono">Ciudades</p>
                  </div>
                  <div className="bg-card border border-white/5 rounded-card p-4 text-center">
                    <p className="font-display text-3xl text-accent">
                      {[...new Set(scans.filter(s => s.country).map(s => s.country))].length}
                    </p>
                    <p className="text-xs text-muted font-mono">Países</p>
                  </div>
                </div>

                {/* Profile link + QR */}
                <div className="bg-card border border-white/5 rounded-card p-4">
                  <p className="font-mono text-xs text-muted mb-2">TU PERFIL NFC</p>
                  <a
                    href={`/p/${chip.chip_id}`}
                    target="_blank"
                    className="text-accent text-sm hover:underline break-all"
                  >
                    vrtx-seven.vercel.app/p/{chip.chip_id}
                  </a>
                </div>

                {/* Scans by city */}
                {scans.some(s => s.city) && (
                  <div className="bg-card border border-white/5 rounded-card p-5">
                    <h3 className="font-display text-lg text-accent mb-3">Por ciudad</h3>
                    <div className="space-y-3">
                      {(() => {
                        const cities = scans.filter(s => s.city).reduce((acc, s) => {
                          acc[s.city!] = (acc[s.city!] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>);
                        const sorted = Object.entries(cities).sort((a, b) => b[1] - a[1]);
                        const max = sorted[0]?.[1] || 1;
                        return sorted.map(([city, count]) => (
                          <div key={city} className="flex items-center gap-3">
                            <span className="text-sm w-28 truncate">{city}</span>
                            <div className="flex-1 bg-vrtx-black rounded-full h-3 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-accent transition-all"
                                style={{ width: `${(count / max) * 100}%` }}
                              />
                            </div>
                            <span className="font-mono text-sm text-accent w-8 text-right">{count}</span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                )}

                {/* Recent scans */}
                <div className="bg-card border border-white/5 rounded-card p-5">
                  <h3 className="font-display text-lg text-accent mb-3">Últimos escaneos</h3>
                  {scans.length === 0 ? (
                    <p className="text-[#8899bb] text-sm text-center py-4">Aún no hay escaneos. ¡Comparte tu QR!</p>
                  ) : (
                    <div className="space-y-2">
                      {scans.slice(0, 10).map((scan) => (
                        <div key={scan.id} className="flex items-center justify-between bg-vrtx-black/50 rounded-card px-4 py-3">
                          <div>
                            <p className="text-sm">📍 {scan.city || "Ubicación desconocida"}</p>
                            <p className="text-xs text-muted font-mono">
                              {new Date(scan.scanned_at).toLocaleDateString("es-CO", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          {scan.country && (
                            <span className="text-xs text-muted">{scan.country}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
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

            {/* Mis Gustos */}
            <div className="bg-card border border-white/5 rounded-card p-5">
              <h3 className="font-display text-lg text-accent mb-1">🎯 Mis Gustos</h3>
              <p className="text-xs text-muted mb-4">Define tus preferencias para que el Radar te recomiende lugares personalizados.</p>
              
              {preferenceCategories.map((cat) => (
                <div key={cat.id} className="mb-4">
                  <p className="text-xs text-muted font-mono uppercase mb-2">
                    {cat.icon} {cat.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cat.options.map((opt) => {
                      const selected = (form.interests || []).includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            const current = form.interests || [];
                            const updated = selected
                              ? current.filter((i: string) => i !== opt.id)
                              : [...current, opt.id];
                            setForm({ ...form, interests: updated });
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs transition-all ${
                            selected
                              ? "bg-accent text-vrtx-black font-bold"
                              : "bg-white/5 text-muted hover:bg-white/10"
                          }`}
                        >
                          <span>{opt.icon}</span>
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <button
                onClick={() => saveProfile({ interests: form.interests })}
                disabled={saving}
                className="w-full py-3 bg-accent text-vrtx-black font-bold rounded-pill hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
              >
                {saving ? "Guardando..." : "Guardar gustos"}
              </button>
              {saveMsg && <p className="text-center text-sm text-accent mt-2">{saveMsg}</p>}
            </div>

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

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#060810] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
