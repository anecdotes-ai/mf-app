export function splitArray<T>(array: T[], maxItemsCount: number): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < array.length; i += maxItemsCount) {
    result.push(array.slice(i, i + maxItemsCount));
  }

  return result;
}
