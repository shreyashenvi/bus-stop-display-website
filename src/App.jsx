// ─── App.jsx ─────────────────────────────────────────────────────────────────
// Root component — orchestrates all sections, dark mode, expo mode, and loading
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useCallback } from 'react';

// ── Component imports ───────────────────────────────────────────────────────
import LoadingScreen    from './components/LoadingScreen';
import Navbar           from './components/Navbar';
import HeroSection      from './components/HeroSection';
import AlertBanner      from './components/AlertBanner';
import LiveMap          from './components/LiveMap';
import BusDisplayPanel  from './components/BusDisplayPanel';
import AIPredictionPanel from './components/AIPredictionPanel';
import ExpoMode         from './components/ExpoMode';
import Footer           from './components/Footer';

export default function App() {
  // ── State ─────────────────────────────────────────────────────────────────
  const [loading,  setLoading ] = useState(true);   // Show splash screen
  const [darkMode, setDarkMode] = useState(true);   // Dark / light theme
  const [expoMode, setExpoMode] = useState(false);  // Fullscreen expo display

  // Called when loading screen finishes
  const handleLoadDone = useCallback(() => setLoading(false), []);

  // Scroll to map section when "Start Tracking" is clicked in hero
  const handleStartTracking = () => {
    document.getElementById('live-map')?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    // Apply 'dark' class to root for Tailwind dark-mode support
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-950 text-white font-body">

        {/* ── Splash / Loading screen (covers everything on first load) ── */}
        {loading && <LoadingScreen onDone={handleLoadDone} />}

        {/* ── Expo / fullscreen projector mode ── */}
        {expoMode && <ExpoMode onClose={() => setExpoMode(false)} />}

        {/* ── Main app layout ── */}
        {!loading && (
          <>
            {/* Fixed top navbar */}
            <Navbar
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              onExpoMode={() => setExpoMode(true)}
            />

            {/* Rotating emergency / info alerts */}
            <div className="fixed top-[60px] left-0 right-0 z-40">
              <AlertBanner />
            </div>

            {/* ── Page sections ── */}
            <main>
              {/* 1. Hero landing section */}
              <HeroSection onStartTracking={handleStartTracking} />

              {/* 2. Live GPS map */}
              <LiveMap />

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-city-500/30 to-transparent mx-8" />

              {/* 3. Smart bus stop display board */}
              <BusDisplayPanel />

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mx-8" />

              {/* 4. AI prediction & analytics */}
              <AIPredictionPanel />

              {/* Expo mode promo card */}
              <section className="py-12 px-4">
                <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-10 border border-amber-500/20">
                  <div className="text-4xl mb-4">📺</div>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3">
                    Expo Presentation Mode
                  </h3>
                  <p className="text-slate-400 text-sm sm:text-base mb-6 max-w-lg mx-auto">
                    Switch to fullscreen bus stop display — large fonts, animated arrivals,
                    and auto-updating ETA board designed for projectors and demo screens.
                  </p>
                  <button
                    onClick={() => setExpoMode(true)}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-display font-bold text-base shadow-neon-amber hover:scale-105 transition-all duration-200"
                  >
                    🚀 Launch Expo Display Mode
                  </button>
                  <p className="text-slate-500 text-xs mt-3 font-mono">Press ESC to exit · Navbar button also available</p>
                </div>
              </section>
            </main>

            {/* Footer */}
            <Footer />
          </>
        )}
      </div>
    </div>
  );
}
