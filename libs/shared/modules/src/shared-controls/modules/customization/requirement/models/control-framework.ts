import { CalculatedControl} from 'core/modules/data/models';
import { Framework } from 'core/modules/data/models/domain';

export interface ControlFramework {
  control: CalculatedControl;
  framework: Framework;
}
