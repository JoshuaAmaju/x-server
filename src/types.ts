import { Actions, Context, Guards, Services } from "./definitions";

export type Config<T> = {
  guards?: Guards<T>;
  context?: Context<T>;
  actions?: Actions<T>;
  services?: Services<T>;
};
