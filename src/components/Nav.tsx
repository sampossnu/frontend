import React, { useEffect, useState } from 'react';

const Nav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#problem',        label: 'Problem' },
    { href: '#analysis',       label: 'Analysis' },
    { href: '#solution',       label: 'Solution' },
    { href: '#simulator',      label: 'Simulator' },
    { href: '#implementation', label: 'Roadmap' },
];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2.5rem', height: 60,
      background: 'rgba(255,255,255,0.88)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(109,40,217,0.1)',
      transition: 'box-shadow .3s',
      boxShadow: scrolled ? '0 4px 24px rgba(15,31,92,0.1)' : 'none',
    }}>
      <span style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.2rem',
        background: 'linear-gradient(135deg,#0f1f5c,#6d28d9)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.02em',
      }}>DriveGuard</span>

      <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none' }}>
        {links.map(l => (
          <li key={l.href}>
            <a href={l.href} style={{
              fontSize: '.82rem', fontWeight: 500, letterSpacing: '.04em',
              color: 'var(--dgray)', textDecoration: 'none', textTransform: 'uppercase',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--violet)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--dgray)')}
            >{l.label}</a>
          </li>
        ))}
      </ul>

      <span style={{
        fontFamily: "'DM Mono', monospace", fontSize: '.7rem', fontWeight: 500,
        background: 'linear-gradient(135deg,#eef2ff,#ede9fe)',
        color: 'var(--indigo)', border: '1px solid #c7d2fe',
        padding: '.3rem .7rem', borderRadius: 20, letterSpacing: '.04em',
      }}>AI Utilization · Insurance</span>
    </nav>
  );
};

export default Nav;