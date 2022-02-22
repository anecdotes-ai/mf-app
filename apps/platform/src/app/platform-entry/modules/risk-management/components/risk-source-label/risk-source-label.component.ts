import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RiskSource } from 'core/modules/risk/models';
import { RiskFacadeService, RiskSourceFacadeService } from 'core/modules/risk/services';
import { SubscriptionDetacher } from 'core/utils';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-risk-source-label',
  templateUrl: './risk-source-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskSourceLabelComponent implements OnInit {
  private detacher = new SubscriptionDetacher();
  private sources: RiskSource[];

  @HostBinding('class')
  private classes = 'inline';

  @Input()
  riskId: string;

  sources$: Observable<RiskSource[]>;
  formControl = new FormControl();
  sourceDisplayValueSelector = this.selectSourceDisplayValue.bind(this);

  constructor(private riskSourceFacade: RiskSourceFacadeService, private riskFacade: RiskFacadeService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.riskSourceFacade.getSourceForRisk(this.riskId).pipe(this.detacher.takeUntilDetach()).subscribe(riskSource => {
      this.formControl.setValue(riskSource, { emitEvent: false });
      this.cd.detectChanges();
    });

    this.formControl.valueChanges
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((value: RiskSource) => this.riskFacade.addOrUpdateSourceForRiskAsync(this.riskId, value));

    this.sources$ = this.riskSourceFacade.getAllRiskSources();

    this.sources$
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((sources) => {
        this.sources = sources || [];
      });
  }

  addAndSelectNewSource(value: string): void {
    this.riskFacade.addOrUpdateSourceForRiskAsync(this.riskId, { source_name: value });
  }

  clearSelection(): void {
    this.formControl.setValue(null, { emitEvent: false });
    this.riskFacade.removeSourceForRiskAsync(this.riskId);
  }

  buildTranslationKey(relativeKey: string): string {
    return `riskManagement.riskSourceLabel.${relativeKey}`;
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  shouldDisableAddOption = (sourceName: string): boolean => {
    return !!this.sources.find((source: RiskSource) => source.source_name === sourceName);
  };

  private selectSourceDisplayValue(source: RiskSource): string {
    return source.source_name;
  }
}
