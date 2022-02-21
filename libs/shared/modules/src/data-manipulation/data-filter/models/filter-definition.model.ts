import { TemplateRef } from '@angular/core';
export interface FilterOption<T> {
  value: any;
  exactValue?: any;
  icon?: string;
  customPropertySelector?: (t: T) => any;
  translationKey?: string;
  optionId?: string;
  displayed?: boolean;
  checkedByDefault?: boolean;
  notTrackedInQueryParams?: boolean;
  counterPropertySelector?: ((t: T) => any) | NestedCounterPropertySelector[];
}

export interface NestedCounterPropertySelector {
  nextEntities?: (source: any) => any[] | any;
  filterCurrentEntityBy?: (result: any) => boolean;
}

export interface NestedOptions {
  propertyName: string;
  propertySelector?: (t: any) => any;
  filterCriteria?: (data: any, optionValue: any) => boolean;
  nestedOptions?: NestedOptions;
}

export interface FilterOptionState<T> extends FilterOption<T> {
  checked: boolean;
  displayed: boolean;
  exactValue: any;
  calculatedCount: number;
}

export interface FilterDefinition<T> {
  translationKey?: string;
  fieldId: string;
  singleSelection?: boolean;
  propertySelector?: (t: T) => any;
  useSort?: boolean;
  customSortCallback?: (a: any, b: any) => number;
  multiSelector?: boolean;
  iconTemplate?: TemplateRef<any>;
  options?: FilterOption<T>[];
  displayed?: boolean;
  hideInZeroCount?: boolean;
  isSwitcher?: boolean;
  ignoreForCounting?: boolean;
  ignoreForReset?: boolean;
  shouldAffectCounting?: boolean;
  optionsCounterPropertySelector?: (value: any) => NestedCounterPropertySelector[];
  nestedFiltering?: boolean;
  nestedOptions?: NestedOptions;
  expanded?: boolean;
  // This options will alwaes be on the filter even if the count is 0
  fixedOptions?: FilterOption<T>[];
}
