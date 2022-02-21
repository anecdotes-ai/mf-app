import { SearchDefinitionModel } from 'core/modules/data-manipulation/search';
import { SortDefinition } from 'core/modules/data-manipulation/sort';

export interface MainHeaderInput {
  translationRootKey?: string;
  translationHeaderCount?: string | number;
  showOnlyTitle?: boolean;
  hasActionBtn?: boolean;
  searchDefinitions?: SearchDefinitionModel<any>[];
  btnIcon?: string;
  hasDataSort?: boolean;
  liveSort?: boolean;
  data?: any[];
  sortDefinition?: SortDefinition<any>[];
  sortHandler?: (any) => void;
}
