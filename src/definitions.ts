import { Request, Response, NextFunction } from "express";

export type Method =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "OPTIONS"
  | "HEAD"
  | "*";

export type Context<T = any> = { [K in keyof T]: T[K] };

export type ActorAction<C = any, T = void> = (
  context: Context<C>,
  event: {
    data?: any;
    error?: any;
    request: Request;
    response: Response;
    next: NextFunction;
  }
) => T;

export type Action<T = any> = ActorAction<T, void>;
export type Guard<T = any> = ActorAction<T, boolean>;
export type Service<T = any> = ActorAction<T, Promise<unknown>>;

export type Guards<T = any> = Record<string, Guard<T>>;
export type Services<T = any> = Record<string, Service<T>>;
export type Actions<T = any> = Record<string, ActorAction<T>>;

export type Actor<T = any> = {
  target?: string;
  cond?: string | Guard<T>;
  action?: string | string[] | ActorAction<T> | ActorAction<T>[];
};

export type ActorNode<T> = string | Actor<T> | Actor<T>[] | ActorAction<T>;

type ServiceAction<C = any, T = void> = string | ActorAction<C, T>;

export type InvokableServices<T> = {
  [service: string]: {
    invoke: {
      src: string | Service<T>;
      onDone?: ServiceAction<void | unknown>;
      onError?: ServiceAction<void | unknown>;
    };
  };
};

export type DefinitionNode<T> = {
  on: {
    [K in Method]?: ActorNode<T>;
  };
  services?: InvokableServices<T>;
};

export type DefinitionConfig<T> = {
  id?: string;
  context?: Context<T>;
  routes: {
    [path: string]: DefinitionNode<T>;
  };
};
