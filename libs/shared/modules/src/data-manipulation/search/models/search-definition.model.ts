export interface SearchDefinitionModel<T> {
  propertySelector: (t: T) => string;
}
