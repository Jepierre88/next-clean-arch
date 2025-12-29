export const TOKENS = {
  // Example: BuildingsApi: Symbol.for("BuildingsApi"),
  SomeRepository: Symbol.for("SomeRepository"),
  SomeDataSourceService: Symbol.for("SomeDataSourceService"),
} as const;

export type TokenName = keyof typeof TOKENS;
