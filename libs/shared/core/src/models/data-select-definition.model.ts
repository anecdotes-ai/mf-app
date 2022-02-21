export interface DataSelectDefinition<T> {
  fieldId: string;
  valueSelector: (v: T) => any;
  idSelector: (v: T) => any;
}
