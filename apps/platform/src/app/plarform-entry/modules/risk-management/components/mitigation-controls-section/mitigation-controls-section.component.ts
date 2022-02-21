import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Risk } from 'core/modules/risk/models';
import { MitigateControlsModalService, RiskFacadeService } from 'core/modules/risk/services';
import { SubscriptionDetacher } from 'core/utils';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/lib/perfect-scrollbar.interfaces';

@Component({
  selector: 'app-mitigation-controls-section',
  templateUrl: './mitigation-controls-section.component.html',
  styleUrls: ['./mitigation-controls-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MitigationControlsSection implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @Input()
  riskId: string;

  risk: Risk;
  scrollbarConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: false,
  };

  constructor(
    private cd: ChangeDetectorRef,
    private mitigateControlsModalService: MitigateControlsModalService,
    private riskFacadeService: RiskFacadeService
  ) {}

  ngOnInit(): void {
    this.riskFacadeService.getRiskById(this.riskId).subscribe((risk) => {
      this.risk = risk;

      this.cd.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `riskManagement.mitigateControls.${relativeKey}`;
  }

  linkControlClicked(): void {
    this.mitigateControlsModalService.openMitigateControlskModal(this.risk);
  }
}
