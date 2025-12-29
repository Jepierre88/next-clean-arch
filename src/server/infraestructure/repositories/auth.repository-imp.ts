import { inject, injectable } from "tsyringe";
import { TOKENS } from "@/shared/di/tokens";
import type { ActionResponseEntity } from "@/shared/types/action-response.entity";
import { AuthRepository } from "@/server/domain/repositories/auth.repository";
import { AuthDataSourceService } from "@/server/infraestructure/datasources/auth.datasource";
import type { IExternalUserLoginParams } from "@/server/domain/entities/params/external-user-login-params.entity";
import type { IExternalLoginResponse } from "@/server/domain/entities/response/external-user-login-response.entity";

@injectable()
export class AuthRepositoryImp implements AuthRepository {
  constructor(
    @inject(TOKENS.AuthDataSourceService)
    private readonly authDataSource: AuthDataSourceService
  ) {}

  login(
    credentials: IExternalUserLoginParams
  ): Promise<ActionResponseEntity<IExternalLoginResponse>> {
    return this.authDataSource.login(credentials);
  }
}
