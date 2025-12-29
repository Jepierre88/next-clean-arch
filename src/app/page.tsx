"use client";

import { $fetch, useSession } from "@/shared/lib/auth-client";
import { ActionResponseEntity } from "@/shared/types/action-response.entity";
import { AppUser } from "@/shared/types/app-user.entity";
import { getSession } from "better-auth/api";
import { useState } from "react";

type Json = Record<string, unknown>;

export default function Home() {
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();

  const signIn = async ({
    identificationNumber,
    password,
  }: { identificationNumber: string; password: string }): Promise<ActionResponseEntity<AppUser>> => {
    const res = await $fetch<ActionResponseEntity<AppUser>>("/credentials/sign-in", {
      method: "POST",
      body: { identificationNumber, password },
    });

    const { data } = res;

    if (!data?.success) {
       alert("Error al iniciar sesión: " + (data?.statusCode === 422 ? "Credenciales inválidas" : data?.message || "Error desconocido"));
       throw new Error(data?.message || "Error al iniciar sesión");
    }

    return data

  };

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
        <button type="button" onClick={() => signIn({ identificationNumber, password })} disabled={loading}>
          {loading ? "..." : "Sign in"}
        </button>
        <button type="button" onClick={() => {}} disabled={loading}>
          {loading ? "..." : "Get session"}
        </button>
      </div>

      {session?.user ? (
        <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }} key={session.user.id}>
          {JSON.stringify(session, null, 2)}
        </pre>
      ) : null}
    </main>
  );
}
