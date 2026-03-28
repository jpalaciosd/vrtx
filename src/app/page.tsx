"use client";

import VrtxLogo from "@/components/VrtxLogo";
import { useState } from "react";

const tiers = [
  {
    name: "CORE",
    price: "$80.000 – $120.000",
    color: "#00d4ff",
    features: [
      "Perfil NFC personalizable",
      "Diseño generativo por IA",
      "Configurador de perfil",
      "Envío nacional incluido",
      "5 temas visuales",
    ],
  },
  {
    name: "LINKED",
    price: "$180.000 – $250.000",
    color: "#d4a843",
    popular: true,
    features: [
      "Todo lo de CORE",
      "Modos contextuales",
      "Comunidad VRTX",
      "Analytics de escaneos",
      "App móvil completa",
      "Integración Spotify",
    ],
  },
  {
    name: "LEGENDARY",
    price: "$350.000 – $500.000",
    color: "#ff2d7b",
    features: [
      "Todo lo de LINKED",
      "Certificado NFT",
      "Edición limitada (50 uds)",
      "Número de serie bordado",
      "Artista colaborador",
      "Acceso prioritario a drops",
    ],
  },
];

const colorways = [
  { name: "Midnight Carbon", desc: "Negro carbón + costuras cian + logo cian", color: "#00d4ff", bg: "#0a0e1a" },
  { name: "Bone Gold", desc: "Tela hueso + visera negra + logo dorado", color: "#d4a843", bg: "#2a2518" },
  { name: "All Black Neon", desc: "Negro total + logo verde neón", color: "#39ff14", bg: "#0a1a0a" },
];

const steps = [
  { num: "01", title: "Escanea", desc: "Acerca tu celular a la visera de la gorra" },
  { num: "02", title: "Descubre", desc: "El perfil digital del portador se carga al instante" },
  { num: "03", title: "Conecta", desc: "Redes, contacto, música, portfolio — todo en un toque" },
  { num: "04", title: "Rastrea", desc: "El dueño recibe una notificación con la ubicación del escaneo" },
];

export default function LandingPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", tier: "CORE" });
  const [submitted, setSubmitted] = useState(false);

  return (
    <div data-theme="cyber" className="min-h-screen bg-vrtx-black text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-vrtx-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <VrtxLogo size={28} animated={false} />
            <span className="font-display text-2xl tracking-wider">VRTX</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-body text-vrtx-gray">
            <a href="#como-funciona" className="hover:text-accent transition-colors">Cómo funciona</a>
            <a href="#tiers" className="hover:text-accent transition-colors">Tiers</a>
            <a href="#colorways" className="hover:text-accent transition-colors">Colorways</a>
            <a href="#preventa" className="hover:text-accent transition-colors">Preventa</a>
          </div>
          <a
            href="#preventa"
            className="px-4 py-2 bg-accent text-vrtx-black font-semibold text-sm rounded-pill hover:opacity-90 transition-opacity"
          >
            Reservar
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-vrtx-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.08)_0%,transparent_70%)]" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl animate-fade-in">
          <VrtxLogo size={160} />
          <h1 className="font-display text-6xl md:text-8xl tracking-wider mt-8">VRTX</h1>
          <p className="font-mono text-accent text-sm md:text-base tracking-[0.3em] mt-2">
            WEAR YOUR VERTEX
          </p>
          <p className="text-vrtx-gray text-lg md:text-xl mt-6 max-w-lg leading-relaxed">
            Gorras premium con tecnología NFC integrada. Tu identidad digital, tus redes, tu música — todo en un toque.
          </p>
          <div className="flex gap-4 mt-10">
            <a
              href="#preventa"
              className="px-8 py-3 bg-accent text-vrtx-black font-bold text-lg rounded-pill hover:opacity-90 transition-opacity font-body"
            >
              Reservar mi VRTX
            </a>
            <a
              href="#como-funciona"
              className="px-8 py-3 border border-accent/30 text-accent font-semibold text-lg rounded-pill hover:border-accent/60 transition-colors font-body"
            >
              Ver demo
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 flex flex-col items-center gap-2 animate-pulse">
          <span className="text-vrtx-gray text-xs font-mono">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-accent/50 to-transparent" />
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-4">CÓMO FUNCIONA</h2>
          <p className="text-vrtx-gray text-center mb-16 max-w-lg mx-auto">
            Un chip NFC en la visera conecta tu gorra con tu mundo digital
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.num} className="bg-card border border-white/5 rounded-card p-6 text-center group hover:border-accent/30 transition-colors">
                <span className="font-mono text-accent text-3xl font-bold">{step.num}</span>
                <h3 className="font-display text-2xl mt-3">{step.title}</h3>
                <p className="text-vrtx-gray text-sm mt-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section id="tiers" className="py-24 px-4 bg-vrtx-dark">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-4">ELIGE TU TIER</h2>
          <p className="text-vrtx-gray text-center mb-16">Tres niveles de experiencia VRTX</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative bg-card border rounded-card p-8 flex flex-col ${
                  tier.popular ? "border-[color:var(--accent)] shadow-accent" : "border-white/5"
                }`}
                style={tier.popular ? {} : { borderColor: `${tier.color}20` }}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-vrtx-black text-xs font-bold px-4 py-1 rounded-pill">
                    MÁS POPULAR
                  </span>
                )}
                <h3 className="font-display text-3xl" style={{ color: tier.color }}>
                  {tier.name}
                </h3>
                <p className="font-mono text-white text-xl mt-2">{tier.price}</p>
                <p className="text-vrtx-gray text-xs mt-1">COP</p>
                <ul className="mt-6 space-y-3 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-vrtx-gray">
                      <span style={{ color: tier.color }}>▸</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#preventa"
                  className="mt-8 block text-center py-3 rounded-pill font-semibold text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: tier.color, color: "#060810" }}
                >
                  Reservar {tier.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Colorways */}
      <section id="colorways" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-4">COLORWAYS</h2>
          <p className="text-vrtx-gray text-center mb-16">Primera colección — Drop 001</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {colorways.map((cw) => (
              <div
                key={cw.name}
                className="rounded-card p-8 border border-white/5 text-center"
                style={{ background: cw.bg }}
              >
                <div
                  className="w-20 h-20 mx-auto rounded-full mb-4"
                  style={{
                    background: `radial-gradient(circle, ${cw.color}40, transparent)`,
                    border: `2px solid ${cw.color}`,
                  }}
                />
                <h3 className="font-display text-2xl" style={{ color: cw.color }}>
                  {cw.name}
                </h3>
                <p className="text-vrtx-gray text-sm mt-2">{cw.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="py-24 px-4 bg-vrtx-dark">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-4">VRTX EN ACCIÓN</h2>
          <p className="text-vrtx-gray text-center mb-16">Mira cómo se vive la experiencia VRTX</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-card overflow-hidden border border-white/5 bg-vrtx-black">
              <video
                src="/video-1.mp4"
                controls
                playsInline
                muted
                loop
                preload="metadata"
                className="w-full aspect-[9/16] object-cover"
                poster=""
              />
            </div>
            <div className="rounded-card overflow-hidden border border-white/5 bg-vrtx-black">
              <video
                src="/video-2.mp4"
                controls
                playsInline
                muted
                loop
                preload="metadata"
                className="w-full aspect-[9/16] object-cover"
                poster=""
              />
            </div>
          </div>
        </div>
      </section>

      {/* Perfil demo */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl mb-4">TU PERFIL DIGITAL</h2>

          <p className="text-vrtx-gray mb-10 max-w-lg mx-auto">
            Así se ve cuando alguien escanea tu gorra VRTX
          </p>
          <a
            href="/p/demo"
            className="inline-block px-8 py-3 bg-accent text-vrtx-black font-bold text-lg rounded-pill hover:opacity-90 transition-opacity"
          >
            Ver perfil demo →
          </a>
        </div>
      </section>

      {/* Preventa */}
      <section id="preventa" className="py-24 px-4">
        <div className="max-w-lg mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-4">PREVENTA</h2>
          <p className="text-vrtx-gray text-center mb-10">
            Reserva tu gorra VRTX. Solo 30 unidades en el Drop 001.
          </p>

          {submitted ? (
            <div className="bg-card border border-accent/30 rounded-card p-8 text-center">
              <span className="text-4xl">🔺</span>
              <h3 className="font-display text-2xl mt-4 text-accent">¡Reserva registrada!</h3>
              <p className="text-vrtx-gray mt-2">Te contactaremos cuando tu VRTX esté lista.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="bg-card border border-white/5 rounded-card p-8 space-y-5"
            >
              <div>
                <label className="text-xs text-vrtx-gray font-mono uppercase">Nombre</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 bg-vrtx-black border border-white/10 rounded-card px-4 py-3 text-white font-body focus:border-accent focus:outline-none transition-colors"
                  placeholder="Tu nombre completo"
                />
              </div>
              <div>
                <label className="text-xs text-vrtx-gray font-mono uppercase">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full mt-1 bg-vrtx-black border border-white/10 rounded-card px-4 py-3 text-white font-body focus:border-accent focus:outline-none transition-colors"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="text-xs text-vrtx-gray font-mono uppercase">WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full mt-1 bg-vrtx-black border border-white/10 rounded-card px-4 py-3 text-white font-body focus:border-accent focus:outline-none transition-colors"
                  placeholder="+57 300 123 4567"
                />
              </div>
              <div>
                <label className="text-xs text-vrtx-gray font-mono uppercase">Tier</label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                  className="w-full mt-1 bg-vrtx-black border border-white/10 rounded-card px-4 py-3 text-white font-body focus:border-accent focus:outline-none transition-colors"
                >
                  <option value="CORE">CORE — $80.000 – $120.000</option>
                  <option value="LINKED">LINKED — $180.000 – $250.000</option>
                  <option value="LEGENDARY">LEGENDARY — $350.000 – $500.000</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-accent text-vrtx-black font-bold text-lg rounded-pill hover:opacity-90 transition-opacity"
              >
                Reservar mi VRTX
              </button>
              <p className="text-vrtx-gray text-xs text-center">
                Sin compromiso de pago. Te contactaremos para confirmar.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <VrtxLogo size={20} animated={false} />
            <span className="font-display text-xl tracking-wider">VRTX</span>
            <span className="text-vrtx-gray text-xs ml-2 font-mono">WEAR YOUR VERTEX</span>
          </div>
          <p className="text-vrtx-gray text-xs font-mono">
            © 2026 VRTX · Cali, Colombia 🇨🇴 · Powered by Ainovax
          </p>
        </div>
      </footer>
    </div>
  );
}
