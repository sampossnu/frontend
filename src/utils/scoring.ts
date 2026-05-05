import { FormData, UnderwriteResult } from "../types";

export function calculateResult(form: FormData): UnderwriteResult {
  let score = 80;
  const factors = [];

  if (form.smoking === "흡연 (현재)") {
    score -= 12;
    factors.push({ label: "현재 흡연 중", delta: -12, clause: "약관 제7조 3항" });
  } else if (form.smoking === "흡연 (과거 1년 이내)") {
    score -= 6;
    factors.push({ label: "과거 흡연 이력 (1년 이내)", delta: -6, clause: "약관 제7조 3항" });
  }

  if (form.hospitalization === "1회") {
    score -= 10;
    factors.push({ label: "최근 5년 내 입원 1회", delta: -10, clause: "약관 제5조 1항" });
  } else if (form.hospitalization === "2회 이상") {
    score -= 22;
    factors.push({ label: "최근 5년 내 입원 2회 이상", delta: -22, clause: "약관 제5조 1항" });
  }

  if (form.cancer === "5년 이내") {
    score -= 35;
    factors.push({ label: "5년 이내 암 진단 이력", delta: -35, clause: "약관 제9조 2항" });
  } else if (form.cancer === "5년 초과") {
    score -= 15;
    factors.push({ label: "암 진단 이력 (5년 초과)", delta: -15, clause: "약관 제9조 3항" });
  }

  if (form.chronic === "당뇨") {
    score -= 12;
    factors.push({ label: "당뇨 보유", delta: -12, clause: "약관 제6조 1항" });
  } else if (form.chronic === "고혈압") {
    score -= 8;
    factors.push({ label: "고혈압 보유", delta: -8, clause: "약관 제6조 2항" });
  } else if (form.chronic === "기타") {
    score -= 5;
    factors.push({ label: "기타 만성질환", delta: -5, clause: "약관 제6조 4항" });
  }

  if (form.surgery === "주요 수술") {
    score -= 10;
    factors.push({ label: "최근 3년 내 주요 수술", delta: -10, clause: "약관 제8조 1항" });
  } else if (form.surgery === "경미한 수술") {
    score -= 4;
    factors.push({ label: "최근 3년 내 경미한 수술", delta: -4, clause: "약관 제8조 2항" });
  }

  const bmiNum = parseFloat(form.bmi);
  if (!isNaN(bmiNum) && bmiNum > 30) {
    score -= 6;
    factors.push({ label: "BMI 30 초과 (비만)", delta: -6, clause: "약관 제7조 1항" });
  }

  score = Math.max(5, Math.min(97, score));

  const suggestions: string[] = [];
  if (form.smoking !== "비흡연")
    suggestions.push("금연 후 1년 경과 시 심사 점수 향상 가능합니다.");
  if (!isNaN(bmiNum) && bmiNum > 25)
    suggestions.push("체중 관리 후 재심사 시 점수 개선이 가능합니다.");
  if (score < 50)
    suggestions.push("건강검진 결과서 추가 제출 시 재심사를 받으실 수 있습니다.");
  if (factors.length === 0)
    suggestions.push("현재 양호한 건강 상태입니다. 정기 건강검진을 유지해 주세요.");

  const reason =
    score >= 70
      ? "전반적으로 양호한 건강 상태로 가입 가능성이 높습니다. 일부 리스크 요인이 확인되었으나 심사 기준 범위 내에 있습니다."
      : score >= 45
      ? "중등도 리스크 요인이 확인되어 조건부 가입 검토가 필요합니다. 추가 서류 제출 후 재심사를 권장합니다."
      : "다수의 고위험 요인이 확인되어 현재 기준으로는 가입이 어려울 수 있습니다. 상담을 통해 대안 상품을 안내받으세요.";

  return { score, factors, suggestions, reason };
}

export function getScoreColor(score: number): string {
  if (score >= 70) return "#1D9E75";
  if (score >= 45) return "#BA7517";
  return "#E24B4A";
}

export function getScoreLabel(score: number): string {
  if (score >= 70) return "가입 가능";
  if (score >= 45) return "조건부 검토";
  return "가입 어려움";
}

export function getScoreBg(score: number): string {
  if (score >= 70) return "#E1F5EE";
  if (score >= 45) return "#FAEEDA";
  return "#FCEBEB";
}
