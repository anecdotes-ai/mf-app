export const isArrayOfArrays = (array: unknown): boolean => {
  return Array.isArray(array) && array.every((element): boolean => Array.isArray(element));
};

export const convertToOneLevelArray = (array: unknown): unknown[] | unknown => {
  if (isArrayOfArrays(array)) {
    return (array as unknown[]).flat(1);
  }

  return array;
};
