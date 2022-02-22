import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlsProgressBarDefinition } from 'core/components';
import { MenuAction } from 'core/modules/dropdown-menu';
import {
  DataFilterManagerService,
  FilterOptionState,
  FilterTabModel,
} from 'core/modules/data-manipulation/data-filter';
import { CalculatedControl } from 'core/modules/data/models';
import { ControlStatusEnum, Framework } from 'core/modules/data/models/domain';
import { SubscriptionDetacher } from 'core/utils';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

interface ControlsCountObject {
  pbDefinition: ControlsProgressBarDefinition;
  overallCount: number;
}

export enum ActionsIds {
  ExportFilteredControls = 'filteredControls',
  ExportAllControls = 'allControls',
  ExportAllEvidence = 'allEvidence',
  ExportAllLogs = 'allLogs',
}

export const TabIds = {
  all: 'ALL',
  notStarted: ControlStatusEnum.NOTSTARTED,
  inProgress: ControlStatusEnum.INPROGRESS,
  compliant: ControlStatusEnum.COMPLIANT,
};

export const ALL_CATEGORIES = 'All Categories';

@Component({
  selector: 'app-controls-secondary-header',
  templateUrl: './controls-secondary-header.component.html',
  styleUrls: ['./controls-secondary-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsSecondaryHeaderComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private applicableControls: CalculatedControl[];

  @Input()
  framework: Framework;

  @Input()
  filteredData: CalculatedControl[];

  selectedStatus$: Observable<string>;
  controlsCountByStatuses$: Observable<ControlsCountObject>;
  filteredControls$: Observable<CalculatedControl[]>;

  controlTabs$: Observable<FilterTabModel[]>;

  controlsCategories$: Observable<string[]>;
  categoriesControl = new FormControl();
  exportMenuActions: MenuAction[];
  controlsCount$: Observable<number>;

  appliedFiltersNames: string[];

  constructor(private filterManager: DataFilterManagerService, private tralateService: TranslateService) {}

  ngOnInit(): void {
    const filteringOptions$ = this.filterManager.getFilteringOptions().pipe(shareReplay());
    filteringOptions$
      .pipe(
        tap((options) => {
          this.recalculateAppliedFilterNames(options);
        }),
        map((options) => options['categories']),
        filter((options) => !!options),
        map((categoryOptions) => Object.values(categoryOptions).find((opt) => opt.checked)),
        this.detacher.takeUntilDetach()
      )
      .subscribe((opt) => {
        const optValue = opt?.value || ALL_CATEGORIES;
        if (this.categoriesControl.value !== optValue) {
          this.categoriesControl.setValue(optValue);
        }
      });

    this.filteredControls$ = this.filterManager.getDataFilterEvent();
    this.controlsCategories$ = filteringOptions$.pipe(
      map((options) => [
        ALL_CATEGORIES,
        ...Object.values(options['categories'] || {}).map((category) => category.value),
      ])
    );

    this.filterManager
      .getDataFilterEvent<CalculatedControl>()
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((controls) => {
        this.applicableControls = controls.filter((control) => control.control_is_applicable);
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  selectCategory(category: string): void {
    if (category === ALL_CATEGORIES) {
      this.filterManager.resetField('categories');
    } else {
      this.filterManager.toggleOptions({ fieldId: 'categories', value: category });
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `controls.secondaryHeader.${relativeKey}`;
  }

  private recalculateAppliedFilterNames(options: { [key: string]: { [key: string]: FilterOptionState<any> } }): void {
    this.appliedFiltersNames = [];
    const optionGroups = Object.keys(options);
    optionGroups.forEach((groupName) => {
      const applayedFilterFields = Object.values(options[groupName])
        .filter((field) => field.checked && field.displayed)
        .map((value) => (value.translationKey ? this.tralateService.instant(value.translationKey) : value.exactValue));
      if (applayedFilterFields.length) {
        this.appliedFiltersNames.push(...applayedFilterFields);
      }
    });
  }
}
