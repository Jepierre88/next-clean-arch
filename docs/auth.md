# Auth: modelos, sesión dinámica y extensiones

Este proyecto separa:

- **Core genérico** (sin lógica de negocio): construye `AppUser`/`AppSession` dinámicamente según los modelos.
- **App-specific** (tu dominio): endpoints, fetches, buildings, etc.

## Archivos clave

- Modelos + `initialValue`
  - `src/types/app-user.entity.ts`
  - `src/types/app-session.entity.ts`
- Builders genéricos (dinámicos)
  - `src/lib/auth.ts`
  - `src/lib/entity-helpers.ts`
- Implementación específica de tu app (endpoints + lógica)
  - `src/lib/app-auth.ts`

## 1) Cómo cambiar el modelo de usuario

1. Edita el tipo `AppUser` en `src/types/app-user.entity.ts`.
2. Agrega el **mismo campo** en `appUserInitialValue`.

Regla: si un campo existe en el tipo pero NO existe en el `initialValue`, el builder no podrá “verlo” para copiarlo dinámicamente.

### Ejemplo: agregar `role`

En `src/types/app-user.entity.ts`:

```ts
export type AppUser = {
  // ...
  role: "admin" | "user";
};

export const appUserInitialValue: AppUser = {
  // ...
  role: "user",
};
```

A partir de ahí, si el objeto externo trae `role`, `buildAppUser(external)` lo copiará automáticamente.

## 2) Cómo cambiar el modelo de sesión

Mismo patrón en `src/types/app-session.entity.ts`:

1. Agrega/edita campos en `AppSession`.
2. Refleja esos campos en `appSessionInitialValue`.

### Ejemplo: agregar `permissions: string[]`

```ts
export type AppSession = {
  // ...
  permissions: string[];
};

export const appSessionInitialValue: AppSession = {
  // ...
  permissions: [],
};
```

Luego, si en tu app pasas `permissions` en los args del builder, se copia solo:

```ts
const session = await buildAppSession({
  userId,
  expiresAt,
  permissions: ["read", "write"],
});
```

## 3) Cómo funciona la construcción “dinámica”

En `src/lib/auth.ts`:

- `buildAppUser(external)`:
  - parte de `appUserInitialValue`
  - copia automáticamente claves presentes en `external` *que también existan en el `initialValue`*
  - setea `createdAt/updatedAt`
  - aplica `extend` si existe

- `buildAppSession(args)`:
  - parte de `appSessionInitialValue`
  - copia automáticamente claves presentes en `args` *que también existan en el `initialValue`*
  - setea `id/token` si no vienen
  - setea `ipAddress/userAgent` desde `headers` si no vienen
  - aplica `extend` si existe

Esto te permite que el core NO conozca nada de buildings, tokens externos, etc.

## 4) Agregar campos extra con lógica personalizada (callback `extend`)

Usa `extend` cuando:

- el campo no viene en el `external/args`
- el campo es derivado (ej. `selectedBuilding`)
- querés validar/normalizar

### Ejemplo: user con campo derivado

```ts
const user = await buildAppUser(externalUser, {
  extend: (base, external) => ({
    emailVerified: true,
    image: null,
    // ejemplo: normalizar nombre
    name: String(external.name ?? "").trim(),
  }),
});
```

### Ejemplo: session con campo derivado

```ts
const session = await buildAppSession(
  {
    userId: user.id,
    expiresAt,
    buildings,
  },
  {
    extend: (base) => ({
      selectedBuilding: base.buildings?.[0] ?? null,
    }),
  }
);
```

## 5) Cómo cambiar datos de la sesión en runtime

Patrón recomendado:

1. Crear un endpoint en `src/lib/app-auth.ts` (o en otro módulo app-specific)
2. Leer la sesión actual con `getSessionFromCtx(ctx)`
3. Construir la nueva sesión (merge + validaciones)
4. Persistir con `setSessionCookie(ctx, { session, user })`

### Ejemplo: actualizar un campo

En la práctica se ve en `setSelectedBuilding` (en `src/lib/app-auth.ts`):

- valida `buildingId`
- verifica que pertenezca a `currentSession.buildings`
- crea `updatedSession = { ...currentSession, selectedBuilding: next, updatedAt: new Date() }`
- llama `setSessionCookie(...)`

## 6) Dónde poner lógica de negocio

- ✅ App-specific: `src/lib/app-auth.ts` (o módulos en `src/datasource/*`, `src/services/*`, etc.)
- ✅ Modelos: `src/types/*`
- ✅ Builders genéricos: `src/lib/auth.ts`
- ❌ Evitar lógica de negocio en `src/lib/auth.ts`

## Checklist rápido

- Agregar campo nuevo: editar `type` + `initialValue`.
- Copia automática: pasar el campo en `external` (user) o en `args` (session).
- Lógica especial: usar `extend`.
- Cambio runtime: endpoint + `getSessionFromCtx` + `setSessionCookie`.
