import React, { useState, useEffect } from "react";
import { UnderwriteHistoryItem, UnderwriteResult, Grade } from "../types";
import { getScoreColor, getScoreLabel, getScoreBg } from "../utils/scoring";
import styles from "./HistoryPage.module.css";

interface HistoryPageProps {
  onBack: () => void;
}

const GRADE_LABEL: Record<Grade, string> = {
  APPROVED: "가입 가능",
  PARTIAL: "조건부 검토",
  REJECTED: "가입 어려움",
};

const GRADE_COLOR: Record<Grade, string> = {
  APPROVED: "#1D9E75",
  PARTIAL: "#BA7517",
  REJECTED: "#E24B4A",
};

const GRADE_BG: Record<Grade, string> = {
  APPROVED: "#E1F5EE",
  PARTIAL: "#FAEEDA",
  REJECTED: "#FCEBEB",
};

const MOCK_HISTORY: UnderwriteHistoryItem[] = [
  { id: 1, probability: 0.65, grade: "PARTIAL", createdAt: "2026-05-09T14:30:00" },
  { id: 2, probability: 0.85, grade: "APPROVED", createdAt: "2026-04-01T10:00:00" },
  { id: 3, probability: 0.20, grade: "REJECTED", createdAt: "2026-03-15T09:00:00" },
];

const MOCK_DETAILS: Record<number, UnderwriteResult> = {
  1: {
    id: 1,
    score: 65,
    grade: "PARTIAL",
    factors: [
      { label: "최근 5년 내 입원·수술 이력", delta: -20, clause: "계약 전 알릴의무 질문 2항 (355·5)" },
      { label: "최근 3개월 내 진찰·검사 소견", delta: -5, clause: "계약 전 알릴의무 질문 1항 (355·5)" },
    ],
    suggestions: [
      "건강검진 결과서 추가 제출 시 재심사를 받으실 수 있습니다.",
      "3개월 경과 후 재심사 시 점수 향상이 가능합니다.",
    ],
    reason: "일부 고지 항목에 해당하여 조건부 가입 검토가 필요합니다. 추가 서류 제출 후 재심사를 권장합니다.",
    evidence: "약관 제3조 2항",
    createdAt: "2026-05-09T14:30:00",
  },
  2: {
    id: 2,
    score: 85,
    grade: "APPROVED",
    factors: [],
    suggestions: ["고지 항목 모두 해당 없음으로 간편심사 기준 가입 가능성이 높습니다."],
    reason: "고지 항목에 해당 사항이 없어 간편심사 보험 가입 가능성이 높습니다.",
    evidence: "계약 전 알릴의무 사항 (355·5) 전항목 해당 없음",
    createdAt: "2026-04-01T10:00:00",
  },
  3: {
    id: 3,
    score: 20,
    grade: "REJECTED",
    factors: [
      { label: "최근 5년 내 암·협심증·심근경색·뇌졸중·심장판막증 진단 이력", delta: -40, clause: "계약 전 알릴의무 질문 3항 (355·5)" },
      { label: "최근 5년 내 입원·수술 이력", delta: -20, clause: "계약 전 알릴의무 질문 2항 (355·5)" },
      { label: "최근 3개월 내 진찰·검사 소견", delta: -10, clause: "계약 전 알릴의무 질문 1항 (355·5)" },
    ],
    suggestions: [
      "3개월 경과 후 재심사 시 점수 향상이 가능합니다.",
      "건강검진 결과서 추가 제출 시 재심사를 받으실 수 있습니다.",
    ],
    reason: "주요 고지 항목에 해당하여 현재 기준으로 가입이 어려울 수 있습니다. 상담을 통해 대안 상품을 안내받으세요.",
    evidence: "약관 제9조 2항",
    createdAt: "2026-03-15T09:00:00",
  },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function HistoryPage({ onBack }: HistoryPageProps) {
  const [history, setHistory] = useState<UnderwriteHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<UnderwriteResult | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHistory(MOCK_HISTORY);
      setLoading(false);
    }, 500);
  }, []);

  const handleSelect = async (id: number) => {
    setDetailLoading(true);
    setTimeout(() => {
      setSelected(MOCK_DETAILS[id]);
      setDetailLoading(false);
    }, 300);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={selected ? () => setSelected(null) : onBack}
        >
          ← {selected ? "목록으로" : "뒤로"}
        </button>
        <h1 className={styles.title}>
          {selected ? "심사 상세 결과" : "내 심사 이력"}
        </h1>
      </div>

      {!selected && (
        <>
          {loading && (
            <div className={styles.stateBox}>
              <div className={styles.spinner} />
              <p className={styles.stateText}>이력을 불러오는 중...</p>
            </div>
          )}

          {error && (
            <div className={styles.stateBox}>
              <p className={styles.errorText}>{error}</p>
            </div>
          )}

          {!loading && !error && history.length === 0 && (
            <div className={styles.stateBox}>
              <p className={styles.emptyIcon}>📋</p>
              <p className={styles.stateText}>심사 이력이 없습니다.</p>
              <p className={styles.stateSubText}>심사를 시작해 보세요!</p>
            </div>
          )}

          {!loading && !error && history.length > 0 && (
            <div className={styles.list}>
              {history.map((item) => (
                <button
                  key={item.id}
                  className={styles.listItem}
                  onClick={() => handleSelect(item.id)}
                  disabled={detailLoading}
                >
                  <div className={styles.listLeft}>
                    <div
                      className={styles.gradeBadge}
                      style={{
                        background: GRADE_BG[item.grade],
                        color: GRADE_COLOR[item.grade],
                      }}
                    >
                      {GRADE_LABEL[item.grade]}
                    </div>
                    <p className={styles.listDate}>{formatDate(item.createdAt)}</p>
                  </div>
                  <div className={styles.listRight}>
                    <span
                      className={styles.listScore}
                      style={{ color: GRADE_COLOR[item.grade] }}
                    >
                      {Math.round(item.probability * 100)}%
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 18l6-6-6-6"
                        stroke="#CBD5E1"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {selected && (
        <div className={styles.detail}>
          <div className={styles.scoreCard}>
            <p className={styles.scoreCardLabel}>간편심사 보험 · 가입 가능성</p>
            <div
              className={styles.scoreBadge}
              style={{
                background: getScoreBg(selected.score),
                color: getScoreColor(selected.score),
              }}
            >
              <span className={styles.scoreNum}>{selected.score}%</span>
              <span className={styles.scoreGrade}>{getScoreLabel(selected.score)}</span>
            </div>
            <p className={styles.reason}>{selected.reason}</p>
            {selected.createdAt && (
              <p className={styles.createdAt}>
                심사일시: {formatDate(selected.createdAt)}
              </p>
            )}
          </div>

          {selected.factors.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>리스크 요인</h3>
              {selected.factors.map((f, i) => (
                <div key={i} className={styles.factorCard}>
                  <div>
                    <p className={styles.factorLabel}>{f.label}</p>
                    <p className={styles.factorClause}>{f.clause}</p>
                  </div>
                  <span className={styles.factorDelta}>{f.delta}%</span>
                </div>
              ))}
            </div>
          )}

          {selected.evidence && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>판단 근거</h3>
              <div className={styles.evidenceBox}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                    stroke="#7B3FF0"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <p className={styles.evidenceText}>{selected.evidence}</p>
              </div>
            </div>
          )}

          {selected.suggestions.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>개선 가이드</h3>
              {selected.suggestions.map((s, i) => (
                <div key={i} className={styles.suggestionItem}>
                  <div className={styles.checkIcon}>
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="#185FA5"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                  </div>
                  <span className={styles.suggestionText}>{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}