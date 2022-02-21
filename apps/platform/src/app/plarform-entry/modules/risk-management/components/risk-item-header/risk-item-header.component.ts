import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SubscriptionDetacher } from 'core/utils';
import { Risk } from 'core/modules/risk/models';
import { RiskFacadeService } from 'core/modules/risk/services';

@Component({
  selector: 'app-risk-item-header',
  templateUrl: './risk-item-header.component.html',
  styleUrls: ['./risk-item-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskItemHeaderComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  private classes = 'block w-full group relative';

  private detacher = new SubscriptionDetacher();

  @Input()
  riskId: string;

  @Input()
  isOpen: boolean;

  risk: Risk;

  constructor(private riskFacadeService: RiskFacadeService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.riskFacadeService.getRiskById(this.riskId).subscribe((risk) => {
      this.risk = risk;
      this.cd.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  editRiskName(newValue: string): void {
    this.riskFacadeService.editRiskNameAsync(this.risk.id, newValue);
  }
}
