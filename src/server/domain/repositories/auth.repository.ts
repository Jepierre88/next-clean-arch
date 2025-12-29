import { ActionResponseEntity } from "@/shared/types/action-response.entity";
import { IExternalUserLoginParams } from "../entities/params/external-user-login-params.entity";
import { IExternalLoginResponse } from "../entities/response/external-user-login-response.entity";

export abstract class AuthRepository {
  abstract login(
    credentials: IExternalUserLoginParams
  ): Promise<ActionResponseEntity<IExternalLoginResponse>>;
}
