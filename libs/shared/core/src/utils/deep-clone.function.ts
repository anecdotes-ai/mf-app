export function deepClone<T = object>(obj: T): T {
  const result: any = {};

  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      result[key] = deepClone(obj[key]);
    } else {
      result[key] = obj[key];
    }
  }

  result.__proto__ = (obj as any).__proto__;

  return obj instanceof Array ? Object.values(result) : result;
}
