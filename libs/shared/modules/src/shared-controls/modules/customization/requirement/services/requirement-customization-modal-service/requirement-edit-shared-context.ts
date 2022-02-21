import { Control, ControlRequirement, Framework } from 'core/modules/data/models/domain';
import { StatusModalWindowSharedContext } from 'core/modules/modals';

export interface RequirementEditSharedContext extends StatusModalWindowSharedContext {
  control: Control;
  requirement: ControlRequirement;
  framework: Framework;
}
