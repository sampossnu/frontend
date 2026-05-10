import React from "react";
import { User } from "../types";
import styles from "./Navbar.module.css";

interface NavbarProps {
  user: User | null;
  onLogoClick: () => void;
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
}

export default function Navbar({
  user,
  onLogoClick,
  onLogin,
  onSignup,
  onLogout,
}: NavbarProps) {
  return (
    <nav className={styles.nav}>
      <div
        className={styles.logo}
        onClick={onLogoClick}
        style={{ cursor: "pointer" }}
      >
        <div className={styles.logoIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
              fill="white"
              opacity="0.9"
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="#111"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
        <span className={styles.logoText}>InsureAI</span>
        <span className={styles.badge}>BETA</span>
      </div>

      <div className={styles.authRow}>
        {user ? (
          <>
            <span className={styles.userName}>{user.name}님</span>
            <button className={styles.linkBtn} onClick={onLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <button className={styles.linkBtn} onClick={onLogin}>
              로그인
            </button>
            <button className={styles.primaryBtn} onClick={onSignup}>
              회원가입
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
