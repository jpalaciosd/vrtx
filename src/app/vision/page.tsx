"use client";
import { useState, useRef } from "react";

interface VrtxProfile {
  name: string;
  handle: string;
  bio: string;
  avatar_url: string;
  theme: string;
  active_mode: string;
  social_links: Record<string, string>;
  main_sport?: string;
  interests: string[];
  privacy: {
    showBio: boolean;
    showSocial: boolean;
    showSport: boolean;
    showInterests: boolean;
  };
}

const THEME_COLORS: Record<string, string> = {
  cyber: "#00d4ff",
  gold: "#ffd700",
  neon: "#39ff14",
  rose: "#ff69b4",
  white: "#ffffff",
};

const MODE_LABELS: Record<string, string> = {
  todo: "🌐 Modo Libre",
  trabajo: "💼 Trabajo",
  deporte: "⚡ Deporte",
  parche: "🎉 Parche",
  negocio: "📊 Negocio",
};

const DEMO_PROFILE: VrtxProfile = {
  name: "Juan Diego",
  handle: "@jdpd",
  bio: "Creador de VRTX. Tech & Innovation 🚀",
  avatar_url: "",
  theme: "cyber",
  active_mode: "parche",
  social_links: { instagram: "jdpalacios", linkedin: "juandiegopalacios" },
  main_sport: "Running",
  interests: ["tech", "coffee", "running", "craft-beer", "music", "travel"],
  privacy: { showBio: true, showSocial: true, showSport: true, showInterests: true },
};

export default function VisionPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<VrtxProfile | null>(null);
  const [scanning, setScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanPhase, setScanPhase] = useState(0); // 0=idle, 1=analyzing, 2=found, 3=not found
  const [scanMessage, setScanMessage] = useState("");

  // Open native camera via file input (works on ALL iOS versions)
  const openCamera = () => {
    fileInputRef.current?.click();
  };

  // Handle captured photo — sends to OpenAI Vision for real detection
  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show captured image
    const url = URL.createObjectURL(file);
    setCapturedImage(url);
    setScanning(true);
    setScanPhase(1); // analyzing

    try {
      // Send to API for real detection
      const formData = new FormData();
      formData.append("frame", file, "capture.jpg");

      const res = await fetch("/api/vision/scan", { method: "POST", body: formData });
      const data = await res.json();

      if (data.detected && data.profile) {
        setScanPhase(2); // found
        await new Promise(r => setTimeout(r, 800));
        setProfile(data.profile);
        if (navigator.vibrate) navigator.vibrate([100, 50, 200]);
      } else if (data.detected && !data.profile) {
        setScanPhase(3); // cap found but no profile
        setScanMessage("Gorra detectada, pero no está registrada en VRTX");
        await new Promise(r => setTimeout(r, 2500));
        setScanPhase(0);
        setScanning(false);
        setCapturedImage(null);
      } else {
        setScanPhase(3); // not found
        setScanMessage(data.message || "No se detectó una gorra en la imagen");
        await new Promise(r => setTimeout(r, 2500));
        setScanPhase(0);
        setScanning(false);
        setCapturedImage(null);
      }
    } catch {
      setScanPhase(3);
      setScanMessage("Error al analizar la imagen. Intenta de nuevo.");
      await new Promise(r => setTimeout(r, 2000));
      setScanPhase(0);
      setScanning(false);
      setCapturedImage(null);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Load demo without camera
  const loadDemo = () => {
    setCapturedImage(null);
    setScanPhase(2);
    setProfile(DEMO_PROFILE);
  };

  // Reset
  const reset = () => {
    setProfile(null);
    setCapturedImage(null);
    setScanPhase(0);
    setScanning(false);
  };

  const themeColor = profile ? THEME_COLORS[profile.theme] || "#00d4ff" : "#00d4ff";

  return (
    <div className="min-h-screen bg-[#060810] text-white relative overflow-hidden">
      {/* Hidden file input — this is the iOS-compatible camera trigger */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
        className="hidden"
      />

      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: profile
            ? `radial-gradient(circle at 50% 30%, ${themeColor}15 0%, transparent 70%)`
            : "radial-gradient(circle at 50% 30%, #00d4ff08 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-cyan-500/50 rounded-lg flex items-center justify-center">
            <span className="text-lg">👁️</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wider" style={{ fontFamily: "monospace" }}>
              VRTX <span style={{ color: themeColor }}>VISION</span>
            </h1>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase">Realidad Aumentada</p>
          </div>
        </div>
        {profile && (
          <button onClick={reset} className="text-xs text-gray-400 border border-gray-700 px-3 py-1.5 rounded-lg">
            ← Volver
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-24">
        {!profile && !scanning ? (
          /* ── Landing state ── */
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-full border-2 border-cyan-500/30 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border border-cyan-500/20 flex items-center justify-center">
                  <span className="text-5xl">👁️</span>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full animate-ping opacity-10 border-2 border-cyan-400" />
            </div>

            <h2 className="text-2xl font-bold mb-3">
              Escanea gorras <span style={{ color: themeColor }}>VRTX</span>
            </h2>
            <p className="text-gray-400 text-sm max-w-xs mb-8 leading-relaxed">
              Toma una foto de cualquier gorra VRTX y descubre el perfil de quien la usa.
              Solo verás lo que el usuario haya autorizado.
            </p>

            <button
              onClick={openCamera}
              className="px-8 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${themeColor}, ${themeColor}88)`,
                boxShadow: `0 0 30px ${themeColor}40`,
              }}
            >
              📸 Escanear Gorra
            </button>

            <button
              onClick={loadDemo}
              className="mt-4 text-xs text-gray-500 hover:text-gray-300 transition underline"
            >
              Ver demo sin cámara
            </button>

            <div className="mt-12 grid grid-cols-3 gap-6 text-center">
              {[
                { icon: "🧢", label: "Reconoce gorras" },
                { icon: "🔒", label: "Privacidad total" },
                { icon: "⚡", label: "Instantáneo" },
              ].map((f) => (
                <div key={f.label}>
                  <span className="text-2xl">{f.icon}</span>
                  <p className="text-[10px] text-gray-500 mt-1">{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        ) : scanning ? (
          /* ── Scanning/analyzing state ── */
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            {/* Show captured image with scan overlay */}
            {capturedImage && (
              <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border-2 border-cyan-500/30 mb-6">
                <img src={capturedImage} alt="Captured" className="w-full rounded-2xl" />
                
                {/* Scan overlay */}
                <div className="absolute inset-0">
                  {/* Corner markers */}
                  <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-cyan-400 rounded-tl-lg" />
                  <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-cyan-400 rounded-tr-lg" />
                  <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-cyan-400 rounded-bl-lg" />
                  <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-cyan-400 rounded-br-lg" />

                  {/* Scanning line */}
                  <div className="absolute inset-x-3 top-0 h-full overflow-hidden">
                    <div
                      className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                      style={{
                        animation: "scanline 1.5s ease-in-out infinite",
                      }}
                    />
                  </div>

                  {/* Status */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${scanPhase === 2 ? "bg-green-400" : scanPhase === 3 ? "bg-red-400" : "bg-cyan-400"}`} />
                      <span className={`text-xs font-mono tracking-wider ${scanPhase === 2 ? "text-green-300" : scanPhase === 3 ? "text-red-300" : "text-cyan-300"}`}>
                        {scanPhase === 1 ? "ANALIZANDO CON IA..." : scanPhase === 2 ? "¡PERFIL DETECTADO!" : scanPhase === 3 ? (scanMessage || "NO DETECTADO") : "PROCESANDO..."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!capturedImage && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-2 border-cyan-500/30 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
                </div>
                <p className="text-sm text-cyan-300 font-mono">Procesando...</p>
              </div>
            )}
          </div>
        ) : profile ? (
          /* ── Profile detected ── */
          <div className="flex flex-col items-center">
            {/* Captured image (small) */}
            {capturedImage && (
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 mb-4" style={{ borderColor: `${themeColor}50` }}>
                <img src={capturedImage} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <span className="text-green-400 text-2xl">✓</span>
                </div>
              </div>
            )}

            {/* AR Profile Card */}
            <div
              className="w-full max-w-md rounded-3xl p-6 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${themeColor}15, #0a0e18, ${themeColor}08)`,
                border: `1px solid ${themeColor}30`,
                boxShadow: `0 0 40px ${themeColor}15, inset 0 1px 0 ${themeColor}20`,
                animation: "fadeSlideUp 0.5s ease-out",
              }}
            >
              {/* Detected badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full"
                style={{ background: `${themeColor}20`, border: `1px solid ${themeColor}40` }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: themeColor }} />
                <span className="text-[10px] font-mono tracking-wider" style={{ color: themeColor }}>
                  DETECTADO
                </span>
              </div>

              {/* Profile header */}
              <div className="flex items-center gap-4 mb-6 mt-2">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
                  style={{ background: `${themeColor}20`, border: `1px solid ${themeColor}30` }}
                >
                  <span style={{ color: themeColor }}>{profile.name[0]}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{profile.name}</h3>
                  <p className="text-sm" style={{ color: `${themeColor}aa` }}>{profile.handle}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block"
                    style={{ background: `${themeColor}15`, color: themeColor, border: `1px solid ${themeColor}30` }}>
                    {MODE_LABELS[profile.active_mode] || profile.active_mode}
                  </span>
                </div>
              </div>

              {/* Bio */}
              {profile.privacy.showBio && profile.bio && (
                <div className="mb-5 px-4 py-3 rounded-xl" style={{ background: `${themeColor}08` }}>
                  <p className="text-sm text-gray-300 leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {/* Sport */}
              {profile.privacy.showSport && profile.main_sport && (
                <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: `${themeColor}08` }}>
                  <span className="text-xl">⚡</span>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Deporte</p>
                    <p className="text-sm font-semibold" style={{ color: themeColor }}>{profile.main_sport}</p>
                  </div>
                </div>
              )}

              {/* Interests */}
              {profile.privacy.showInterests && profile.interests.length > 0 && (
                <div className="mb-5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 px-1">Intereses</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.interests.slice(0, 8).map((i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-full"
                        style={{ background: `${themeColor}12`, color: `${themeColor}cc`, border: `1px solid ${themeColor}20` }}>
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social links */}
              {profile.privacy.showSocial && Object.keys(profile.social_links).length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 px-1">Conectar</p>
                  <div className="flex gap-2">
                    {Object.entries(profile.social_links).map(([platform, username]) => (
                      <a key={platform}
                        href={
                          platform === "instagram" ? `https://instagram.com/${username}` :
                          platform === "linkedin" ? `https://linkedin.com/in/${username}` :
                          platform === "twitter" ? `https://twitter.com/${username}` : "#"
                        }
                        target="_blank" rel="noopener"
                        className="px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95"
                        style={{ background: `${themeColor}15`, color: themeColor, border: `1px solid ${themeColor}25` }}>
                        {platform === "instagram" ? "📷" : platform === "linkedin" ? "💼" : "🔗"} {platform}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* VRTX branding */}
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-600 font-mono">POWERED BY</span>
                  <span className="text-xs font-bold tracking-widest" style={{ color: themeColor }}>VRTX</span>
                </div>
                <span className="text-[10px] text-gray-600 font-mono">🔒 Verificado</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button onClick={openCamera}
                className="px-5 py-3 rounded-xl text-sm font-semibold border border-gray-700 text-gray-300 active:scale-95 transition">
                📸 Escanear otro
              </button>
              <button onClick={() => {
                  if (navigator.share) navigator.share({ title: `${profile.name} en VRTX`, url: window.location.href });
                }}
                className="px-5 py-3 rounded-xl text-sm font-semibold transition active:scale-95"
                style={{ background: `${themeColor}20`, color: themeColor, border: `1px solid ${themeColor}30` }}>
                📤 Compartir
              </button>
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      {!profile && !scanning && (
        <div className="fixed bottom-0 inset-x-0 bg-gradient-to-t from-[#060810] to-transparent p-6 text-center">
          <p className="text-[10px] text-gray-600 font-mono tracking-wider">VRTX VISION v1.0</p>
        </div>
      )}

      {/* CSS animations */}
      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(400px); opacity: 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
