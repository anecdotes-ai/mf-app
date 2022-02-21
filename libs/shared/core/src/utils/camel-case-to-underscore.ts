export function camelCaseToUnderscore(key): string {
  return key.replace(/([A-Z])/g, '_$1').toLowerCase();
}
