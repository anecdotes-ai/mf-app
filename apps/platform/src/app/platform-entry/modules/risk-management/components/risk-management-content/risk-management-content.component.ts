import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { DataFilterManagerService, FilterDefinition } from 'core/modules/data-manipulation/data-filter';
import { DataSearchComponent, SearchInstancesManagerService } from 'core/modules/data-manipulation/search';
import {
  Risk,
  RiskCategory,
  RiskSource,
  ResidualRiskLevelEnum,
  EffectEnum,
  StrategyEnum,
} from 'core/modules/risk/models';
import { SubscriptionDetacher } from 'core/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { User } from 'core/modules/auth-core/models/domain';
import { RiskFacadeService } from 'core/modules/risk/services';
import { OwnerFilterService } from 'core/services';
import { AuthService, UserFacadeService } from 'core/modules/auth-core/services';

@Component({
  selector: 'app-risk-management-content',
  templateUrl: './risk-management-content.component.html',
  styleUrls: ['./risk-management-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskManagementContentComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  allRisks: Risk[];
  @Input()
  sortedRisks: Risk[];
  @Input()
  riskCategories: RiskCategory[];
  @Input()
  riskSources: RiskSource[];

  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private currentSearchScopeKey: string;
  private dataSearch: DataSearchComponent;
  filterStream$: Observable<Risk[]>;

  currentUserName: string;
  users: User[] = [];
  isNotFoundState$ = new BehaviorSubject(false);
  risks$ = new BehaviorSubject<Risk[]>([]);
  isFilterPanelOpen: boolean;
  expandedRisk: string;
  
  riskIdSelector = this.idSelector.bind(this);

  constructor(
    private cd: ChangeDetectorRef,
    private searchInstancesManagerService: SearchInstancesManagerService,
    private elementRef: ElementRef<HTMLElement>,
    private filterManager: DataFilterManagerService,
    private riskFacade: RiskFacadeService,
    private authService: AuthService,
    private userFacade: UserFacadeService,
    private ownerFilterService: OwnerFilterService
  ) {}

  async ngOnInit(): Promise<void> {
    this.filterStream$ = this.filterManager.getDataFilterEvent<Risk>();
    this.currentSearchScopeKey = this.searchInstancesManagerService.getSearchScopeKey(this.elementRef.nativeElement);
    this.users = await this.userFacade.getUsers().pipe(take(1)).toPromise();
    const currentUser = await this.authService.getUserAsync();
    this.currentUserName = `${currentUser?.first_name} ${currentUser?.last_name}`;

    await this.initSearchAsync();
    this.handleFiltering();
    this.setInitialData(this.allRisks);
    this.filterManager
      .isOpen()
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((isOpen) => {
        this.isFilterPanelOpen = isOpen;
        this.cd.detectChanges();
      });

    this.cd.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('sortedRisks' in changes || 'riskCategories' in changes || 'riskSources' in changes) {
      this.setInitialData(this.sortedRisks);
    } 
  }

  clearSearch(): void {
    this.dataSearch.reset();
  }

  buildTranslationKey(relativeKey: string): string {
    return `riskManagement.${relativeKey}`;
  }

  idSelector(risk: Risk): string {
    return risk.id;
  }

  riskTrackBy(_: number, risk: Risk): string {
    return risk.id;
  }

  private setInitialData(risks: Risk[]): void {
    this.filterManager.setData(risks);
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

    this.dataSearch.data = this.allRisks;
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

  private setDataToDisplay(risks: Risk[]): void {
    this.isNotFoundState$.next(!risks.length);
    this.risks$.next(risks);
    this.cd.detectChanges();
  }

  private loadFilteringDefinition(): void {
    const filterDefinition: FilterDefinition<Risk>[] = [
      {
        translationKey: this.buildTranslationKey('filters.riskLevel.title'),
        propertySelector: (e) => e?.residual_risk_level || e?.inherent_risk_level,
        fieldId: 'riskLevel',
        hideInZeroCount: true,
        useSort: true,
        expanded: true,
        options: [
          {
            value: null,
            optionId: 'not-started',
            icon: 'controls-filter/status/not_started',
            translationKey: this.buildTranslationKey('filters.riskLevel.notSet'),
          },
          {
            value: ResidualRiskLevelEnum.Low,
            icon: 'controls-filter/status/ready_for_audit',
            translationKey: this.buildTranslationKey('filters.riskLevel.low'),
          },
          {
            value: ResidualRiskLevelEnum.Medium,
            icon: 'controls-filter/status/in_progress',
            translationKey: this.buildTranslationKey('filters.riskLevel.medium'),
          },
          {
            value: ResidualRiskLevelEnum.High,
            icon: 'controls-filter/status/gap',
            translationKey: this.buildTranslationKey('filters.riskLevel.high'),
          },
          {
            value: ResidualRiskLevelEnum.Critical,
            icon: 'critical',
            translationKey: this.buildTranslationKey('filters.riskLevel.critical'),
          },
        ],
      },
      this.ownerFilterService.getOwnerFilterDefinition(
        this.users,
        this.currentUserName,
        'owner',
        this.buildTranslationKey('filters.owner')
      ),
      {
        translationKey: this.buildTranslationKey('filters.strategy.title'),
        propertySelector: (e) => e?.strategy,
        fieldId: 'strategy',
        hideInZeroCount: true,
        useSort: true,
        expanded: true,
        options: [
          {
            value: StrategyEnum.Mitigate,
            translationKey: this.buildTranslationKey('filters.strategy.mitigate'),
          },
          {
            value: StrategyEnum.Avoid,
            translationKey: this.buildTranslationKey('filters.strategy.avoid'),
          },
          {
            value: StrategyEnum.Transfer,
            translationKey: this.buildTranslationKey('filters.strategy.transfer'),
          },
          {
            value: StrategyEnum.Accept,
            translationKey: this.buildTranslationKey('filters.strategy.accept'),
          },
        ],
      },
      {
        translationKey: this.buildTranslationKey('filters.category'),
        propertySelector: (e) => e?.category_id,
        fieldId: 'category',
        displayed: !!this.riskCategories?.length,
        useSort: true,
        expanded: false,
        options: this.riskCategories
          ?.sort((a: RiskCategory, b: RiskCategory) => a.category_name.localeCompare(b.category_name))
          .map((category) => {
            return { translationKey: category.category_name, value: category.id };
          }),
      },
      {
        translationKey: this.buildTranslationKey('filters.effect.title'),
        propertySelector: (e) => e?.effect,
        fieldId: 'effect',
        hideInZeroCount: true,
        useSort: true,
        expanded: true,
        options: [
          {
            value: EffectEnum.Confidentiality,
            translationKey: this.buildTranslationKey('filters.effect.confidentiality'),
          },
          {
            value: EffectEnum.Integrity,
            translationKey: this.buildTranslationKey('filters.effect.integrity'),
          },
          {
            value: EffectEnum.Availability,
            translationKey: this.buildTranslationKey('filters.effect.availability'),
          },
        ],
      },
      {
        translationKey: this.buildTranslationKey('filters.source'),
        propertySelector: (e) => e?.source_id,
        fieldId: 'source',
        displayed: !!this.riskSources?.length,
        useSort: true,
        expanded: false,
        options: this.riskSources
          ?.sort((a: RiskSource, b: RiskSource) => a.source_name.localeCompare(b.source_name))
          .map((source) => {
            return { translationKey: source.source_name, value: source.id };
          }),
      },
    ];
    this.filterManager.setFilterDefinition(filterDefinition);
  }

  ngOnDestroy(): void {
    this.detacher.detach();
    this.filterManager.close(true);
  }

  riskExpanded(riskId: string): void {
    this.expandedRisk = riskId;
  }
}
