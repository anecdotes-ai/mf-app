import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ModalWindowService } from 'core/modules/modals';
import { RiskRegistryModal } from '../risk-registry-modal/risk-registry-modal.component';
import { RiskFacadeService } from 'core/modules/risk/services';
import { SubscriptionDetacher } from 'core/utils';
import { Risk } from 'core/modules/risk/models';

@Component({
  selector: 'app-risk-analysis',
  templateUrl: './risk-analysis.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskAnalysisComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @HostBinding('class')
  private classes = 'flex flex-col gap-6';

  @Input()
  riskId: string;

  risk: Risk;

  constructor(
    private cd: ChangeDetectorRef,
    private riskFacade: RiskFacadeService,
    private modalWindowService: ModalWindowService
  ) {}

  ngOnInit(): void {
    this.riskFacade
      .getRiskById(this.riskId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((risk) => {
        this.risk = risk;
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `riskManagement.riskAanlysis.${relativeKey}`;
  }

  openRiskRegistryModal(): void {
    this.modalWindowService.openInSwitcher({
      componentsToSwitch: [
        {
          id: 'risk-registry-modal',
          componentType: RiskRegistryModal,
          contextData: {
            riskName: this.risk.name,
            riskLevel: this.risk.residual_risk_level || this.risk.inherent_risk_level,
          },
        },
      ],
    });
    this.riskFacade.howRiskLevelIsCalculatedEvent(this.risk);
  }
}
