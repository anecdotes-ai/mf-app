export function selectMany<T, M>(array: T[], selector: (item: T) => M[]): M[] {
    return array.reduce((result, item) => [...result, ...selector(item)], [] as M[]);
}
