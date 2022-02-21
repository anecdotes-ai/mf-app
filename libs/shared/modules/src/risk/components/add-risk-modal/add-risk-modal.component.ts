import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DropdownControl, MultiDropdownControl, TextFieldControl } from 'core';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { SubscriptionDetacher } from 'core/utils';
import { DynamicFormGroup } from 'core/modules/dynamic-form';
import { RiskCategory, RiskSource, EffectEnum, StrategyEnum, DetailedRisk } from '../../models';
import { RiskCategoryFacadeService, RiskFacadeService, RiskSourceFacadeService } from '../../services';

export const enum AddRiskModalEnum {
  Add = 'Add-risk',
  Success = 'Success-item',
  Error = 'Error-item',
}

export const FormControlKeys = {
  risk_name: 'risk_name',
  risk_category: 'risk_category',
  risk_source: 'risk_source',
  risk_effect: 'risk_effect',
  risk_strategy: 'risk_strategy',
};

@Component({
  selector: 'app-add-risk-modal',
  templateUrl: './add-risk-modal.component.html',
  styleUrls: ['./add-risk-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddRiskModalComponent implements OnInit, OnDestroy {
  private addedCategories: string[] = [];
  private addedSources: string[] = [];
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @Input()
  riskCategories: RiskCategory[];

  @Input()
  riskSources: RiskSource[];

  form: DynamicFormGroup<any>;
  isLoading: boolean;

  constructor(
    private cd: ChangeDetectorRef,
    private switcher: ComponentSwitcherDirective,
    private translateService: TranslateService,
    private riskFacade: RiskFacadeService,
    private riskCategoryFacade: RiskCategoryFacadeService,
    private riskSourceFacade: RiskSourceFacadeService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `riskManagement.addRiskModal.${relativeKey}`;
  }

  async addRisk(): Promise<void> {
    this.isLoading = true;
    const risk: DetailedRisk = Object.assign(
      {},
      {
        name: this.form.value[FormControlKeys.risk_name],
        category_id: this.form.value[FormControlKeys.risk_category]?.id,
        isCustomCategory: this.isCustomCategory(this.form.value[FormControlKeys.risk_category]?.id),
        isCustomSource: this.isCustomSource(this.form.value[FormControlKeys.risk_source]?.id),
      },
      this.form.value[FormControlKeys.risk_effect] ? { effect: this.form.value[FormControlKeys.risk_effect] } : null,
      this.form.value[FormControlKeys.risk_source] ? { source_id: this.form.value[FormControlKeys.risk_source]?.id } : null,
      this.form.value[FormControlKeys.risk_strategy] ? { strategy: this.form.value[FormControlKeys.risk_strategy] } : null
    );

    try {
      await this.riskFacade.addRisk(risk);
      this.switcher.goById(AddRiskModalEnum.Success);
      this.createForm();
    } catch (e) {
      this.switcher.goById(AddRiskModalEnum.Error);
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  private createForm(): void {
    this.form = new DynamicFormGroup({
      [FormControlKeys.risk_name]: new TextFieldControl({
        initialInputs: {
          label: this.translateService.instant(this.buildTranslationKey('riskName')),
          validateOnDirty: true,
          required: true,
        },
        validators: [Validators.required],
      }),
      [FormControlKeys.risk_category]: new DropdownControl({
        initialInputs: {
          titleTranslationKey: this.buildTranslationKey('category'),
          placeholderTranslationKey: this.buildTranslationKey('dropdownPlaceholder'),
          searchEnabled: true,
          searchFieldPlaceholder: this.buildTranslationKey('searchCategoryPl'),
          data: this.riskCategories,
          validateOnDirty: true,
          required: true,
          displayValueSelector: (item) => item.category_name,
          bottomDropdownAction: {
            translationKey: this.buildTranslationKey('newCategory'),
            showOnlyOnSearch: true,
            shouldResetOnClick: true,
            icon: 'Add',
            action: (context) => this.addRiskCategory(context),
          },
        },
        validators: [Validators.required],
      }),
      [FormControlKeys.risk_source]: new DropdownControl({
        initialInputs: {
          titleTranslationKey: this.buildTranslationKey('source'),
          placeholderTranslationKey: this.buildTranslationKey('dropdownPlaceholder'),
          searchEnabled: true,
          searchFieldPlaceholder: this.buildTranslationKey('searchSourcePl'),
          data: this.riskSources,
          displayValueSelector: (item) => item.source_name,
          bottomDropdownAction: {
            translationKey: this.buildTranslationKey('newSource'),
            showOnlyOnSearch: true,
            shouldResetOnClick: true,
            icon: 'Add',
            action: (context) => this.addRiskSource(context),
          },
        },
      }),
      [FormControlKeys.risk_effect]: new MultiDropdownControl({
        initialInputs: {
          titleTranslationKey: this.buildTranslationKey('effect'),
          data: Object.values(EffectEnum),
          placeholderTranslationKey: this.buildTranslationKey('select'),
          displaySelectedItemsList: false,
        },
      }),
      [FormControlKeys.risk_strategy]: new DropdownControl({
        initialInputs: {
          titleTranslationKey: this.buildTranslationKey('strategy'),
          placeholderTranslationKey: this.buildTranslationKey('select'),
          data: [StrategyEnum.Mitigate, StrategyEnum.Accept, StrategyEnum.Transfer, StrategyEnum.Avoid],
        },
      }),
    });
  }

  private async addRiskCategory(category_name: string): Promise<void> {
    const newCategory = await this.riskCategoryFacade.addRiskCategory({ category_name });
    this.riskCategories.push(newCategory);
    this.addedCategories.push(newCategory.id);
    this.form.items[FormControlKeys.risk_category].setValue(newCategory);
    this.cd.detectChanges();
  }

  private async addRiskSource(source_name: string): Promise<void> {
    const newSource = await this.riskSourceFacade.addRiskSource({ source_name });
    this.riskSources.push(newSource);
    this.addedSources.push(newSource.id);
    this.form.items[FormControlKeys.risk_source].setValue(newSource);
    this.cd.detectChanges();
  }

  private isCustomCategory(categoryId: string): boolean {
    return this.addedCategories.includes(categoryId);
  }

  private isCustomSource(sourceId: string): boolean {
    return this.addedSources.includes(sourceId);
  }
}
