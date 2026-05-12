import React, { useState } from "react";
import { FormData, Question } from "../types";
import {
  QUESTIONS,
  INSURANCE_TYPES,
  INSURANCE_PRODUCTS,
  LONG_TERM_CHANNELS,
  LONG_TERM_CATEGORIES,
  LONG_TERM_PRODUCTS,
} from "../constants";
import { submitUnderwrite } from "../utils/api";
import styles from "./FormPage.module.css";

interface FormPageProps {
  form: Partial<FormData>;
  onChange: (id: keyof FormData, value: string) => void;
  onSubmit: (result: import("../types").UnderwriteResult) => void;
  onBack: () => void;
}

type StepId =
  | "type"
  | "channel"
  | "category"
  | "product"
  | "basic"
  | "lifestyle"
  | "health"
  | "job";

const BASIC_IDS: Array<keyof FormData> = ["name", "age", "gender"];
const LIFESTYLE_IDS: Array<keyof FormData> = ["height", "weight", "smoking", "alcohol"];
const HEALTH_IDS: Array<keyof FormData> = [
  "recentTreatment3m",
  "hospitalizationSurgery5y",
  "seriousDiagnosis5y",
];
const JOB_IDS: Array<keyof FormData> = ["jobCategory", "monthlyIncome"];

const getSteps = (insuranceType: string | undefined): StepId[] => {
  if (insuranceType === "장기보험") {
    return ["type", "channel", "category", "product", "basic", "lifestyle", "health", "job"];
  }
  return ["type", "product", "basic", "lifestyle", "health", "job"];
};

const STEP_TITLES: Record<StepId, string> = {
  type: "보험 종류 선택",
  channel: "판매 채널 선택",
  category: "보장 카테고리 선택",
  product: "보험 상품 선택",
  basic: "기본 정보 입력",
  lifestyle: "신체·생활 정보 입력",
  health: "건강 정보 입력",
  job: "직업·소득 정보 입력",
};

const STEP_SUBTITLES: Record<StepId, string> = {
  type: "심사받을 보험의 종류를 선택해 주세요",
  channel: "가입할 채널을 선택해 주세요",
  category: "원하시는 보장 카테고리를 선택해 주세요",
  product: "심사받을 보험 상품을 선택해 주세요",
  basic: "이름, 나이, 성별을 입력해 주세요",
  lifestyle: "신장, 체중, 흡연·음주 정보를 입력해 주세요",
  health: "간편심사 보험 기준으로 분석됩니다",
  job: "직업과 월평균 소득을 선택해 주세요",
};

export default function FormPage({ form, onChange, onSubmit, onBack }: FormPageProps) {
  const [stepIdx, setStepIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = getSteps(form.insuranceType);
  const currentStep = steps[Math.min(stepIdx, steps.length - 1)];
  const isLastStep = stepIdx === steps.length - 1;

  const allRequiredIds: Array<keyof FormData> = [
    "insuranceType",
    ...(form.insuranceType === "장기보험"
      ? (["insuranceChannel", "insuranceCategory"] as Array<keyof FormData>)
      : []),
    "insuranceProduct",
    ...BASIC_IDS,
    ...LIFESTYLE_IDS,
    ...HEALTH_IDS,
    ...JOB_IDS,
  ];
  const filled = allRequiredIds.filter((id) => form[id] !== undefined && form[id] !== "").length;
  const totalFields = allRequiredIds.length;
  const progress = (filled / totalFields) * 100;

  const stepFieldIds = (() => {
    switch (currentStep) {
      case "basic": return BASIC_IDS;
      case "lifestyle": return LIFESTYLE_IDS;
      case "health": return HEALTH_IDS;
      case "job": return JOB_IDS;
      default: return [];
    }
  })();

  const isStepValid = (() => {
    switch (currentStep) {
      case "type": return !!form.insuranceType;
      case "channel": return !!form.insuranceChannel;
      case "category": return !!form.insuranceCategory;
      case "product": return !!form.insuranceProduct;
      default:
        return stepFieldIds.every((id) => form[id] !== undefined && form[id] !== "");
    }
  })();

  const handleTypeChange = (t: string) => {
    if (form.insuranceType !== t) {
      onChange("insuranceType", t);
      onChange("insuranceChannel", "");
      onChange("insuranceCategory", "");
      onChange("insuranceProduct", "");
    }
  };

  const handleChannelChange = (c: string) => {
    if (form.insuranceChannel !== c) {
      onChange("insuranceChannel", c);
      onChange("insuranceCategory", "");
      onChange("insuranceProduct", "");
    }
  };

  const handleCategoryChange = (cat: string) => {
    if (form.insuranceCategory !== cat) {
      onChange("insuranceCategory", cat);
      onChange("insuranceProduct", "");
    }
  };

  const handleNext = () => {
    if (!isStepValid) {
      const isSelection = ["type", "channel", "category", "product"].includes(currentStep);
      alert(isSelection ? "항목을 선택해 주세요." : "모든 항목을 입력해 주세요.");
      return;
    }
    setStepIdx(stepIdx + 1);
  };

  const handlePrev = () => {
    if (stepIdx === 0) onBack();
    else setStepIdx(stepIdx - 1);
  };

  const handleSubmit = async () => {
    if (!isStepValid) {
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

  const renderOptionGrid = (
    options: string[],
    selected: string | undefined,
    onSelect: (v: string) => void
  ) => (
    <div className={styles.optionGrid}>
      {options.length === 0 ? (
        <p className={styles.subtitle}>해당 조합의 상품이 준비 중입니다.</p>
      ) : (
        options.map((o) => (
          <button
            key={o}
            type="button"
            className={`${styles.optionCard} ${selected === o ? styles.optionCardActive : ""}`}
            onClick={() => onSelect(o)}
          >
            {o}
          </button>
        ))
      )}
    </div>
  );

  const renderQuestions = (ids: Array<keyof FormData>) => {
    const qs = QUESTIONS.filter((q) => ids.includes(q.id));
    return (
      <div className={styles.formGrid}>
        {qs.map((q: Question) => (
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
            ) : q.type === "text" ? (
              <div className={styles.inputWrap}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder={q.placeholder}
                  value={form[q.id] ?? ""}
                  onChange={(e) => onChange(q.id, e.target.value)}
                />
                {q.unit && <span className={styles.unit}>{q.unit}</span>}
              </div>
            ) : (
              <div className={styles.inputWrap}>
                <input
                  type="number"
                  min="0"
                  step={q.id === "height" || q.id === "weight" ? "0.1" : "1"}
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
    );
  };

  const getProductOptions = (): string[] => {
    if (form.insuranceType === "장기보험") {
      const channel = form.insuranceChannel ?? "";
      const category = form.insuranceCategory ?? "";
      return LONG_TERM_PRODUCTS[channel]?.[category] ?? [];
    }
    return INSURANCE_PRODUCTS[form.insuranceType ?? ""] ?? [];
  };

  const getCategoryOptions = (): string[] => {
    if (form.insuranceType !== "장기보험") return [];
    return LONG_TERM_CATEGORIES[form.insuranceChannel ?? ""] ?? [];
  };

  return (
    <div className={styles.container}>
      <div className={styles.progressWrap}>
        <span className={styles.progressLabel}>
          {filled} / {totalFields} 완료
        </span>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <h2 className={styles.title}>{STEP_TITLES[currentStep]}</h2>
      <p className={styles.subtitle}>{STEP_SUBTITLES[currentStep]}</p>

      {currentStep === "type" &&
        renderOptionGrid(INSURANCE_TYPES, form.insuranceType, handleTypeChange)}

      {currentStep === "channel" &&
        renderOptionGrid(LONG_TERM_CHANNELS, form.insuranceChannel, handleChannelChange)}

      {currentStep === "category" &&
        renderOptionGrid(getCategoryOptions(), form.insuranceCategory, handleCategoryChange)}

      {currentStep === "product" &&
        renderOptionGrid(getProductOptions(), form.insuranceProduct, (v) =>
          onChange("insuranceProduct", v)
        )}

      {(currentStep === "basic" ||
        currentStep === "lifestyle" ||
        currentStep === "health" ||
        currentStep === "job") &&
        renderQuestions(stepFieldIds)}

      {error && <p style={{ color: "#E24B4A", fontSize: 14, marginTop: 12 }}>{error}</p>}

      <div className={styles.btnRow}>
        <button className={styles.btnOutline} onClick={handlePrev} disabled={loading}>
          ← 이전
        </button>
        {isLastStep ? (
          <button className={styles.btnPrimary} onClick={handleSubmit} disabled={loading}>
            {loading ? "심사 중..." : "심사 결과 보기"}
          </button>
        ) : (
          <button className={styles.btnPrimary} onClick={handleNext}>
            다음
          </button>
        )}
      </div>
    </div>
  );
}
