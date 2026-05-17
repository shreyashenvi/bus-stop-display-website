// ─── LoadingScreen.jsx ───────────────────────────────────────────────────────
// Animated loading/splash screen shown on app start
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';

const STEPS = [
  'Initialising GPS modules…',
  'Loading BMTC route data…',
  'Connecting to RR Nagar network…',
  'Starting AI prediction engine…',
  'System ready!',
];

export default function LoadingScreen({ onDone }) {
  const [step, setStep] = useState(0);
  const [pct,  setPct ] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => {
        const next = s + 1;
        setPct(Math.round((next / STEPS.length) * 100));
        if (next >= STEPS.length) {
          clearInterval(id);
          setTimeout(onDone, 600);
        }
        return next < STEPS.length ? next : s;
      });
    }, 500);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950 flex flex-col items-center justify-center gap-8 p-8">
      {/* Animated logo */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-2 border-city-500/30 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border-2 border-city-400 border-t-transparent animate-spin flex items-center justify-center">
            <span className="text-4xl" style={{ transform: 'rotate(0deg)' }}>🚌</span>
          </div>
        </div>
        {/* Ping rings */}
        <div className="absolute inset-0 rounded-full border border-city-400/20 animate-ping" />
      </div>

      {/* Title */}
      <div className="text-center">
        <div className="font-display font-black text-2xl text-white mb-1">
          Smart<span className="text-city-400">Bus</span> System
        </div>
        <div className="text-slate-500 text-xs font-mono">RR Nagar · Bengaluru</div>
      </div>

      {/* Progress bar */}
      <div className="w-72 space-y-3">
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-city-500 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="font-mono text-city-400 text-xs text-center animate-pulse">
          {STEPS[step] || STEPS[STEPS.length - 1]}
        </div>
      </div>
    </div>
  );
}
