import React from "react";
import styles from "./IntroPage.module.css";

interface IntroPageProps {
  onStart: () => void;
}


export default function IntroPage({ onStart }: IntroPageProps) {
  return (
    <div className={styles.page}>

      {/* ── 1st screen: Title + CTA + 3D ── */}
      <section className={styles.hero}>

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

        <div className={styles.splinePanel}>
          <iframe
            src="https://my.spline.design/interactivekeyboardbyabhinand-gwHiNCRREVrYiqJ75YExD1wN/"
            frameBorder="0"
            title="3D Interactive Keyboard"
            className={styles.splineFrame}
          />
        </div>

      </section>

      {/* ── 2nd screen: Feature Cards (Bento) ── */}
      <section className={styles.featureSection}>
        <div className={styles.featureSectionInner}>

          <div className={styles.featureHeader}>
            <p className={styles.featureSectionLabel}>
              <span className={styles.featureSectionDot} />
              왜 InsureAI인가요?
            </p>
            <h2 className={styles.featureSectionTitle}>
              <span>더 투명하고,</span>
              <span className={styles.titleAccent}>더 정확하게.</span>
            </h2>
          </div>

          <div className={styles.featureBento}>

            {/* Card 01 - large, with stat */}
            <div className={`${styles.featureCard} ${styles.cardWide}`}>
              <span className={styles.featureCardNum}>01 / 확률 기반 심사</span>
              <div className={styles.statBlock}>
                <span className={styles.statRange}>0%</span>
                <span className={styles.statBar} />
                <span className={styles.statRangeEnd}>100<small>%</small></span>
              </div>
              <h3 className={styles.featureCardTitle}>
                O/X가 아닌, <em>몇 %</em>로 답합니다.
              </h3>
              <p className={styles.featureCardDesc}>
                기존 보험 심사처럼 단순한 통과/거절이 아니라,<br />
                각 항목이 가입 가능성에 미치는 영향을 정확한 수치로 보여줍니다.
              </p>
            </div>

            {/* Card 02 - quote / citation */}
            <div className={`${styles.featureCard} ${styles.cardQuote}`}>
              <span className={styles.featureCardNum}>02 / 근거 기반 설명</span>
              <div className={styles.quoteBlock}>
                <span className={styles.quoteMark}>“</span>
                <p className={styles.quoteText}>
                  최근 5년 이내 입원 이력이 있는 경우<br />
                  본 상품 가입은 제한될 수 있다.
                </p>
                <p className={styles.quoteCite}>— 약관 제5조 1항</p>
                <span className={styles.quoteMarkEnd}>”</span>
              </div>
              <h3 className={styles.featureCardTitle}>
                항상 결과와 함께 출처도 알려줍니다.
              </h3>
            </div>

            {/* Card 03 - chat preview */}
            <div className={`${styles.featureCard} ${styles.cardChat}`}>
              <span className={styles.featureCardNum}>03 / AI 상담</span>
              <div className={styles.chatPreview}>
                <div className={styles.chatBubbleUser}>
                  왜 점수가 낮게 나왔어?
                </div>
                <div className={styles.chatBubbleAi}>
                  <span className={styles.chatDot} />
                  <span className={styles.chatDot} />
                  <span className={styles.chatDot} />
                </div>
              </div>
              <h3 className={styles.featureCardTitle}>
                궁금한 건 바로 물어보세요.
              </h3>
              <p className={styles.featureCardDesc}>
                결과 페이지에서 AI에게 자유롭게 질문할 수 있습니다.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
