import { type AppSession, appSessionInitialValue } from "@/shared/types/app-session.entity";
import { type AppUser, appUserInitialValue } from "@/shared/types/app-user.entity";
import { pickKnownKeys } from "./entity-helpers";

export type { AppSession, AppUser };

export function expiresAtFromJwt(token: string, fallbackMs = 60 * 60 * 1000): Date {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString("utf8")
    ) as { exp?: number };

    if (typeof payload.exp === "number") return new Date(payload.exp * 1000);
  } catch {}

  return new Date(Date.now() + fallbackMs);
}


export type BuildAppUserOptions<TExternal extends Record<string, unknown>> = {
  now?: Date;
  extend?: (base: AppUser, external: TExternal) => Partial<AppUser> | Promise<Partial<AppUser>>;
};

export async function buildAppUser<TExternal extends Record<string, unknown>>(
  external: TExternal,
  options?: BuildAppUserOptions<TExternal>
): Promise<AppUser> {
  const now = options?.now ?? new Date();

  // Dinámico: copia automáticamente campos que existan en `external` y en el `initialValue`.
  // Para cualquier campo derivado (p.ej. emailVerified/image), usar `extend`.
  const base: AppUser = {
    ...appUserInitialValue,
    ...pickKnownKeys(appUserInitialValue as unknown as Record<string, unknown>, external),
    createdAt: now,
    updatedAt: now,
  };

  const extra = options?.extend ? await options.extend(base, external) : undefined;
  return {
    ...base,
    ...(extra ?? {}),
  };
}

export type BuildAppSessionArgs = Partial<AppSession> & {
  userId: string;
  expiresAt: Date;
  headers?: Headers;
  now?: Date;
};

export type BuildAppSessionOptions = {
  extend?: (base: AppSession, args: BuildAppSessionArgs) =>
    | Partial<AppSession>
    | Promise<Partial<AppSession>>;
};

export async function buildAppSession(
  args: BuildAppSessionArgs,
  options?: BuildAppSessionOptions
): Promise<AppSession> {
  const now = args.now ?? new Date();

  // Dinámico: cualquier campo extra que exista en `args` y en el `initialValue`
  // se copia automáticamente (ej: externalToken, buildings, selectedBuilding, etc.).
  const base: AppSession = {
    ...appSessionInitialValue,
    ...pickKnownKeys(appSessionInitialValue as unknown as Record<string, unknown>, args),
    id: args.id ?? crypto.randomUUID(),
    createdAt: args.createdAt ?? now,
    updatedAt: args.updatedAt ?? now,
    userId: args.userId,
    token: args.token ?? crypto.randomUUID(),
    expiresAt: args.expiresAt,
    ipAddress: args.ipAddress ?? args.headers?.get("x-forwarded-for") ?? null,
    userAgent: args.userAgent ?? args.headers?.get("user-agent") ?? null,
  };

  const extra = options?.extend ? await options.extend(base, args) : undefined;
  return {
    ...base,
    ...(extra ?? {}),
  };
}