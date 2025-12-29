import type {
  DependencyContainer,
  InjectionToken,
} from "tsyringe";
import { Lifecycle } from "tsyringe";

type Ctor<T> = new (...args: any[]) => T;

type Factory<T> = (c: DependencyContainer) => T;

export function registerSingletonOnce<T>(
  c: DependencyContainer,
  token: InjectionToken<T>,
  ctor: Ctor<T>
): void {
  if (!c.isRegistered(token)) c.register(token, ctor, { lifecycle: Lifecycle.Singleton });
}

export function registerValueOnce<T>(
  c: DependencyContainer,
  token: InjectionToken<T>,
  value: T
): void {
  if (!c.isRegistered(token)) c.register(token, { useValue: value });
}

export function registerFactoryOnce<T>(
  c: DependencyContainer,
  token: InjectionToken<T>,
  factory: Factory<T>
): void {
  if (!c.isRegistered(token)) c.register(token, { useFactory: factory });
}
