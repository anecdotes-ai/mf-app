import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Risk } from 'core/modules/risk/models';
import { RiskFacadeService } from 'core/modules/risk/services';
import { SubscriptionDetacher } from 'core/utils';
import { RiskLevelBGClasses, NOT_SET, notSetDefaultClass } from '../../constants';

type RiskKeys<Risk> = {
  [K in keyof Risk]: string;
};

interface RiskAnalysisFields {
  impact?: string;
  liklihood?: string;
  riskLevel?: string;
  financialImpact?: string;
  riskLevelTarget?: string;
}

@Component({
  selector: 'app-risk-analysis-item',
  templateUrl: './risk-analysis-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskAanlysisItemComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @Input()
  riskId: string;

  @Input()
  title: string;

  @Input()
  analysisType: 'Inherent' | 'Residual' | 'RiskLevelTarget';

  risk: Risk;
  isLoading = false;

  riskAnalysisKeys: RiskKeys<Risk> = {
    inherent_risk_level_impact: 'inherent_risk_level_impact',
    inherent_risk_level_like_hood: 'inherent_risk_level_like_hood',
    inherent_risk_level: 'inherent_risk_level',
    inherent_risk_level_financial_impact: 'inherent_risk_level_financial_impact',
    residual_risk_level_impact: 'residual_risk_level_impact',
    residual_risk_level_like_hood: 'residual_risk_level_like_hood',
    residual_risk_level: 'residual_risk_level',
    residual_risk_level_financial_impact: 'residual_risk_level_financial_impact',
    level_target: 'level_target',
  };
  analysisFields: RiskAnalysisFields;
  analysisTypeToPropsMapper = this.initializeAnalysisProps();
  
  get riskLevelBackgroundClass(): string {
    return RiskLevelBGClasses[this.risk[this.analysisFields?.riskLevel]] || notSetDefaultClass;
  }

  get riskLevelTitle(): string {
    return this.risk[this.analysisFields?.riskLevel] || this.translateService.instant(`riskManagement.${NOT_SET}`);
  }

  constructor(
    private cd: ChangeDetectorRef,
    private riskFacade: RiskFacadeService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.analysisFields = this.analysisTypeToPropsMapper[this.analysisType];

    this.riskFacade
      .getRiskById(this.riskId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((risk) => {
        this.risk = risk;

        this.cd.detectChanges();
      });
  }

  buildTranslationKey(relativeKey: string): string {
    return `riskManagement.riskAanlysis.${relativeKey}`;
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  editFinancialImpact(newValue: string): void {
    this.riskFacade.editFinancialImpactAsync(this.risk.id, { [this.analysisFields.financialImpact]: newValue });
  }

  onEditing(riskField: string): void {
    // We want to show the risk level loader only when both impact and liklihood have values
    if ((riskField === this.analysisFields.liklihood && this.risk[this.analysisFields.impact]) ||
      (riskField === this.analysisFields.impact && this.risk[this.analysisFields.liklihood])
    ) {
      this.isLoading = true;
      this.cd.detectChanges();
    }
  }

  onEditingDone(): void {
    this.isLoading = false;
    this.cd.detectChanges();
  }

  private initializeAnalysisProps(): object {
    return {
      Inherent: {
        impact: this.riskAnalysisKeys.inherent_risk_level_impact,
        liklihood: this.riskAnalysisKeys.inherent_risk_level_like_hood,
        riskLevel: this.riskAnalysisKeys.inherent_risk_level,
        financialImpact: this.riskAnalysisKeys.inherent_risk_level_financial_impact,
      } as RiskAnalysisFields,
      Residual: {
        impact: this.riskAnalysisKeys.residual_risk_level_impact,
        liklihood: this.riskAnalysisKeys.residual_risk_level_like_hood,
        riskLevel: this.riskAnalysisKeys.residual_risk_level,
        financialImpact: this.riskAnalysisKeys.residual_risk_level_financial_impact,
      } as RiskAnalysisFields,
      RiskLevelTarget: {
        riskLevelTarget: this.riskAnalysisKeys.level_target,
      } as RiskAnalysisFields,
    };
  }
}
