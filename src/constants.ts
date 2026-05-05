import { Question } from "./types";

export const QUESTIONS: Question[] = [
  { id: "age", label: "나이", type: "number", placeholder: "예: 35", unit: "세" },
  { id: "gender", label: "성별", type: "select", options: ["남성", "여성"] },
  {
    id: "smoking",
    label: "흡연 여부",
    type: "select",
    options: ["비흡연", "흡연 (현재)", "흡연 (과거 1년 이내)"],
  },
  { id: "bmi", label: "BMI", type: "number", placeholder: "예: 23.5", unit: "" },
  {
    id: "hospitalization",
    label: "최근 5년 내 입원 이력",
    type: "select",
    options: ["없음", "1회", "2회 이상"],
  },
  {
    id: "chronic",
    label: "만성질환 보유",
    type: "select",
    options: ["없음", "고혈압", "당뇨", "기타"],
  },
  {
    id: "cancer",
    label: "암 진단 이력",
    type: "select",
    options: ["없음", "5년 이내", "5년 초과"],
  },
  {
    id: "surgery",
    label: "최근 3년 내 수술 이력",
    type: "select",
    options: ["없음", "경미한 수술", "주요 수술"],
  },
];

export const CHAT_SYSTEM = `당신은 보험 심사 AI 어시스턴트입니다. 사용자의 보험 심사 결과에 대해 친절하고 전문적으로 설명해주세요.
답변은 간결하게 3-4문장 이내로 해주세요. 보험 약관, 리스크 요인, 개선 방법 등에 대해 도움을 드립니다.`;

export const QUICK_QUESTIONS = [
  "거절 사유를 자세히 설명해주세요",
  "대안 보험 상품이 있나요?",
  "확률을 높이려면 어떻게 해야 하나요?",
];