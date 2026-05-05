import React, { useState } from "react";
import { Page, FormData, UnderwriteResult } from "./types";
import { calculateResult } from "./utils/scoring";
import Navbar from "./components/Navbar";
import IntroPage from "./pages/IntroPage";
import FormPage from "./pages/FormPage";
import ResultPage from "./pages/ResultPage";

export default function App() {
  const [page, setPage] = useState<Page>("intro");
  const [form, setForm] = useState<Partial<FormData>>({});
  const [result, setResult] = useState<UnderwriteResult | null>(null);

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

  return (
    <div>
      <Navbar showBack={page !== "intro"} onReset={handleReset} />
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
    </div>
  );
}