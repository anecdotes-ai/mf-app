export function toDictionary<T, K>(
  array: T[],
  keySelector: (o: T, index: number) => string,
  valueSelector?: (o: T, index: number) => K
): { [key: string]: K } {
  const result = {};

  array.forEach((arrayItem, index) => {
    result[keySelector(arrayItem, index)] = valueSelector ? valueSelector(arrayItem, index) : arrayItem;
  });

  return result;
}
