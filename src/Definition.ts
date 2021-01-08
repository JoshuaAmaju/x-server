import { DefinitionConfig } from "./definitions";
import { Config } from "./types";

type _Config<T> = Omit<Config<T>, "context">;

export class BaseDefinition<T> {
  private _def: DefinitionConfig<T> & _Config<T>;

  constructor(
    private definiton: DefinitionConfig<T>,
    private config: _Config<T>
  ) {
    this._def = { ...definiton, ...config };
  }

  static of<T>(definiton: DefinitionConfig<T>, config: _Config<T>) {
    return new BaseDefinition(definiton, config);
  }

  get routes() {
    return this._def.routes;
  }

  get context() {
    return this._def.context;
  }

  get actions() {
    return this._def.actions;
  }

  get guards() {
    return this._def.guards;
  }

  get services() {
    return this._def.services;
  }

  withConfig(config: Config<T>) {
    return BaseDefinition.of(this.definiton, { ...this.config, ...config });
  }

  getDefinition() {
    return this._def;
  }
}

export default function Definition<T>(
  definitions: DefinitionConfig<T>,
  config?: Config<T>
) {
  return new BaseDefinition(definitions, config ?? {});
}
