export interface IExternalUser {
  id: string;
  name: string;
  email: string;
  // El backend puede traer más campos; se ignoran si AppUser no los define.
  [key: string]: unknown;
};
