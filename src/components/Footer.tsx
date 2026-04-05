import React from 'react';

const Footer: React.FC = () => (
  <footer style={{ background:'var(--navy)', padding:'3rem 4rem', textAlign:'center', position:'relative', overflow:'hidden' }}>
    <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 80% at 50% 120%, rgba(109,40,217,.4), transparent)' }} />
    <div style={{ position:'relative', zIndex:1 }}>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'2rem', fontWeight:800, color:'#60a5fa', letterSpacing:'-.03em', marginBottom:'.5rem' }}>DriveGuard</div>
      <p style={{ fontSize:'.85rem', color:'rgba(255,255,255,.5)', marginBottom:'1.5rem' }}>Real-Time Cognitive Monitoring Insurance Platform for Elderly Drivers</p>
      <span style={{ display:'inline-block', background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.15)', color:'rgba(255,255,255,.6)', fontFamily:"'DM Mono',monospace", fontSize:'.72rem', padding:'.4rem 1rem', borderRadius:20 }}>
        4th Samsung Fire &amp; Marine Insurance – POSTECH – SNU Risk Management Competition · AI Utilization Solution Track
      </span>
      <p style={{ fontSize:'.8rem', color:'rgba(255,255,255,.58)', margin:'1rem 0 0' }}>
        Yoon Ayoung, Yun Hyerin, Lee Hyeontaek, Im Jeongwon
      </p>
    </div>
  </footer>
);

export default Footer;
