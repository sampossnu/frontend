import React, { useState, useRef, useEffect } from "react";
import { User } from "../types";
import styles from "./Navbar.module.css";

interface NavbarProps {
  user: User | null;
  onLogoClick: () => void;
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
  onHistory: () => void;
}

export default function Navbar({
  user,
  onLogoClick,
  onLogin,
  onSignup,
  onLogout,
  onHistory,
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={styles.nav}>
      <div className={styles.logo} onClick={onLogoClick} style={{ cursor: "pointer" }}>
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
            <div className={styles.userMenu} ref={dropdownRef}>
              <button
                className={styles.userName}
                onClick={() => setDropdownOpen((v) => !v)}
              >
                {user.name}님
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 4 }}>
                  <path d="M6 9l6 6 6-6" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => { setDropdownOpen(false); onHistory(); }}
                  >
                    내 심사 이력
                  </button>
                </div>
              )}
            </div>
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