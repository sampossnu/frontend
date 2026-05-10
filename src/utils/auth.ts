import { AuthTokens, LoginRequest, SignupRequest, User } from "../types";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";
const USE_MOCK = process.env.REACT_APP_USE_MOCK_AUTH === "true" || !API_BASE_URL;

const ACCESS_TOKEN_KEY = "insureai_access_token";
const REFRESH_TOKEN_KEY = "insureai_refresh_token";
const USER_KEY = "insureai_user";
const MOCK_USERS_KEY = "insureai_mock_users";

interface MockUser {
  email: string;
  password: string;
  name: string;
}

function getMockUsers(): MockUser[] {
  const raw = localStorage.getItem(MOCK_USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveMockUsers(users: MockUser[]) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

async function mockSignup(req: SignupRequest): Promise<{ message: string }> {
  await new Promise((r) => setTimeout(r, 300));
  const users = getMockUsers();
  if (users.some((u) => u.email === req.email)) {
    throw new Error("이미 등록된 이메일입니다.");
  }
  users.push({ email: req.email, password: req.password, name: req.name });
  saveMockUsers(users);
  return { message: "회원가입이 완료되었습니다." };
}

async function mockLogin(req: LoginRequest): Promise<AuthTokens & { name: string }> {
  await new Promise((r) => setTimeout(r, 300));
  const users = getMockUsers();
  const found = users.find((u) => u.email === req.email && u.password === req.password);
  if (!found) {
    throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.");
  }
  return {
    accessToken: `mock-access-${Date.now()}`,
    refreshToken: `mock-refresh-${Date.now()}`,
    name: found.name,
  };
}

export async function signup(req: SignupRequest): Promise<{ message: string }> {
  if (USE_MOCK) return mockSignup(req);

  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "회원가입에 실패했습니다.");
  }

  return data;
}

export async function login(
  req: LoginRequest
): Promise<AuthTokens & { name?: string }> {
  if (USE_MOCK) return mockLogin(req);

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "로그인에 실패했습니다.");
  }

  return { accessToken: data.accessToken, refreshToken: data.refreshToken };
}

export function saveAuth(tokens: AuthTokens, user: User) {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}
