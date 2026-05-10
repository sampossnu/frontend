import React, { useState } from "react";
import { signup } from "../utils/auth";
import styles from "./AuthPage.module.css";

interface SignupPageProps {
  onSignedUp: () => void;
  onGoLogin: () => void;
}

export default function SignupPage({ onSignedUp, onGoLogin }: SignupPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || loading) return;

    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await signup({ name, email, password });
      setSuccess(res.message || "회원가입이 완료되었습니다.");
      setTimeout(onSignedUp, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.metaRow}>
          <span className={styles.metaDot} />
          <span className={styles.metaText}>Sign up</span>
        </div>
        <h1 className={styles.title}>회원가입</h1>
        <p className={styles.subtitle}>InsureAI 계정을 만들어 보세요.</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="signup-name">이름</label>
            <input
              id="signup-name"
              type="text"
              className={styles.input}
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="signup-email">이메일</label>
            <input
              id="signup-email"
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
            <label className={styles.label} htmlFor="signup-password">비밀번호</label>
            <input
              id="signup-password"
              type="password"
              className={styles.input}
              placeholder="8자 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading || !name || !email || !password}
          >
            {loading ? "가입 처리 중..." : "회원가입"}
          </button>
        </form>

        <div className={styles.switchRow}>
          이미 계정이 있으신가요?
          <button type="button" className={styles.switchLink} onClick={onGoLogin}>
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}
