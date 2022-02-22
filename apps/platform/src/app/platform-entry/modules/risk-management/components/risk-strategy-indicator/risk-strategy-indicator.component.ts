import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { RiskFacadeService } from 'core/modules/risk/services';
import { Observable } from 'rxjs';
import { StrategyEnum } from 'core/modules/risk/models';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SubscriptionDetacher } from 'core/utils';

const translationMapping = {
  [StrategyEnum.Mitigate]: 'mitigate',
  [StrategyEnum.Accept]: 'accept',
  [StrategyEnum.Transfer]: 'transfer',
  [StrategyEnum.Avoid]: 'avoid',
};

@Component({
  selector: 'app-risk-strategy-indicator',
  templateUrl: './risk-strategy-indicator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskStrategyIndicatorComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();

  @HostBinding('class')
  private classes = 'inline-block max-w-full';

  @Input()
  riskId: string;

  control = new FormControl();

  strategy$: Observable<string>;

  options: StrategyEnum[] = [StrategyEnum.Mitigate, StrategyEnum.Accept, StrategyEnum.Transfer, StrategyEnum.Avoid];

  strategyDisplayValueSelector = this.selectStrategyDisplayValue.bind(this);

  constructor(private riskFacadeService: RiskFacadeService, private translateService: TranslateService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.riskFacadeService
      .getRiskById(this.riskId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((risk) => {
        this.control.setValue(risk.strategy, { emitEvent: false });
        this.cd.detectChanges();
      });

    this.control.valueChanges
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((value) => this.riskFacadeService.updateRiskStrategyAsync(this.riskId, value));
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  clearSelection(): void {
    this.riskFacadeService.updateRiskStrategyAsync(this.riskId, null);
  }

  buildTranslationKey(relativeKey: string): string {
    return `riskManagement.riskStrategy.${relativeKey}`;
  }

  private selectStrategyDisplayValue(v: StrategyEnum): string {
    return this.translateService.instant(this.buildTranslationKey(translationMapping[v]));
  }
}
