export function isString(val: any): val is string {
  return typeof val === "string";
}

export function isArray<T = any>(val: any): val is T[] {
  return Array.isArray(val);
}

export function isFunc(val: any): val is Function {
  return typeof val === "function";
}
