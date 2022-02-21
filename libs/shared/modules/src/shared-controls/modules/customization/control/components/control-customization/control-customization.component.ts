import { AddCustomControlModalEnum, EditCustomControlModalEnum } from '../../models';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { DropdownControl, TextAreaControl, MultiDropdownControl, TextFieldControl } from 'core/models/form';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher/directives';
import { AnecdotesUnifiedFramework } from 'core/modules/data/constants';
import { CalculatedControl } from 'core/modules/data/models';
import { Control, Framework } from 'core/modules/data/models/domain';
import { ControlsFacadeService, FrameworksFacadeService } from 'core/modules/data/services';
import { CustomControlFormData } from 'core/modules/data/services/controls/models/add-customer-control.model';
import { DynamicFormGroup } from 'core/modules/dynamic-form/models/dynamic-form-group';
import { groupBy, SubscriptionDetacher } from 'core/utils';
import { Observable, Subject } from 'rxjs';
import { filter, map, shareReplay, take, tap } from 'rxjs/operators';
import { ControlCustomizationSharedContext } from './../../services/controls-customization-modal-service/controls-customization-shared-context';
import { SocTwoFrameworkId } from 'core/constants';

export const translationRootKey = 'controls.addControlModal';
// const DefaultSubCategory = 'Other';

export type CustomizationDynamicForm = {
  category: DropdownControl;
  // subCategory?: DropdownControl;
  controlName: TextFieldControl;
  addDescription: TextAreaControl;
  tsc?: MultiDropdownControl;
};

@Component({
  selector: 'app-control-customization',
  templateUrl: './control-customization.component.html',
  styleUrls: ['./control-customization.component.scss'],
})
export class ControlCustomizationComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  private contextData: ControlCustomizationSharedContext;

  private framework$: Observable<Framework>;

  get isEditMode(): boolean {
    return this.contextData?.isEditMode;
  }

  submitFormBtnLoader$ = new Subject<boolean>();

  form: DynamicFormGroup<CustomizationDynamicForm>;

  constructor(
    private controlsFacade: ControlsFacadeService,
    private frameworksFacade: FrameworksFacadeService,
    private switcher: ComponentSwitcherDirective
  ) {}

  ngOnInit(): void {
    this.switcher.sharedContext$
      .pipe(
        filter((c) => !!c),
        tap((context: ControlCustomizationSharedContext) => (this.contextData = context)),
        take(1),
        this.detacher.takeUntilDetach()
      )
      .subscribe(async (context: ControlCustomizationSharedContext) => {
        this.framework$ = this.frameworksFacade.getFrameworkById(context.framework_id).pipe(
          filter((framework) => !!framework),
          shareReplay()
        );
        this.form = this.resolveFormDataForParticularFramework(context.framework_id);
        this.fetchFormData(context.framework_id);

        if (context.isEditMode && context.control_id) {
          const control = (await this.controlsFacade
            .getControl(context.control_id)
            .pipe(take(1))
            .toPromise()) as Control;
          this.selectControlFormData(control);
        }
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(partialKey: string): string {
    return `${translationRootKey}.${partialKey}`;
  }

  async submitFormBtnClick(): Promise<void> {
    this.submitFormBtnLoader$.next(true);
    this.form.disable();

    const actionPayload: CustomControlFormData = {
      control_description: this.form.items.addDescription.value,
      control_framework_category: this.form.items.category.value,
      control_name: this.form.items.controlName.value,
      // Commented in case that currently we don't use sub categories
      // my_controls_category: this.form.items.subCategory.value,
    };

    if (this.form.items.tsc?.value) {
      actionPayload.control_original_related_controls = this.form.items.tsc.value;
    }

    try {
      if (this.isEditMode) {
        await this.controlsFacade.editCustomControl(
          this.contextData.framework_id,
          this.contextData.control_id,
          actionPayload
        );
        this.switcher.goById(EditCustomControlModalEnum.SuccessModal);
      } else {
        const control_id = await this.controlsFacade.addCustomControl(this.contextData.framework_id, actionPayload);
        const updatedContext: ControlCustomizationSharedContext = { control_id, ...this.contextData };
        this.switcher.changeContext(updatedContext);
        this.switcher.goById(AddCustomControlModalEnum.Success);
      }
    } catch (e) {
      this.switcher.goById(this.isEditMode ? EditCustomControlModalEnum.ErrorModal : AddCustomControlModalEnum.Error);
    } finally {
      this.form.enable();
      this.submitFormBtnLoader$.next(false);
    }
  }

  private resolveFormDataForParticularFramework(framework_id: string): DynamicFormGroup<CustomizationDynamicForm> {
    if (framework_id === AnecdotesUnifiedFramework.framework_id) {
      return new DynamicFormGroup<CustomizationDynamicForm>({
        category: this.createCategoryDropdownControl(),
        controlName: this.createControlNameTextFieldControl(),
        addDescription: this.createAddDescriptionTextFieldControl(),
      });
    } else if (framework_id === SocTwoFrameworkId) {
      return new DynamicFormGroup<CustomizationDynamicForm>({
        category: this.createCategoryDropdownControl(),
        // Commented code, will be fixed soon, as we are don't expect sub categories for any frameworks
        // subCategory: this.createSubCategoryDropdownControl(),
        controlName: this.createControlNameTextFieldControl(),
        addDescription: this.createAddDescriptionTextFieldControl(),
        tsc: this.createTscMultiDropdownControl(),
      });
    } else {
      return new DynamicFormGroup<CustomizationDynamicForm>({
        category: this.createCategoryDropdownControl(),
        // Commented code, will be fixed soon, as we are don't expect sub categories for any frameworks
        // subCategory: this.createSubCategoryDropdownControl(),
        controlName: this.createControlNameTextFieldControl(),
        addDescription: this.createAddDescriptionTextFieldControl(),
      });
    }
  }

  private fetchFormData(framework_id: string): void {
    const frameworkCategories$ = this.controlsFacade.getControlsByFrameworkId(framework_id).pipe(
      take(1),
      map((controls) => this.getAllCategories(controls).map((category) => category.category_name))
    );

    // If form has subCategory control, means that the form created relying on Anecdotes framework
    // if (this.form.controls.subCategory) {
    //   const anecdotesFrameworkCategories$ = this.controlsFacade.selectControlsByFrameworkId(AnecdotesUnifiedFrameworkName).pipe(
    //     take(1),
    //     map((controls) => this.getAllCategories(controls).map((category) => category.category_name))
    //   );

    //   this.subscriptions.push(
    //     anecdotesFrameworkCategories$.subscribe((anecdotesCategories) => {
    //       this.form.items.subCategory.inputs.data = [DefaultSubCategory, ...anecdotesCategories];
    //       this.form.items.subCategory.setValue(DefaultSubCategory);
    //     })
    //   );
    // }

    frameworkCategories$.pipe(this.detacher.takeUntilDetach()).subscribe((frameworkCategories) => {
      this.form.items.category.inputs.data = frameworkCategories;
    });
    if (this.form.items.tsc) {
      this.framework$.pipe(this.detacher.takeUntilDetach()).subscribe((framework) => {
        if (framework.framework_references) {
          this.form.items.tsc.inputs.data = framework.framework_references;
        }

        if (framework.framework_reference_field_name) {
          this.form.items.tsc.inputs.titleTranslationKey = framework.framework_reference_field_name;
        }
      });
    }
  }

  private selectControlFormData(control: Control): void {
    this.form.items.category.setValue(control.control_category);
    this.form.items.addDescription.setValue(control.control_description);
    this.form.items.controlName.setValue(control.control_name);

    this.framework$
      .pipe(
        filter((framework) => framework.framework_id === SocTwoFrameworkId),
        this.detacher.takeUntilDetach()
      )
      .subscribe((framework) => {
        this.form.items.tsc.setValue(control.control_related_frameworks_names[framework.framework_name]);
      });
  }

  private getAllCategories(controls: CalculatedControl[]): { category_name: string }[] {
    return groupBy(controls, (x) => x.control_category).map((x) => ({
      category_name: x.key,
    }));
  }

  private createCategoryDropdownControl(): DropdownControl {
    return new DropdownControl({
      initialInputs: {
        titleTranslationKey: this.buildTranslationKey('form.categoryLabel'),
        data: [],
        searchEnabled: true,
        required: true,
        placeholderTranslationKey: this.buildTranslationKey('form.categoryPlaceholder'),
        searchFieldPlaceholder: this.buildTranslationKey('form.categorySearchPlaceholder'),
      },
      validators: [Validators.required],
    });
  }

  private createTscMultiDropdownControl(): MultiDropdownControl {
    return new MultiDropdownControl({
      initialInputs: {
        data: [],
        searchEnabled: true,
        placeholderTranslationKey: this.buildTranslationKey('form.tscPlaceholder'),
        searchFieldPlaceholder: this.buildTranslationKey('form.tscSearchPlaceholder'),
      },
    });
  }

  // private createSubCategoryDropdownControl(): DropdownControl {
  //   return new DropdownControl({
  //     initialInputs: {
  //       titleTranslationKey: this.buildTranslationKey('form.subCategoryLabel'),
  //       // isDisabled: true,
  //       data: [],
  //       searchEnabled: true,
  //       placeholderTranslationKey: this.buildTranslationKey('form.subCategoryPlaceholder'),
  //     },
  //   });
  // }

  private createControlNameTextFieldControl(): TextFieldControl {
    return new TextFieldControl({
      initialInputs: {
        label: this.buildTranslationKey('form.controlNameLabel'),
        displayCharactersCounter: true,
        maxLength: 100,
        rows: 1,
        required: true,
        resizable: false,
        validateOnDirty: true,
      },
      validators: [Validators.required],
    });
  }

  private createAddDescriptionTextFieldControl(): TextAreaControl {
    return new TextAreaControl({
      initialInputs: {
        label: this.buildTranslationKey('form.addDescriptionLabel'),
        rows: 3,
        resizable: false,
      },
    });
  }
}
