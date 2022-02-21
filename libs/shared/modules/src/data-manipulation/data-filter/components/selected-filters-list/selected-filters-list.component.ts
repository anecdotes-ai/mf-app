import { Component, OnInit } from '@angular/core';
import { DataFilterManagerService } from 'core/modules/data-manipulation/data-filter/services';
import { FilterOptionState } from 'core/modules/data-manipulation/data-filter/models';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

export interface FilterOptionStateWithFieldId<T> extends FilterOptionState<T> {
  fieldId: string;
}

@Component({
  selector: 'app-selected-filters-list',
  templateUrl: './selected-filters-list.component.html',
  styleUrls: ['./selected-filters-list.component.scss'],
})
export class SelectedFiltersListComponent implements OnInit {
  filters$: Observable<FilterOptionStateWithFieldId<any>[]>;

  constructor(private filterManager: DataFilterManagerService) {}

  ngOnInit(): void {
    this.filters$ = combineLatest([
      this.filterManager.getFilterDefinition(),
      this.filterManager.getFilteringOptions(),
    ]).pipe(
      map(([definition, filters]) => {
        const displayedFilters = Object.entries(filters).filter(([filterId]) =>
          definition.some((def) => def.fieldId === filterId && this.handleDisplayedProp(def.displayed))
        );

        const appliedFiltersOptions = this.getAppliedFiltersOptions(displayedFilters);
        return appliedFiltersOptions;
      })
    );
  }

  resetFilterOption({ fieldId, value, optionId }: FilterOptionStateWithFieldId<any>): void {
    this.filterManager.toggleOptions({ fieldId, value, optionId });
  }

  resetAllFilters(): void {
    this.filterManager.reset();
  }

  buildTranslationKey(relativeKey: string): string {
    return `core.dataFilter.${relativeKey}`;
  }

  private getAppliedFiltersOptions(
    filters: [
      string,
      {
        [key: string]: FilterOptionState<any>;
      }
    ][]
  ): FilterOptionStateWithFieldId<any>[] {
    const optionsWithFieldId = filters.map(([fieldId, options]) =>
      Object.values(options).map((option) => ({
        ...option,
        fieldId,
      }))
    );

    return optionsWithFieldId
      .reduce((a, b) => a.concat(b), [])
      .filter((option) => !!option.checked && this.handleDisplayedProp(option.displayed));
  }

  private handleDisplayedProp(isDisplayed: boolean | undefined): boolean {
    return isDisplayed || isDisplayed === undefined;
  }
}
