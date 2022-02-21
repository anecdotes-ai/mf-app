export function createComposedResourceId(resourceType: string, resourceId: string): string {
  return `${resourceType}@${resourceId}`;
}
