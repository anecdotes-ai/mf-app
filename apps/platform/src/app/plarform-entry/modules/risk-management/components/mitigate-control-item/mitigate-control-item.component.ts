import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CalculatedControl } from 'core/modules/data/models';
import { Risk } from 'core/modules/risk/models';
import { RiskFacadeService } from 'core/modules/risk/services';
import { ViewControlModalService } from 'core/modules/shared-controls';
import { SubscriptionDetacher } from 'core/utils';
import { MenuAction } from 'core/modules/dropdown-menu/types';
import { ControlsFacadeService } from 'core/modules/data/services';

@Component({
  selector: 'app-mitigate-control-item',
  templateUrl: './mitigate-control-item.component.html',
  styleUrls: ['./mitigate-control-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MitigateControlItem implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @Input()
  riskId: string;

  @Input()
  controlId: string;

  frameworkNames = {};
  isLoading = false;
  threeDotsMenu: MenuAction[] = [];
  risk: Risk;
  control: CalculatedControl;

  @HostListener('click')
  openViewControlModal(): void {
    this.viewControlModalService.openViewControlModal(this.control.control_id, { entityPath: [this.risk.name] });
    this.riskFacade.openViewControlEvent(this.risk, this.control);
  }

  constructor(
    private cd: ChangeDetectorRef,
    private riskFacade: RiskFacadeService,
    private controlsFacade: ControlsFacadeService,
    private viewControlModalService: ViewControlModalService
  ) {}

  ngOnInit(): void {
    this.riskFacade
      .getRiskById(this.riskId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((risk) => {
        this.risk = risk;
        this.cd.detectChanges();
      });

    this.controlsFacade
      .getControl(this.controlId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((control) => {
        this.control = control;
        this.frameworkNames = { [control?.control_framework]: '' };
        this.cd.detectChanges();
      });

    this.initThreeDotMenu();
    this.cd.detectChanges();
  }

  buildTranslationKey(relativeKey: string): string {
    return `riskManagement.mitigateControls.${relativeKey}`;
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  private initThreeDotMenu(): void {
    this.threeDotsMenu = [
      {
        translationKey: this.buildTranslationKey('disconnect'),
        action: () => this.removeControl(),
      },
    ];
  }

  private async removeControl(): Promise<void> {
    this.isLoading = true;
    this.cd.detectChanges();

    const controlIds = this.risk.mitigation_control_ids?.filter((id) => id !== this.control.control_id);

    try {
      await this.riskFacade.updateRiskMitigationControls(this.risk.id, controlIds);
      await this.riskFacade.disconnectControlEvent(this.risk, this.control);
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }
}
