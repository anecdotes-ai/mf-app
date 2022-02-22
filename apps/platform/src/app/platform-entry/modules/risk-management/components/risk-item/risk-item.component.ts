import { ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SubscriptionDetacher } from 'core/utils';
import { Risk } from 'core/modules/risk/models';
import { RiskFacadeService } from 'core/modules/risk/services';

@Component({
  selector: 'app-risk-item',
  templateUrl: './risk-item.component.html',
  styleUrls: ['./risk-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskItemComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();

  @Input()
  riskId: string;
  @Input()
  isFilterPanelOpen: boolean;
  @Input()
  isExpanded: boolean;

  @Output()
  riskExpanded = new EventEmitter<string>();

  risk: Risk;

  constructor(
    private riskFacadeService: RiskFacadeService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.riskFacadeService
      .getRiskById(this.riskId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((risk) => {
        this.risk = risk;
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  headerClicked (event: MouseEvent): void {
    event.stopPropagation();
    this.riskExpanded.emit(this.isExpanded ? null : this.riskId);
  }
}
