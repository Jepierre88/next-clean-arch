export type AppUser = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image: string | null;
};

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
