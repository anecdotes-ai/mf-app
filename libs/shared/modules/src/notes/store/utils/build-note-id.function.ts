import { ResourceType } from 'core/modules/data/models';

export function buildNoteId(resource_type: ResourceType, resource_id: string): string {
  return `${resource_type}_${resource_id}`;
}
