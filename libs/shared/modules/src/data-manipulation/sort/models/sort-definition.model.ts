export interface SortDefinition<T> {
  id: string;
  propertySelector: (t: T) => any;
  sortFunc?: (first: any, second: any) => number;
  translationKey?: string;
}
