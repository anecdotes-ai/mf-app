import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SubscriptionDetacher } from 'core/utils';
import { EffectEnum } from 'core/modules/risk/models';
import { RiskFacadeService } from 'core/modules/risk/services';

@Component({
  selector: 'app-risk-effects',
  templateUrl: './risk-effects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskEffectsComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();
  @Input()
  riskId: string;

  isDropdownOpened: boolean;

  appliedEffects = new Set<EffectEnum>();
  selectedEffectsDictionary: { [key: string]: boolean } = {};

  allEffects: EffectEnum[] = [EffectEnum.Confidentiality, EffectEnum.Integrity, EffectEnum.Availability];

  get hasAppliedEffects(): boolean {
    return !!this.appliedEffects.size;
  }

  constructor(private riskFacadeService: RiskFacadeService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.riskFacadeService
      .getRiskById(this.riskId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((risk) => {
        let sorted: EffectEnum[] = this.allEffects.filter(effect => risk.effect.includes(effect));

        this.appliedEffects = new Set<EffectEnum>(sorted);
        this.createEffectsDictionary(risk.effect);
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  toggleDropdown(e: MouseEvent): void {
    if (this.isDropdownOpened) {
      this.close();
    } else {
      this.open();
    }

    e.stopPropagation();
  }

  open(): void {
    this.isDropdownOpened = true;
    this.cd.detectChanges();
  }

  close(): void {
    this.isDropdownOpened = false;
    this.cd.detectChanges();

    if (this.hasChanges()) {
      this.riskFacadeService.updateRiskEffectsAsync(this.riskId, this.getSelectedEffects());
    }
  }

  getFirstCharacter(str: string): string {
    return str.substring(0, 1);
  }

  buildTranslationKey(relativeKey: string): string {
    return `riskManagement.riskEffects.${relativeKey}`;
  }

  private hasChanges(): boolean {
    let areSizesEqual: boolean = this.appliedEffects.size === this.getSelectedEffects().length;

    if (areSizesEqual) {
      return Array.from(this.appliedEffects).some((effect) => !this.selectedEffectsDictionary[effect]);
    }

    return true;
  }

  private getSelectedEffects(): EffectEnum[] {
    return Object.entries(this.selectedEffectsDictionary)
      .filter(([_, value]) => value)
      .map(([key, _]) => key as EffectEnum);
  }

  private createEffectsDictionary(effects: EffectEnum[]): void {
    this.selectedEffectsDictionary = effects.reduce((result, effect) => ({ ...result, [effect]: true }), {});
  }

  getEffects(): any {
    return [...this.appliedEffects].join(', ');
  }
}
