
const isEntityLoaded = (entity: object): boolean => entity && Object.keys(entity).length > 0;

export function areNotLoaded(entities: object[], isInitialized= true): boolean {
  return !(isInitialized && entities.map((entity) => isEntityLoaded(entity)).every((res) => res));
}
