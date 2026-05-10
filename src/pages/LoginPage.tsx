import React, { useState } from "react";
import { User } from "../types";
import { login, saveAuth } from "../utils/auth";
import styles from "./AuthPage.module.css";

interface LoginPageProps {
  onLoggedIn: (user: User) => void;
  onGoSignup: () => void;
}

export default function LoginPage({ onLoggedIn, onGoSignup }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || loading) return;

    setError(null);
    setLoading(true);
    try {
      const result = await login({ email, password });
      const user: User = {
        email,
        name: result.name ?? email.split("@")[0],
      };
      saveAuth(
        { accessToken: result.accessToken, refreshToken: result.refreshToken },
        user
      );
      onLoggedIn(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.metaRow}>
          <span className={styles.metaDot} />
          <span className={styles.metaText}>Login</span>
        </div>
        <h1 className={styles.title}>로그인</h1>
        <p className={styles.subtitle}>이메일과 비밀번호를 입력해 주세요.</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-email">이메일</label>
            <input
              id="login-email"
              type="email"
              className={styles.input}
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-password">비밀번호</label>
            <input
              id="login-password"
              type="password"
              className={styles.input}
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading || !email || !password}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className={styles.switchRow}>
          아직 계정이 없으신가요?
          <button type="button" className={styles.switchLink} onClick={onGoSignup}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
