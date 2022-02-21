export function groupBy<T, R>(array: T[], selector: (item: T) => R): { key: R; values: T[] }[] {
  return array.reduce((objectsByKeyValue: any[], obj) => {
    const key = selector(obj);
    let group = objectsByKeyValue.find((t) => t.key === key);

    if (!group) {
      group = { key };
      objectsByKeyValue.push(group);
    }

    group.values = (group.values || []).concat([obj]);

    return objectsByKeyValue;
  }, []);
}
