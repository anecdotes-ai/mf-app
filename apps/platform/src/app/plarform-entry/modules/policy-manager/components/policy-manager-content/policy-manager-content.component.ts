import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MessageBusService } from 'core';
import { CalculatedPolicy, ResourceStatusEnum } from 'core/modules/data/models';
import { Framework, Policy } from 'core/modules/data/models/domain';
import { PoliciesFacadeService } from 'core/modules/data/services/facades/policies-facade/policies-facade.service';
import { TrackOperations } from 'core/modules/data/services/operations-tracker/constants/track.operations.list.constant';
import { DataSearchComponent, SearchInstancesManagerService } from 'core/modules/data-manipulation/search';
import { SubscriptionDetacher } from 'core/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, filter, map, take } from 'rxjs/operators';
import { VScrollListEntity } from '../../models';
import { PoliciesRendererComponent } from '../policies-renderer/policies-renderer.component';
import {
  DataFilterManagerService,
  FilterDefinition,
  FilterOption,
  FilterTabModel,
} from 'core/modules/data-manipulation/data-filter';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { PolicyTypeQueryParam } from '../../models/policy-type-query-param';
import { PolicyTypesEnum } from 'core/modules/data/models';

const ELEMENTS_REFRESH_TIME = 500;
const allPoliciesTabId = 'All';

export interface PolicyType {
  type: string;
  policies: CalculatedPolicy[];
}

@Component({
  selector: 'app-policy-manager-content',
  templateUrl: './policy-manager-content.component.html',
  styleUrls: ['./policy-manager-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolicyManagerContentComponent implements OnInit, AfterViewInit, OnDestroy {
  // ** PRIVATES **
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private currentSearchScopeKey: string;
  private dataSearch: DataSearchComponent;
  private newPolicyAdded$: Observable<string>;
  private policyUpdated$: Observable<string>;
  private currentTab: FilterTabModel;
  private policies$: Observable<CalculatedPolicy[]>;
  private policiesGroupedByTypes: PolicyType[] = [];
  private allData: { [entityId: string]: VScrollListEntity<Policy> } = {};
  private allPolicies: CalculatedPolicy[];
  private applicableFrameworks: Framework[];

  // ** OUTPUTS **
  @Output() policiesLoaded = new EventEmitter<any>();

  // ** DATA **
  private _displayedData$ = new BehaviorSubject<VScrollListEntity<Policy | any>[]>([]);
  private filterStream$: Observable<CalculatedPolicy[]>;

  isNotFoundState$ = new BehaviorSubject<boolean>(undefined);
  displayedData$: Observable<VScrollListEntity<Policy>[]> = this._displayedData$.asObservable();

  policyTypeTabQueryParam = PolicyTypeQueryParam.type;
  tabs: FilterTabModel[];
  defaultTab = allPoliciesTabId;

  // ** VIEW STUFF **
  @ViewChild(PoliciesRendererComponent)
  policiesRenderer: PoliciesRendererComponent<Policy>;

  get searchInput(): string {
    return this.dataSearch.inputtedText;
  }

  // **** INIT ****
  constructor(
    private cd: ChangeDetectorRef,
    private searchInstancesManagerService: SearchInstancesManagerService,
    private elementRef: ElementRef<HTMLElement>,
    private policyFacade: PoliciesFacadeService,
    private messageBusService: MessageBusService,
    private filterManager: DataFilterManagerService,
    private frameworksFacade: FrameworksFacadeService
  ) {}

  async ngOnInit(): Promise<void> {
    this.policies$ = this.policyFacade.getAllApplicableWithCategoriesOrderAndSort();
    this.filterStream$ = this.filterManager.getDataFilterEvent<CalculatedPolicy>();
    this.currentSearchScopeKey = this.searchInstancesManagerService.getSearchScopeKey(this.elementRef.nativeElement);
    this.applicableFrameworks = await this.frameworksFacade.getApplicableFrameworks().pipe(take(1)).toPromise();

    await this.initSearchAsync();
    this.handleFiltering();
    this.handleSearchPaginator();

    this.policies$.pipe(this.detacher.takeUntilDetach()).subscribe((policies) => {
      this.allPolicies = policies;
      this.setAllData(policies);
      this.dataSearch.data = policies;
      this.policiesGroupedByTypes = this.groupPoliciesByType(policies);
      this.tabs = this.buildTabs(this.policiesGroupedByTypes, policies);
      this.cd.detectChanges();
    });
  }

  ngAfterViewInit(): any {
    this.newPolicyAdded$ = this.messageBusService.getObservable(TrackOperations.ADD_CUSTOM_POLICY);
    this.policyUpdated$ = this.messageBusService
      .getFeedByKeyPrefix(TrackOperations.UPDATE_CUSTOM_POLICY)
      .pipe(map((value) => value.payload as string));
    this.handlePolicyAdded();
    this.handlePoliciesUpdated();

    this.isNotFoundState$
      .pipe(
        filter((isNotFound) => isNotFound),
        take(1),
        this.detacher.takeUntilDetach()
      )
      .subscribe(() => {
        this.policiesLoaded.emit();
      });
  }

  toggleTab(chosenTab: FilterTabModel): void {
    this.currentTab = chosenTab;
    if (chosenTab.tabId === allPoliciesTabId) {
      this.setInitialData(this.allPolicies);
    } else {
      const categoryData = this.policiesGroupedByTypes.find((category) => category.type === chosenTab.tabId).policies;
      this.setInitialData(categoryData);
    }
  }

  clearSearch(): void {
    this.dataSearch.reset();
  }

  private setInitialData(policies: CalculatedPolicy[]): void {
    this.dataSearch.data = policies;
    this.filterManager.setData(policies);
    this.filterManager.refreshFilter();
    this.loadFilteringDefinition();
  }

  private async initSearchAsync(): Promise<void> {
    this.dataSearch = await this.searchInstancesManagerService
      .getDataSearch(this.currentSearchScopeKey)
      .pipe(
        filter((x) => !!x),
        take(1)
      )
      .toPromise();
    this.cd.detectChanges();

    this.dataSearch.search.pipe(this.detacher.takeUntilDetach()).subscribe(this.setDataToDisplay.bind(this));
  }

  private handleFiltering(): void {
    this.filterStream$.pipe(this.detacher.takeUntilDetach()).subscribe((filteredData) => {
      this.dataSearch.data = filteredData;
      this.cd.detectChanges();
    });

    this.filterManager
      .getDataFilterEvent()
      .pipe(take(1), this.detacher.takeUntilDetach())
      .subscribe(() => this.filterManager.open());
  }

  private groupPoliciesByType(policies: CalculatedPolicy[]): PolicyType[] {
    const policyTypes = [...new Set(policies
      .map((policy) => policy.policy_type)
      .filter((policy_type) => (policy_type)))];
    const arrayOfPolicyTypes: PolicyType[] = [];
    policyTypes.forEach((type) => {
      arrayOfPolicyTypes.push({
        type: type,
        policies: policies.filter((policy) => policy?.policy_type === type),
      });
    });
    return arrayOfPolicyTypes;
  }

  private buildTabs(policiesGroupedByTypes: PolicyType[], policies: CalculatedPolicy[]): FilterTabModel[] {
    const otherPoliciesAmount = policies.filter((policy) => policy?.policy_type === PolicyTypesEnum.Other).length;
    const allPoliciesAmount = policies.length;
    const tabsByCategories: FilterTabModel[] = policiesGroupedByTypes.map((policyType) => ({
      translationKey: policyType.type,
      tabId: policyType.type,
      count: policyType.policies.length,
      filterDefinitionValue: policyType.type,
    }))
    .filter((tabCategory) => tabCategory.tabId !==  PolicyTypesEnum.Other || tabCategory.count <= 0)
    .sort((a, b) => b.count - a.count);

    return [
      {
        translationKey: 'All',
        tabId: allPoliciesTabId,
        count: allPoliciesAmount,
        filterDefinitionValue: undefined,
      },
      ...tabsByCategories,
      {
        translationKey: PolicyTypesEnum.Other,
        tabId: PolicyTypesEnum.Other,
        count: otherPoliciesAmount,
        filterDefinitionValue: undefined,
      },
    ];
  }

  private setDataToDisplay(policies: Policy[]): void {
    const displayedData = [];

    if (policies.length) {
      policies.forEach((policy) => {
        displayedData.push(this.allData[policy.policy_id]);
      });
    }

    this._displayedData$.next(displayedData);
    this.isNotFoundState$.next(!displayedData.length);
  }

  private setAllData(allPolicies: Policy[]): void {
    this.allData = {};
    allPolicies.forEach((policy) => (this.allData[policy.policy_id] = { entityOrHeader: policy, isEntity: true }));
  }

  private handleSearchPaginator(): void {
    this.searchInstancesManagerService
      .getSearchResultsPaginator(this.currentSearchScopeKey)
      .pipe(
        filter((searchPaginator) => !!searchPaginator),
        this.detacher.takeUntilDetach()
      )
      .subscribe((searchPaginator) => {
        if (searchPaginator) {
          searchPaginator.dataFocusChange.pipe(this.detacher.takeUntilDetach()).subscribe(() => {
            this.policiesRenderer.scrollToItem(searchPaginator.currentRow);
          });
        }
      });
  }

  private handlePolicyAdded(): void {
    this.newPolicyAdded$
      .pipe(
        debounceTime(ELEMENTS_REFRESH_TIME),
        filter((policyId) => !!policyId),
        this.detacher.takeUntilDetach()
      )
      .subscribe((policyId) => this.policiesRenderer.scrollToItem(this.allData[policyId]));
  }

  private handlePoliciesUpdated(): void {
    this.policyUpdated$
      .pipe(
        debounceTime(ELEMENTS_REFRESH_TIME),
        filter((policyId) => !!policyId),
        this.detacher.takeUntilDetach()
      )
      .subscribe((policyId) => this.policiesRenderer.scrollToItem(this.allData[policyId]));
  }

  private prepareFrameworksOptions(): FilterOption<CalculatedPolicy>[] {
    const result: FilterOption<CalculatedPolicy>[] = [];
    this.applicableFrameworks.map((value) => {
      result.push({ translationKey: value.framework_name, value: value.framework_name });
    });
    return result;
  }

  private loadFilteringDefinition(): void {
    const filterDefinition: FilterDefinition<CalculatedPolicy>[] = [
      {
        translationKey: `policy.frameworks.tab`,
        propertySelector: (e) => {
          if (e?.policy_related_frameworks_names) {
            return Object.keys(e?.policy_related_frameworks_names).filter((frameworkName) =>
              this.applicableFrameworks.some((framework) => framework.framework_name === frameworkName)
            );
          }
        },
        fieldId: 'frameworks',
        useSort: true,
        expanded: true,
        options: this.prepareFrameworksOptions(),
      },
      {
        translationKey: 'policy.status.tab',
        fieldId: 'status',
        propertySelector: (c) => c.status,
        ignoreForCounting: true,
        displayed: true,
        expanded: true,
        options: [
          {
            value: ResourceStatusEnum.UNDEFINED,
            icon: 'controls-filter/status/not_started',
            translationKey: 'policy.status.empty',
          },
          {
            value: ResourceStatusEnum.NOTSTARTED,
            icon: 'controls-filter/status/gap',
            translationKey: 'policy.status.notSet',
          },
          {
            value: ResourceStatusEnum.PENDING,
            icon: 'controls-filter/status/in_progress',
            translationKey: 'policy.status.pending',
          },
          {
            value: ResourceStatusEnum.ON_HOLD,
            icon: 'controls-filter/status/monitoring',
            translationKey: 'policy.status.onHold',
          },
          {
            value: ResourceStatusEnum.APPROVED,
            icon: 'controls-filter/status/ready_for_audit',
            translationKey: 'policy.status.approved',
          },
        ],
      },
    ];
    this.filterManager.setFilterDefinition(filterDefinition);
  }

  ngOnDestroy(): void {
    this.detacher.detach();
    this.filterManager.close(true);
  }
}
