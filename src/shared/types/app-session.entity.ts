import { sessionSchema } from "better-auth";
import type { DBFieldAttribute, DBFieldType, Session } from "better-auth";
import type { FieldAttributeToObject } from "better-auth/db";
import { z } from "zod";

/**
 * =================================
 *  AppSession + Additional Fields
 * =================================
 *
 * Better Auth define un modelo base `Session`.
 * En la app, `AppSession` = `Session` + campos extra (si los necesitas).
 *
 * Hay 2 lugares donde se “agrega” un campo:
 *
 * 1) `appSessionAdditionalFields` (DB schema / typing de Better Auth)
 *    - Declara QUÉ se guarda/retorna en el modelo `session`.
 *    - Se registra en el server:
 *      betterAuth({ session: { additionalFields: appSessionAdditionalFields } })
 *
 * 2) `appSessionSchema` (shape / zod)
 *    - Documenta el shape y te permite validar/parsing si usas schemas reales.
 *    - OJO: `z.custom<T>()` solo tipa, NO valida.
 *
 * Nota sobre `type: "json"`:
 * - Better Auth infiere `json` como `Record<string, any>` en el cliente.
 * - Si necesitas tipado 100% exacto en `useSession()`/`getSession()`, complementa
 *   con el plugin `customSession()` (server) y `customSessionClient()` (client)
 *   para que el payload retornado tenga el shape exacto (idealmente validado).
 */

export const appSessionAdditionalFields = {} as const satisfies Record<
  string,
  DBFieldAttribute<DBFieldType>
>;

export type AppSessionAdditionalFields = FieldAttributeToObject<
  typeof appSessionAdditionalFields
>;

export type AppSession = Session & AppSessionAdditionalFields;

export const appSessionSchema = sessionSchema.extend({}) satisfies z.ZodType<AppSession>;

// Defaults para tus campos extra. Mantén esto sincronizado con `appSessionAdditionalFields`.
// Ejemplo:
// export const appSessionDefaults = {
//   applications: [] as Array<{ id: string; name: string }>,
// } satisfies Partial<AppSessionAdditionalFields>;
export const appSessionDefaults = {} satisfies Partial<AppSessionAdditionalFields>;

const mergeWithDefaults = <T extends object, D extends Record<string, unknown>>(
  value: T,
  defaults: D
): T & D => {
  const out: any = { ...value };
  for (const [key, defaultValue] of Object.entries(defaults)) {
    out[key] = out[key] ?? defaultValue;
  }
  return out;
};

/**
 * Normaliza (merge) una sesión proveniente de Better Auth al shape `AppSession`.
 *
 * Por qué es importante:
 * - Los campos extra pueden venir como `undefined` dependiendo del endpoint/cache.
 * - Para `json`, TS suele inferir `Record<string, any>`; esta función centraliza
 *   la normalización para que la UI no tenga que hacerlo en todos lados.
 *
 * Qué NO hace:
 * - NO valida contenido. Si necesitas validación real, usa Zod con schemas reales
 *   o valida en el server antes de setear la cookie / en `customSession()`.
 */
export function mergeAppSession(session: Session & Partial<AppSessionAdditionalFields>): AppSession {
  return mergeWithDefaults(session, appSessionDefaults) as AppSession;
}

// Nota: fecha estable para evitar valores no deterministas al importar el módulo.
export const appSessionInitialValue: AppSession = {
  id: "",
  createdAt: new Date(0),
  updatedAt: new Date(0),
  userId: "",
  token: "",
  expiresAt: new Date(0),
  ipAddress: null,
  userAgent: null,
} as AppSession;
