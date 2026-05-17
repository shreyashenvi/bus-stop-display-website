// ─── HeroSection.jsx ─────────────────────────────────────────────────────────
// Landing hero with animated background, glassmorphism card, and stats
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react';
import { STATS } from '../data/busData';

// Animated particle canvas (pure JS canvas drawing)
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,179,220,${p.alpha})`;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,179,220,${0.15 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// Animated counter for stat cards
function StatCard({ stat, delay }) {
  return (
    <div
      className="glass rounded-2xl p-4 text-center animate-slide-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="text-2xl mb-1">{stat.icon}</div>
      <div className="font-display font-bold text-2xl text-city-400 neon-text">
        {stat.value.toLocaleString('en-IN')}{stat.suffix}
      </div>
      <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
    </div>
  );
}

export default function HeroSection({ onStartTracking }) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center px-4 pt-20 pb-10 overflow-hidden"
    >
      {/* ── Animated background layers ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#061e42] to-slate-950" />
      <div className="absolute inset-0 grid-bg opacity-60" />
      <ParticleCanvas />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-city-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-city-400/30 text-city-400 text-xs font-semibold mb-6 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          LIVE SYSTEM ACTIVE · BMTC REAL-TIME TRACKING
        </div>

        {/* Main title */}
        <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-4 animate-fade-in"
            style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          <span className="text-white">Smart Bus Tracking</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-city-400 via-cyan-300 to-sky-400 neon-text">
            & Passenger Info System
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-4 animate-fade-in"
           style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          AI-based real-time transport monitoring for{' '}
          <span className="text-city-300 font-semibold">RR Nagar, Bengaluru</span>
          <br className="hidden sm:block" />
          Powered by GPS simulation · Built for BMTC routes
        </p>

        {/* College badge */}
        <div className="inline-flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-4 py-1 mb-8 animate-fade-in"
             style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
          🎓 RNSIT Engineering Project Expo · Smart City Transportation System
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
             style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
          <button
            onClick={onStartTracking}
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-city-500 to-cyan-500 text-white font-display font-bold text-base sm:text-lg shadow-neon hover:shadow-[0_0_40px_rgba(0,179,220,0.7)] transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2 justify-center">
              🚌 Start Tracking
            </span>
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </button>

          <button
            onClick={() => document.getElementById('bus-display')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-2xl glass border border-white/20 text-white font-display font-semibold text-base hover:border-city-400/50 transition-all duration-300 hover:scale-105"
          >
            📺 Bus Stop Display
          </button>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="relative z-10 w-full max-w-4xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <StatCard key={s.label} stat={s} delay={500 + i * 100} />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 mt-12 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-slate-500">Scroll to explore</span>
        <div className="w-5 h-8 rounded-full border border-slate-600 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-city-400 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
