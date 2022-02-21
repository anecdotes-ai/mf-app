import { NestedCounterPropertySelector, NestedOptions } from './../../models/filter-definition.model';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FilterDefinition, FilterOption, FilterOptionState } from 'core/modules/data-manipulation/data-filter';
import { distinct, groupBy, SubscriptionDetacher, toKeyValueArray } from 'core/utils';

const replaceCharactersRegExp = new RegExp('\\.|\\s', 'g');

@Component({
  selector: 'app-base-data-filter',
  template: '',
})
export class BaseDataFilterComponent implements OnChanges, OnDestroy {
  public predefinedCheckedOptions: { fieldId: string; value: any }[];
  private optionsDictionary: { [key: string]: { [key: string]: FilterOption<any> } };
  private definitionDictionary: { [key: string]: FilterDefinition<any> };
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private filteredDataExceptIgnored: any[];
  private filteredForCounting: any[];

  public formGroup: FormGroup;

  @Input()
  filteringDefinition: FilterDefinition<any>[];

  @Input()
  data: any[];

  @Output()
  filter = new EventEmitter<any[]>(true);

  @Output()
  filtering = new EventEmitter<boolean>(true);

  @Output()
  filteringOptions = new EventEmitter<{
    [key: string]: { [key: string]: FilterOptionState<any> };
  }>(true);

  builtFilteringDefinition: FilterDefinition<any>[];
  initialized: boolean;
  appliedFiltersCount: number;

  constructor(public cd: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes) {
      if(changes['data'].firstChange) {
        this.data = changes['data'].currentValue || [];
        this.filter.emit(this.data);
      }

      if(this.initialized) {
        return this.fillMappingsInDefs();
      }
    }

    if ('filteringDefinition' in changes && this.initialized) {
      this.filteringDefinition = changes['filteringDefinition'].currentValue || [];
      this.fillMappingsInDefs();
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `core.dataFilter.${relativeKey}`;
  }

  toggleOptions(options: { fieldId: string; value: any; optionId?: string }[], emitEvent?: boolean): void {
    if (!this.formGroup) {
      this.initialize();
    }

    if (this.formGroup && this.builtFilteringDefinition && options.length) {
      const objectPreventingEvent = { emitEvent: false };

      groupBy(options, (x) => x.fieldId).forEach((group) => {
        const innerFormGroup = this.formGroup.controls[group.key] as FormGroup;

        if (innerFormGroup) {
          const currentFilterDefinition = this.definitionDictionary[group.key];
          const optionsValues = currentFilterDefinition.singleSelection ? [group.values[0]] : group.values;

          optionsValues.forEach((option) => {
            const control = innerFormGroup.controls[
              option.optionId || this.generateOptionId(option.value)
            ] as FormControl;

            if (control) {
              if (currentFilterDefinition.singleSelection) {
                innerFormGroup.reset({}, objectPreventingEvent);
              }

              control.setValue(!control.value, objectPreventingEvent);
            }
          });
        }
      });

      this.formGroup.updateValueAndValidity({ emitEvent: emitEvent === undefined || emitEvent });

      this.cd.detectChanges();
    } else {
      this.predefinedCheckedOptions = options;
    }
  }

  calculateCount(fieldDefinition: FilterDefinition<any>, option: FilterOption<any>): number {
    let counterSelector: ((t: any) => any) | NestedCounterPropertySelector[];
    if (option.counterPropertySelector) {
      counterSelector = option.counterPropertySelector;
    } else if (fieldDefinition.multiSelector) {
      counterSelector = option.customPropertySelector;
    } else {
      counterSelector = fieldDefinition.propertySelector;
    }

    let dataToCount = this.filteredForCounting;

    if (fieldDefinition.ignoreForCounting) {
      dataToCount = this.filteredDataExceptIgnored;
    } else if (fieldDefinition.shouldAffectCounting) {
      dataToCount = this.data;
    }

    if (Array.isArray(counterSelector)) {
      let dataFromToCount = dataToCount || this.data;
      counterSelector.forEach((selectorItem) => {
        dataFromToCount = dataFromToCount?.filter((elem) => selectorItem.filterCurrentEntityBy(elem));
        if (dataFromToCount?.length && selectorItem.nextEntities) {
          dataFromToCount = selectorItem.nextEntities(dataFromToCount);
        }
      });

      return dataFromToCount ? dataFromToCount.length : 0;
    } else {
      return (dataToCount || this.data).filter((t) => {
        const resolvedCounterSelector = counterSelector as (x) => any;
        const propValue = resolvedCounterSelector(t);
        const filterable = Array.isArray(propValue) ? propValue : [propValue];
        return filterable.some((v) => v === option.value);
      }).length;
    }
  }

  reset(): void {
    // This if statement handle the error when the formGroup was not defined.
    if (this.formGroup) {
      const formValue = {};

      this.builtFilteringDefinition.forEach((def) => {
        if (def.ignoreForReset) {
          formValue[def.fieldId] = this.formGroup.controls[def.fieldId].value;
          return;
        }

        formValue[def.fieldId] = {};

        def.options.forEach((opt) => {
          formValue[def.fieldId][opt.optionId] = opt.checkedByDefault ? true : false;
        });
      });

      this.formGroup.setValue(formValue);

      this.cd.detectChanges();
    }
  }

  resetField(fieldId: string): void {
    if (this.formGroup) {
      const innerFormgroup = this.formGroup.get(fieldId);

      if (innerFormgroup) {
        const innerFormGroupValue = {};
        this.definitionDictionary[fieldId].options.forEach(
          (opt) => (innerFormGroupValue[opt.optionId] = opt.checkedByDefault ? true : false)
        );
        innerFormgroup.setValue(innerFormGroupValue);
        this.cd.detectChanges();
      }
    }
  }

  refreshFilter(): void {
    this.formGroup?.updateValueAndValidity({ onlySelf: false, emitEvent: true });
  }

  // It allows us to initiate DOM of the component and build filter definitions on demand.
  // It means, that DOM and other staff will be built when the user first expands the filter.
  // Not immediately when the component appears in a parent.
  initialize(): void {
    if (!this.initialized) {
      this.builtFilteringDefinition = [...(this.filteringDefinition || [])];

      this.fillMappingsInDefs();

      this.initialized = true;
    }
  }

  private filterDataWithNestedProperties(
    input: any[],
    filterDefinition: FilterDefinition<any>,
    options: FilterOption<any>[]
  ): any[] {
    let filtered = this.filterFn(input, filterDefinition, options);
    if (filterDefinition.nestedFiltering) {
      filtered = filtered
        .map((item) => this.filterNested(item, filterDefinition.nestedOptions, options))
        .filter((item) => item[filterDefinition.nestedOptions.propertyName].length);
    }

    return filtered;
  }

  private filterNested(input: any, nestedOptions: NestedOptions, options: FilterOption<any>[]): any {
    const inputFiltered = { ...input };
    const propertyFiltered = inputFiltered[nestedOptions.propertyName].filter((data) =>
      options.some((option) => {
        const value = option.exactValue || option.value ;
        if (nestedOptions.propertySelector) {
          return nestedOptions.propertySelector(data) === value;
        } else if (nestedOptions.filterCriteria) {
          return nestedOptions.filterCriteria(data, value);
        }
      })
    );

    inputFiltered[nestedOptions.propertyName] = propertyFiltered;

    if (nestedOptions.nestedOptions) {
      inputFiltered[nestedOptions.propertyName] = inputFiltered[nestedOptions.propertyName].map((item) =>
        this.filterNested(item, nestedOptions.nestedOptions, options)
      );
    }

    return inputFiltered;
  }

  private filterFn(input: any[], filterDefinition: FilterDefinition<any>, options: FilterOption<any>[]): any[] {
    return input.filter((t) => {
      return options.some((option) => {
        const propValue = option.customPropertySelector
          ? option.customPropertySelector(t)
          : filterDefinition.propertySelector(t);

        return Array.isArray(propValue) ? propValue.some((g) => g === option.value) : propValue === option.value;
      });
    });
  }

  private filterDataForCounting(
    input: any[],
    filterDefinition: FilterDefinition<any>,
    options: FilterOption<any>[]
  ): any[] {
    if (options.length && filterDefinition.shouldAffectCounting) {
      return this.filterDataWithNestedProperties(input, filterDefinition, options);
    }

    return input;
  }

  private filterDataExceptIgnored(
    input: any[],
    filterDefinition: FilterDefinition<any>,
    options: FilterOption<any>[]
  ): any[] {
    if (options.length && !filterDefinition.ignoreForCounting) {
      return this.filterDataWithNestedProperties(input, filterDefinition, options);
    }

    return input;
  }

  private filterData(input: any[], filterDefinition: FilterDefinition<any>, options: FilterOption<any>[]): any[] {
    if (options.length) {
      return this.filterDataWithNestedProperties(input, filterDefinition, options);
    }

    return input;
  }

  private fillMappingsInDefs(): void {
    if (this.data && this.data.length) {
       this.builtFilteringDefinition = this.filteringDefinition.map(item => ({ ...item })).map((item) => {
          if(item.options) {
            return item;
          }

          const mapped = this.data
            .map((t) => item.propertySelector(t))
            .map(t => t === undefined || t === null ? [] : t) // It's intentional, because false value is allowed.
            .map((t) => (Array.isArray(t) ? [...t] : [t]));

          let fixedOptions = [];
          if (item.fixedOptions) {
            fixedOptions = item.fixedOptions.map(option => option.value);
          }

          const distinctValues = distinct(mapped.reduce((a, b) => a.concat(b), fixedOptions));
          const sortedValues = item.useSort ? distinctValues.sort(item.customSortCallback) : distinctValues;

          item.options = sortedValues.map((v) => {
            let option: FilterOption<any> = { value: v };
            if (item.fixedOptions) {
              option = item.fixedOptions.find(option => option.value === v) || option;
            }
            if (item.optionsCounterPropertySelector) {
              option.counterPropertySelector = item.optionsCounterPropertySelector(v);
            }

            return option;
          });

          return item;
        });

      this.setDefaultValuesForDisplayedOption();
      this.assignOptionIds();
      this.buildDictionaries();

      this.buildFormGroup();

      this.formGroup.valueChanges
        .pipe(this.detacher.takeUntilDetach())
        .subscribe(this.handleFormValueChange.bind(this));

      if (this.predefinedCheckedOptions) {
        this.toggleOptions(this.predefinedCheckedOptions);
        delete this.predefinedCheckedOptions;
      }
    }
  }

  private setDefaultValuesForDisplayedOption(): void {
    this.builtFilteringDefinition.forEach((fd) => (fd.displayed = fd.displayed === undefined ? true : fd.displayed));
  }

  private buildDictionaries(): void {
    this.optionsDictionary = {};
    this.definitionDictionary = {};

    this.builtFilteringDefinition.forEach((fd) => {
      const options = {};

      if (fd.options) {
        fd.options.forEach((opt) => (options[opt.optionId] = opt));
      }

      this.optionsDictionary[fd.fieldId] = options;
      this.definitionDictionary[fd.fieldId] = fd;
    });
  }

  private assignOptionIds(): void {
    this.builtFilteringDefinition.forEach((def) => {
      def.options.forEach((opt) => {
        if (!opt.optionId) {
          opt.optionId = this.generateOptionId(opt.value);
        }
      });
    });
  }

  private buildFormGroup(): void {
    const formGroupConfig = {};

    this.builtFilteringDefinition.forEach((def) => {
      const innerFormGroupConfig = {};

      def.options.forEach((opt) => {
        let initialValue = false;

        if(this.formGroup) {
          const formGroupForDefinition = this.formGroup.controls[def.fieldId] as FormGroup;
          const formControlForOption = formGroupForDefinition.controls[opt.optionId] as FormControl;

          if(formControlForOption) {
            initialValue = formControlForOption.value;
          }
        }

        innerFormGroupConfig[opt.optionId] = new FormControl(initialValue);
      });

      formGroupConfig[def.fieldId] = new FormGroup(innerFormGroupConfig);
    });

    this.formGroup = new FormGroup(formGroupConfig);

    this.setSingleSelectionHandling();
    this.setSwitchers();
  }

  private setSwitchers(): void {
    const switchersSubscriptions = [];

    this.builtFilteringDefinition
      .filter((x) => x.isSwitcher)
      .map((x) => ({ def: x, innerFormGroup: this.formGroup.get(x.fieldId) }))
      .forEach((x) => {
        x.def.options.forEach((opt) => {
          const control = x.innerFormGroup.get(opt.optionId) as FormControl;

          if (opt.checkedByDefault) {
            control.setValue(true, { emitEvent: false });
          }

          switchersSubscriptions.push(
            control.valueChanges.pipe(this.detacher.takeUntilDetach()).subscribe((v) => {
              x.def.options
                .map((o) => x.innerFormGroup.get(o.optionId) as FormControl)
                .filter((c) => c !== control)
                .forEach((c) => c.setValue(!v, { emitEvent: false }));
              x.innerFormGroup.updateValueAndValidity();
            })
          );
        });
      });

    if (switchersSubscriptions.length) {
      this.handleFormValueChange(this.formGroup.value);
    }
  }

  private setSingleSelectionHandling(): void {
    toKeyValueArray(this.formGroup.controls)
      .filter((x) => this.definitionDictionary[x.key].singleSelection)
      .map((x) => x.value)
      .map((x: FormGroup) => {
        const controlsInInnerFormGroup = toKeyValueArray(x.controls);

        return controlsInInnerFormGroup.map((y) => {
          return (y.value as FormControl).valueChanges.pipe(this.detacher.takeUntilDetach()).subscribe((v) => {
            if (v) {
              controlsInInnerFormGroup
                .filter((g) => g.key !== y.key)
                .forEach((g) => (g.value as FormControl).setValue(false, { emitEvent: false }));
            }

            x.updateValueAndValidity();
          });
        });
      });
  }

  private handleFormValueChange(formValue: { [key: string]: { [key: string]: boolean } }): void {
    let filteredData = this.data;
    let filteredDataExceptIgnored = this.data;
    let filteredForCounting = this.data;
    let isOnFiltering = false;

    Object.keys(formValue).forEach((definitionId) => {
      const optionsIds = Object.keys(formValue[definitionId]);

      const options = optionsIds
        .filter((optionId) => formValue[definitionId][optionId])
        .map((optionId) => this.optionsDictionary[definitionId][optionId]);

      // Define 'on filtering' state by the 'checked' value === true
      if (optionsIds.some((optionId) => formValue[definitionId][optionId] === true)) {
        isOnFiltering = true;
      }

      if (filteredData.length) {
        // If filter returns no results, there is no reason to filter empty array
        filteredData = this.filterData(filteredData, this.definitionDictionary[definitionId], options);
      }

      if (filteredForCounting.length) {
        // If filter returns no results, there is no reason to filter empty array
        filteredForCounting = this.filterDataForCounting(
          filteredForCounting,
          this.definitionDictionary[definitionId],
          options
        );
      }

      if (filteredDataExceptIgnored.length) {
        // If filter returns no results, there is no reason to filter empty array
        filteredDataExceptIgnored = this.filterDataExceptIgnored(
          filteredDataExceptIgnored,
          this.definitionDictionary[definitionId],
          options
        );
      }
    });

    // should always be before getFilteringOptions as getFilteringOptions uses these values for counting
    this.filteredDataExceptIgnored = filteredDataExceptIgnored;
    this.filteredForCounting = filteredForCounting;

    const filteringOptions = this.getFilteringOptions(formValue);
    this.appliedFiltersCount = this.countAppliedFilters(filteringOptions);

    this.filtering.emit(isOnFiltering);
    this.filter.emit(filteredData);
    this.filteringOptions.emit(filteringOptions);
  }

  private getFilteringOptions(formValue: { [key: string]: { [key: string]: boolean } }): any {
    const allFilteredOptions = {};
    Object.keys(formValue).forEach((definitionId) => {
      const filteringOptions: { [key: string]: FilterOptionState<any> } = {};

      Object.keys(formValue[definitionId]).forEach((optionId) => {
        const optionDisplayed =
          'displayed' in this.optionsDictionary[definitionId][optionId]
            ? this.optionsDictionary[definitionId][optionId].displayed
            : true;

        filteringOptions[optionId] = {
          ...this.optionsDictionary[definitionId][optionId],
          checked: formValue[definitionId][optionId],
          displayed: optionDisplayed,
          exactValue: this.optionsDictionary[definitionId][optionId].value,
          calculatedCount: this.calculateCount(
            this.definitionDictionary[definitionId],
            this.optionsDictionary[definitionId][optionId]
          ),
        };
      });

      allFilteredOptions[definitionId] = filteringOptions;
    });

    return allFilteredOptions;
  }

  private generateOptionId(value: any): string {
    // Generates form control name based on control value
    return value?.toString().replace(replaceCharactersRegExp, '_');
  }

  private countAppliedFilters(filters: {
    [key: string]: {
      [key: string]: FilterOptionState<any>;
    };
  }): number {
    const displayedFilters = Object.entries(filters).filter(([filterId]) =>
      this.builtFilteringDefinition.some((def) => def.fieldId === filterId && !!def.displayed)
    );

    const filtersCount = displayedFilters
      .map(([_, options]) => Object.values(options))
      .reduce((a, b) => a.concat(b), [])
      .filter((option) => !!option.checked && !!option.displayed).length;

    return filtersCount;
  }
}
