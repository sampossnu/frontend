import { FormData, UnderwriteResult } from "../types";

export function calculateResult(form: FormData): UnderwriteResult {
  let score = 90;
  const factors = [];

  if (form.recentTreatment3m === "예") {
    score -= 40;
    factors.push({
      label: "최근 3개월 내 진찰·검사·입원·수술 필요 소견",
      delta: -40,
      clause: "계약 전 알릴의무 질문 1항 (355·5)",
    });
  }

  if (form.hospitalizationSurgery5y === "예") {
    score -= 20;
    factors.push({
      label: "최근 5년 내 입원·수술 이력",
      delta: -20,
      clause: "계약 전 알릴의무 질문 2항 (355·5)",
    });
  }

  if (form.seriousDiagnosis5y === "예") {
    score -= 40;
    factors.push({
      label: "최근 5년 내 암·협심증·심근경색·뇌졸중·심장판막증 진단 이력",
      delta: -40,
      clause: "계약 전 알릴의무 질문 3항 (355·5)",
    });
  }

  const bmiNum = parseFloat(form.bmi);
  if (!isNaN(bmiNum) && bmiNum >= 35) {
    score -= 10;
    factors.push({
      label: "고도비만 (BMI 35 이상)",
      delta: -10,
      clause: "인수심사 기준",
    });
  }

  score = Math.max(5, Math.min(97, score));

  const suggestions: string[] = [];
  if (form.recentTreatment3m === "예")
    suggestions.push("3개월 경과 후 재심사 시 점수 향상이 가능합니다.");
  if (form.hospitalizationSurgery5y === "예")
    suggestions.push("건강검진 결과서 추가 제출 시 재심사를 받으실 수 있습니다.");
  if (!isNaN(bmiNum) && bmiNum >= 30)
    suggestions.push("체중 관리 후 재심사 시 점수 개선이 가능합니다.");
  if (factors.length === 0)
    suggestions.push("고지 항목 모두 해당 없음으로 간편심사 기준 가입 가능성이 높습니다.");

  const reason =
    score >= 80
      ? "고지 항목에 해당 사항이 없어 간편심사 보험 가입 가능성이 높습니다."
      : score >= 40
      ? "일부 고지 항목에 해당하여 조건부 가입 검토가 필요합니다. 추가 서류 제출 후 재심사를 권장합니다."
      : "주요 고지 항목에 해당하여 현재 기준으로 가입이 어려울 수 있습니다. 상담을 통해 대안 상품을 안내받으세요.";

  return { score, factors, suggestions, reason };
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#1D9E75";
  if (score >= 40) return "#BA7517";
  return "#E24B4A";
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "가입 가능 (APPROVED)";
  if (score >= 40) return "조건부 검토 (PARTIAL)";
  return "가입 어려움 (REJECTED)";
}

export function getScoreBg(score: number): string {
  if (score >= 80) return "#E1F5EE";
  if (score >= 40) return "#FAEEDA";
  return "#FCEBEB";
}