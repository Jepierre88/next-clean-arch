"use client";

import { useCallback, useState } from "react";

type Json = Record<string, unknown>;

export default function Home() {
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Json | null>(null);

  const signIn = useCallback(async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/auth/credentials/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identificationNumber, password }),
      });
      const data = (await res.json()) as Json;
      setResult({ status: res.status, ...data });
    } finally {
      setLoading(false);
    }
  }, [identificationNumber, password]);

  const getSession = useCallback(async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/auth/get-session", { method: "GET" });
      const data = (await res.json()) as Json;
      setResult({ status: res.status, ...data });
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <main style={{ padding: 16, maxWidth: 420 }}>
      <h1 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Mini Login</h1>

      <label style={{ display: "block", marginBottom: 8 }}>
        Identificación
        <input
          value={identificationNumber}
          onChange={(e) => setIdentificationNumber(e.target.value)}
          style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
        />
      </label>

      <label style={{ display: "block", marginBottom: 12 }}>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
        />
      </label>

      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" onClick={signIn} disabled={loading}>
          {loading ? "..." : "Sign in"}
        </button>
        <button type="button" onClick={getSession} disabled={loading}>
          {loading ? "..." : "Get session"}
        </button>
      </div>

      {result ? (
        <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      ) : null}
    </main>
  );
}
