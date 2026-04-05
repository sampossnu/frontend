import React from 'react';

interface Props { num: string; label: string; }

const SectionLabel: React.FC<Props> = ({ num, label }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: '.5rem',
    fontFamily: "'DM Mono', monospace",
    fontSize: '.72rem', fontWeight: 500, letterSpacing: '.12em',
    color: 'var(--violet)', textTransform: 'uppercase',
    marginBottom: '1rem',
  }}>
    <span style={{ display:'inline-block', width:20, height:2, background:'linear-gradient(90deg,#1d4ed8,#6d28d9)', borderRadius:1 }} />
    {num} — {label}
  </div>
);

export default SectionLabel;