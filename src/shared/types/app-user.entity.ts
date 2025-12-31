import { userSchema } from "better-auth";
import type { DBFieldAttribute, DBFieldType, User } from "better-auth";
import type { FieldAttributeToObject } from "better-auth/db";
import { z } from "zod";

/**
 * =================================
 *  AppUser + Additional Fields
 * =================================
 *
 * Better Auth define un modelo base `User`.
 * En la app, `AppUser` = `User` + campos extra (si los necesitas).
 *
 * Hay 2 lugares donde se “agrega” un campo:
 *
 * 1) `appUserAdditionalFields` (DB schema / typing de Better Auth)
 *    - Declara QUÉ se guarda/retorna en el modelo `user`.
 *    - Se registra en el server:
 *      betterAuth({ user: { additionalFields: appUserAdditionalFields } })
 *
 * 2) `appUserSchema` (shape / zod)
 *    - Documenta el shape y te permite validar/parsing si usas schemas reales.
 *    - OJO: `z.custom<T>()` solo tipa, NO valida.
 *
 * Cómo agregar un campo (ejemplo `companyId: string`):
 *
 * A) DB/schema (Better Auth):
 *    export const appUserAdditionalFields = {
 *      companyId: { type: "string", returned: true },
 *    } as const satisfies Record<string, DBFieldAttribute<DBFieldType>>
 *
 * B) Tipado (automático):
 *    `FieldAttributeToObject<typeof appUserAdditionalFields>` se suma a `AppUser`.
 *
 * C) Zod (si quieres runtime safety):
 *    export const appUserSchema = userSchema.extend({ companyId: z.string() })
 */

export const appUserSchema = userSchema.extend({}) satisfies z.ZodType<AppUser>;

export const appUserAdditionalFields = {} as const satisfies Record<
  string,
  DBFieldAttribute<DBFieldType>
>;

export type AppUserAdditionalFields = FieldAttributeToObject<typeof appUserAdditionalFields>;

export type AppUser = User & AppUserAdditionalFields;

// Nota: fecha estable para evitar valores no deterministas al importar el módulo.
export const appUserInitialValue: AppUser = {
  id: "",
  createdAt: new Date(0),
  updatedAt: new Date(0),
  email: "",
  emailVerified: false,
  name: "",
  image: null,
};
