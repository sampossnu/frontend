import React from 'react';
import { useInView } from '../hooks/useInView';

// ── Animated Number ────────────────────────────────────────
export const AnimatedNumber: React.FC<{ target: number; suffix?: string; duration?: number }> = ({ target, suffix = '', duration = 1200 }) => {
  const [val, setVal] = React.useState(0);
  const { ref, inView } = useInView(0.3);
  React.useEffect(() => {
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

// ── Stat Callout ───────────────────────────────────────────
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

// ── Line Chart ─────────────────────────────────────────────
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
  const gradId = `grad-${title.replace(/\s/g,'')}`;

  return (
    <div ref={ref} style={{ background: 'white', borderRadius: 16, border: '1px solid var(--lgray)', padding: '1.5rem', boxShadow: '0 2px 16px rgba(15,31,92,.05)', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(16px)', transition: 'opacity .6s, transform .6s' }}>
      <div style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '.2rem' }}>{title}</div>
      <div style={{ fontSize: '.75rem', color: 'var(--mgray)', marginBottom: '.8rem' }}>{subtitle}</div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gradId})`} />
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

// ── Main Export ────────────────────────────────────────────
const DataCharts: React.FC = () => (
  <>
    <p style={{ fontSize: '.9rem', color: 'var(--mgray)', marginTop: '2rem', marginBottom: '2rem', lineHeight: 1.6 }}>
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
      <LineChart title="Elderly License Holders" subtitle="Age 65+, in millions"           data={[3.1, 3.3, 3.6, 3.8, 4.1]}     labels={['2019','2020','2021','2022','2023']} color="#1d4ed8" unit="M" />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
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
  </>
);

export default DataCharts;