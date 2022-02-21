import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RiskFacadeService } from 'core/modules/risk/services';
import { ResidualRiskLevelEnum, Risk } from 'core/modules/risk/models';
import { RiskLevelBGClasses, RiskLevelTargetBGClasses, notSetClass } from '../../constants';
import { FormControl } from '@angular/forms';
import { SubscriptionDetacher } from 'core/utils';

const notSet = 'Not Set';

@Component({
  selector: 'app-risk-level-indicator',
  templateUrl: './risk-level-indicator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskLevelIndicatorComponent implements OnInit, OnDestroy {
  private previousValue: string;
  private detacher = new SubscriptionDetacher();
  riskLevelBGClasses = RiskLevelBGClasses;

  @HostBinding('class')
  private classes = 'flex flex-row gap-1';

  @Input()
  riskId: string;

  @Input()
  editable = false;

  @Input()
  riskLevelField: string;

  riskLevel: string;

  control = new FormControl();

  options: ResidualRiskLevelEnum[] = [
    ResidualRiskLevelEnum.Low,
    ResidualRiskLevelEnum.Medium,
    ResidualRiskLevelEnum.High,
    ResidualRiskLevelEnum.Critical,
  ];

  displayValueSelector = this.selectDisplayValue.bind(this);

  get buttonBackgroundClass(): string {
    return RiskLevelTargetBGClasses[this.control?.value] || notSetClass;
  }

  constructor(private cd: ChangeDetectorRef, private riskFacadeService: RiskFacadeService, private translateService: TranslateService) {}

  ngOnInit(): void {
    this.riskFacadeService
      .getRiskById(this.riskId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((risk) => {
        if (this.editable && this.riskLevelField) {
          this.control.setValue(risk[this.riskLevelField], { emitEvent: false });
          this.riskLevel = risk[this.riskLevelField];
        } else {
          this.riskLevel = this.resolveLevel(risk);
        }

        this.previousValue = this.riskLevel;
        this.cd.detectChanges();
      });

    if (this.editable && this.riskLevelField) {
      this.control.valueChanges
        .pipe(this.detacher.takeUntilDetach())
        .subscribe(async (value) => this.editField(value));
    }
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  clearSelection(): void {
    this.editField(null);
  }

  buildTranslationKey(relativeKey: string): string {
    return `riskManagement.riskLevelRating.${relativeKey}`;
  }

  private selectDisplayValue(v: ResidualRiskLevelEnum): string {
    return this.translateService.instant(this.buildTranslationKey(v));
  }

  private resolveLevel(risk: Risk): string {
    if (!risk.inherent_risk_level && !risk.residual_risk_level) {
      return notSet;
    }
    if (risk.inherent_risk_level && !risk.residual_risk_level) {
      return risk.inherent_risk_level;
    }
    if (risk.residual_risk_level && (risk.inherent_risk_level || !risk.inherent_risk_level)) {
      return risk.residual_risk_level;
    }
  }

  private async editField(value: any): Promise<void> {
    await this.riskFacadeService.editRisk(this.riskId, { [this.riskLevelField]: value }, this.previousValue);
    this.previousValue = value;
  }
}
