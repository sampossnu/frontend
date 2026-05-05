import React from "react";
import styles from "./Navbar.module.css";

interface NavbarProps {
  showBack: boolean;
  onReset: () => void;
}

export default function Navbar({ showBack, onReset }: NavbarProps) {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
              fill="white"
              opacity="0.9"
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="#185FA5"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
        <span className={styles.logoText}>InsureAI</span>
        <span className={styles.badge}>BETA</span>
      </div>
      {showBack && (
        <button className={styles.backBtn} onClick={onReset}>
          처음으로
        </button>
      )}
    </nav>
  );
}
