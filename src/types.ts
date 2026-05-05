export type Page = "intro" | "form" | "result";

export type TabId = "factors" | "suggestions" | "chat";

export interface FormData {
  age: string;
  gender: string;
  smoking: string;
  bmi: string;
  hospitalization: string;
  chronic: string;
  cancer: string;
  surgery: string;
}

export interface RiskFactor {
  label: string;
  delta: number;
  clause: string;
}

export interface UnderwriteResult {
  score: number;
  factors: RiskFactor[];
  suggestions: string[];
  reason: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export interface Question {
  id: keyof FormData;
  label: string;
  type: "number" | "select";
  placeholder?: string;
  unit?: string;
  options?: string[];
}
