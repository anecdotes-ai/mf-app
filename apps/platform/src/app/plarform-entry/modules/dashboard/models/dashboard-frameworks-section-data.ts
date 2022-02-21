import { CalculatedControl } from 'core/modules/data/models';
import { Framework } from 'core/modules/data/models/domain';

export interface DashboardFrameworksSectionData {
  frameworksSectionItems: FrameworkSectionItem[];
}

export interface FrameworkSectionItem {
  framework: Framework;
  relatedControls: CalculatedControl[];
}
