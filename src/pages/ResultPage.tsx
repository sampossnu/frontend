import React, { useState, useEffect, useRef } from "react";
import { UnderwriteResult, ChatMessage, TabId } from "../types";
import { getScoreColor, getScoreLabel, getScoreBg } from "../utils/scoring";
import { sendChatMessage } from "../utils/api";
import { QUICK_QUESTIONS } from "../constants";
import styles from "./ResultPage.module.css";

interface ResultPageProps {
  result: UnderwriteResult;
  onBack: () => void;
  onReset: () => void;
}

const CIRCUMFERENCE = 2 * Math.PI * 54;

export default function ResultPage({ result, onBack, onReset }: ResultPageProps) {
  const [animScore, setAnimScore] = useState(0);
  const [activeTab, setActiveTab] = useState<TabId>("factors");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "안녕하세요! 심사 결과에 대해 궁금한 점이 있으시면 질문해 주세요.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scoreColor = getScoreColor(result.score);
  const scoreLabel = getScoreLabel(result.score);
  const scoreBg = getScoreBg(result.score);
  const dashOffset = CIRCUMFERENCE - (CIRCUMFERENCE * animScore) / 100;

  useEffect(() => {
    let current = 0;
    const target = result.score;
    const step = target / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setAnimScore(target);
        clearInterval(timer);
      } else {
        setAnimScore(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [result.score]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendChat = async (text?: string) => {
    const userText = (text ?? chatInput).trim();
    if (!userText || chatLoading) return;
    setChatInput("");

    const newMessages: ChatMessage[] = [
      ...chatMessages,
      { role: "user", text: userText },
    ];
    setChatMessages(newMessages);
    setChatLoading(true);

    const context = `가입 가능성 ${result.score}%, 주요 리스크: ${
      result.factors.map((f) => f.label).join(", ") || "없음"
    }`;

    try {
      const reply = await sendChatMessage(newMessages, context);
      setChatMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: "일시적인 오류가 발생했습니다. 다시 시도해 주세요." },
      ]);
    }
    setChatLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainGrid}>
      <div className={styles.leftCol}>
      {/* Score Card */}
      <div className={`${styles.card} ${styles.scoreCard}`}>
        <p className={styles.scoreLabel}>간편심사 보험 · 가입 가능성</p>
        <div className={styles.gaugeWrap}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="54" fill="none" stroke="#F1F5F9" strokeWidth="10" />
            <circle
              cx="70"
              cy="70"
              r="54"
              fill="none"
              stroke={scoreColor}
              strokeWidth="10"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 70 70)"
              style={{ transition: "stroke-dashoffset 0.05s" }}
            />
          </svg>
          <div className={styles.gaugeCenter}>
            <span className={styles.gaugeNum} style={{ color: scoreColor }}>
              {animScore}
            </span>
            <span className={styles.gaugeUnit}>%</span>
          </div>
        </div>
        <div
          className={styles.statusBadge}
          style={{ background: scoreBg, color: scoreColor }}
        >
          {scoreLabel}
        </div>
        <p className={styles.reason}>{result.reason}</p>
      </div>
      </div>

      <div className={styles.rightCol}>
      {/* Tabs */}
      <div className={styles.tabBar}>
        {(["factors", "suggestions", "chat"] as TabId[]).map((id) => {
          const labels: Record<TabId, string> = {
            factors: "리스크 요인",
            suggestions: "개선 가이드",
            chat: "AI 상담",
          };
          return (
            <button
              key={id}
              className={`${styles.tab} ${activeTab === id ? styles.tabActive : styles.tabInactive}`}
              onClick={() => setActiveTab(id)}
            >
              {labels[id]}
            </button>
          );
        })}
      </div>

      {/* Tab: Factors */}
      {activeTab === "factors" && (
        <div className={styles.tabContent}>
          {result.factors.length === 0 ? (
            <div className={`${styles.card} ${styles.emptyCard}`}>
              <p className={styles.emptyTitle}>✓ 특이 리스크 요인 없음</p>
              <p className={styles.emptyDesc}>모든 심사 기준을 통과했습니다.</p>
            </div>
          ) : (
            result.factors.map((f, i) => (
              <div key={i} className={`${styles.card} ${styles.factorCard}`}>
                <div>
                  <p className={styles.factorLabel}>{f.label}</p>
                  <p className={styles.factorClause}>{f.clause}</p>
                </div>
                <span className={styles.factorDelta}>{f.delta}%</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Suggestions */}
      {activeTab === "suggestions" && (
        <div className={styles.tabContent}>
          <div className={styles.card}>
            <h3 className={styles.suggestTitle}>가입 확률 향상 방법</h3>
            {result.suggestions.map((s, i) => (
              <div key={i} className={styles.suggestItem}>
                <div className={styles.checkIcon}>
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="#7B3FF0"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </div>
                <span className={styles.suggestText}>{s}</span>
              </div>
            ))}
            <p className={styles.disclaimer}>
              ※ 본 결과는 참고용이며, 실제 심사 결과와 다를 수 있습니다.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Chat */}
      {activeTab === "chat" && (
        <div className={styles.tabContent}>
          <div className={styles.chatCard}>
            <div className={styles.chatMessages}>
              {chatMessages.map((m, i) => (
                <div
                  key={i}
                  className={m.role === "user" ? styles.bubbleUser : styles.bubbleAi}
                >
                  {m.text}
                </div>
              ))}
              {chatLoading && (
                <div className={styles.bubbleAi}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className={styles.chatInputRow}>
              <input
                className={styles.chatInput}
                placeholder="심사 결과에 대해 질문해보세요..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
              />
              <button
                className={styles.sendBtn}
                onClick={() => handleSendChat()}
                disabled={chatLoading || !chatInput.trim()}
              >
                전송
              </button>
            </div>
          </div>
          <div className={styles.quickBtns}>
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                className={styles.quickBtn}
                onClick={() => handleSendChat(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      </div>
      </div>

      {/* Bottom Buttons */}
      <div className={styles.bottomBtns}>
        <button className={styles.btnOutline} onClick={onBack}>
          ← 다시 입력
        </button>
        <button className={styles.btnPrimary} onClick={onReset}>
          처음으로
        </button>
      </div>
    </div>
  );
}