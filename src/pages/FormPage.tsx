import React, { useState } from "react";
import { FormData, Question } from "../types";
import { QUESTIONS } from "../constants";
import { submitUnderwrite } from "../utils/api";
import styles from "./FormPage.module.css";

interface FormPageProps {
  form: Partial<FormData>;
  onChange: (id: keyof FormData, value: string) => void;
  onSubmit: (result: import("../types").UnderwriteResult) => void;
  onBack: () => void;
}

const STEP1_IDS: Array<keyof FormData> = ["age", "gender", "bmi"];
const STEP2_IDS: Array<keyof FormData> = [
  "recentTreatment3m",
  "hospitalizationSurgery5y",
  "seriousDiagnosis5y",
];

export default function FormPage({ form, onChange, onSubmit, onBack }: FormPageProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentIds = step === 1 ? STEP1_IDS : STEP2_IDS;
  const currentQuestions = QUESTIONS.filter((q) => currentIds.includes(q.id));

  const filled = QUESTIONS.filter((q) => form[q.id] !== undefined && form[q.id] !== "").length;
  const progress = (filled / QUESTIONS.length) * 100;

  const isStepFilled = currentIds.every(
    (id) => form[id] !== undefined && form[id] !== ""
  );

  const handleNext = () => {
    if (!isStepFilled) {
      alert("모든 항목을 입력해 주세요.");
      return;
    }
    setStep(2);
  };

  const handlePrev = () => {
    if (step === 2) {
      setStep(1);
    } else {
      onBack();
    }
  };

  const handleSubmit = async () => {
    if (filled < QUESTIONS.length) {
      alert("모든 항목을 입력해 주세요.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await submitUnderwrite(form as FormData);
      onSubmit(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "심사 요청에 실패했습니다.");
    } finally {
      setLoading(false);
    }
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

      <h2 className={styles.title}>
        {step === 1 ? "기본 정보 입력" : "건강 정보 입력"}
      </h2>
      <p className={styles.subtitle}>
        {step === 1
          ? "나이, 성별, BMI를 입력해 주세요"
          : "간편심사 보험 기준으로 분석됩니다"}
      </p>

      <div className={styles.formGrid}>
        {currentQuestions.map((q: Question) => (
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
                  min="0"
                  step={q.id === "bmi" ? "0.1" : "1"}
                  className={styles.input}
                  placeholder={q.placeholder}
                  value={form[q.id] ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || Number(val) >= 0) {
                      onChange(q.id, val);
                    }
                  }}
                />
                {q.unit && <span className={styles.unit}>{q.unit}</span>}
              </div>
            )}
          </div>
        ))}
      </div>

      {error && <p style={{ color: "#E24B4A", fontSize: 14, marginTop: 12 }}>{error}</p>}

      <div className={styles.btnRow}>
        <button className={styles.btnOutline} onClick={handlePrev} disabled={loading}>
          ← 이전
        </button>
        {step === 1 ? (
          <button className={styles.btnPrimary} onClick={handleNext}>
            다음
          </button>
        ) : (
          <button className={styles.btnPrimary} onClick={handleSubmit} disabled={loading}>
            {loading ? "심사 중..." : "심사 결과 보기"}
          </button>
        )}
      </div>
    </div>
  );
}
