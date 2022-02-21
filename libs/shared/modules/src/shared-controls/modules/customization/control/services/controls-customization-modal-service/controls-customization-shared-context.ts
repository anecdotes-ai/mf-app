import { StatusModalWindowSharedContext } from 'core/modules/modals/components/status-window-modal/constants';
import { RequirementCreationSharedContext } from './../../../requirement/services/requirement-customization-modal-service/requirement-creation-shared-context';

export interface ControlCustomizationSharedContext
  extends StatusModalWindowSharedContext,
    RequirementCreationSharedContext {
  control_id?: string;
  framework_id: string;
  isEditMode?: boolean;
}
