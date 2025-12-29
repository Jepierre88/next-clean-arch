export function pickKnownKeys<T extends Record<string, unknown>>(
  shape: T,
  source: unknown
): Partial<T> {
  if (!source || typeof source !== "object") return {};

  const src = source as Record<string, unknown>;
  const out: Partial<T> = {};

  for (const key of Object.keys(shape)) {
    if (Object.prototype.hasOwnProperty.call(src, key)) {
      (out as Record<string, unknown>)[key] = src[key];
    }
  }

  return out;
}
