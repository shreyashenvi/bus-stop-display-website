// ─── AIPredictionPanel.jsx ───────────────────────────────────────────────────
// Simulated AI/ML prediction dashboard showing traffic, crowd, weather, peak hour
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { ENV_CONDITIONS, TRAFFIC_LEVELS, PEAK_HOURS } from '../data/busData';

// Detect if current time is a peak hour
function detectPeakHour() {
  const h = new Date().getHours();
  return PEAK_HOURS.find((p) => h >= p.start && h < p.end) || null;
}

// Radial gauge SVG for traffic
function TrafficGauge({ pct, color, label }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center">
      <svg width="110" height="110" viewBox="0 0 110 110">
        {/* Background ring */}
        <circle cx="55" cy="55" r={r} fill="none" stroke="#1e293b" strokeWidth="8" />
        {/* Progress ring */}
        <circle
          cx="55" cy="55" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          transform="rotate(-90 55 55)"
          style={{ transition: 'stroke-dasharray 1s ease', filter: `drop-shadow(0 0 8px ${color})` }}
        />
        {/* Centre text */}
        <text x="55" y="50" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="Share Tech Mono">
          {pct}%
        </text>
        <text x="55" y="67" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="DM Sans">
          congestion
        </text>
      </svg>
      <div className="text-sm font-semibold mt-1" style={{ color }}>{label}</div>
    </div>
  );
}

// Crowd indicator bar
function CrowdBar({ level }) {
  const levels = ['Empty', 'Low', 'Moderate', 'High', 'Packed'];
  const idx    = levels.indexOf(level);
  const colors = ['bg-green-400', 'bg-green-400', 'bg-yellow-400', 'bg-orange-400', 'bg-red-500'];

  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
        <span>Crowd Level</span>
        <span className={`font-bold ${['text-green-400','text-green-400','text-yellow-400','text-orange-400','text-red-500'][idx]}`}>
          {level}
        </span>
      </div>
      <div className="flex gap-1">
        {levels.map((l, i) => (
          <div
            key={l}
            className={`flex-1 h-2 rounded-full transition-all duration-700 ${
              i <= idx ? colors[idx] : 'bg-slate-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// AI insight card
function InsightCard({ icon, title, value, sub, accent, delay }) {
  return (
    <div
      className="glass rounded-2xl p-5 flex flex-col gap-2 animate-slide-up border"
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
        borderColor: `${accent}33`,
      }}
    >
      <div className="text-3xl">{icon}</div>
      <div className="text-xs text-slate-400 uppercase tracking-widest font-mono">{title}</div>
      <div className="text-2xl font-display font-bold" style={{ color: accent }}>{value}</div>
      <div className="text-xs text-slate-400">{sub}</div>
    </div>
  );
}

export default function AIPredictionPanel() {
  const [traffic, setTraffic]   = useState(TRAFFIC_LEVELS[1]);
  const [weather, setWeather]   = useState(ENV_CONDITIONS[0]);
  const [crowd, setCrowd]       = useState('Moderate');
  const [peakHour, setPeakHour] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [prediction, setPrediction] = useState(null);

  // Simulate AI re-analysis every 8 seconds
  useEffect(() => {
    const run = () => {
      setTraffic(TRAFFIC_LEVELS[Math.floor(Math.random() * TRAFFIC_LEVELS.length)]);
      setWeather(ENV_CONDITIONS[Math.floor(Math.random() * ENV_CONDITIONS.length)]);
      const crowds = ['Empty', 'Low', 'Moderate', 'High', 'Packed'];
      setCrowd(crowds[Math.floor(Math.random() * crowds.length)]);
      setPeakHour(detectPeakHour());
    };
    run();
    const id = setInterval(run, 8000);
    return () => clearInterval(id);
  }, []);

  // Simulate AI prediction generation
  const runPrediction = () => {
    setPredicting(true);
    setPrediction(null);
    setTimeout(() => {
      const delays = traffic.pct > 60
        ? ['401K delayed ~8 min', '225N may skip Nayandahalli stop', 'V-335 heavy congestion near Mysore Rd']
        : ['401K on schedule', '500D arriving in 2 min', 'KBS-9 slight 3 min delay due to signal'];
      setPrediction({
        delays,
        recommendation: traffic.pct > 60
          ? 'Consider taking Banashankari Metro and connecting to 225N at Kengeri'
          : 'All routes operating normally. 401K is your fastest option now.',
        confidence: Math.floor(78 + Math.random() * 18),
      });
      setPredicting(false);
    }, 2200);
  };

  const crowdIdx   = ['Empty','Low','Moderate','High','Packed'].indexOf(crowd);
  const crowdColor = ['#10b981','#22c55e','#f59e0b','#f97316','#ef4444'][crowdIdx] || '#f59e0b';

  return (
    <section id="ai-insights" className="py-16 px-4 relative">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-purple-400 bg-purple-400/10 border border-purple-400/20 rounded-full px-4 py-1 mb-3">
            🤖 AI/ML ENGINE · REAL-TIME ANALYSIS
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2">
            AI <span className="text-purple-400">Prediction</span> Centre
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Machine-learning model predicts delays using traffic congestion data,
            peak-hour patterns, and crowd density analysis.
          </p>
        </div>

        {/* Top insight cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <InsightCard
            icon="🚦" title="Traffic"
            value={traffic.label}
            sub={`Congestion: ${traffic.pct}% of max capacity`}
            accent={traffic.color} delay={0}
          />
          <InsightCard
            icon={weather.icon} title="Weather"
            value={weather.label}
            sub="No major weather disruptions expected"
            accent="#38bdf8" delay={100}
          />
          <InsightCard
            icon="👥" title="Crowd Level"
            value={crowd}
            sub={`Avg ${crowdIdx + 1}/5 across all buses`}
            accent={crowdColor} delay={200}
          />
          <InsightCard
            icon="🕐" title="Peak Hour"
            value={peakHour ? peakHour.label : 'Off-Peak'}
            sub={peakHour ? 'Expect 15–25% longer ETAs' : 'Normal service intervals apply'}
            accent={peakHour ? '#f59e0b' : '#10b981'} delay={300}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Traffic gauge */}
          <div className="glass rounded-2xl p-6 flex flex-col items-center gap-4">
            <div className="font-display font-bold text-white text-base mb-2">Traffic Congestion Index</div>
            <TrafficGauge pct={traffic.pct} color={traffic.color} label={traffic.label} />
            <CrowdBar level={crowd} />
            <div className="text-xs text-slate-400 text-center mt-2">
              Based on RR Nagar road sensor data & historical BMTC patterns
            </div>
          </div>

          {/* AI predictor */}
          <div className="lg:col-span-2 glass rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display font-bold text-white text-base">Delay Predictor</div>
                <div className="text-xs text-slate-400">Click to generate AI analysis</div>
              </div>
              <button
                onClick={runPrediction}
                disabled={predicting}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  predicting
                    ? 'bg-purple-500/30 text-purple-300 cursor-wait'
                    : 'bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 hover:scale-105'
                }`}
              >
                {predicting ? '🤖 Analysing...' : '⚡ Run AI Analysis'}
              </button>
            </div>

            {/* Loading state */}
            {predicting && (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8">
                <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <div className="text-purple-400 text-sm font-mono animate-pulse">
                  Processing traffic patterns…
                </div>
                <div className="text-slate-500 text-xs">Analysing 24hr BMTC data for RR Nagar</div>
              </div>
            )}

            {/* Prediction result */}
            {!predicting && prediction && (
              <div className="space-y-4 animate-slide-up">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-mono mb-2">Predicted Delays</div>
                  <div className="space-y-2">
                    {prediction.delays.map((d, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                        <span className="text-slate-300">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                  <div className="text-xs text-purple-400 font-mono uppercase tracking-widest mb-1">💡 AI Recommendation</div>
                  <div className="text-sm text-slate-300">{prediction.recommendation}</div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-xs text-slate-400 font-mono">Model Confidence:</div>
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-city-500 rounded-full transition-all duration-1000"
                      style={{ width: `${prediction.confidence}%` }}
                    />
                  </div>
                  <div className="text-purple-400 font-mono text-xs font-bold">{prediction.confidence}%</div>
                </div>
              </div>
            )}

            {/* Default state */}
            {!predicting && !prediction && (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8 text-center">
                <div className="text-4xl">🤖</div>
                <div className="text-slate-400 text-sm">
                  AI model ready. Click "Run AI Analysis" to predict
                  upcoming delays based on current conditions.
                </div>
                <div className="text-slate-500 text-xs mt-1">
                  Uses Random Forest + LSTM hybrid model trained on 2 years of BMTC data
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tech badges */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {['Random Forest', 'LSTM Neural Net', 'Real-time GPS', 'Traffic Sensors', 'Crowd Analytics', 'Peak-Hour Model'].map((t) => (
            <span key={t} className="px-3 py-1 rounded-full glass text-xs text-slate-300 border border-white/10 font-mono">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
