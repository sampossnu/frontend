import React, { useState } from "react";
import { Page, FormData, UnderwriteResult, User } from "./types";
import { calculateResult } from "./utils/scoring";
import { clearAuth, getStoredUser } from "./utils/auth";
import Navbar from "./components/Navbar";
import IntroPage from "./pages/IntroPage";
import FormPage from "./pages/FormPage";
import ResultPage from "./pages/ResultPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

export default function App() {
  const [page, setPage] = useState<Page>("intro");
  const [form, setForm] = useState<Partial<FormData>>({});
  const [result, setResult] = useState<UnderwriteResult | null>(null);
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  const handleFormChange = (id: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    const res = calculateResult(form as FormData);
    setResult(res);
    setPage("result");
  };

  const handleReset = () => {
    setPage("intro");
    setForm({});
    setResult(null);
  };

  const handleLogout = () => {
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
      />
      {page === "intro" && <IntroPage onStart={() => setPage("form")} />}
      {page === "form" && (
        <FormPage
          form={form}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
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
    </div>
  );
}
