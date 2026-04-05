import React, { useState, useEffect, useRef } from 'react';
import { useInView } from '../hooks/useInView';
import SectionLabel from './SectionLabel';

// ── Animated Number ────────────────────────────────────────
const AnimatedNumber: React.FC<{ target: number; suffix?: string; duration?: number }> = ({ target, suffix = '', duration = 1200 }) => {
  const [val, setVal] = useState(0);
  const { ref, inView } = useInView(0.3);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
};

// ── Stat Callout Card ──────────────────────────────────────
const StatCallout: React.FC<{ val: number; suffix: string; label: string; color: string; delay: number }> = ({ val, suffix, label, color, delay }) => {
  const { ref, inView } = useInView(0.3);
  return (
    <div ref={ref} style={{ background: 'white', borderRadius: 14, border: '1px solid var(--lgray)', padding: '1.2rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(15,31,92,.05)', opacity: inView?1:0, transform: inView?'none':'translateY(12px)', transition: `opacity .5s ${delay}s, transform .5s ${delay}s` }}>
      <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily:"'Syne',sans-serif", color, lineHeight: 1 }}>
        <AnimatedNumber target={val} suffix={suffix} />
      </div>
      <div style={{ fontSize: '.75rem', color: 'var(--mgray)', marginTop: '.4rem', lineHeight: 1.4 }}>{label}</div>
    </div>
  );
};

// ── Bar Chart ──────────────────────────────────────────────
interface BarData { label: string; value: number; color: string; }

const BarChart: React.FC<{ data: BarData[]; title: string; subtitle: string }> = ({ data, title, subtitle }) => {
  const { ref, inView } = useInView(0.2);
  const max = Math.max(...data.map(d => d.value));
  return (
    <div ref={ref} style={{ background: 'white', borderRadius: 16, border: '1px solid var(--lgray)', padding: '1.5rem', boxShadow: '0 2px 16px rgba(15,31,92,.05)', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(16px)', transition: 'opacity .6s, transform .6s' }}>
      <div style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '.2rem' }}>{title}</div>
      <div style={{ fontSize: '.75rem', color: 'var(--mgray)', marginBottom: '1.2rem' }}>{subtitle}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
        {data.map((d, i) => (
          <div key={d.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.25rem' }}>
              <span style={{ fontSize: '.8rem', color: 'var(--text)', fontWeight: 500 }}>{d.label}</span>
              <span style={{ fontSize: '.8rem', fontWeight: 700, color: d.color }}>{d.value}</span>
            </div>
            <div style={{ height: 8, background: 'var(--lgray)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: d.color, borderRadius: 4, width: inView ? `${(d.value / max) * 100}%` : '0%', transition: `width .8s ease ${i * 0.1}s` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Line Chart (SVG) ───────────────────────────────────────
const LineChart: React.FC<{ data: number[]; labels: string[]; color: string; title: string; subtitle: string; unit: string }> = ({ data, labels, color, title, subtitle, unit }) => {
  const { ref, inView } = useInView(0.2);
  const W = 320, H = 120, PAD = 20;
  const min = Math.min(...data) * 0.95;
  const max = Math.max(...data) * 1.05;
  const pts = data.map((v, i) => ({
    x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
    y: H - PAD - ((v - min) / (max - min)) * (H - PAD * 2),
  }));
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `${path} L${pts[pts.length-1].x},${H-PAD} L${pts[0].x},${H-PAD} Z`;

  return (
    <div ref={ref} style={{ background: 'white', borderRadius: 16, border: '1px solid var(--lgray)', padding: '1.5rem', boxShadow: '0 2px 16px rgba(15,31,92,.05)', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(16px)', transition: 'opacity .6s, transform .6s' }}>
      <div style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '.2rem' }}>{title}</div>
      <div style={{ fontSize: '.75rem', color: 'var(--mgray)', marginBottom: '.8rem' }}>{subtitle}</div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        <defs>
          <linearGradient id={`grad-${title.replace(/\s/g,'')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#grad-${title.replace(/\s/g,'')})`} />
        <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill={color} />
            <text x={p.x} y={H - 4} textAnchor="middle" fontSize="9" fill="#94a3b8">{labels[i]}</text>
            <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="8.5" fill={color} fontWeight="700">{data[i]}{unit}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// ── Cognitive Risk Score Simulator ────────────────────────
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
  const pct = score / 100;
  const angle = startAngle + pct * (endAngle - startAngle);
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcPath = (start: number, end: number, r: number) => {
    const s = { x: cx + r * Math.cos(toRad(start)), y: cy + r * Math.sin(toRad(start)) };
    const e = { x: cx + r * Math.cos(toRad(end)),   y: cy + r * Math.sin(toRad(end)) };
    const large = end - start > 180 ? 1 : 0;
    return `M${s.x.toFixed(2)},${s.y.toFixed(2)} A${r},${r} 0 ${large},1 ${e.x.toFixed(2)},${e.y.toFixed(2)}`;
  };

  return (
    <div ref={ref} style={{ marginTop: '2rem', borderRadius: 20, overflow: 'hidden', border: '1px solid #c7d2fe', background: 'linear-gradient(135deg,#f5f7ff,#faf8ff)', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(16px)', transition: 'opacity .6s .2s, transform .6s .2s' }}>
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
              <input
                type="range" min={0} max={100} value={sl.val}
                onChange={e => sl.set(Number(e.target.value))}
                style={{ width: '100%', accentColor: sl.color, cursor: 'pointer' }}
              />
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

// ── Main Component ─────────────────────────────────────────
const DataAnalysis: React.FC = () => (
  <section id="data" style={{ background: 'var(--off)', padding: '7rem 4rem' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <SectionLabel num="05" label="Data Analysis & Evidence" />
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, color:'var(--navy)', letterSpacing:'-.03em', lineHeight:1.05, marginBottom:'.5rem' }}>
        Real data behind<br />the problem.
      </h2>
      <p style={{ fontSize: '.95rem', color: 'var(--mgray)', marginBottom: '3rem', lineHeight: 1.6 }}>
        Based on TAAS (Traffic Accident Analysis System) 2019–2023 · Korea Road Traffic Authority · Samsung Traffic Safety Research Institute
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        <StatCallout val={35000} suffix="+" label="Elderly driver accidents (2023)" color="#dc2626" delay={0} />
        <StatCallout val={16}    suffix="%" label="Share of total accidents"        color="#6d28d9" delay={0.1} />
        <StatCallout val={41}    suffix="M" label="Elderly license holders"         color="#1d4ed8" delay={0.2} />
        <StatCallout val={8}     suffix="%" label="YoY growth in elderly drivers"   color="#d97706" delay={0.3} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <LineChart title="Elderly Accident Share" subtitle="2019–2023, % of total accidents" data={[14.5, 14.8, 15.2, 15.3, 15.9]} labels={['2019','2020','2021','2022','2023']} color="#6d28d9" unit="%" />
        <LineChart title="Elderly Fatality Rate"  subtitle="Deaths per 100 accidents"        data={[2.51, 2.73, 2.81, 2.60, 2.53]} labels={['2019','2020','2021','2022','2023']} color="#dc2626" unit="" />
        <LineChart title="Elderly License Holders" subtitle="Age 65+, in millions"           data={[3.1, 3.3, 3.6, 3.8, 4.1]}      labels={['2019','2020','2021','2022','2023']} color="#1d4ed8" unit="M" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <BarChart
          title="Accident Rate by Age Group (2023)"
          subtitle="Accidents per 10,000 license holders"
          data={[
            { label: '20s', value: 12.4, color: '#d97706' },
            { label: '30s', value: 8.1,  color: '#059669' },
            { label: '40s', value: 9.3,  color: '#059669' },
            { label: '50s', value: 10.2, color: '#d97706' },
            { label: '60s', value: 12.8, color: '#d97706' },
            { label: '70s', value: 18.6, color: '#dc2626' },
            { label: '80+', value: 24.1, color: '#dc2626' },
          ]}
        />
        <BarChart
          title="Fatality Rate by Age Group (2023)"
          subtitle="Deaths per 100 accidents"
          data={[
            { label: '20s', value: 1.1, color: '#059669' },
            { label: '30s', value: 0.9, color: '#059669' },
            { label: '40s', value: 1.0, color: '#059669' },
            { label: '50s', value: 1.2, color: '#d97706' },
            { label: '60s', value: 1.8, color: '#d97706' },
            { label: '70s', value: 2.9, color: '#dc2626' },
            { label: '80+', value: 4.2, color: '#dc2626' },
          ]}
        />
      </div>

      <Simulator />
    </div>
  </section>
);

export default DataAnalysis;