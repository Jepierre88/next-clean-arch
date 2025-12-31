import { betterAuth, type BetterAuthOptions, type Session } from "better-auth";
import { createAuthEndpoint, getSessionFromCtx } from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import { bearer, customSession } from "better-auth/plugins";

import type { ActionResponseEntity } from "@/shared/types/action-response.entity";
import { mergeAppSession, type AppSession } from "@/shared/types/app-session.entity";
import type { AppUser } from "@/shared/types/app-user.entity";
import { appSessionAdditionalFields } from "@/shared/types/app-session.entity";
import { appUserAdditionalFields } from "@/shared/types/app-user.entity";
import { serverContainer } from "@/server/di/server-container";
import { CredentialsSignInUseCase } from "@/server/domain/usecases/credentials-sign-in.usecase";

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

    // Clean Architecture: delegar orquestación a un UseCase.
    // El endpoint se encarga solo de: validar input, ejecutar caso de uso, setear cookie y responder.
    const useCase = serverContainer.resolve(CredentialsSignInUseCase);
    const result = await useCase.execute({
      identificationNumber,
      password,
      headers: ctx.headers,
    });

    if (!result.success) {
      return ctx.json(
        {
          data: undefined,
          success: false,
          message: result.message,
          statusCode: result.statusCode,
        },
        { status: result.statusCode }
      );
    }

    const user = result.user;
    const session = result.session as AppSession;

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

const options = {
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60,
      strategy: "jwe",
      refreshCache: true,
    },
    additionalFields: appSessionAdditionalFields,
  },
  user: {
    additionalFields: appUserAdditionalFields,
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [
    bearer(),
    {
      id: "api",
      endpoints: {
        credentialsSignIn,
      },
    },

    // Mantiene el shape exacto que verá el cliente en useSession()/getSession().
    // Si no tienes campos extra aún, es “no-op”; si los agregas, centraliza defaults.
    customSession(
      async ({ user, session }) => {
        const merged = mergeAppSession(session as Session);
        return { user, session: merged };
      },
      options
    ),
  ],
});
