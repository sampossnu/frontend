# InsureAI — AI 기반 보험 심사 시스템

제4회 전국 대학(원)생 리스크 관리 경진대회 출품작

## 실행 방법

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정 (AI 상담 기능)
```bash
cp .env.example .env
```
`.env` 파일을 열고 `REACT_APP_ANTHROPIC_API_KEY`에 API 키를 입력하세요.
> API 키는 https://console.anthropic.com 에서 발급받을 수 있습니다.
> AI 상담 기능을 사용하지 않는다면 이 단계를 건너뛰어도 됩니다.

### 3. 개발 서버 실행
```bash
npm start
```
브라우저에서 http://localhost:3000 으로 접속합니다.

## 프로젝트 구조

```
src/
├── components/     # 공통 컴포넌트 (Navbar 등)
├── pages/          # 페이지 컴포넌트 (Intro, Form, Result)
├── utils/
│   ├── scoring.ts  # 리스크 점수 계산 로직 (백엔드 /predict 연동 시 교체)
│   └── api.ts      # Anthropic API 연동 (백엔드 /explain 연동 시 교체)
├── types.ts        # TypeScript 타입 정의
├── constants.ts    # 질문 목록, 상수 정의
└── App.tsx         # 라우팅 및 상태 관리
```

## 백엔드 연동

실제 백엔드(Spring)와 연결할 때는 두 파일만 수정하면 됩니다:

### `src/utils/scoring.ts`
```ts
// 현재: 클라이언트 사이드 계산
// 변경: 백엔드 /predict API 호출로 교체
export async function calculateResult(form: FormData): Promise<UnderwriteResult> {
  const res = await fetch("/api/underwrite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  return res.json();
}
```

### `src/utils/api.ts`
```ts
// AI 상담을 백엔드 /explain API로 프록시하여 API 키 노출 방지
```

## 팀 역할

| 역할 | 담당 |
|------|------|
| AI 모델 (Risk Scoring) | 현택 |
| RAG + Agent (설명 생성) | 정원 |
| 백엔드 Spring (통합) | 혜린 |
| 프론트엔드 React | 아영 |
