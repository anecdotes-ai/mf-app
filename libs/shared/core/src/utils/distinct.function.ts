export function distinct<T>(array: T[]): T[] {
  return array.filter((value, index, self) => self.indexOf(value) === index);
}
