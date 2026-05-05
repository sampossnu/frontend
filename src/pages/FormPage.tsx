import React from "react";
import { FormData, Question } from "../types";
import { QUESTIONS } from "../constants";
import styles from "./FormPage.module.css";

interface FormPageProps {
  form: Partial<FormData>;
  onChange: (id: keyof FormData, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export default function FormPage({ form, onChange, onSubmit, onBack }: FormPageProps) {
  const filled = QUESTIONS.filter((q) => form[q.id] !== undefined && form[q.id] !== "").length;
  const progress = (filled / QUESTIONS.length) * 100;

  const handleSubmit = () => {
    if (filled < QUESTIONS.length) {
      alert("모든 항목을 입력해 주세요.");
      return;
    }
    onSubmit();
  };

  return (
    <div className={styles.container}>
      <div className={styles.progressWrap}>
        <span className={styles.progressLabel}>
          {filled} / {QUESTIONS.length} 완료
        </span>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <h2 className={styles.title}>건강 정보 입력</h2>
      <p className={styles.subtitle}>간편심사 보험 기준으로 분석됩니다</p>

      <div className={styles.formGrid}>
        {QUESTIONS.map((q: Question) => (
          <div key={q.id} className={styles.fieldWrap}>
            <label className={styles.label}>{q.label}</label>
            {q.type === "select" ? (
              <div className={styles.selectWrap}>
                <select
                  className={styles.select}
                  value={form[q.id] ?? ""}
                  onChange={(e) => onChange(q.id, e.target.value)}
                >
                  <option value="">선택해주세요</option>
                  {q.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                <svg className={styles.selectIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9l6 6 6-6" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            ) : (
              <div className={styles.inputWrap}>
                <input
                  type="number"
                  className={styles.input}
                  placeholder={q.placeholder}
                  value={form[q.id] ?? ""}
                  onChange={(e) => onChange(q.id, e.target.value)}
                />
                {q.unit && <span className={styles.unit}>{q.unit}</span>}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.btnRow}>
        <button className={styles.btnOutline} onClick={onBack}>
          ← 이전
        </button>
        <button className={styles.btnPrimary} onClick={handleSubmit}>
          심사 결과 보기
        </button>
      </div>
    </div>
  );
}