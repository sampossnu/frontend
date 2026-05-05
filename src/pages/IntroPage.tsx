import React from "react";
import styles from "./IntroPage.module.css";

interface IntroPageProps {
  onStart: () => void;
}

const FEATURES = [
  {
    icon: "📊",
    title: "확률 기반 심사",
    desc: "O/X 대신 정확한 % 수치 제공",
  },
  {
    icon: "📄",
    title: "근거 기반 설명",
    desc: "약관 조항을 근거로 한 투명한 판단",
  },
  {
    icon: "🤖",
    title: "AI 상담",
    desc: "결과에 대해 AI에게 바로 질문",
  },
];

export default function IntroPage({ onStart }: IntroPageProps) {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.tag}>AI 기반 보험 심사 시스템</div>
        <h1 className={styles.title}>
          보험 가입 가능성을
          <br />
          지금 바로 확인하세요
        </h1>
        <p className={styles.subtitle}>
          약관 기반 RAG 분석과 AI Agent가 결합된 심사 시스템으로
          <br />
          가입 확률과 그 이유를 투명하게 제공합니다.
        </p>
      </div>

      <div className={styles.featureGrid}>
        {FEATURES.map((f, i) => (
          <div key={i} className={styles.featureCard}>
            <div className={styles.featureIcon}>{f.icon}</div>
            <div className={styles.featureTitle}>{f.title}</div>
            <div className={styles.featureDesc}>{f.desc}</div>
          </div>
        ))}
      </div>

      <div className={styles.cta}>
        <button className={styles.startBtn} onClick={onStart}>
          심사 시작하기 →
        </button>
        <p className={styles.disclaimer}>입력된 정보는 저장되지 않습니다</p>
      </div>
    </div>
  );
}
