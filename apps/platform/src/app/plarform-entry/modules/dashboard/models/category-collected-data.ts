import { SpecificInformationContent } from 'core';

export interface CategoryCollectedData extends SpecificInformationContent {
  field?: string;
  fieldValue?: any;
  values?: Array<any>;
  progress_status?: Array<CategoryCollectedData>;
  status_indications?: number;
}
