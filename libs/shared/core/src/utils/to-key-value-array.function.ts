export function toKeyValueArray<T>(object: T): { key: string; value: any }[] {
  return Object.keys(object).map((key) => ({ key: key.toString(), value: object[key] }));
}
