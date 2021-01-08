import { Actions, ActorAction, Guards, Guard } from "./definitions";
import { Request, Response, Router, RouterOptions } from "express";
import { Actor, ActorNode, Method } from "./definitions";
import { isArray, isFunc, isString } from "./utils";
import { BaseDefinition } from "./Definition";

function toGuard(cond: Actor["cond"], guards: Guards): Guard {
  return isString(cond) ? guards[cond] : cond ?? (() => true);
}

function toAction(action: Actor["action"], actions: Actions): ActorAction[] {
  let _actions: ActorAction[] = [];

  if (isString(action)) {
    _actions = [actions[action]];
  }

  if (isFunc(action)) {
    _actions = [action];
  }

  if (isArray(action)) {
    return (action as (string | ActorAction)[]).map((act) => {
      const [action] = toAction(act, actions);
      return action;
    });
  }

  return _actions;
}

function toActor(actor: ActorNode<any>): Actor[] {
  let actors: Actor[];

  if (isFunc(actor)) {
    actors = [{ action: actor }];
  } else if (isString(actor)) {
    actors = [{ target: actor }];
  } else if (isArray(actor)) {
    return actor.map((act) => {
      const [actor] = toActor(act);
      return actor;
    });
  } else {
    actors = [actor];
  }

  return actors;
}

export default function createRouter<T>(
  definition: BaseDefinition<T>,
  options?: RouterOptions
): Router {
  const {
    routes,
    context,
    guards = {},
    actions = {},
    services: globalServices = {},
  } = definition.getDefinition();

  const router = Router(options);

  Object.keys(routes).forEach((path) => {
    const { on, services } = routes[path];

    Object.keys(on).forEach((method) => {
      router.all(path, async (request, response, next) => {
        const options = { request, response, next };
        const actor = on[method === "*" ? method : (request.method as Method)];

        if (actor) {
          const _actor = toActor(actor);
          const args = [context, options] as Parameters<ActorAction>;

          for (const { target, cond, action } of _actor) {
            const _cond = toGuard(cond, guards);
            const _actions = toAction(action, actions);
            const service = services?.[target as string];

            if (target && !_cond(...args)) continue;

            let data: unknown;
            let error: unknown;

            if (service) {
              const {
                invoke: { src, onDone, onError },
              } = service;

              const _src = isString(src) ? globalServices?.[src] : src;

              const _onDone = toAction(onDone, actions);
              const _onError = toAction(onError, actions);

              try {
                const result = await _src(...args);
                data = _onDone.reduce((_, action) => {
                  return action(context as any, {
                    ...options,
                    data: result,
                  }) as any;
                }, null);
              } catch (err) {
                error = _onError.reduce((_, action) => {
                  return action(context as any, {
                    ...options,
                    error: err,
                  }) as any;
                }, null);
              }
            }

            const _args = [
              context as any,
              { ...options, data, error },
            ] as Parameters<ActorAction>;

            if (_cond(..._args)) {
              _actions.forEach((action) => {
                action(..._args);
              });

              break;
            }
          }
        }
      });
    });
  });

  return router;
}
