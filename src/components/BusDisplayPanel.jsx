// ─── BusDisplayPanel.jsx ─────────────────────────────────────────────────────
// Electronic LED-style bus stop information display board
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { BUSES, BUS_STOPS, getStop } from '../data/busData';

// Generate simulated ETA table
function generateEtas(stopId) {
  return BUSES
    .filter((b) => b.route.includes(stopId))
    .map((bus) => {
      const idx = bus.route.indexOf(stopId);
      const progress = Math.random();

      const eta = Math.max(
        1,
        Math.round((bus.route.length - idx) * 3 - progress * 5)
      );

      return {
        busNumber: bus.number,
        destination:
          getStop(bus.route[bus.route.length - 1])?.name || 'Terminal',
        eta,
        status: bus.status,
        color: bus.color,
        crowdLevel: bus.crowdLevel,
        ac: bus.ac,
      };
    })
    .sort((a, b) => a.eta - b.eta);
}

// Display row
function DisplayRow({ entry, rank, animate }) {
  const statusColor = {
    'On Time': 'text-green-400',
    Delayed: 'text-red-400',
    'Arriving Soon': 'text-cyan-400',
    'Heavy Traffic': 'text-orange-400',
  }[entry.status] || 'text-slate-400';

  const crowdColor = {
    Low: 'bg-green-500',
    Moderate: 'bg-yellow-500',
    Crowded: 'bg-red-500',
  }[entry.crowdLevel] || 'bg-slate-500';

  return (
    <div
      className={`grid grid-cols-12 gap-2 items-center px-4 py-3 border-b border-white/5
      transition-all duration-500 ${
        animate ? 'opacity-100' : 'opacity-0 translate-y-2'
      }
      ${rank === 0 ? 'bg-cyan-500/10' : 'hover:bg-white/5'}`}
    >
      {/* Bus Number */}
      <div
        className="col-span-2 font-mono font-black text-lg sm:text-xl"
        style={{ color: entry.color }}
      >
        {entry.busNumber}
      </div>

      {/* Destination */}
      <div className="col-span-4 text-white text-xs sm:text-sm font-semibold truncate">
        {entry.destination}

        {entry.ac && (
          <span className="ml-1 text-[10px] text-sky-400 bg-sky-400/10 px-1 rounded">
            AC
          </span>
        )}
      </div>

      {/* ETA */}
      <div className="col-span-2 text-center">
        {entry.eta <= 2 ? (
          <span className="text-green-400 font-mono font-bold text-sm animate-pulse">
            NOW
          </span>
        ) : (
          <span className="font-mono font-bold text-white text-sm">
            {entry.eta}
            <span className="text-slate-500 text-xs"> min</span>
          </span>
        )}
      </div>

      {/* Status */}
      <div
        className={`col-span-2 text-[10px] sm:text-xs font-semibold truncate ${statusColor}`}
      >
        {entry.status}
      </div>

      {/* Crowd */}
      <div className="col-span-2 flex items-center gap-1">
        <div
          className={`w-2 h-2 rounded-full flex-shrink-0 ${crowdColor}`}
        />
        <span className="text-[10px] text-slate-400 hidden sm:block">
          {entry.crowdLevel}
        </span>
      </div>
    </div>
  );
}

// Safe ticker
function Ticker({ stop }) {
  const stopName = stop?.name || 'BMTC Smart Stop';

  const msg = `🚌 Welcome to ${stopName} · ಬೆಂಗಳೂರು ಮಹಾನಗರ ಸಾರಿಗೆ ಸಂಸ್ಥೆ · GPS Enabled Real-Time Bus Information · Have a Safe Journey · RR Nagar Bengaluru`;

  return (
    <div className="bg-amber-500/10 border-t border-amber-500/20 py-2 overflow-hidden relative">
      <div className="whitespace-nowrap animate-marquee font-mono text-xs text-amber-400">
        {msg} &nbsp;&nbsp;&nbsp;&nbsp; {msg}
      </div>
    </div>
  );
}

export default function BusDisplayPanel() {
  const [selectedStopId, setSelectedStopId] = useState(
    BUS_STOPS[0]?.id || 'rrnagar'
  );

  const [etas, setEtas] = useState([]);
  const [animate, setAnimate] = useState(true);
  const [tick, setTick] = useState(0);

  const stop = getStop(selectedStopId);

  // Refresh every 5 seconds
  useEffect(() => {
    const refresh = () => {
      setAnimate(false);

      setTimeout(() => {
        setEtas(generateEtas(selectedStopId));
        setAnimate(true);
        setTick((t) => t + 1);
      }, 300);
    };

    refresh();

    const id = setInterval(refresh, 5000);

    return () => clearInterval(id);
  }, [selectedStopId]);

  return (
    <section id="bus-display" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-4 py-1 mb-3">
            📺 ELECTRONIC DISPLAY BOARD · UPDATES EVERY 5 SECONDS
          </div>

          <h2 className="font-bold text-3xl sm:text-4xl text-white mb-2">
            Smart Bus <span className="text-amber-400">Stop Display</span>
          </h2>

          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Simulated BMTC LED display board with live ETA updates.
          </p>
        </div>

        {/* Stop Selector */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {BUS_STOPS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStopId(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                selectedStopId === s.id
                  ? 'bg-amber-500 text-black'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {s.isMain ? '📍' : '•'} {s.name}
            </button>
          ))}
        </div>

        {/* Display Board */}
        <div className="rounded-2xl overflow-hidden border border-amber-500/20 shadow-2xl">

          {/* Top Header */}
          <div className="bg-slate-900 px-4 py-4 flex items-center justify-between">
            <div>
              <div className="font-mono font-black text-amber-400 text-lg sm:text-2xl tracking-wider">
                {stop?.name?.toUpperCase() || 'BUS STOP'}
              </div>

              <div className="text-slate-500 text-xs font-mono mt-0.5">
                BMTC SMART STOP · RR NAGAR
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono text-amber-400 text-xl font-bold">
                {new Date().toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>

              <div className="text-[10px] text-slate-500 font-mono">
                REFRESH #{tick}
              </div>
            </div>
          </div>

          {/* Column Headers */}
          <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-amber-500/5 text-amber-500/60 text-[10px] font-mono uppercase tracking-widest border-b border-amber-500/10">
            <div className="col-span-2">Bus</div>
            <div className="col-span-4">Destination</div>
            <div className="col-span-2 text-center">ETA</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Crowd</div>
          </div>

          {/* Bus Rows */}
          <div className="bg-slate-950/80 min-h-40">
            {etas.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-mono text-sm">
                NO BUSES AVAILABLE
              </div>
            ) : (
              etas.map((e, i) => (
                <DisplayRow
                  key={`${e.busNumber}-${tick}`}
                  entry={e}
                  rank={i}
                  animate={animate}
                />
              ))
            )}
          </div>

          {/* Ticker */}
          <Ticker stop={stop} />
        </div>
      </div>
    </section>
  );
}