export type Page = "intro" | "form" | "result" | "login" | "signup" | "history";

export interface User {
  email: string;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type TabId = "factors" | "suggestions" | "chat";

export interface FormData {
  age: string;
  gender: string;
  bmi: string;
  recentTreatment3m: string;
  hospitalizationSurgery5y: string;
  seriousDiagnosis5y: string;
}

export interface RiskFactor {
  label: string;
  delta: number;
  clause: string;
}

export interface ApiRiskFactor {
  factor: string;
  impact: number;
}

export type Grade = "APPROVED" | "PARTIAL" | "REJECTED";

export interface UnderwriteResult {
  id?: number;
  score: number;
  grade?: Grade;
  factors: RiskFactor[];
  suggestions: string[];
  reason: string;
  evidence?: string;
  createdAt?: string;
}

export interface UnderwriteHistoryItem {
  id: number;
  probability: number;
  grade: Grade;
  createdAt: string;
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