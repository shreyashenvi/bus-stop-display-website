// ─── Footer.jsx ──────────────────────────────────────────────────────────────
// Project credits and tech stack footer
// ─────────────────────────────────────────────────────────────────────────────
export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 px-4 mt-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          {/* Project info */}
          <div>
            <div className="font-display font-bold text-city-400 text-lg mb-2">
              🚌 SmartBus RR Nagar
            </div>
            <div className="text-xs text-slate-400 leading-relaxed">
              Smart Bus Stop Information Display System — a final-year engineering
              project prototype simulating GPS-based real-time BMTC bus tracking
              for RR Nagar, Bengaluru.
            </div>
          </div>

          {/* Tech stack */}
          <div>
            <div className="font-semibold text-white text-sm mb-3">Tech Stack</div>
            <div className="flex flex-wrap gap-1.5">
              {['React 18', 'Vite', 'Tailwind CSS', 'Leaflet.js', 'JavaScript'].map((t) => (
                <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono border border-slate-700">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* College info */}
          <div>
            <div className="font-semibold text-white text-sm mb-3">Project Details</div>
            <div className="text-xs text-slate-400 space-y-1">
              <div>🎓 RNS Institute of Technology</div>
              <div>📍 RR Nagar, Bengaluru – 560098</div>
              <div>🏷️ Smart City Transportation System</div>
              <div>📅 Engineering Project Expo</div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            Built with ❤️ for RNSIT Engineering Expo · Simulation prototype — no real GPS data
          </div>
          <div className="font-mono">
            BMTC routes are realistic but not live
          </div>
        </div>
      </div>
    </footer>
  );
}
