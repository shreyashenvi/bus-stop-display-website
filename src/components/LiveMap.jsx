// ─── LiveMap.jsx ─────────────────────────────────────────────────────────────
// Interactive Leaflet map with animated bus markers and GPS simulation
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { BUSES, BUS_STOPS, getStop } from '../data/busData';

// ── Custom bus icon creator ────────────────────────────────────────────────
function createBusIcon(color, number, isMoving) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <!-- Pulse ring -->
      <circle cx="24" cy="24" r="20" fill="${color}" opacity="0.15"/>
      <!-- Main circle -->
      <circle cx="24" cy="24" r="16" fill="${color}" opacity="0.9" stroke="white" stroke-width="2"/>
      <!-- Bus emoji text -->
      <text x="24" y="29" text-anchor="middle" font-size="16" fill="white">🚌</text>
      ${isMoving ? `<circle cx="24" cy="24" r="20" fill="none" stroke="${color}" stroke-width="2" opacity="0.5">
        <animate attributeName="r" from="16" to="24" dur="1.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite"/>
      </circle>` : ''}
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24],
  });
}

// ── Custom stop icon ────────────────────────────────────────────────────────
function createStopIcon(isMain) {
  const size   = isMain ? 14 : 10;
  const color  = isMain ? '#00b3dc' : '#64748b';
  const stroke = isMain ? '#fff' : '#94a3b8';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size*2}" height="${size*2}" viewBox="0 0 ${size*2} ${size*2}">
      <circle cx="${size}" cy="${size}" r="${size-2}" fill="${color}" stroke="${stroke}" stroke-width="2"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [size * 2, size * 2],
    iconAnchor: [size, size],
    popupAnchor: [0, -size],
  });
}

// ── Interpolate position between two stops ─────────────────────────────────
function interpolate(a, b, t) {
  return {
    lat: a.lat + (b.lat - a.lat) * t,
    lng: a.lng + (b.lng - a.lng) * t,
  };
}

export default function LiveMap() {
  const mapRef      = useRef(null);
  const leafletMap  = useRef(null);
  const markersRef  = useRef({});
  const progressRef = useRef({}); // per-bus interpolation progress 0→1
  const [selectedBus, setSelectedBus] = useState(null);
  const [busStates, setBusStates] = useState(
    BUSES.map((b) => ({ ...b, stopIdx: 0, progress: 0 }))
  );

  // ── Initialise Leaflet map once ──────────────────────────────────────────
  useEffect(() => {
    if (leafletMap.current) return;

    // Centre on RNSIT
    leafletMap.current = L.map(mapRef.current, {
      center:  [12.9240, 77.5149],
      zoom:    13,
      zoomControl: true,
      attributionControl: true,
    });

    // Dark tile layer (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19,
    }).addTo(leafletMap.current);

    // ── Draw bus stop markers ─────────────────────────────────────────────
    BUS_STOPS.forEach((stop) => {
      const marker = L.marker([stop.lat, stop.lng], { icon: createStopIcon(stop.isMain) })
        .addTo(leafletMap.current)
        .bindPopup(`
          <div style="font-family:'DM Sans',sans-serif; min-width:160px">
            <div style="font-weight:700; color:#00b3dc; margin-bottom:4px">📍 ${stop?.name}</div>
            <div style="font-size:12px; color:#94a3b8">Bus Stop · RR Nagar Network</div>
          </div>
        `);
    });

    // ── Draw route polylines ──────────────────────────────────────────────
    BUSES.forEach((bus) => {
      const coords = bus.route.map((sid) => {
        const s = getStop(sid);
        return s ? [s.lat, s.lng] : null;
      }).filter(Boolean);

      L.polyline(coords, {
        color: bus.color,
        weight: 3,
        opacity: 0.5,
        dashArray: '8 4',
      }).addTo(leafletMap.current);
    });

    // ── Create bus markers ────────────────────────────────────────────────
    BUSES.forEach((bus) => {
      const startStop = getStop(bus.route[0]);
      if (!startStop) return;

      const marker = L.marker([startStop.lat, startStop.lng], {
        icon: createBusIcon(bus.color, bus.number, true),
        zIndexOffset: 1000,
      })
        .addTo(leafletMap.current)
        .bindPopup(`
          <div style="font-family:'DM Sans',sans-serif; min-width:200px">
            <div style="font-weight:800; font-size:16px; color:${bus.color}">${bus.number}</div>
            <div style="font-size:13px; color:#e2e8f0; margin-bottom:6px">${bus.name}</div>
            <div style="font-size:11px; color:#94a3b8">Status: <b style="color:${bus.color}">${bus.status}</b></div>
            <div style="font-size:11px; color:#94a3b8">Crowd: ${bus.crowdLevel}</div>
            ${bus.ac ? '<div style="font-size:11px; color:#38bdf8">❄️ AC Bus</div>' : ''}
          </div>
        `);

      marker.on('click', () => setSelectedBus(bus));
      markersRef.current[bus.id] = { marker, progress: 0, stopIdx: 0 };
      progressRef.current[bus.id] = { progress: 0, stopIdx: 0 };
    });

    return () => {
      // Cleanup on unmount
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  }, []);

  // ── GPS simulation: animate buses along routes ───────────────────────────
  useEffect(() => {
    const SPEED = 0.004; // interpolation increment per tick (tune for speed)

    const tick = setInterval(() => {
      BUSES.forEach((bus) => {
        const state = progressRef.current[bus.id];
        if (!state) return;

        const routeLen = bus.route.length;
        if (routeLen < 2) return;

        const fromId = bus.route[state.stopIdx];
        const toId   = bus.route[(state.stopIdx + 1) % routeLen];
        const from   = getStop(fromId);
        const to     = getStop(toId);
        if (!from || !to) return;

        // Increment progress
        state.progress += SPEED + Math.random() * 0.002; // slight random jitter

        if (state.progress >= 1) {
          state.progress = 0;
          state.stopIdx  = (state.stopIdx + 1) % routeLen;
        }

        // Interpolate position
        const pos = interpolate(from, to, state.progress);

        // Move marker
        const markerEntry = markersRef.current[bus.id];
        if (markerEntry?.marker && leafletMap.current) {
          markerEntry.marker.setLatLng([pos.lat, pos.lng]);
        }
      });

      // Update React state for ETA panel (less frequently)
      setBusStates((prev) =>
        prev.map((b) => {
          const s = progressRef.current[b.id];
          return s ? { ...b, stopIdx: s.stopIdx, progress: s.progress } : b;
        })
      );
    }, 100); // 10 fps update

    return () => clearInterval(tick);
  }, []);

  return (
    <section id="live-map" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-4 py-1 mb-3">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            LIVE GPS SIMULATION · UPDATING EVERY 100ms
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2">
            Live <span className="text-city-400">Bus Tracking</span> Map
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Real-time GPS simulation of BMTC buses across RR Nagar, Bengaluru.
            Click any bus marker for details.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-4">
          {/* ── Map ── */}
          <div className="lg:col-span-3 relative">
            <div
              ref={mapRef}
              className="rounded-2xl overflow-hidden neon-border"
              style={{ height: '520px' }}
            />
            {/* Map overlay badge */}
            <div className="absolute top-3 left-3 z-[400] glass-dark rounded-xl px-3 py-2 text-xs text-city-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              RR Nagar Network · 5 Buses Active
            </div>
          </div>

          {/* ── Bus list sidebar ── */}
          <div className="space-y-3 overflow-y-auto" style={{ maxHeight: '520px' }}>
            {BUSES.map((bus) => {
              const state = busStates.find((b) => b.id === bus.id);
              const nextStopId = bus.route[(state?.stopIdx ?? 0) + 1] ?? bus.route[0];
              const nextStop   = getStop(nextStopId);
              const eta        = Math.max(1, Math.round(10 - (state?.progress ?? 0) * 10));
              const isSelected = selectedBus?.id === bus.id;

              return (
                <div
                  key={bus.id}
                  onClick={() => {
                    setSelectedBus(bus);
                    const m = markersRef.current[bus.id];
                    if (m?.marker && leafletMap.current) {
                      const latlng = m.marker.getLatLng();
                      leafletMap.current.flyTo([latlng.lat, latlng.lng], 15, { duration: 1 });
                      m.marker.openPopup();
                    }
                  }}
                  className={`cursor-pointer rounded-xl p-3 border transition-all duration-200 ${
                    isSelected
                      ? 'border-city-400/60 bg-city-500/10 shadow-neon'
                      : 'glass border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {/* Colour dot */}
                    <div className="w-3 h-3 rounded-full flex-shrink-0 animate-pulse-slow"
                         style={{ backgroundColor: bus.color }} />
                    <span className="font-display font-bold text-white text-sm">{bus.number}</span>
                    {bus.ac && <span className="text-[10px] text-sky-400 bg-sky-400/10 px-1 rounded">AC</span>}
                  </div>
                  <div className="text-[11px] text-slate-400 mb-1 truncate">{bus.name}</div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      bus.status === 'On Time'      ? 'bg-green-500/20 text-green-400'  :
                      bus.status === 'Delayed'      ? 'bg-red-500/20   text-red-400'    :
                      bus.status === 'Arriving Soon'? 'bg-city-500/20  text-city-400'   :
                      bus.status === 'Heavy Traffic'? 'bg-orange-500/20 text-orange-400':
                                                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {bus.status}
                    </span>
                    <span className="text-city-400 font-mono text-xs font-bold">{eta} min</span>
                  </div>
                  {/* Crowd bar */}
                  <div className="mt-2">
                    <div className="flex justify-between text-[9px] text-slate-500 mb-0.5">
                      <span>Crowd</span>
                      <span>{bus.currentPassengers}/{bus.capacity}</span>
                    </div>
                    <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(bus.currentPassengers / bus.capacity) * 100}%`,
                          backgroundColor: bus.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Legend */}
            <div className="glass rounded-xl p-3 text-xs space-y-1.5">
              <div className="text-slate-400 font-semibold mb-2">Map Legend</div>
              <div className="flex items-center gap-2 text-slate-400">
                <div className="w-3 h-3 rounded-full bg-city-500" /> Main Bus Stop
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <div className="w-2 h-2 rounded-full bg-slate-500" /> Minor Stop
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <div className="w-6 h-0.5 bg-city-500" style={{ borderTop: '2px dashed' }} /> Route Line
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
