export const ENVIRONTMENT = {
  BACKEND_URL:
    process.env.BACKEND_URL ??
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    "http://localhost:3001",
} as const;
