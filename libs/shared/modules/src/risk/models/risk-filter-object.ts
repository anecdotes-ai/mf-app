import { Risk } from 'core/modules/risk/models/risk';

export interface RiskFilterObject extends Risk {
  category_name: string
}
