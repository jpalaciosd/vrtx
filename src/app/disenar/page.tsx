'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  estilos,
  elementos,
  coloresDominantes,
  coloresSecundarios,
  intensidades,
  type DesignOptions,
} from '@/lib/prompts';

const steps = ['Estilo', 'Elemento', 'Colores', 'Texto', 'Intensidad'];

export default function DisenarPage() {
  const [step, setStep] = useState(0);
  const [options, setOptions] = useState<DesignOptions>({
    estilo: '',
    elemento: 'none',
    texto: '',
    colorDominante: 'cyan',
    colorSecundario: 'none',
    intensidad: 'balanced',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ imageUrl: string; revisedPrompt: string } | null>(null);
  const [error, setError] = useState('');

  const canAdvance = () => {
    if (step === 0) return !!options.estilo;
    return true;
  };

  const generate = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error generando diseño');
      setResult({ imageUrl: data.imageUrl, revisedPrompt: data.revisedPrompt });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060810] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-wider">
          <span className="text-[#00d4ff]">VR</span>TX
        </Link>
        <span className="text-[#8899bb] text-sm">Diseñador AI</span>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="flex items-center gap-1 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <button
                onClick={() => i <= step && setStep(i)}
                className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                  i === step
                    ? 'text-[#00d4ff]'
                    : i < step
                    ? 'text-[#00d4ff]/60 cursor-pointer'
                    : 'text-[#8899bb]/40'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                    i === step
                      ? 'border-[#00d4ff] bg-[#00d4ff]/10'
                      : i < step
                      ? 'border-[#00d4ff]/40 bg-[#00d4ff]/5'
                      : 'border-[#8899bb]/20'
                  }`}
                >
                  {i < step ? '✓' : i + 1}
                </span>
                <span className="hidden sm:inline">{s}</span>
              </button>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-2 ${
                    i < step ? 'bg-[#00d4ff]/30' : 'bg-white/5'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        {!result && !loading && (
          <div className="space-y-6">
            {/* STEP 0: Estilo */}
            {step === 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Elige tu estilo</h2>
                <p className="text-[#8899bb] text-sm mb-6">
                  Cada estilo define la personalidad visual de tu gorra.
                </p>
                <div className="grid gap-3">
                  {estilos.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setOptions({ ...options, estilo: e.id })}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        options.estilo === e.id
                          ? 'border-[#00d4ff] bg-[#00d4ff]/5'
                          : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{e.icon}</span>
                        <div>
                          <div className="font-bold tracking-wider">{e.name}</div>
                          <div className="text-xs text-[#8899bb]">{e.desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 1: Elemento */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Elemento central</h2>
                <p className="text-[#8899bb] text-sm mb-6">
                  Opcional. Si no eliges uno, el diseño se centra en el patrón del estilo.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {elementos.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setOptions({ ...options, elemento: e.id })}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        options.elemento === e.id
                          ? 'border-[#00d4ff] bg-[#00d4ff]/5'
                          : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                      }`}
                    >
                      <span className="text-3xl block mb-1">{e.icon}</span>
                      <span className="text-sm font-medium">{e.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Colores */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Colores del bordado</h2>
                <p className="text-[#8899bb] text-sm mb-6">
                  Máximo 3 colores de hilo sobre tela negra.
                </p>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-[#8899bb] mb-3 uppercase tracking-wider">
                    Color dominante
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {coloresDominantes.map((c) => (
                      <button
                        key={c.id}
                        onClick={() =>
                          setOptions({ ...options, colorDominante: c.id })
                        }
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                          options.colorDominante === c.id
                            ? 'border-[#00d4ff] bg-[#00d4ff]/5'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="text-sm">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#8899bb] mb-3 uppercase tracking-wider">
                    Color secundario
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {coloresSecundarios.map((c) => (
                      <button
                        key={c.id}
                        onClick={() =>
                          setOptions({ ...options, colorSecundario: c.id })
                        }
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                          options.colorSecundario === c.id
                            ? 'border-[#00d4ff] bg-[#00d4ff]/5'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        {c.hex !== 'transparent' ? (
                          <span
                            className="w-4 h-4 rounded-full border border-white/20"
                            style={{ backgroundColor: c.hex }}
                          />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px]">
                            ✕
                          </span>
                        )}
                        <span className="text-sm">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Texto */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Texto personalizado</h2>
                <p className="text-[#8899bb] text-sm mb-6">
                  Opcional. Máximo 12 caracteres. Se integra al diseño con tipografía del estilo.
                </p>
                <input
                  type="text"
                  maxLength={12}
                  value={options.texto}
                  onChange={(e) =>
                    setOptions({ ...options, texto: e.target.value.toUpperCase() })
                  }
                  placeholder="Ej: VRTX, TU NOMBRE..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg tracking-widest font-bold placeholder:text-[#8899bb]/30 placeholder:font-normal placeholder:tracking-normal focus:border-[#00d4ff] focus:outline-none transition-colors"
                />
                <div className="text-right text-xs text-[#8899bb]/50 mt-1">
                  {options.texto.length}/12
                </div>
              </div>
            )}

            {/* STEP 4: Intensidad */}
            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Intensidad</h2>
                <p className="text-[#8899bb] text-sm mb-6">
                  Controla la densidad y agresividad del diseño.
                </p>
                <div className="grid gap-3">
                  {intensidades.map((i) => (
                    <button
                      key={i.id}
                      onClick={() =>
                        setOptions({ ...options, intensidad: i.id })
                      }
                      className={`p-4 rounded-xl border text-left transition-all ${
                        options.intensidad === i.id
                          ? 'border-[#00d4ff] bg-[#00d4ff]/5'
                          : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                      }`}
                    >
                      <div className="font-bold">{i.name}</div>
                      <div className="text-xs text-[#8899bb]">{i.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setStep(step - 1)}
                className={`px-5 py-2 rounded-lg text-sm transition-colors ${
                  step === 0
                    ? 'opacity-0 pointer-events-none'
                    : 'text-[#8899bb] hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                ← Anterior
              </button>

              {step < steps.length - 1 ? (
                <button
                  onClick={() => canAdvance() && setStep(step + 1)}
                  disabled={!canAdvance()}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                    canAdvance()
                      ? 'bg-[#00d4ff] text-black hover:bg-[#00d4ff]/80'
                      : 'bg-white/5 text-[#8899bb]/40 cursor-not-allowed'
                  }`}
                >
                  Siguiente →
                </button>
              ) : (
                <button
                  onClick={generate}
                  className="px-6 py-2.5 rounded-lg text-sm font-bold bg-[#00d4ff] text-black hover:bg-[#00d4ff]/80 transition-all"
                >
                  🎨 Generar diseño
                </button>
              )}
            </div>

            {/* Preview summary */}
            {step > 0 && (
              <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-xs font-semibold text-[#8899bb]/60 uppercase tracking-wider mb-2">
                  Tu selección
                </div>
                <div className="flex flex-wrap gap-2">
                  {options.estilo && (
                    <span className="px-3 py-1 rounded-full bg-[#00d4ff]/10 text-[#00d4ff] text-xs font-medium">
                      {estilos.find((e) => e.id === options.estilo)?.icon}{' '}
                      {estilos.find((e) => e.id === options.estilo)?.name}
                    </span>
                  )}
                  {options.elemento !== 'none' && (
                    <span className="px-3 py-1 rounded-full bg-white/5 text-white/70 text-xs">
                      {elementos.find((e) => e.id === options.elemento)?.icon}{' '}
                      {elementos.find((e) => e.id === options.elemento)?.name}
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full bg-white/5 text-white/70 text-xs flex items-center gap-1">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          coloresDominantes.find((c) => c.id === options.colorDominante)?.hex,
                      }}
                    />
                    {coloresDominantes.find((c) => c.id === options.colorDominante)?.name}
                  </span>
                  {options.colorSecundario !== 'none' && (
                    <span className="px-3 py-1 rounded-full bg-white/5 text-white/70 text-xs flex items-center gap-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            coloresSecundarios.find((c) => c.id === options.colorSecundario)?.hex,
                        }}
                      />
                      {coloresSecundarios.find((c) => c.id === options.colorSecundario)?.name}
                    </span>
                  )}
                  {options.texto && (
                    <span className="px-3 py-1 rounded-full bg-white/5 text-white/70 text-xs">
                      &quot;{options.texto}&quot;
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full bg-white/5 text-white/70 text-xs">
                    {intensidades.find((i) => i.id === options.intensidad)?.name}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-2 border-[#00d4ff]/20 rounded-full" />
              <div className="absolute inset-0 border-2 border-[#00d4ff] rounded-full border-t-transparent animate-spin" />
              <div className="absolute inset-3 border border-[#00d4ff]/30 rounded-full border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>
            <p className="text-lg font-bold mb-1">Generando tu diseño...</p>
            <p className="text-sm text-[#8899bb]">DALL·E 3 está creando tu gorra única</p>
            <p className="text-xs text-[#8899bb]/50 mt-2">Esto puede tomar 15-30 segundos</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-10">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => { setError(''); setStep(4); }}
              className="px-6 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-1">Tu diseño VRTX</h2>
              <p className="text-[#8899bb] text-sm">Generado con inteligencia artificial</p>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-white/10">
              <img
                src={result.imageUrl}
                alt="Diseño VRTX generado"
                className="w-full"
              />
            </div>

            {/* Selection summary */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-xs font-semibold text-[#8899bb]/60 uppercase tracking-wider mb-2">
                Configuración
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-[#8899bb]">Estilo:</span>{' '}
                  {estilos.find((e) => e.id === options.estilo)?.name}
                </div>
                <div>
                  <span className="text-[#8899bb]">Elemento:</span>{' '}
                  {elementos.find((e) => e.id === options.elemento)?.name}
                </div>
                <div>
                  <span className="text-[#8899bb]">Color:</span>{' '}
                  {coloresDominantes.find((c) => c.id === options.colorDominante)?.name}
                </div>
                <div>
                  <span className="text-[#8899bb]">Intensidad:</span>{' '}
                  {intensidades.find((i) => i.id === options.intensidad)?.name}
                </div>
                {options.texto && (
                  <div className="col-span-2">
                    <span className="text-[#8899bb]">Texto:</span> {options.texto}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setResult(null);
                  setStep(0);
                  setOptions({
                    estilo: '',
                    elemento: 'none',
                    texto: '',
                    colorDominante: 'cyan',
                    colorSecundario: 'none',
                    intensidad: 'balanced',
                  });
                }}
                className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-white text-sm font-medium hover:border-white/20 transition-colors"
              >
                Nuevo diseño
              </button>
              <button
                onClick={generate}
                className="flex-1 px-6 py-3 rounded-xl bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-colors"
              >
                🔄 Regenerar
              </button>
              <a
                href={result.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex-1 px-6 py-3 rounded-xl bg-[#00d4ff] text-black text-sm font-bold text-center hover:bg-[#00d4ff]/80 transition-colors"
              >
                ⬇ Descargar
              </a>
            </div>

            <div className="text-center pt-4">
              <Link
                href="/"
                className="text-sm text-[#8899bb] hover:text-[#00d4ff] transition-colors"
              >
                ← Volver al inicio
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
