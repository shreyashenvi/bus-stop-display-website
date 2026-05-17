// ─── Navbar.jsx ──────────────────────────────────────────────────────────────
// Top navigation bar with logo, real-time clock, and dark-mode toggle
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';

export default function Navbar({ darkMode, setDarkMode, onExpoMode }) {
  // Live clock state
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fmt = (n) => String(n).padStart(2, '0');
  const timeStr = `${fmt(time.getHours())}:${fmt(time.getMinutes())}:${fmt(time.getSeconds())}`;
  const dateStr = time.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 flex items-center justify-center">
            {/* Animated ring */}
            <div className="absolute inset-0 rounded-full border-2 border-city-400 animate-ping-slow opacity-40" />
            <div className="w-9 h-9 rounded-full bg-city-500/20 border border-city-400/60 flex items-center justify-center text-lg">
              🚌
            </div>
          </div>
          <div>
            <div className="font-display font-bold text-white text-sm sm:text-base leading-tight">
              Smart<span className="text-city-400">Bus</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono hidden sm:block">RR Nagar · Bengaluru</div>
          </div>
        </div>

        {/* ── Centre nav links (hidden on mobile) ── */}
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-300 font-body">
          {['Live Map', 'Bus Display', 'AI Insights', 'Stats'].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(' ', '-')}`}
              className="hover:text-city-400 transition-colors duration-200"
            >
              {l}
            </a>
          ))}
        </div>

        {/* ── Right controls ── */}
        <div className="flex items-center gap-3">
          {/* Clock */}
          <div className="hidden sm:block text-right">
            <div className="font-mono text-city-400 text-sm font-bold tracking-widest">{timeStr}</div>
            <div className="text-[10px] text-slate-500">{dateStr}</div>
          </div>

          {/* Expo mode button */}
          <button
            onClick={onExpoMode}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-semibold hover:bg-amber-500/30 transition-all"
            title="Fullscreen Bus Stop Display"
          >
            <span>📺</span> Expo Mode
          </button>

          {/* Dark-mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-9 h-9 rounded-full glass flex items-center justify-center text-base hover:scale-110 transition-transform"
            title="Toggle theme"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}
