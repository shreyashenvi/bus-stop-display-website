// ─── AlertBanner.jsx ─────────────────────────────────────────────────────────
// Emergency / system alerts that rotate automatically
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { ALERTS } from '../data/busData';

export default function AlertBanner() {
  const [idx, setIdx]     = useState(0);
  const [visible, setVisible] = useState(true);

  // Rotate alert every 6 seconds with fade
  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % ALERTS.length);
        setVisible(true);
      }, 400);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const alert = ALERTS[idx];
  const styles = {
    warning:  { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: '⚠️', text: 'text-amber-400' },
    info:     { bg: 'bg-sky-500/10',   border: 'border-sky-500/30',   icon: 'ℹ️', text: 'text-sky-400'   },
    critical: { bg: 'bg-red-500/10',   border: 'border-red-500/30',   icon: '🚨', text: 'text-red-400'   },
  };
  const s = styles[alert.type] || styles.info;

  return (
    <div className={`mx-4 my-2 rounded-xl px-4 py-3 border ${s.bg} ${s.border} transition-opacity duration-400 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-6xl mx-auto flex items-center gap-3">
        <span className="text-lg flex-shrink-0">{s.icon}</span>
        <div className="flex-1 min-w-0">
          <span className={`text-xs font-bold uppercase tracking-widest ${s.text} mr-2`}>
            {alert.type === 'critical' ? 'ALERT' : alert.type === 'warning' ? 'WARNING' : 'INFO'}
          </span>
          <span className="text-slate-300 text-xs sm:text-sm">{alert.msg}</span>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          {ALERTS.map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? s.text.replace('text','bg') : 'bg-slate-600'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
