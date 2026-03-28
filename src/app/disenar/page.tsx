"use client";

import { useState } from "react";
import VrtxLogo from "@/components/VrtxLogo";
import {
  estilos,
  elementos,
  coloresDominantes,
  coloresSecundarios,
  intensidades,
} from "@/lib/prompts";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export default function DesignerPage() {
  const [step, setStep] = useState<Step>(1);
  const [estilo, setEstilo] = useState("");
  const [elemento, setElemento] = useState("");
  const [texto, setTexto] = useState("");
  const [colorDom, setColorDom] = useState("");
  const [colorSec, setColorSec] = useState("none");
  const [intensidad, setIntensidad] = useState("balanced");

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const canNext = () => {
    if (step === 1) return !!estilo;
    if (step === 2) return !!elemento;
    if (step === 3) return true; // texto es opcional
    if (step === 4) return !!colorDom;
    if (step === 5) return true; // sec es opcional
    if (step === 6) return !!intensidad;
    return false;
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setImageUrl("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estilo,
          elemento,
          texto,
          colorDominante: colorDom,
          colorSecundario: colorSec,
          intensidad,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setImageUrl(data.imageUrl);
        setStep(7);
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setEstilo("");
    setElemento("");
    setTexto("");
    setColorDom("");
    setColorSec("none");
    setIntensidad("balanced");
    setImageUrl("");
    setError("");
  };

  const selectedEstilo = estilos.find((e) => e.id === estilo);

  return (
    <div data-theme="cyber" className="min-h-screen bg-vrtx-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-vrtx-black/80 backdrop-blur-md border-b border-white/5 px-4 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <VrtxLogo size={22} animated={false} />
          <span className="font-display text-lg tracking-wider">VRTX</span>
        </a>
        <span className="font-mono text-xs text-accent">DISEÑADOR</span>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-vrtx-dark">
        <div
          className="h-full bg-accent transition-all duration-500"
          style={{ width: `${(Math.min(step, 6) / 6) * 100}%` }}
        />
      </div>

      <main className="max-w-lg mx-auto px-4 py-8">
        {/* ===== STEP 1: ESTILO ===== */}
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <div>
              <p className="font-mono text-xs text-accent mb-1">PASO 1 DE 6</p>
              <h1 className="font-display text-3xl">ELIGE TU ESTILO</h1>
              <p className="text-muted text-sm mt-1">Define la estética de tu diseño VRTX</p>
            </div>
            <div className="space-y-3">
              {estilos.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setEstilo(e.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-card border transition-all text-left ${
                    estilo === e.id
                      ? "border-accent bg-accent/10 shadow-accent"
                      : "border-white/5 hover:border-white/20 bg-card"
                  }`}
                >
                  <span className="text-3xl">{e.icon}</span>
                  <div>
                    <p className="font-display text-xl">{e.name}</p>
                    <p className="text-xs text-muted">{e.desc}</p>
                  </div>
                  {estilo === e.id && <span className="ml-auto text-accent text-xl">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ===== STEP 2: ELEMENTO ===== */}
        {step === 2 && (
          <div className="animate-fade-in space-y-6">
            <div>
              <p className="font-mono text-xs text-accent mb-1">PASO 2 DE 6</p>
              <h1 className="font-display text-3xl">ELEMENTO CENTRAL</h1>
              <p className="text-muted text-sm mt-1">Elige un ícono o déjalo con el símbolo VRTX</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {elementos.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setElemento(e.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-card border transition-all ${
                    elemento === e.id
                      ? "border-accent bg-accent/10 shadow-accent"
                      : "border-white/5 hover:border-white/20 bg-card"
                  }`}
                >
                  <span className="text-3xl">{e.icon}</span>
                  <span className="text-xs font-mono">{e.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ===== STEP 3: TEXTO ===== */}
        {step === 3 && (
          <div className="animate-fade-in space-y-6">
            <div>
              <p className="font-mono text-xs text-accent mb-1">PASO 3 DE 6</p>
              <h1 className="font-display text-3xl">TEXTO PERSONALIZADO</h1>
              <p className="text-muted text-sm mt-1">Tu nombre, alias o frase corta (opcional)</p>
            </div>
            <div className="space-y-3">
              <input
                value={texto}
                onChange={(e) => setTexto(e.target.value.slice(0, 15))}
                placeholder="Ej: SANTIAGO, VRTX001, CALI..."
                className="w-full bg-card border border-white/10 rounded-card px-4 py-4 text-white font-display text-2xl tracking-wider text-center focus:border-accent focus:outline-none uppercase"
              />
              <p className="text-xs text-muted text-center font-mono">{texto.length}/15 caracteres</p>
              {texto && (
                <div className="bg-card border border-accent/20 rounded-card p-6 text-center">
                  <p className="font-display text-4xl text-accent tracking-widest">{texto.toUpperCase()}</p>
                </div>
              )}
              <button
                onClick={() => setTexto("")}
                className="w-full text-center text-sm text-muted hover:text-white transition-colors"
              >
                Sin texto →
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 4: COLOR DOMINANTE ===== */}
        {step === 4 && (
          <div className="animate-fade-in space-y-6">
            <div>
              <p className="font-mono text-xs text-accent mb-1">PASO 4 DE 6</p>
              <h1 className="font-display text-3xl">COLOR DOMINANTE</h1>
              <p className="text-muted text-sm mt-1">El color principal de tu diseño</p>
            </div>
            <div className="space-y-3">
              {coloresDominantes.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColorDom(c.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-card border transition-all ${
                    colorDom === c.id
                      ? "border-accent bg-accent/10"
                      : "border-white/5 hover:border-white/20 bg-card"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full border-2"
                    style={{ backgroundColor: c.hex, borderColor: c.hex }}
                  />
                  <span className="font-body text-lg">{c.name}</span>
                  {colorDom === c.id && <span className="ml-auto text-accent text-xl">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ===== STEP 5: COLOR SECUNDARIO ===== */}
        {step === 5 && (
          <div className="animate-fade-in space-y-6">
            <div>
              <p className="font-mono text-xs text-accent mb-1">PASO 5 DE 6</p>
              <h1 className="font-display text-3xl">ACENTO SECUNDARIO</h1>
              <p className="text-muted text-sm mt-1">Un segundo color para detalles (opcional)</p>
            </div>
            <div className="space-y-3">
              {coloresSecundarios.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColorSec(c.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-card border transition-all ${
                    colorSec === c.id
                      ? "border-accent bg-accent/10"
                      : "border-white/5 hover:border-white/20 bg-card"
                  }`}
                >
                  {c.id === "none" ? (
                    <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center text-muted">✕</div>
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full border-2"
                      style={{ backgroundColor: c.hex, borderColor: c.hex }}
                    />
                  )}
                  <span className="font-body text-lg">{c.name}</span>
                  {colorSec === c.id && <span className="ml-auto text-accent text-xl">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ===== STEP 6: INTENSIDAD ===== */}
        {step === 6 && (
          <div className="animate-fade-in space-y-6">
            <div>
              <p className="font-mono text-xs text-accent mb-1">PASO 6 DE 6</p>
              <h1 className="font-display text-3xl">INTENSIDAD</h1>
              <p className="text-muted text-sm mt-1">Qué tan cargado quieres el diseño</p>
            </div>
            <div className="space-y-3">
              {intensidades.map((i) => (
                <button
                  key={i.id}
                  onClick={() => setIntensidad(i.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-card border transition-all text-left ${
                    intensidad === i.id
                      ? "border-accent bg-accent/10 shadow-accent"
                      : "border-white/5 hover:border-white/20 bg-card"
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-display text-xl">{i.name}</p>
                    <p className="text-xs text-muted">{i.desc}</p>
                  </div>
                  {intensidad === i.id && <span className="text-accent text-xl">✓</span>}
                </button>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-card border border-white/5 rounded-card p-5 space-y-2">
              <p className="font-mono text-xs text-accent mb-2">RESUMEN DE TU DISEÑO</p>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Estilo</span>
                <span>{selectedEstilo?.name} {selectedEstilo?.icon}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Elemento</span>
                <span>{elementos.find((e) => e.id === elemento)?.name} {elementos.find((e) => e.id === elemento)?.icon}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Texto</span>
                <span className="font-mono text-accent">{texto.toUpperCase() || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Color</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: coloresDominantes.find((c) => c.id === colorDom)?.hex }} />
                  <span>{coloresDominantes.find((c) => c.id === colorDom)?.name}</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Intensidad</span>
                <span>{intensidades.find((i) => i.id === intensidad)?.name}</span>
              </div>
            </div>
          </div>
        )}

        {/* ===== STEP 7: RESULTADO ===== */}
        {step === 7 && (
          <div className="animate-fade-in space-y-6">
            <div className="text-center">
              <h1 className="font-display text-3xl text-accent">TU DISEÑO VRTX</h1>
              <p className="text-muted text-sm mt-1">
                {selectedEstilo?.name} · {elementos.find((e) => e.id === elemento)?.name} · {coloresDominantes.find((c) => c.id === colorDom)?.name}
              </p>
            </div>

            {imageUrl && (
              <div className="rounded-card overflow-hidden border border-accent/30 shadow-accent">
                <img
                  src={imageUrl}
                  alt="Diseño VRTX generado"
                  className="w-full aspect-square object-cover"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="py-3 border border-accent/30 text-accent rounded-pill hover:bg-accent/10 transition-colors font-body text-sm"
              >
                {loading ? "Generando..." : "🔄 Regenerar"}
              </button>
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 bg-accent text-vrtx-black font-bold rounded-pill hover:opacity-90 transition-opacity text-center text-sm"
              >
                💾 Descargar
              </a>
            </div>

            <button
              onClick={reset}
              className="w-full py-3 border border-white/10 text-muted rounded-pill hover:border-white/30 hover:text-white transition-colors text-sm"
            >
              ← Crear otro diseño
            </button>
          </div>
        )}

        {/* ===== LOADING OVERLAY ===== */}
        {loading && step !== 7 && (
          <div className="fixed inset-0 z-50 bg-vrtx-black/90 flex flex-col items-center justify-center gap-6">
            <div className="animate-nfc-pulse">
              <VrtxLogo size={80} animated={false} />
            </div>
            <div className="text-center">
              <p className="font-display text-2xl text-accent">GENERANDO</p>
              <p className="font-mono text-xs text-muted mt-2 tracking-wider animate-pulse">
                Creando tu diseño con IA...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-950/30 border border-red-500/30 rounded-card p-4 text-center mt-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Navigation buttons */}
        {step < 7 && (
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep((step - 1) as Step)}
                className="flex-1 py-3 border border-white/10 text-muted rounded-pill hover:border-white/30 hover:text-white transition-colors"
              >
                ← Atrás
              </button>
            )}
            {step < 6 ? (
              <button
                onClick={() => canNext() && setStep((step + 1) as Step)}
                disabled={!canNext()}
                className={`flex-1 py-3 rounded-pill font-bold transition-all ${
                  canNext()
                    ? "bg-accent text-vrtx-black hover:opacity-90"
                    : "bg-white/5 text-muted cursor-not-allowed"
                }`}
              >
                Siguiente →
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex-1 py-3 bg-accent text-vrtx-black font-bold rounded-pill hover:opacity-90 transition-opacity"
              >
                {loading ? "Generando..." : "🔺 GENERAR DISEÑO"}
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
