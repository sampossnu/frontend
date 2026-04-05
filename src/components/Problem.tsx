import React from 'react';
import { useInView } from '../hooks/useInView';
import SectionLabel from './SectionLabel';

interface ProblemCard { icon: string; title: string; body: string; }
interface StatCard { val: string; desc: string; dark?: boolean; }

const problems: ProblemCard[] = [
  { icon: '⚠️', title: 'Cognitive Decline Goes Undetected',    body: "Elderly drivers' cognitive changes accumulate silently. Current systems have no mechanism to detect decline before a fatal accident happens." },
  { icon: '⏱️', title: 'Renewal Cycles Are Too Slow',           body: 'License renewals happen every 1–5 years depending on age. Gradual cognitive decline is entirely missed between these long gaps.' },
  { icon: '👤', title: 'Drivers Are Unaware of Their Changes',  body: 'Cognitive decline is often imperceptible to the individual. Drivers continue driving without knowing their risk profile has changed.' },
  { icon: '👨‍👩‍👧', title: 'Families Have No Objective Data',    body: 'Family members who notice changes have no data-backed basis to support early intervention or suggest driving restraint.' },
];

const statCards: StatCard[] = [
  { val: '4,000,000+', desc: 'Elderly license holders in Korea as of 2025, growing at approximately 8% annually', dark: true },
  { val: '1.8×',       desc: 'Higher fatality rate in elderly driver accidents versus the national average' },
  { val: '5 Years',    desc: 'Minimum license renewal cycle for drivers under 65 — far too long to detect gradual cognitive decline' },
];

const FadeCard: React.FC<{ delay?: number; tx?: number; children: React.ReactNode; style?: React.CSSProperties }> =
  ({ delay = 0, tx = 0, children, style }) => {
    const { ref, inView } = useInView();
    return (
      <div ref={ref} style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : `translateX(${tx}px)`,
        transition: `opacity .5s ${delay}s, transform .5s ${delay}s`,
        ...style,
      }}>{children}</div>
    );
  };

const Problem: React.FC = () => (
  <section id="problem" style={{ background: 'white', padding: '7rem 4rem' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <SectionLabel num="01" label="Problem Definition" />
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, color: 'var(--navy)', letterSpacing:'-.03em', lineHeight:1.05, marginBottom:'1rem' }}>
        Insurance today only reacts<br />after accidents occur.
      </h2>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'start', marginTop:'3.5rem' }}>
        {/* Left */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {problems.map((p, i) => (
            <FadeCard key={p.title} delay={i * 0.08} tx={-20}>
              <div style={{
                display:'flex', alignItems:'flex-start', gap:'1rem',
                padding:'1.4rem 1.5rem',
                background:'var(--off)',
                border:'1px solid var(--lgray)', borderLeft:'3px solid transparent',
                borderRadius:12,
                cursor:'default',
                transition:'all .3s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderLeftColor = 'var(--violet)';
                el.style.background = '#faf8ff';
                el.style.transform = 'translateX(4px)';
                el.style.boxShadow = '0 4px 20px rgba(109,40,217,.08)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderLeftColor = 'transparent';
                el.style.background = 'var(--off)';
                el.style.transform = 'none';
                el.style.boxShadow = 'none';
              }}>
                <div style={{ width:36, height:36, borderRadius:8, background:'#fef3c7', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'1rem' }}>{p.icon}</div>
                <div>
                  <strong style={{ display:'block', fontSize:'.9rem', fontWeight:600, color:'var(--dgray)', marginBottom:'.25rem' }}>{p.title}</strong>
                  <p style={{ fontSize:'.84rem', color:'var(--mgray)', lineHeight:1.5 }}>{p.body}</p>
                </div>
              </div>
            </FadeCard>
          ))}
          <div style={{ marginTop:'.5rem' }}>
            <p style={{ fontSize:'.8rem', color:'var(--mgray)', marginBottom:'.6rem', fontWeight:500 }}>Stakeholders Affected</p>
            <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
              {['Elderly Drivers','Families','Insurers','Society at Large'].map(s => (
                <span key={s} style={{ fontSize:'.75rem', fontWeight:500, padding:'.3rem .8rem', borderRadius:20, background:'#eef2ff', color:'var(--indigo)', border:'1px solid #c7d2fe' }}>{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
          {statCards.map((sc, i) => (
            <FadeCard key={sc.val} delay={i * 0.1} tx={20}>
              <div style={{
                padding:'1.8rem 2rem', borderRadius:16, position:'relative', overflow:'hidden',
                background: sc.dark ? 'linear-gradient(135deg,#0f1f5c,#6d28d9)' : 'white',
                border: sc.dark ? 'none' : '1px solid var(--lgray)',
              }}>
                <div style={{ fontSize:'3.5rem', fontWeight:800, fontFamily:"'Syne',sans-serif", lineHeight:1, letterSpacing:'-.04em',
                  ...(sc.dark ? { color:'#60a5fa' } : { background:'linear-gradient(135deg,#1d4ed8,#6d28d9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' as const })
                }}>{sc.val}</div>
                <div style={{ fontSize:'.88rem', lineHeight:1.5, marginTop:'.5rem', color: sc.dark ? 'rgba(255,255,255,.75)' : 'var(--mgray)' }}>{sc.desc}</div>
              </div>
            </FadeCard>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Problem;