import { Service, Framework } from 'core/modules/data/models/domain';
import { CalculatedControl } from 'core/modules/data/models';

export interface DashboardData {
  controlsFrameworksMapping: { [controlId: string]: string };
  anecdotesControls: CalculatedControl[];
  frameworksControls: CalculatedControl[];
  frameworks: Framework[];
  applicableFrameworksIds: string[];
  services: Service[];
}
