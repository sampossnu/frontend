import React, { useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/useInView';
import SectionLabel from './SectionLabel';

interface Phase { n: string; title: string; sub: string; items: string[]; }
interface KPI    { val: string; desc: string; }
interface SV     { emoji: string; title: string; body: string; }
interface Eval   { label: string; pct: string; width: number; }

const phases: Phase[] = [
  { n:'1', title:'PHASE 1 — Pilot',    sub:'6 Months', items:['500 Samsung Fire elderly policyholders recruited','Free OBD device provisioned on consent-only basis','Real-time data collection pipeline established'] },
  { n:'2', title:'PHASE 2 — Validate', sub:'6 Months', items:['Train & validate Cognitive Risk Score model','Correlate score against accident history data','Actuarial analysis for score-to-premium mapping'] },
  { n:'3', title:'PHASE 3 — Scale-up', sub:'Ongoing',  items:['Full product launch to all policyholders','Partner: Road Traffic Authority + Ministry of Welfare','Cross-reference data with license renewal records'] },
];

const kpis: KPI[] = [
  { val:'15–20%', desc:'Accident rate reduction among elderly drivers' },
  { val:'₩80B+',  desc:'Annual claims savings — Samsung Fire estimate' },
  { val:'500K+',  desc:'Drivers protected by Scale-up Phase 3' },
];

const svItems: SV[] = [
  { emoji:'🤝', title:'Dignity for Elderly Drivers',  body:'Objective self-assessment without stigma; families gain data-backed basis for early intervention.' },
  { emoji:'🌿', title:'Sustainable Road Safety',      body:'Insurer transforms from passive payer into proactive road safety partner for an aging society.' },
  { emoji:'🛡️', title:'Ethical AI Governance',       body:'Consent-only data collection; Cognitive Risk Score used solely for premium — no third-party sharing.' },
];

const evals: Eval[] = [
  { label:'Creativity & Innovation', pct:'40%', width:1 },
  { label:'Social Value & Impact',   pct:'30%', width:.75 },
  { label:'Feasibility',             pct:'30%', width:.75 },
];

const EvalBar: React.FC<{ e: Eval; delay: number }> = ({ e, delay }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [go, setGo] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setGo(true); obs.unobserve(el); } }, { threshold:.5 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ marginBottom:'1rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'.4rem' }}>
        <span style={{ fontSize:'.82rem', fontWeight:500, color:'var(--dgray)' }}>{e.label}</span>
        <span style={{ fontSize:'.82rem', fontWeight:700, color:'var(--navy)' }}>{e.pct}</span>
      </div>
      <div style={{ height:6, background:'var(--lgray)', borderRadius:3, overflow:'hidden' }}>
        <div style={{ height:'100%', background:'linear-gradient(90deg,#1d4ed8,#6d28d9)', borderRadius:3, transform: go ? 'scaleX(1)' : 'scaleX(0)', transformOrigin:'left', transition:`transform 1s ease ${delay}s`, width:`${e.width*100}%` }} />
      </div>
    </div>
  );
};

const SideCard: React.FC<{ delay?: number; children: React.ReactNode }> = ({ delay = 0, children }) => {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} style={{ background:'white', borderRadius:16, border:'1px solid var(--lgray)', overflow:'hidden', boxShadow:'0 2px 16px rgba(15,31,92,.04)', opacity: inView?1:0, transform: inView?'none':'translateX(16px)', transition:`opacity .5s ${delay}s, transform .5s ${delay}s` }}>
      {children}
    </div>
  );
};

const CardHead: React.FC<{ label: string }> = ({ label }) => (
  <div style={{ padding:'.8rem 1.3rem', background:'linear-gradient(135deg,#0f1f5c,#6d28d9)', color:'white', fontSize:'.78rem', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase' as const }}>{label}</div>
);

const PhaseRow: React.FC<{ phase: Phase; index: number; total: number }> = ({ phase: p, index: i, total }) => {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} style={{ display:'flex', gap:'1.4rem', opacity:inView?1:0, transform:inView?'none':'translateX(-16px)', transition:`opacity .5s ${i*.1}s, transform .5s ${i*.1}s` }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
        <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#1d4ed8,#6d28d9)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'1rem', color:'white', boxShadow:'0 4px 16px rgba(109,40,217,.3)', flexShrink:0, zIndex:1 }}>{p.n}</div>
        {i < total - 1 && <div style={{ width:2, flex:1, background:'var(--lgray)', minHeight:24 }} />}
      </div>
      <div style={{ padding:`0 0 ${i < total - 1 ? '2rem' : '0'}`, flex:1 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:'.75rem', marginBottom:'.6rem' }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:'1rem', fontWeight:700, color:'var(--navy)' }}>{p.title}</span>
          <span style={{ fontSize:'.78rem', fontWeight:600, color:'var(--violet)' }}>{p.sub}</span>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'.35rem' }}>
          {p.items.map(it => (
            <span key={it} style={{ fontSize:'.83rem', color:'var(--text)', lineHeight:1.4, display:'flex', alignItems:'flex-start', gap:'.5rem' }}>
              <span style={{ color:'var(--violet)', fontSize:'.8rem', flexShrink:0, marginTop:1 }}>→</span>{it}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const Implementation: React.FC = () => (
  <section id="implementation" style={{ background:'var(--off)', padding:'7rem 4rem' }}>
    <div style={{ maxWidth:1200, margin:'0 auto' }}>
      <SectionLabel num="04" label="Implementation & Social Value" />
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, color:'var(--navy)', letterSpacing:'-.03em', lineHeight:1.05, marginBottom:'1rem' }}>
        Phased rollout with measurable<br />impact at every stage.
      </h2>
      <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:'2rem', marginTop:'3.5rem' }}>
        <div>
          {phases.map((p, i) => <PhaseRow key={p.n} phase={p} index={i} total={phases.length} />)}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
          <SideCard>
            <CardHead label="Projected Impact" />
            <div style={{ padding:'.5rem' }}>
              {kpis.map(k => (
                <div key={k.val} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'.9rem 1rem', borderRadius:10, background:'var(--off)', marginBottom:'.4rem', gap:'1rem' }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'1.6rem', fontWeight:800, background:'linear-gradient(135deg,#0f1f5c,#6d28d9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' as const }}>{k.val}</div>
                  <div style={{ fontSize:'.8rem', color:'var(--mgray)', lineHeight:1.3, textAlign:'right', maxWidth:140 }}>{k.desc}</div>
                </div>
              ))}
            </div>
          </SideCard>
          <SideCard delay={0.1}>
            <CardHead label="Social Value" />
            <div style={{ padding:'1rem', display:'flex', flexDirection:'column', gap:'.75rem' }}>
              {svItems.map(sv => (
                <div key={sv.title} style={{ display:'flex', alignItems:'flex-start', gap:'.9rem' }}>
                  <div style={{ width:36, height:36, background:'#eef2ff', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0 }}>{sv.emoji}</div>
                  <div>
                    <strong style={{ fontSize:'.88rem', fontWeight:700, color:'var(--navy)', display:'block', marginBottom:'.2rem' }}>{sv.title}</strong>
                    <p style={{ fontSize:'.8rem', color:'var(--mgray)', lineHeight:1.4 }}>{sv.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </SideCard>
          <SideCard delay={0.2}>
            <CardHead label="Evaluation Criterion Alignment" />
            <div style={{ padding:'1.1rem 1.3rem' }}>
              {evals.map((e, i) => <EvalBar key={e.label} e={e} delay={i * .2} />)}
            </div>
          </SideCard>
        </div>
      </div>
    </div>
  </section>
);

export default Implementation;