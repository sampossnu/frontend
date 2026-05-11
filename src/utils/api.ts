import { ChatMessage, FormData, UnderwriteResult, UnderwriteHistoryItem, ApiRiskFactor } from "../types";
import { CHAT_SYSTEM } from "../constants";
import { getAccessToken } from "./auth";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";
const USE_MOCK = process.env.REACT_APP_USE_MOCK_AUTH === "true" || !API_BASE_URL;

// ── Underwrite API ──────────────────────────────

export async function submitUnderwrite(form: FormData): Promise<UnderwriteResult> {
  if (USE_MOCK) {
    const { calculateResult } = await import("./scoring");
    return calculateResult(form);
  }

  const token = getAccessToken();
  const res = await fetch(`${API_BASE_URL}/underwrite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userInput: form }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "심사 요청에 실패했습니다.");

  return {
    id: data.id,
    score: Math.round(data.probability * 100),
    grade: data.grade,
    factors: (data.riskFactors as ApiRiskFactor[]).map((f) => ({
      label: f.factor,
      delta: Math.round(f.impact * 100),
      clause: "",
    })),
    suggestions: data.suggestion ? [data.suggestion] : [],
    reason: data.reason,
    evidence: data.evidence,
    createdAt: data.createdAt,
  };
}

export async function fetchUnderwriteHistory(): Promise<UnderwriteHistoryItem[]> {
  if (USE_MOCK) return [];

  const token = getAccessToken();
  const res = await fetch(`${API_BASE_URL}/underwrite/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "이력 조회에 실패했습니다.");

  return data.history as UnderwriteHistoryItem[];
}

export async function fetchUnderwriteDetail(id: number): Promise<UnderwriteResult> {
  const token = getAccessToken();
  const res = await fetch(`${API_BASE_URL}/underwrite/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "상세 조회에 실패했습니다.");

  return {
    id: data.id,
    score: Math.round(data.probability * 100),
    grade: data.grade,
    factors: (data.riskFactors as ApiRiskFactor[]).map((f) => ({
      label: f.factor,
      delta: Math.round(f.impact * 100),
      clause: "",
    })),
    suggestions: data.suggestion ? [data.suggestion] : [],
    reason: data.reason,
    evidence: data.evidence,
    createdAt: data.createdAt,
  };
}

// ── Chat API ────────────────────────────────────

export async function sendChatMessage(
  messages: ChatMessage[],
  resultContext: string
): Promise<string> {
  const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;

  if (!apiKey) {
    return "API 키가 설정되지 않았습니다. .env 파일에 REACT_APP_ANTHROPIC_API_KEY를 설정해 주세요.";
  }

  const systemPrompt =
    CHAT_SYSTEM +
    (resultContext ? `\n\n현재 사용자의 심사 결과: ${resultContext}` : "");

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.text,
      })),
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "API 오류가 발생했습니다.");

  const textBlock = data.content?.find((b: { type: string }) => b.type === "text");
  return textBlock?.text ?? "응답을 받지 못했습니다.";
}