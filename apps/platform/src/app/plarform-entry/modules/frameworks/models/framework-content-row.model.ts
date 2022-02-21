import { SpecificInformationContent } from 'core';

export interface FrameworkContentRow extends SpecificInformationContent {
  // This property are used to set a filter filed name in query parameters
  field?: string;
  // The value for provided 'field' in query parameters. For filter
  fieldValue?: any;
}
