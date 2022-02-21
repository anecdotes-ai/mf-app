/**
  DEPRECATED!!!!
  Use createSortCallback instead.
  It should be deprecated in favour of createSortCallback
  createSortCallback is more useful
 */
export function sortCallback<T>(first: T, second: T, sortBy?: (v: T) => any): number {
  if (typeof sortBy === 'function') {
    first = sortBy(first);
    second = sortBy(second);
  }

  if (first < second) {
    return -1;
  }
  if (first > second) {
    return 1;
  }

  return 0;
}

export function createSortCallback<T>(
  sortBy?: (v: T) => any,
  direction: 'ASC' | 'DSC' = 'ASC'
): (fst: T, scnd: T) => number {
  return (first, second) => {
    if (typeof sortBy === 'function') {
      first = sortBy(first);
      second = sortBy(second);
    }

    let result: number;

    if (first < second) {
      result = -1;
    } else if (first > second) {
      result = 1;
    } else {
      result = 0;
    }

    return direction === 'DSC' ? result * -1 : result;
  };
}
