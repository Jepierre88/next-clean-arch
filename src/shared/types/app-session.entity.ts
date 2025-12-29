export type AppSession = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
};

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
};
