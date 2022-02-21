import { Control, ControlStatus } from './../../../models/domain';

export interface CustomControlFormData {
  control_description: string;
  control_framework_category: string;
  control_id?: string;
  control_name: string;
  // Commented till we adjust system to use my_controls_category
  my_controls_category?: string;
  control_original_related_controls?: string[];
  control_status?: ControlStatus;
}

export function CustomControlDataToControlMap(frameworkId: string, model: CustomControlFormData): Control {
  return {
    control_is_applicable: true,
    control_is_custom: true,
    control_name: model.control_name,
    control_id: model.control_id,
    control_related_frameworks: [],
    control_related_frameworks_names: {},
    control_requirement_ids: [],
    control_description: model.control_description,
    control_category: model.control_framework_category,
    control_status: model.control_status
    // frameworkId === AnecdotesUnifiedFrameworkId ? model.my_controls_category : model.control_framework_category,
  };
}
