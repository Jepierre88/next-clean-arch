export const TOKENS = {
  // Example: BuildingsApi: Symbol.for("BuildingsApi"),
  SomeRepository: Symbol.for("SomeRepository"),
  SomeDataSourceService: Symbol.for("SomeDataSourceService"),

  AuthDataSourceService: Symbol.for("AuthDataSourceService"),
  AuthRepository: Symbol.for("AuthRepository"),
} as const;

export type TokenName = keyof typeof TOKENS;
