import React, { useState } from "react";
import { Page, FormData, UnderwriteResult, User } from "./types";
import { clearAuth, getStoredUser, getAccessToken, getRefreshToken, logout } from "./utils/auth";
import Navbar from "./components/Navbar";
import IntroPage from "./pages/IntroPage";
import FormPage from "./pages/FormPage";
import ResultPage from "./pages/ResultPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HistoryPage from "./pages/HistoryPage";

export default function App() {
  const [page, setPage] = useState<Page>("intro");
  const [form, setForm] = useState<Partial<FormData>>({});
  const [result, setResult] = useState<UnderwriteResult | null>(null);
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  const handleFormChange = (id: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitResult = (res: UnderwriteResult) => {
    setResult(res);
    setPage("result");
  };

  const handleReset = () => {
    setPage("intro");
    setForm({});
    setResult(null);
  };

  const handleLogout = async () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    if (accessToken && refreshToken) {
      await logout({ accessToken, refreshToken }).catch(() => {});
    }
    clearAuth();
    setUser(null);
    handleReset();
  };

  return (
    <div>
      <Navbar
        user={user}
        onLogoClick={handleReset}
        onLogin={() => setPage("login")}
        onSignup={() => setPage("signup")}
        onLogout={handleLogout}
        onHistory={() => setPage("history")}
      />
      {page === "intro" && <IntroPage onStart={() => setPage("form")} />}
      {page === "form" && (
        <FormPage
          form={form}
          onChange={handleFormChange}
          onSubmit={handleSubmitResult}
          onBack={() => setPage("intro")}
        />
      )}
      {page === "result" && result && (
        <ResultPage
          result={result}
          onBack={() => setPage("form")}
          onReset={handleReset}
        />
      )}
      {page === "login" && (
        <LoginPage
          onLoggedIn={(u) => {
            setUser(u);
            setPage("intro");
          }}
          onGoSignup={() => setPage("signup")}
        />
      )}
      {page === "signup" && (
        <SignupPage
          onSignedUp={() => setPage("login")}
          onGoLogin={() => setPage("login")}
        />
      )}
      {page === "history" && (
        <HistoryPage onBack={() => setPage("intro")} />
      )}
    </div>
  );
}