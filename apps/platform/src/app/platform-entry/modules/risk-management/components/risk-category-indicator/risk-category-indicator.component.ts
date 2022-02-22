import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SubscriptionDetacher } from 'core/utils';
import { RiskCategory } from 'core/modules/risk/models';
import { RiskCategoryFacadeService, RiskFacadeService } from 'core/modules/risk/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-risk-category-indicator',
  templateUrl: './risk-category-indicator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskCategoryIndicatorComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();

  @HostBinding('class')
  private classes = 'inline-block max-w-full';
  private categories: RiskCategory[];

  @Input()
  riskId: string;

  allCategories$: Observable<RiskCategory[]>;
  control = new FormControl();

  constructor(private cd: ChangeDetectorRef, private riskFacade: RiskFacadeService, private riskCategoryFacadeService: RiskCategoryFacadeService) {}

  ngOnInit(): void {
    this.riskCategoryFacadeService
      .getCategoryForRisk(this.riskId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((riskCategory) => {
        this.control.setValue(riskCategory, { emitEvent: false });

        this.cd.detectChanges();
      });

    this.control.valueChanges
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((value: RiskCategory) => this.riskFacade.addOrUpdateCategoryForRiskAsync(this.riskId, value));

    this.allCategories$ = this.riskCategoryFacadeService.getAllRiskCategories();

    this.allCategories$
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((categories) => {
        this.categories = categories || [];
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  addAndSelectNewCategory(value: string): void {
    this.riskFacade.addOrUpdateCategoryForRiskAsync(this.riskId, { category_name: value });
  }

  selectRiskCategoryDisplayValue(riskCategory: RiskCategory): string {
    return riskCategory.category_name;
  }

  shouldDisableAddOption = (categoryName: string): boolean => {
    return !!this.categories.find((category: RiskCategory) => category.category_name === categoryName);
  };

  buildTranslationKey(relativeKey: string): string {
    return `riskManagement.riskCategory.${relativeKey}`;
  }
}
