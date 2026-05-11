import { Question } from "./types";

export const QUESTIONS: Question[] = [
  {
    id: "age",
    label: "나이",
    type: "number",
    placeholder: "예: 45",
    unit: "세",
  },
  {
    id: "gender",
    label: "성별",
    type: "select",
    options: ["남성", "여성"],
  },
  {
    id: "bmi",
    label: "BMI",
    type: "number",
    placeholder: "예: 23.5",
  },
  {
    id: "recentTreatment3m",
    label: "최근 3개월 이내에 의사로부터 진찰 또는 검사를 통하여 다음 의료행위를 받은 사실이 있으십니까? (입원 필요 소견, 수술 필요 소견, 추가검사 필요 소견, 질병확정진단, 질병의심소견)",
    type: "select",
    options: ["아니오", "예"],
  },
  {
    id: "hospitalizationSurgery5y",
    label: "최근 5년 이내에 질병이나 상해사고로 인하여 입원 또는 수술(제왕절개 포함)을 받은 사실이 있으십니까?",
    type: "select",
    options: ["아니오", "예"],
  },
  {
    id: "seriousDiagnosis5y",
    label: "최근 5년 이내에 암, 협심증, 심근경색, 뇌졸중(뇌출혈·뇌경색), 심장판막증으로 진단·입원·수술을 받은 사실이 있으십니까?",
    type: "select",
    options: ["아니오", "예"],
  },
];

export const CHAT_SYSTEM = `당신은 보험 심사 AI 어시스턴트입니다. 사용자의 보험 심사 결과에 대해 친절하고 전문적으로 설명해주세요.
답변은 간결하게 3-4문장 이내로 해주세요. 보험 약관, 리스크 요인, 개선 방법 등에 대해 도움을 드립니다.`;

export const QUICK_QUESTIONS = [
  "거절 사유를 자세히 설명해주세요",
  "대안 보험 상품이 있나요?",
  "확률을 높이려면 어떻게 해야 하나요?",
];