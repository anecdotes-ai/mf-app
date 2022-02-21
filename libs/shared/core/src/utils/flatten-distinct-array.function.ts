import { distinct } from './distinct.function';

export function flattenAndDistinctArrays<T>(arrayOfArrays: T[][]): T[] {
    return distinct(arrayOfArrays.reduce((acc, it) => [...acc, ...it], [])) as T[];
}
