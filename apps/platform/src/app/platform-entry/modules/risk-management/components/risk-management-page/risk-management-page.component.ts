import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SubscriptionDetacher } from 'core/utils';
import { Risk, RiskCategory, RiskSource, RiskFilterObject, InherentRiskLevelEnum } from 'core/modules/risk/models';
import { SearchDefinitionModel } from 'core/modules/data-manipulation/search';
import { MainHeaderInput } from 'core/modules/component-modules';
import {
  RiskFacadeService,
  AddRiskModalService,
  RiskCategoryFacadeService,
  RiskSourceFacadeService,
  RiskFilterService,
} from 'core/modules/risk/services';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

const RiskLevelValuesMapping = {
  [InherentRiskLevelEnum.Empty]: 0,
  [InherentRiskLevelEnum.Low]: 1,
  [InherentRiskLevelEnum.Medium]: 2,
  [InherentRiskLevelEnum.High]: 3,
  [InherentRiskLevelEnum.Critical]: 4,
};

@Component({
  selector: 'app-risk-management-page',
  templateUrl: './risk-management-page.component.html',
  styleUrls: ['./risk-management-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskManagementPageComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();
  private translationBase = 'riskManagement';

  risks: Risk[];
  dataToDisplay: Risk[];
  searchDefinitions: SearchDefinitionModel<RiskFilterObject>[] = [
    {
      propertySelector: (r) => r.name,
    },
    {
      propertySelector: (r) => r.category_name,
    },
  ];

  headerInput: MainHeaderInput = {
    translationRootKey: this.translationBase,
    translationHeaderCount: 0,
    searchDefinitions: this.searchDefinitions,
    btnIcon: 'Add',
    hasActionBtn: true,
    hasDataSort: true,
    liveSort: false,
    showOnlyTitle: true,
    sortHandler: this.sort.bind(this),
    sortDefinition: [
      {
        id: 'by-risk-level',
        propertySelector: (e: RiskFilterObject) =>
          e.residual_risk_level || e.inherent_risk_level || InherentRiskLevelEnum.Empty,
        translationKey: this.buildTranslationKey('sort.riskLevel'),
        sortFunc: (a: string, b: string) => RiskLevelValuesMapping[b] - RiskLevelValuesMapping[a],
      },
      {
        id: 'by-name',
        propertySelector: (e: RiskFilterObject) => e.name,
        translationKey: this.buildTranslationKey('sort.name'),
        sortFunc: (a, b) => a.toLowerCase().localeCompare(b.toLowerCase()),
      },
      {
        id: 'by-category',
        propertySelector: (e: RiskFilterObject) => e.category_name ?? '',
        translationKey: this.buildTranslationKey('sort.category'),
        sortFunc: (a, b) => a.toLowerCase().localeCompare(b.toLowerCase()),
      },
      {
        id: 'by-linked-controls',
        propertySelector: (e: RiskFilterObject) => e.mitigation_control_ids?.length,
        translationKey: this.buildTranslationKey('sort.linkedControls'),
      },
    ],
  };

  riskCategories: RiskCategory[] = [];
  riskSources: RiskSource[] = [];
  loading$ = new BehaviorSubject<boolean>(null);

  constructor(
    private riskFacade: RiskFacadeService,
    private addRiskModalService: AddRiskModalService,
    private riskCategoryFacade: RiskCategoryFacadeService,
    private riskSourceFacade: RiskSourceFacadeService,
    private cd: ChangeDetectorRef,
    private riskFilterService: RiskFilterService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading$.next(true);
    await this.riskFacade.initAsync();

    this.riskFilterService
      .getAllRiskFilterObjects()
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((risks) => {
        this.risks = risks;

        this.headerInput = Object.assign({}, this.headerInput, {
          translationHeaderCount: risks?.length,
          data: risks,
          showOnlyTitle: !risks.length,
        });

        this.loading$.next(false);

        if (this.dataToDisplay) {
          this.dataToDisplay = this.dataToDisplay.reduce((total, risk) => {
            const updatedRisk = risks.find((updatedRisk) => updatedRisk.id === risk.id);
            return updatedRisk ? [...total, updatedRisk] : total;
          }, []);
        }
      });

    this.riskCategoryFacade
      .getAllRiskCategories()
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((riskCategories) => {
        this.riskCategories = riskCategories;
        this.cd.detectChanges();
      });

    this.riskSourceFacade
      .getAllRiskSources()
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((riskSources) => {
        this.riskSources = riskSources;
        this.cd.detectChanges();
      });
  }

  sort(sortedData: Risk[]): void {
    this.dataToDisplay = sortedData;
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `${this.translationBase}.${relativeKey}`;
  }

  addRisk(): void {
    this.addRiskModalService.openAddRiskModal(this.riskCategories, this.riskSources);
  }
}
