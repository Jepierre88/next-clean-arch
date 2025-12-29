import { createAuthClient } from "better-auth/react";

export const {
    useSession,
    getSession,
    $fetch,
} = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL!,
  fetchOptions: {
    auth: {
      type: "Bearer",
      token: () => (typeof window !== "undefined" ? localStorage.getItem("ba") ?? "" : ""),
    },
    onSuccess: (ctx) => {
      const t = ctx.response.headers.get("set-auth-token");
      if (t && typeof window !== "undefined") localStorage.setItem("ba", t);
    },
  },
});