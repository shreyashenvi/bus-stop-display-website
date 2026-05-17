// ─── ExpoMode.jsx ────────────────────────────────────────────────────────────
// Fullscreen "Bus Stop Display Mode" for projector / expo demo
// Large fonts, animated arrivals, dark LED aesthetic
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { BUSES, BUS_STOPS, getStop } from '../data/busData';

// Generate live ETA rows
function buildRows() {
  return BUSES.map((bus) => {
    const eta = Math.max(1, Math.floor(Math.random() * 15) + 1);
    const dest = getStop(bus.route[bus.route.length - 1])?.name || 'Terminal';
    return { number: bus.number, dest, eta, status: bus.status, color: bus.color, ac: bus.ac };
  }).sort((a, b) => a.eta - b.eta);
}

export default function ExpoMode({ onClose }) {
  const [rows, setRows] = useState(buildRows());
  const [time, setTime] = useState(new Date());
  const [flash, setFlash] = useState(false);
  const [stop]  = useState(BUS_STOPS[0]); // Default to RNSIT

  // Clock tick
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // ETA update + flash every 4 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setFlash(true);
      setTimeout(() => {
        setRows(buildRows());
        setFlash(false);
      }, 400);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const fmt = (n) => String(n).padStart(2, '0');
  const timeStr = `${fmt(time.getHours())}:${fmt(time.getMinutes())}:${fmt(time.getSeconds())}`;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col scanlines">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-8 py-4 bg-[#0a0e0a] border-b border-amber-500/20">
        <div>
          <div className="font-mono text-amber-400 text-2xl sm:text-4xl font-black neon-text-amber tracking-widest">
            {stop.name.toUpperCase()}
          </div>
          <div className="font-mono text-slate-500 text-sm mt-0.5 tracking-wider">
            BMTC SMART BUS STOP · GPS ENABLED · BENGALURU
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-amber-400 text-3xl sm:text-5xl font-black neon-text-amber">
            {timeStr}
          </div>
          <div className="font-mono text-slate-500 text-sm mt-1">
            {time.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* ── Column headers ── */}
      <div className="grid grid-cols-12 gap-4 px-8 py-3 bg-amber-500/5 border-b border-amber-500/10">
        {['BUS NO.', 'DESTINATION', '', 'ARRIVES IN', 'STATUS', 'TYPE'].map((h, i) => (
          <div key={i} className={`font-mono text-amber-500/60 text-xs sm:text-sm uppercase tracking-widest
            ${i === 0 ? 'col-span-2' : i === 1 ? 'col-span-4' : i === 2 ? 'col-span-1' : 'col-span-2'}`}>
            {h}
          </div>
        ))}
      </div>

      {/* ── Bus rows ── */}
      <div className={`flex-1 overflow-hidden transition-opacity duration-300 ${flash ? 'opacity-30' : 'opacity-100'}`}>
        {rows.map((row, i) => (
          <div
            key={row.number}
            className={`grid grid-cols-12 gap-4 items-center px-8 border-b border-white/5
              ${i === 0 ? 'py-6 bg-amber-400/5' : 'py-4 hover:bg-white/2'}`}
          >
            {/* Bus number */}
            <div className="col-span-2 font-mono font-black text-3xl sm:text-5xl"
                 style={{ color: row.color, textShadow: `0 0 20px ${row.color}` }}>
              {row.number}
            </div>

            {/* Destination */}
            <div className={`col-span-4 font-display font-bold text-white
              ${i === 0 ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-2xl'}`}>
              {row.dest}
            </div>

            {/* Spacer */}
            <div className="col-span-1" />

            {/* ETA */}
            <div className="col-span-2">
              {row.eta <= 2 ? (
                <div className="text-green-400 font-mono font-black text-2xl sm:text-4xl animate-blink">
                  NOW
                </div>
              ) : (
                <div className="font-mono font-black text-white">
                  <span className={i === 0 ? 'text-3xl sm:text-5xl' : 'text-2xl sm:text-3xl'} style={{ color: row.color }}>
                    {row.eta}
                  </span>
                  <span className="text-slate-500 text-base"> min</span>
                </div>
              )}
            </div>

            {/* Status */}
            <div className={`col-span-2 font-mono font-bold text-sm sm:text-lg ${
              row.status === 'On Time'      ? 'text-green-400' :
              row.status === 'Delayed'      ? 'text-red-400'   :
              row.status === 'Arriving Soon'? 'text-city-400'  :
              'text-orange-400'
            }`}>
              {row.status.toUpperCase()}
            </div>

            {/* AC badge */}
            <div className="col-span-1">
              {row.ac && (
                <span className="text-xs sm:text-sm text-sky-400 bg-sky-400/10 border border-sky-400/20 px-2 py-0.5 rounded font-mono">
                  ❄️ AC
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Ticker ── */}
      <div className="bg-amber-500/10 border-t border-amber-500/20 py-3 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee font-mono text-base text-amber-400">
          🚌 Welcome to RNSIT Smart Bus Stop · Thank you for using BMTC services ·
          Next update in 4 seconds · Scan QR code to download BMTC Connect app ·
          Report issues: 080-22253311 · Have a safe journey! · 📍 RR Nagar, Bengaluru
          &nbsp;&nbsp;&nbsp;&nbsp;
          🚌 Welcome to RNSIT Smart Bus Stop · Thank you for using BMTC services ·
          Next update in 4 seconds · Scan QR code to download BMTC Connect app ·
          Report issues: 080-22253311 · Have a safe journey! · 📍 RR Nagar, Bengaluru
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all z-10"
        title="Press ESC to exit"
      >
        ✕
      </button>

      {/* ESC hint */}
      <div className="absolute bottom-14 right-6 text-slate-600 text-xs font-mono">
        Press ESC to exit expo mode
      </div>
    </div>
  );
}
