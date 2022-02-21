import { CalculatedControl } from './calculated-control.model';
import { Framework } from './domain';

export interface FrameworkReference {
  framework: Framework;
  controls: CalculatedControl[];
}
