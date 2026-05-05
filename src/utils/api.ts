import { ChatMessage } from "../types";
import { CHAT_SYSTEM } from "../constants";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

// NOTE: API 키를 여기에 직접 넣지 말고, .env 파일의 REACT_APP_ANTHROPIC_API_KEY를 사용하세요.
// 실제 배포 시에는 백엔드 프록시를 통해 API를 호출하는 것을 강력히 권장합니다.

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

  if (!response.ok) {
    throw new Error(data.error?.message || "API 오류가 발생했습니다.");
  }

  const textBlock = data.content?.find((b: { type: string }) => b.type === "text");
  return textBlock?.text ?? "응답을 받지 못했습니다.";
}
