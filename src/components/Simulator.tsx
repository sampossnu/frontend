import React, { useState } from 'react';
import { useInView } from '../hooks/useInView';
import SectionLabel from './SectionLabel';

const Simulator: React.FC = () => {
  const { ref, inView } = useInView(0.2);
  const [behavioral, setBehavioral] = useState(70);
  const [cognitive,  setCognitive]  = useState(75);
  const [visual,     setVisual]     = useState(80);

  const score = Math.round(behavioral * 0.35 + cognitive * 0.40 + visual * 0.25);
  const risk = score >= 75 ? 'Low Risk' : score >= 60 ? 'Moderate Risk' : 'High Risk — Alert Triggered';
  const riskColor = score >= 75 ? '#059669' : score >= 60 ? '#d97706' : '#dc2626';
  const riskBg    = score >= 75 ? '#f0fdf4' : score >= 60 ? '#fffbeb' : '#fef2f2';

  const sliders = [
    { label: 'Behavioral Layer', sub: 'OBD: braking · lane departure · speed', val: behavioral, set: setBehavioral, color: '#1d4ed8', weight: '35%' },
    { label: 'Cognitive Layer',  sub: 'LSTM: reaction time · steering delay',  val: cognitive,  set: setCognitive,  color: '#6d28d9', weight: '40%' },
    { label: 'Visual Layer',     sub: 'CV: forward gaze · attention lapse',     val: visual,     set: setVisual,     color: '#0f1f5c', weight: '25%' },
  ];

  const radius = 80, cx = 110, cy = 105;
  const startAngle = -210, endAngle = 30;
  const angle = startAngle + (score / 100) * (endAngle - startAngle);
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcPath = (start: number, end: number, r: number) => {
    const s = { x: cx + r * Math.cos(toRad(start)), y: cy + r * Math.sin(toRad(start)) };
    const e = { x: cx + r * Math.cos(toRad(end)),   y: cy + r * Math.sin(toRad(end)) };
    const large = end - start > 180 ? 1 : 0;
    return `M${s.x.toFixed(2)},${s.y.toFixed(2)} A${r},${r} 0 ${large},1 ${e.x.toFixed(2)},${e.y.toFixed(2)}`;
  };

  return (
    <div ref={ref} style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid #c7d2fe', background: 'linear-gradient(135deg,#f5f7ff,#faf8ff)', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(16px)', transition: 'opacity .6s .2s, transform .6s .2s' }}>
      <div style={{ padding: '1rem 1.8rem', background: 'linear-gradient(135deg,#0f1f5c,#6d28d9)', color: 'white', fontSize: '.85rem', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' as const }}>
        🎛️ Cognitive Risk Score Simulator — Interactive Demo
      </div>
      <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2.5rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg viewBox="0 0 220 130" style={{ width: '100%', maxWidth: 220 }}>
            <path d={arcPath(startAngle, endAngle, radius)} fill="none" stroke="#e2e8f0" strokeWidth="14" strokeLinecap="round" />
            <path d={arcPath(startAngle, angle, radius)} fill="none" stroke={riskColor} strokeWidth="14" strokeLinecap="round" style={{ transition: 'all .4s ease' }} />
            <text x={cx} y={cy - 10} textAnchor="middle" fontSize="32" fontWeight="800" fill={riskColor} style={{ transition: 'fill .4s' }}>{score}</text>
            <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="#94a3b8">out of 100</text>
          </svg>
          <div style={{ textAlign: 'center', padding: '.5rem 1rem', borderRadius: 20, background: riskBg, color: riskColor, fontSize: '.78rem', fontWeight: 700, border: `1px solid ${riskColor}30`, transition: 'all .4s' }}>
            {risk}
          </div>
          <div style={{ marginTop: '.8rem', fontSize: '.72rem', color: 'var(--mgray)', textAlign: 'center', lineHeight: 1.5 }}>
            Score &lt; 65 triggers<br />staged alert system
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          {sliders.map(sl => (
            <div key={sl.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '.4rem' }}>
                <div>
                  <span style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--navy)' }}>{sl.label}</span>
                  <span style={{ marginLeft: '.5rem', fontSize: '.72rem', fontFamily: 'monospace', background: '#eef2ff', color: '#4338ca', padding: '.1rem .4rem', borderRadius: 4 }}>weight {sl.weight}</span>
                </div>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: sl.color }}>{sl.val}</span>
              </div>
              <div style={{ fontSize: '.74rem', color: 'var(--mgray)', marginBottom: '.5rem' }}>{sl.sub}</div>
              <input type="range" min={0} max={100} value={sl.val} onChange={e => sl.set(Number(e.target.value))} style={{ width: '100%', accentColor: sl.color, cursor: 'pointer' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.68rem', color: 'var(--lgray)' }}>
                <span>0 — High Risk</span><span>100 — Low Risk</span>
              </div>
            </div>
          ))}
          <div style={{ background: 'white', border: '1px solid var(--lgray)', borderRadius: 10, padding: '.8rem 1rem', fontSize: '.75rem', color: 'var(--text)', fontFamily: 'monospace' }}>
            Score = <span style={{ color: '#1d4ed8' }}>Behavioral({behavioral}) × 0.35</span> + <span style={{ color: '#6d28d9' }}>Cognitive({cognitive}) × 0.40</span> + <span style={{ color: '#0f1f5c' }}>Visual({visual}) × 0.25</span> = <strong style={{ color: riskColor, fontSize: '.85rem' }}>{score}</strong>
          </div>
        </div>
      </div>
      <div style={{ padding: '.8rem 1.8rem', background: '#ede9fe', borderTop: '1px solid #c4b5fd', fontSize: '.75rem', color: '#6d28d9', fontFamily: 'monospace' }}>
        🤖 AI Scope — LSTM (Cognitive) · Isolation Forest (Behavioral) · MediaPipe CV (Visual) · Weighted composite scoring engine
      </div>
    </div>
  );
};

const DataAnalysis: React.FC = () => (
  <section id="simulator" style={{ background: 'white', padding: '7rem 4rem' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <SectionLabel num="05" label="AI Score Simulator" />
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, color:'var(--navy)', letterSpacing:'-.03em', lineHeight:1.05, marginBottom:'1rem' }}>
        See DriveGuard<br />in action.
      </h2>
      <Simulator />
    </div>
  </section>
);

export default DataAnalysis;