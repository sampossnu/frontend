import React from 'react';
import styles from './Hero.module.css';

const stats = [
  { val: '4M+',  label: 'Elderly license\nholders in Korea' },
  { val: '1.8×', label: 'Higher fatality rate\nvs. national average' },
  { val: '0',    label: 'Proactive cognitive\nmonitoring solutions' },
];

const Hero: React.FC = () => (
  <section id="hero" className={styles.hero}>
    <div className={styles.bg} />
    <div className={styles.inner}>
      <div className={styles.badge}>
        <span className={styles.dot} />
        4th Samsung Fire &amp; Marine Insurance — POSTECH — SNU Competition
      </div>

      <h1 className={styles.title}>
        Drive<em>Guard</em>
      </h1>

      <p className={styles.sub}>
        Real-Time Cognitive Monitoring Insurance Platform for Elderly Drivers —
        transforming reactive insurance into proactive road safety.
      </p>

      <div className={styles.stats}>
        {stats.map(s => (
          <div key={s.val} className={styles.statItem}>
            <div className={styles.statVal}>{s.val}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>

    <div className={styles.scrollHint}>
      <div className={styles.scrollLine} />
      scroll
    </div>
  </section>
);

export default Hero;
