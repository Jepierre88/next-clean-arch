import type { DBFieldAttribute, FieldAttributeToObject } from "better-auth/db";

export const appUserAdditionalFields = {} as const satisfies Record<string, DBFieldAttribute>;

export type AppUserAdditionalFields = FieldAttributeToObject<typeof appUserAdditionalFields>;

export type AppUserBase = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image: string | null;
};

export type AppUser = AppUserBase & AppUserAdditionalFields;

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
