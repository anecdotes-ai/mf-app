export function splitComposedResourceId(composedResourceId: string): { resourceType: string; resourceId: string } {
  const splitted = composedResourceId.split('@');
  return {
    resourceType: splitted[0],
    resourceId: splitted[1],
  };
}
