import { StatusModalWindowSharedContext } from 'core/modules/modals';

export interface RequirementCreationSharedContext extends StatusModalWindowSharedContext {
  control_id?: string;
  framework_id: string;
}
