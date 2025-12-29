import { inject, injectable } from "tsyringe";
import { TOKENS } from "@/shared/di/tokens";
import type { ActionResponseEntity } from "@/shared/types/action-response.entity";
import { AuthRepository } from "@/server/domain/repositories/auth.repository";
import { buildAppSession, buildAppUser, expiresAtFromJwt } from "@/shared/lib/auth";
import type { AppSession } from "@/shared/types/app-session.entity";
import type { AppUser } from "@/shared/types/app-user.entity";
import type { IExternalLoginResponse } from "@/server/domain/entities/response/external-user-login-response.entity";

export type CredentialsSignInArgs = {
  identificationNumber: string;
  password: string;
  headers?: Headers;
};

export type CredentialsSignInResult =
  | { success: true; user: AppUser; session: AppSession }
  | { success: false; statusCode: number; message: string };

@injectable()
export class CredentialsSignInUseCase {
  constructor(
    @inject(TOKENS.AuthRepository)
    private readonly authRepository: AuthRepository
  ) {}

  async execute(args: CredentialsSignInArgs): Promise<CredentialsSignInResult> {
    const loginResult: ActionResponseEntity<IExternalLoginResponse> = await this.authRepository.login({
      identificationNumber: args.identificationNumber,
      password: args.password,
    });

    if (!loginResult.success || !loginResult.data) {
      return {
        success: false,
        statusCode: loginResult.statusCode ?? 400,
        message: loginResult.message,
      };
    }

    const expiresAt = expiresAtFromJwt(loginResult.data.token);

    const user = await buildAppUser(loginResult.data.user, {
      extend: () => ({
        emailVerified: true,
        image: null,
      }),
    });

    const session = await buildAppSession({
      userId: user.id,
      expiresAt,
      headers: args.headers,
    });

    return { success: true, user, session };
  }
}
