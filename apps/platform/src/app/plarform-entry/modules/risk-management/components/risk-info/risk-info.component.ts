import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Risk } from 'core/modules/risk/models';
import { RiskFacadeService } from 'core/modules/risk/services';
import { SubscriptionDetacher } from 'core/utils';

@Component({
  selector: 'app-risk-info',
  templateUrl: './risk-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskInfoComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();

  @HostBinding('class')
  private classes = 'flex flex-col gap-5 rounded-md bg-navy-10 h-full p-5';

  @Input()
  riskId: string;

  risk: Risk;

  description: string;
  threat: string;
  vulnerability: string;

  constructor(private riskFacadeService: RiskFacadeService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.riskFacadeService
      .getRiskById(this.riskId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((risk) => {
        this.risk = risk;
        this.cd.detectChanges();
      });
  }

  editDescription(newDescription: string): void {
    this.riskFacadeService.editDescriptionsAsync(this.riskId, { newDescription });
  }

  editThreat(newThreat: string): void {
    this.riskFacadeService.editDescriptionsAsync(this.riskId, { newThreat });
  }

  editVulnerability(newVulnerability: string): void {
    this.riskFacadeService.editDescriptionsAsync(this.riskId, { newVulnerability });
  }

  buildTranslationKey(relativeKey: string): string {
    return `riskManagement.riskInfo.${relativeKey}`;
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }
}
