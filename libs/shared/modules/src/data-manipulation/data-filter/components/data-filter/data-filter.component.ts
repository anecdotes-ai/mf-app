import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FilterDefinition, FilterOption, FilterOptionState } from 'core/modules/data-manipulation/data-filter';
import { BaseDataFilterComponent } from '../base-data-filter/base-data-filter.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

// To replace white spaces and dots for form controls being bind to checkboxes
const constantlyDisplayedOptionsCount = 3;

@Component({
  selector: 'app-data-filter',
  templateUrl: './data-filter.component.html',
  styleUrls: ['./data-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('parent', [transition(':enter', [])]),
    // To prevent initial animation
    // https://stackoverflow.com/questions/44111239/angular-is-there-a-way-to-skip-enter-animation-oninitial-render
    trigger('expandField', [
      transition(':enter', [
        style({ height: '0' }), // initial
        animate('0.2s', style({ height: '*' })), // final
      ]),
      transition(':leave', [
        style({ height: '*' }), // initial
        animate('0.2s', style({ height: '0' })), // final
      ]),
    ]),
  ],
})
export class DataFilterComponent extends BaseDataFilterComponent implements OnInit, OnDestroy {
  readonly showMoreClassName = 'show-more';
  readonly showLessClassName = 'show-less';

  private ownSubscriptions: Subscription[] = [];
  private isExpanded: boolean;

  fieldCollapsingObject: { [key: string]: boolean };

  // @HostBinding('class.expanded')
  // get expanded(): boolean {
  //   return this.isExpanded;
  // }

  // @HostBinding('class.collapsed')
  // get collapsed(): boolean {
  //   return !this.isExpanded;
  // }

  @Output()
  collapse = new EventEmitter();

  @Output()
  expand = new EventEmitter();

  constructor(cd: ChangeDetectorRef, private router: Router) {
    super(cd);
  }

  ngOnInit(): void {
    this.ownSubscriptions.push(this.filteringOptions.subscribe(this.filteringOptionsHandler.bind(this)));
  }

  ngOnDestroy(): void {
    this.ownSubscriptions.forEach((x) => x.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);

    if ('filteringDefinition' in changes) {
      this.fieldCollapsingObject = {};
      // We need initialPredefinedOptions variable as then as this.initialize() performed, the this.predefinedCheckedOptions are changed inside base component, so
      // ... it is used to keep validity.
      const initialPredefinedOptions = (this.predefinedCheckedOptions = this.getPredefinedOptions());
      const shouldBeExpanded = !!this.predefinedCheckedOptions.length;
      this.initialize();
      if (shouldBeExpanded) {
        this.expandComponent();
        this.resolvePredefinedShowMoreOptions(initialPredefinedOptions);
      }
    }
  }

  get filtersAmountInBrackets(): string {
    return this.appliedFiltersCount > 0 ? `(${this.appliedFiltersCount})` : '';
  }

  isOptionDisplayed(opt: FilterOption<any>, def: FilterDefinition<any>): boolean {
    return ((opt.displayed === undefined || opt.displayed) && !def.hideInZeroCount) ||
           (this.calculateCount(def, opt) > 0 && def.hideInZeroCount) ;
  }

  expandComponent(...options: { fieldId: string; value: any }[]): void {
    this.isExpanded = true;
    super.toggleOptions(options);
    this.expand.emit();
  }

  collapseComponent(): void {
    this.isExpanded = false;
    this.collapse.emit();
    this.cd.detectChanges();
  }

  isShowMoreOptionsToggleButtonAllowed(unorderedListRef: HTMLUListElement): boolean {
    return (
      unorderedListRef.classList.contains(this.showMoreClassName) ||
      unorderedListRef.classList.contains(this.showLessClassName)
    );
  }

  toggleShowMoreState(def: FilterDefinition<any>): void {
    this.fieldCollapsingObject[def.fieldId] = !this.fieldCollapsingObject[def.fieldId];
  }

  resolveShowMoreButtonTranslationKey(def: FilterDefinition<any>): string {
    return this.fieldCollapsingObject[def.fieldId] ? 'showLessOptionsButtonText' : 'showMoreOptionsButtonText';
  }

  getResolveOptionsVisibilityFromDef(
    filterDef: FilterDefinition<any>
  ): { constantlyVisibleDefs: FilterDefinition<any>; dynamicalyVisibleDefs?: FilterDefinition<any> } {
    if (filterDef.expanded) {
      return {
        constantlyVisibleDefs: { ...filterDef, options: filterDef.options },
      };
    }
    return {
      constantlyVisibleDefs: { ...filterDef, options: filterDef.options.slice(0, constantlyDisplayedOptionsCount) },
      dynamicalyVisibleDefs: { ...filterDef, options: filterDef.options.slice(constantlyDisplayedOptionsCount) },
    };
  }

  private resolvePredefinedShowMoreOptions(initialPredefinedOptions: any[]): void {
    initialPredefinedOptions.forEach((option) => {
      const formGroupValues = this.formGroup.controls[option.fieldId].value;
      const itemPositionInList = Object.keys(formGroupValues).indexOf(option.value) + 1;

      if (itemPositionInList > 3) {
        this.fieldCollapsingObject[option.fieldId] = true;
      }
    });
  }

  private getPredefinedOptions(): any[] {
    const queryParams = this.router.routerState.root.snapshot.queryParams;
    const options = [];

    const filterDefinitionKeys = this.filteringDefinition.filter((x) => x.fieldId in queryParams);

    filterDefinitionKeys
      .map((def) => {
        return {
          fieldId: def.fieldId,
          value: (queryParams[def.fieldId] as string).split(','),
        };
      })
      .forEach((x) => {
        x.value.forEach((y) => {
          options.push({ fieldId: x.fieldId, value: y });
        });
      });

    return options;
  }

  private filteringOptionsHandler(options: { [key: string]: { [key: string]: FilterOptionState<any> } }): void {
    const queryParams = { ...this.router.routerState.root.snapshot.queryParams };

    Object.keys(options).forEach((fieldId) => {
      const queryParam = Object.keys(options[fieldId])
        .filter((key) => options[fieldId][key].checked && !options[fieldId][key].notTrackedInQueryParams)
        .map((key) => key)
        .join(',');

      if (queryParam) {
        queryParams[fieldId] = queryParam;
      } else {
        delete queryParams[fieldId];
      }
    });

    this.router.navigate([], {
      queryParams,
    });
  }
}
