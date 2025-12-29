import { betterAuth } from "better-auth";
import { createAuthEndpoint, getSessionFromCtx } from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import { bearer } from "better-auth/plugins";

import { ENVIRONTMENT } from "@/shared/lib/environment";
import { buildAppSession, buildAppUser, expiresAtFromJwt } from "@/shared/lib/auth";
import type { ActionResponseEntity } from "@/shared/types/action-response.entity";
import type { AppSession } from "@/shared/types/app-session.entity";
import type { AppUser } from "@/shared/types/app-user.entity";
import next from "next";

//IMPORTANTE PARA TIPAR
type ExternalLoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    identificationNumber: string;
  };
};

//IMPORTANTE PARA TIPAR
type ExternalLoginErrorResponse = {
  error: {
    statusCode: number;
    name: string;
    message: string;
  };
};

export const credentialsSignIn = createAuthEndpoint(
  "/credentials/sign-in",
  { method: "POST" },
  async (ctx: any): Promise<ActionResponseEntity<AppUser>> => {
    const { identificationNumber, password } = (ctx.body ?? {}) as {
      identificationNumber?: string;
      password?: string;
    };

    if (!identificationNumber || !password) {
      return ctx.json({
        data: undefined,
        success: false,
        message: "Identificación y contraseña son requeridos",
        statusCode: 400,
      });
    }

    const response = await fetch(`${ENVIRONTMENT.BACKEND_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identificationNumber, password }),
    });

    if (!response.ok) {
      const errorData = ((await response.json()) as ExternalLoginErrorResponse).error?.message;
      return ctx.json({
        data: undefined,
        success: false,
        message:
          response.status === 401
            ? "Credenciales inválidas"
            : errorData || "Error al iniciar sesión",
        statusCode: response.status,
      });
    }

    const data = (await response.json()) as ExternalLoginResponse;
    const expiresAt = expiresAtFromJwt(data.token);

    // User dinámico: copia campos que coincidan por nombre con AppUser.
    const user = await buildAppUser(data.user, {
      extend: (base) => ({
        ...base,
        emailVerified: true,
        image: null,
      }),
    });

    // Session dinámica: pasar extras en `args` (se copian automáticamente) + callback opcional.
    const session = await buildAppSession(
      {
        userId: user.id,
        expiresAt,
        headers: ctx.headers,
        externalToken: data.token,
      } as Partial<AppSession> & { userId: string; expiresAt: Date; headers?: Headers },
    );

    await setSessionCookie(ctx, { session: session as AppSession, user: user as AppUser });

    return ctx.json(
      {
        data: user,
        success: true,
        message: "Inicio de sesión exitoso",
      },
      { status: 200 }
    );
  }
);

export const auth = betterAuth({
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60,
      strategy: "jwe",
      refreshCache: true,
    },
  },
  plugins: [
    bearer(),
    {
      id: "api",
      endpoints: {
        credentialsSignIn,
      },
    },
  ],
});
