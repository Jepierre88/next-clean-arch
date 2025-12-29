import { IExternalUser } from "../external-user.entity";

export interface IExternalLoginResponse {
  token: string;
  user: IExternalUser;
};