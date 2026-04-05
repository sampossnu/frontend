import React from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Analysis from './components/Analysis';
import Solution from './components/Solution';
import Implementation from './components/Implementation';
import DataAnalysis from './components/DataAnalysis';
import Footer from './components/Footer';

const CurveDivider: React.FC = () => (
  <div style={{ width:'100%', overflow:'hidden', lineHeight:0, background:'linear-gradient(135deg,#0f1f5c,#6d28d9)' }}>
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display:'block', width:'100%', height:60 }}>
      <path d="M0,0 Q720,60 1440,0 L1440,60 L0,60 Z" fill="#f8f9fe" />
    </svg>
  </div>
);

const App: React.FC = () => (
  <>
    <Nav />
    <Hero />
    <CurveDivider />
    <Problem />
    <Analysis />
    <Solution />
    <Implementation />
    <DataAnalysis />
    <Footer />
  </>
);

export default App;