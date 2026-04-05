import React from 'react';
import { useInView } from '../hooks/useInView';
import SectionLabel from './SectionLabel';

interface Layer { emoji: string; tag: string; title: string; source: string; desc: string; items: string[]; }

const layers: Layer[] = [
  {
    emoji: '🚗', tag: 'Isolation Forest', title: 'Behavioral Layer', source: 'Data source: OBD Sensor',
    desc: 'Captures sudden braking frequency, lane departure events, and speed variance patterns in real time during every drive session.',
    items: ['Sudden braking frequency index', 'Lane departure event count', 'Speed variance over time windows'],
  },
  {
    emoji: '🧠', tag: 'LSTM Time-Series', title: 'Cognitive Layer', source: 'Data source: Smartphone',
    desc: 'Tracks reaction time to traffic signals and steering delay patterns as continuous temporal sequences, modeled with LSTM architecture.',
    items: ['Signal reaction latency (ms)', 'Steering delay pattern trend', 'Response consistency score'],
  },
  {
    emoji: '👁️', tag: 'MediaPipe CV', title: 'Visual Layer', source: 'Data source: Front Camera',
    desc: 'Monitors forward gaze continuity using computer vision to detect distraction events and sustained attention lapses while driving.',
    items: ['Forward gaze duration ratio', 'Distraction event frequency', 'Attention lapse severity index'],
  },
];

const outputs = [
  { icon: '📊', title: 'Weekly Score',       desc: 'Composite Cognitive Risk Score generated every week' },
  { icon: '🔔', title: 'Staged Alerts',      desc: 'Driver → Family → Insurer escalation when score drops below threshold' },
  { icon: '💰', title: 'Dynamic Premium',    desc: 'Score-to-premium mapping adjusted in real time' },
  { icon: '🍃', title: 'Restraint Discount', desc: 'Voluntary driving reduction earns premium discount incentive' },
];

const LayerCard: React.FC<{ layer: Layer; delay: number }> = ({ layer, delay }) => {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} style={{
      borderRadius: 20, overflow: 'hidden', border: '1px solid var(--lgray)',
      boxShadow: '0 4px 24px rgba(15,31,92,.06)',
      opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(20px)',
      transition: `opacity .5s ${delay}s, transform .5s ${delay}s`,
      cursor: 'default',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.cssText += ';box-shadow:0 12px 40px rgba(109,40,217,.15);transform:translateY(-4px)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(15,31,92,.06)'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}
    >
      {/* Head */}
      <div style={{ padding: '1.8rem 1.6rem 2.2rem', background: 'linear-gradient(135deg,#0f1f5c,#6d28d9)', color: 'white', position: 'relative' }}>
        <div style={{ position:'absolute', bottom:-12, left:0, right:0, height:24, background:'white', clipPath:'ellipse(55% 100% at 50% 100%)' }} />
        <span style={{ fontSize: '2rem', display: 'block', marginBottom: '.8rem' }}>{layer.emoji}</span>
        <span style={{ display:'inline-block', background:'rgba(255,255,255,.15)', border:'1px solid rgba(255,255,255,.25)', color:'#e0e7ff', fontFamily:"'DM Mono',monospace", fontSize:'.7rem', padding:'.25rem .6rem', borderRadius:4, marginBottom:'.6rem' }}>{layer.tag}</span>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'1.2rem', fontWeight:700 }}>{layer.title}</div>
        <div style={{ fontSize:'.78rem', color:'rgba(255,255,255,.7)', marginTop:'.2rem' }}>{layer.source}</div>
      </div>

      {/* Body */}
      <div style={{ padding: '2rem 1.6rem 1.6rem', background: 'white' }}>
        <p style={{ fontSize:'.86rem', color:'var(--text)', lineHeight:1.6, marginBottom:'1.2rem' }}>{layer.desc}</p>
        <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'.5rem' }}>
          {layer.items.map(it => (
            <li key={it} style={{ display:'flex', alignItems:'center', gap:'.6rem', fontSize:'.83rem', color:'var(--dgray)' }}>
              <span style={{ width:18, height:18, borderRadius:4, background:'linear-gradient(135deg,#eef2ff,#ede9fe)', display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'.6rem' }}>✓</span>
              {it}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Solution: React.FC = () => {
  const { ref: engineRef, inView: engineVisible } = useInView(0.2);

  return (
    <section id="solution" style={{ background: 'white', padding: '7rem 4rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionLabel num="03" label="AI Solution" />
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, color:'var(--navy)', letterSpacing:'-.03em', lineHeight:1.05, marginBottom:'1rem' }}>
          DriveGuard Platform —<br />Three AI Layers, One Risk Score.
        </h2>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem', marginTop:'3.5rem' }}>
          {layers.map((l, i) => <LayerCard key={l.title} layer={l} delay={i * 0.1} />)}
        </div>

        {/* Score Engine */}
        <div ref={engineRef} style={{
          marginTop:'2rem', borderRadius:20, overflow:'hidden', border:'1px solid #c7d2fe',
          background:'linear-gradient(135deg,#f5f7ff,#faf8ff)',
          opacity: engineVisible ? 1 : 0, transform: engineVisible ? 'none' : 'translateY(16px)',
          transition: 'opacity .6s .3s, transform .6s .3s',
        }}>
          <div style={{ padding:'1rem 1.8rem', background:'linear-gradient(135deg,#0f1f5c,#6d28d9)', color:'white', fontSize:'.82rem', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase' as const, display:'flex', alignItems:'center', gap:'.6rem' }}>
            ⚡ Cognitive Risk Score Engine — Output &amp; Actions
          </div>
          <div style={{ padding:'1.8rem', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1.5rem' }}>
            {outputs.map(o => (
              <div key={o.title} style={{ textAlign:'center' }}>
                <div style={{ width:48, height:48, borderRadius:12, background:'white', border:'1px solid var(--lgray)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', margin:'0 auto .7rem', boxShadow:'0 2px 8px rgba(15,31,92,.06)' }}>{o.icon}</div>
                <div style={{ fontSize:'.85rem', fontWeight:700, color:'var(--navy)', marginBottom:'.3rem' }}>{o.title}</div>
                <div style={{ fontSize:'.78rem', color:'var(--mgray)', lineHeight:1.4 }}>{o.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ padding:'.8rem 1.8rem', background:'#ede9fe', borderTop:'1px solid #c4b5fd', fontSize:'.75rem', color:'var(--violet)', fontFamily:"'DM Mono',monospace", display:'flex', alignItems:'center', gap:'.5rem' }}>
            🤖 AI Scope — Predictive modeling (LSTM, Isolation Forest) · Computer Vision (MediaPipe) · LLM-assisted alert generation · Score-to-premium decision engine
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solution;