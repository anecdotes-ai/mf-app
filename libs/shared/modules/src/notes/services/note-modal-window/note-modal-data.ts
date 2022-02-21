import { ResourceType } from 'core/modules/data/models';

export interface NoteModalData {
  resource_type: ResourceType;
  resource_id: string;
  resource_title: string;
  resource_category: string;
  source: string;
  isEditMode: boolean;
  isRemoveState: boolean;
}
