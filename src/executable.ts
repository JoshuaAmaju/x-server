import { Service, Method, ActorAction, Guard, Context } from "./definitions";

export type Actor = {
  cond?: Guard;
  target?: string;
  action?: (ActorAction | undefined)[];
};

export type ExecutableDefinitionNode = {
  on: {
    [K in Method]: Actor[];
  };
  services: {
    [service: string]: {
      invoke: {
        src: Service<any> | undefined;
        onDone?: (ActorAction<void | unknown> | undefined)[];
        onError?: (ActorAction<void | unknown> | undefined)[];
      };
    };
  };
};

export type ExecutableDefinition = {
  id?: string;
  context?: Context;
  routes: {
    [path: string]: ExecutableDefinitionNode;
  };
};
