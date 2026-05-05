import React from "react";
import styles from "./IntroPage.module.css";

interface IntroPageProps {
  onStart: () => void;
}

const FEATURES = [
  { num: "01", title: "확률 기반 심사", desc: "O/X 대신 정확한 % 수치 제공" },
  { num: "02", title: "근거 기반 설명", desc: "약관 조항을 근거로 한 투명한 판단" },
  { num: "03", title: "AI 상담", desc: "결과에 대해 AI에게 바로 질문" },
];

export default function IntroPage({ onStart }: IntroPageProps) {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>

        {/* ── Left: Text Content ── */}
        <div className={styles.content}>
          <div className={styles.metaRow}>
            <span className={styles.metaDot} />
            <span className={styles.metaText}>AI Insurance / Beta</span>
          </div>

          <h1 className={styles.title}>
            보험 가입<br />가능성을<br />확인하세요
          </h1>

          <p className={styles.subtitle}>
            약관 기반 RAG 분석과 AI Agent가 결합된 심사 시스템으로<br />
            가입 확률과 그 이유를 투명하게 제공합니다.
          </p>

          <div className={styles.featureList}>
            {FEATURES.map((f) => (
              <div key={f.num} className={styles.featureItem}>
                <span className={styles.featureNum}>{f.num}</span>
                <span className={styles.featureName}>{f.title}</span>
                <span className={styles.featureSep}>—</span>
                <span className={styles.featureDesc}>{f.desc}</span>
              </div>
            ))}
          </div>

          <div className={styles.ctaRow}>
            <button className={styles.startBtn} onClick={onStart}>
              심사 시작하기
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <span className={styles.disclaimer}>입력된 정보는 저장되지 않습니다</span>
          </div>
        </div>

        {/* ── Right: Spline 3D ── */}
        <div className={styles.splinePanel}>
          <iframe
            src="https://my.spline.design/interactivekeyboardbyabhinand-gwHiNCRREVrYiqJ75YExD1wN/"
            frameBorder="0"
            title="3D Interactive Keyboard"
            className={styles.splineFrame}
          />
        </div>

      </section>
    </div>
  );
}
