import React from 'react';
import { useInView } from '../hooks/useInView';
import SectionLabel from './SectionLabel';
import DataCharts from './DataCharts';

const Panel: React.FC<{ title: string; delay?: number; children: React.ReactNode }> = ({ title, delay = 0, children }) => {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} style={{
      background: 'white', border: '1px solid var(--lgray)', borderRadius: 16,
      overflow: 'hidden', boxShadow: '0 2px 16px rgba(15,31,92,.04)',
      opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(16px)',
      transition: `opacity .5s ${delay}s, transform .5s ${delay}s`,
    }}>
      <div style={{ padding: '.9rem 1.4rem', background: 'linear-gradient(135deg,#0f1f5c,#6d28d9)', color: 'white', fontSize: '.78rem', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' as const }}>{title}</div>
      <div style={{ padding: '1.4rem' }}>{children}</div>
    </div>
  );
};

const limits = [
  'Blackbox data exists but is only retrieved after accident claims — never used proactively',
  'No real-time anomaly detection while driving is in progress',
  'No intervention mechanism before an accident occurs',
  'Premium adjustment based solely on age — ignoring actual cognitive state entirely',
  '"70-year-old with sharp cognition" is treated identically to "70-year-old with early decline"',
];

const renewals = [
  { age: 'Under 65', freq: 'Every 5 Years', bg: '#f0fdf4', col: '#059669' },
  { age: 'Age 65–74', freq: 'Every 3 Years', bg: '#fffbeb', col: '#d97706' },
  { age: 'Age 75+',   freq: 'Every 1 Year',  bg: '#fef2f2', col: '#dc2626' },
];

const unsolved = [
  { icon: '🔒', title: 'Privacy Concerns',       body: 'Continuous real-time driving data collection raises personal data sensitivity issues that discouraged past attempts at proactive monitoring.' },
  { icon: '📡', title: 'No Data Infrastructure', body: 'Real-time OBD sensor + camera integration pipeline had no precedent in the insurance ecosystem, making the problem appear technically intractable.' },
  { icon: '💡', title: 'No Incentive Structure', body: 'Without a financial mechanism to reward cognitive-safe behavior or voluntary driving restraint, there was no reason for drivers or insurers to act proactively.' },
];

interface UnsolvedItem { icon: string; title: string; body: string; }
const UnsolvedCard: React.FC<{ item: UnsolvedItem; delay: number }> = ({ item, delay }) => {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} style={{
      background:'white', border:'1px solid var(--lgray)', borderRadius:16,
      padding:'1.5rem', position:'relative', overflow:'hidden',
      boxShadow:'0 2px 16px rgba(15,31,92,.04)',
      opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(16px)',
      transition: `opacity .5s ${delay}s, transform .5s ${delay}s`,
    }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#1d4ed8,#6d28d9)' }} />
      <div style={{ fontSize:'1.6rem', marginBottom:'.8rem' }}>{item.icon}</div>
      <h4 style={{ fontSize:'.9rem', fontWeight:700, color:'var(--navy)', marginBottom:'.5rem' }}>{item.title}</h4>
      <p style={{ fontSize:'.83rem', color:'var(--mgray)', lineHeight:1.55 }}>{item.body}</p>
    </div>
  );
};

const Analysis: React.FC = () => (
  <section id="analysis" style={{ background: 'var(--off)', padding: '7rem 4rem' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <SectionLabel num="02" label="Current Situation Analysis" />
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, color:'var(--navy)', letterSpacing:'-.03em', lineHeight:1.05, marginBottom:'1rem' }}>
        Structural limits that leave<br />the gap unsolved.
      </h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem', marginTop:'3.5rem' }}>
        <Panel title="Limits of Current Insurance Structure">
          {limits.map((l, i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'.8rem', padding:'.75rem 0', borderBottom: i < limits.length-1 ? '1px solid var(--lgray)' : 'none', fontSize:'.86rem', color:'var(--text)', lineHeight:1.5 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:'linear-gradient(135deg,#1d4ed8,#6d28d9)', flexShrink:0, marginTop:6 }} />
              {l}
            </div>
          ))}
        </Panel>
        <Panel title="License Renewal Cycle — Too Slow to Catch Decline" delay={0.1}>
          {renewals.map(r => (
            <div key={r.age} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'.8rem .9rem', borderRadius:8, background:r.bg, marginBottom:'.6rem', gap:'1rem' }}>
              <div>
                <div style={{ fontSize:'.88rem', fontWeight:600, color:'var(--dgray)' }}>{r.age}</div>
                <div style={{ fontSize:'.75rem', fontStyle:'italic', color:'var(--mgray)', marginTop:2 }}>→ Gradual decline missed between renewals</div>
              </div>
              <div style={{ fontSize:'.85rem', fontWeight:700, color:r.col, whiteSpace:'nowrap' }}>{r.freq}</div>
            </div>
          ))}
        </Panel>
        <div style={{ gridColumn:'1 / -1', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }}>
          {unsolved.map((u, i) => <UnsolvedCard key={u.title} item={u} delay={i * 0.1} />)}
        </div>
      </div>

      {/* Data Charts */}
      <div style={{ marginTop: '4rem' }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'1.5rem', fontWeight:800, color:'var(--navy)', letterSpacing:'-.02em', marginBottom:'.5rem' }}>
          Supporting Evidence
        </div>
        <DataCharts />
      </div>

    </div>
  </section>
);

export default Analysis;