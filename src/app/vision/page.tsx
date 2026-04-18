"use client";
import { useState, useRef, useEffect, useCallback } from "react";

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

export default function VisionPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(false);
  const [profile, setProfile] = useState<VrtxProfile | null>(null);
  const [error, setError] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const [scanPulse, setScanPulse] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start camera (iOS compatible)
  const startCamera = useCallback(async () => {
    try {
      setError("");
      
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Tu navegador no soporta acceso a la cámara. Usa Safari en iPhone.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.setAttribute("webkit-playsinline", "true");
        videoRef.current.muted = true;
        
        // iOS requires waiting for loadedmetadata before play
        await new Promise<void>((resolve) => {
          videoRef.current!.onloadedmetadata = () => resolve();
        });
        
        await videoRef.current.play();
        setCameraReady(true);
        setScanning(true);
      }
    } catch (e: unknown) {
      const err = e as Error;
      if (err.name === "NotAllowedError") {
        setError("Permiso de cámara denegado. Ve a Ajustes > Safari > Cámara y permite el acceso.");
      } else if (err.name === "NotFoundError") {
        setError("No se encontró cámara en este dispositivo.");
      } else {
        setError(`Error al acceder a la cámara: ${err.message || "desconocido"}`);
      }
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
    setScanning(false);
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
  }, []);

  // Scan frame — sends frame to API for recognition
  const scanFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !scanning) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, 320, 240);

    setScanPulse(true);
    setTimeout(() => setScanPulse(false), 300);

    try {
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.7)
      );
      const formData = new FormData();
      formData.append("frame", blob, "frame.jpg");

      const res = await fetch("/api/vision/scan", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setProfile(data.profile);
          setScanning(false);
          // Haptic feedback
          if (navigator.vibrate) navigator.vibrate(200);
        }
      }
    } catch { /* silent */ }
  }, [scanning]);

  // Auto-scan every 2 seconds
  useEffect(() => {
    if (scanning && cameraReady) {
      scanIntervalRef.current = setInterval(scanFrame, 2000);
      return () => { if (scanIntervalRef.current) clearInterval(scanIntervalRef.current); };
    }
  }, [scanning, cameraReady, scanFrame]);

  // Demo mode — load demo profile
  const loadDemo = async () => {
    setDemoMode(true);
    setProfile({
      name: "Juan Diego",
      handle: "@jdpd",
      bio: "Creador de VRTX. Tech & Innovation.",
      avatar_url: "",
      theme: "cyber",
      active_mode: "parche",
      social_links: { instagram: "jdpalacios", linkedin: "juandiegopalacios" },
      main_sport: "Running",
      interests: ["tech", "coffee", "running", "craft-beer"],
      privacy: { showBio: true, showSocial: true, showSport: true, showInterests: true },
    });
  };

  // Cleanup
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const themeColor = profile ? THEME_COLORS[profile.theme] || "#00d4ff" : "#00d4ff";

  return (
    <div className="min-h-screen bg-[#060810] text-white relative overflow-hidden">
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
        {cameraReady && (
          <button onClick={stopCamera} className="text-xs text-red-400 border border-red-400/30 px-3 py-1.5 rounded-lg">
            Cerrar cámara
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-24">
        {!cameraReady && !profile ? (
          /* Landing state */
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
              Apunta tu cámara a cualquier gorra VRTX y descubre el perfil de quien la usa.
              Solo verás lo que el usuario haya autorizado.
            </p>

            <button
              onClick={startCamera}
              className="px-8 py-4 rounded-2xl font-bold text-lg transition-all"
              style={{
                background: `linear-gradient(135deg, ${themeColor}, ${themeColor}88)`,
                boxShadow: `0 0 30px ${themeColor}40`,
              }}
            >
              📸 Activar VRTX Vision
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
                { icon: "⚡", label: "Tiempo real" },
              ].map((f) => (
                <div key={f.label}>
                  <span className="text-2xl">{f.icon}</span>
                  <p className="text-[10px] text-gray-500 mt-1">{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        ) : !profile ? (
          /* Camera scanning state */
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden border-2 border-cyan-500/20">
              {/* eslint-disable-next-line */}
              <video ref={videoRef} autoPlay playsInline muted webkit-playsinline="true" className="w-full rounded-2xl" style={{ objectFit: "cover" }} />

              {/* Scan overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Corner markers */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-400/80 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyan-400/80 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-cyan-400/80 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-400/80 rounded-br-lg" />

                {/* Center crosshair */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div
                    className={`w-16 h-16 rounded-full border-2 transition-all duration-300 ${
                      scanPulse ? "border-cyan-400 scale-110" : "border-cyan-500/30 scale-100"
                    }`}
                  >
                    <div className="w-full h-full rounded-full border border-cyan-500/10 flex items-center justify-center">
                      <div className={`w-2 h-2 rounded-full ${scanPulse ? "bg-cyan-400" : "bg-cyan-500/50"}`} />
                    </div>
                  </div>
                </div>

                {/* Scanning line animation */}
                <div className="absolute inset-x-4 top-0 h-full overflow-hidden">
                  <div
                    className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 animate-bounce"
                    style={{ animationDuration: "2s" }}
                  />
                </div>
              </div>

              {/* Status bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <span className="text-xs text-cyan-300 font-mono tracking-wider">ESCANEANDO...</span>
                </div>
                <p className="text-[10px] text-gray-400 text-center mt-1">
                  Apunta a una gorra VRTX
                </p>
              </div>
            </div>

            {/* Demo button while scanning */}
            <button
              onClick={loadDemo}
              className="mt-6 text-xs text-gray-500 hover:text-cyan-400 transition border border-gray-700 px-4 py-2 rounded-lg"
            >
              ⚡ Simular detección (demo)
            </button>

            <canvas ref={canvasRef} className="hidden" />
          </div>
        ) : (
          /* Profile detected — AR card */
          <div className="flex flex-col items-center">
            {/* Camera background (if active) */}
            {cameraReady && (
              <div className="relative w-full max-w-md rounded-2xl overflow-hidden mb-4 opacity-30">
                {/* eslint-disable-next-line */}
              <video ref={videoRef} autoPlay playsInline muted webkit-playsinline="true" className="w-full rounded-2xl" style={{ objectFit: "cover" }} />
              </div>
            )}

            {/* AR Profile Card */}
            <div
              className="w-full max-w-md rounded-3xl p-6 relative overflow-hidden animate-in slide-in-from-bottom-4"
              style={{
                background: `linear-gradient(135deg, ${themeColor}15, #0a0e18, ${themeColor}08)`,
                border: `1px solid ${themeColor}30`,
                boxShadow: `0 0 40px ${themeColor}15, inset 0 1px 0 ${themeColor}20`,
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
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    <span style={{ color: themeColor }}>{profile.name[0]}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{profile.name}</h3>
                  <p className="text-sm" style={{ color: `${themeColor}aa` }}>{profile.handle}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: `${themeColor}15`, color: themeColor, border: `1px solid ${themeColor}30` }}>
                      {MODE_LABELS[profile.active_mode] || profile.active_mode}
                    </span>
                  </div>
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
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-full"
                        style={{ background: `${themeColor}12`, color: `${themeColor}cc`, border: `1px solid ${themeColor}20` }}
                      >
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
                      <a
                        key={platform}
                        href={
                          platform === "instagram" ? `https://instagram.com/${username}` :
                          platform === "linkedin" ? `https://linkedin.com/in/${username}` :
                          platform === "twitter" ? `https://twitter.com/${username}` :
                          platform === "tiktok" ? `https://tiktok.com/@${username}` : "#"
                        }
                        target="_blank"
                        rel="noopener"
                        className="px-3 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105"
                        style={{ background: `${themeColor}15`, color: themeColor, border: `1px solid ${themeColor}25` }}
                      >
                        {platform === "instagram" ? "📷" : platform === "linkedin" ? "💼" : platform === "twitter" ? "🐦" : platform === "tiktok" ? "🎵" : "🔗"}
                        {" "}{platform}
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
                <span className="text-[10px] text-gray-600 font-mono">
                  🔒 Perfil verificado
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => { setProfile(null); setDemoMode(false); if (cameraReady) setScanning(true); }}
                className="px-6 py-3 rounded-xl text-sm font-semibold border border-gray-700 text-gray-300 hover:bg-white/5 transition"
              >
                🔄 Escanear otro
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: `${profile.name} en VRTX`, url: window.location.href });
                  }
                }}
                className="px-6 py-3 rounded-xl text-sm font-semibold transition"
                style={{ background: `${themeColor}20`, color: themeColor, border: `1px solid ${themeColor}30` }}
              >
                📤 Compartir
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom nav hint */}
      {!profile && (
        <div className="fixed bottom-0 inset-x-0 bg-gradient-to-t from-[#060810] to-transparent p-6 text-center">
          <p className="text-[10px] text-gray-600 font-mono tracking-wider">
            VRTX VISION v1.0 — {cameraReady ? "CÁMARA ACTIVA" : "CÁMARA INACTIVA"}
          </p>
        </div>
      )}

      {/* Error toast */}
      {error && (
        <div className="fixed top-20 inset-x-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center z-50">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
