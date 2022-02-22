import { CalculatedControl } from 'core/modules/data/models';

export interface Category {
  category_name?: string;
  values?: CalculatedControl[];
  icon?: string;
  status_indications?: number;
  automation_indications?: number;
  progress_status?: Array<any>;
  control_automated?: number;
  field?: string;
  framework_id?: string;
}

export type CategoryProgressStatus = 'BASIC' | 'ADVANCED' | 'SUPERSTAR';
export const CategoryProgressStatus = {
  BASIC: 'BASIC' as CategoryProgressStatus,
  ADVANCED: 'ADVANCED' as CategoryProgressStatus,
  SUPERSTAR: 'SUPERSTAR' as CategoryProgressStatus,
};

export const DefaultCategories: Set<string> = new Set([
  'Access Control',
  'Data Protection',
  'Governance',
  'Human Resources',
  'Logging & Incident Response',
  'Network Security',
  'Physical Security',
  'Secure Development',
  'Security Operations'
]);


export const CategoriesDefaultState: CalculatedControl[] = [...DefaultCategories].map(cat => ({control_category: cat}));
