import { CalculatedControl } from 'core/modules/data/models';

export interface ControlFilterObject extends CalculatedControl {
  relevant_automating_service_display_names: string[];
}
