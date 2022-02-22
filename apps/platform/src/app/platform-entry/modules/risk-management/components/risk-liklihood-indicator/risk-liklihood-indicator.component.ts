import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { RiskFacadeService } from 'core/modules/risk/services';
import { InherentRiskLevelLikeHoodEnum } from 'core/modules/risk/models';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SubscriptionDetacher } from 'core/utils';
import { LiklihoodBGClasses, notSetClass } from '../../constants';

@Component({
  selector: 'app-risk-liklihood-indicator',
  templateUrl: './risk-liklihood-indicator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskLiklihoodIndicatorComponent implements OnInit, OnDestroy {
  private previousValue: string;
  private detacher = new SubscriptionDetacher();

  @HostBinding('class')
  private classes = 'inline-block w-min';

  @Input()
  riskId: string;

  @Input()
  riskField: string;

  @Output()
  editing = new EventEmitter<string>();

  @Output()
  editingDone = new EventEmitter();

  control = new FormControl();

  options: InherentRiskLevelLikeHoodEnum[] = [
    InherentRiskLevelLikeHoodEnum.Rare,
    InherentRiskLevelLikeHoodEnum.Unlikely,
    InherentRiskLevelLikeHoodEnum.Possible,
    InherentRiskLevelLikeHoodEnum.Likely,
    InherentRiskLevelLikeHoodEnum.AlmostCertain,
  ];

  displayValueSelector = this.selectDisplayValue.bind(this);

  get buttonBackgroundClass(): string {
    return LiklihoodBGClasses[this.control?.value] || notSetClass;
  }

  constructor(private cd: ChangeDetectorRef, private riskFacadeService: RiskFacadeService, private translateService: TranslateService) {}

  ngOnInit(): void {
    this.riskFacadeService
      .getRiskById(this.riskId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((risk) => {
        this.control.setValue(risk[this.riskField], { emitEvent: false });
        this.previousValue = risk[this.riskField];

        this.cd.detectChanges();
      });

    this.control.valueChanges.pipe(this.detacher.takeUntilDetach()).subscribe((value) => this.editField(value));
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  clearSelection(): void {
    this.editField(null);
  }

  buildTranslationKey(relativeKey: string): string {
    return `riskManagement.liklihoodRating.${relativeKey}`;
  }

  private async editField(value: any): Promise<void> {
    this.editing.emit(this.riskField);
    await this.riskFacadeService.editRisk(this.riskId, { [this.riskField]: value }, this.previousValue);
    this.previousValue = value;
    this.editingDone.emit();
  }

  private selectDisplayValue(v: InherentRiskLevelLikeHoodEnum): string {
    return this.translateService.instant(this.buildTranslationKey(v));
  }
}
