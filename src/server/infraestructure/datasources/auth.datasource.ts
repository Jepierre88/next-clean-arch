import { ENVIRONTMENT } from "@/shared/lib/environment";
import { injectable } from "tsyringe";
import type { ActionResponseEntity } from "@/shared/types/action-response.entity";
import type { IExternalUserLoginParams } from "@/server/domain/entities/params/external-user-login-params.entity";
import type { IExternalLoginResponse } from "@/server/domain/entities/response/external-user-login-response.entity";

type ExternalLoginErrorResponse = {
  error?: {
    statusCode?: number;
    name?: string;
    message?: string;
  };
};

@injectable()
export class AuthDataSourceService {
  async login(
    credentials: IExternalUserLoginParams
  ): Promise<ActionResponseEntity<IExternalLoginResponse>> {
    console.log("AuthDataSourceService: login called", ENVIRONTMENT.BACKEND_URL);
    const response = await fetch(`${ENVIRONTMENT.BACKEND_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })


    console.log("AuthDataSourceService: login error payload", (await response.clone().json()));
    if (!response.ok) {
      let message = "Error al iniciar sesión";
      try {
        const payload = (await response.json()) as ExternalLoginErrorResponse;
        message = payload?.error?.message ?? message;
      } catch {
        // ignore
      }

      return {
        success: false,
        message: response.status === 401 ? "Credenciales inválidas" : message,
        statusCode: response.status,
        data: undefined,
      };
    }

    const data = (await response.json()) as IExternalLoginResponse;
    return {
      success: true,
      message: "OK",
      statusCode: 200,
      data,
    };
  }
}
