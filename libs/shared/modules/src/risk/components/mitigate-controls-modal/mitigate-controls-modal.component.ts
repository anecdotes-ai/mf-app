import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { DropdownControl } from 'core';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { CalculatedControl } from 'core/modules/data/models';
import { Framework } from 'core/modules/data/models/domain';
import { ControlsFacadeService, FrameworksFacadeService } from 'core/modules/data/services';
import { SubscriptionDetacher } from 'core/utils';
import { DynamicFormGroup } from 'core/modules/dynamic-form';
import { Risk } from '../../models';
import { RiskFacadeService } from '../../services';

export const enum MitigateControlsModalEnum {
  Link = 'link-control',
  Success = 'Success-item',
  Error = 'Error-item',
}

const MitigateFormControlKeys = {
  framework: 'framework',
  control: 'control',
};

@Component({
  selector: 'app-mitigate-controls-modal',
  templateUrl: './mitigate-controls-modal.component.html',
  styleUrls: ['./mitigate-controls-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MitigateControlsModalComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  risk: Risk;
  form: DynamicFormGroup<any>;
  isLoading: boolean;
  frameworks: Framework[];
  controls: CalculatedControl[];

  constructor(
    private cd: ChangeDetectorRef,
    private switcher: ComponentSwitcherDirective,
    private riskFacade: RiskFacadeService,
    private controlsFacade: ControlsFacadeService,
    private frameworksFacade: FrameworksFacadeService
  ) {}

  ngOnInit(): void {
    this.frameworksFacade
      .getApplicableFrameworks()
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((frameworks) => {
        this.frameworks = frameworks;
      });

    this.switcher.sharedContext$.pipe(this.detacher.takeUntilDetach()).subscribe((ctx) => {
      this.risk = ctx.risk;
      this.createForm();
    });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `riskManagement.mitigateControls.mitigateModal.${relativeKey}`;
  }

  async linkControl(): Promise<void> {
    this.isLoading = true;

    try {
      const control = this.form.value[MitigateFormControlKeys.control] as CalculatedControl;
      const editedRisk = await this.riskFacade.updateRiskMitigationControls(this.risk.id, [
        ...this.risk.mitigation_control_ids,
        control.control_id,
      ]);

      this.riskFacade.linkControlEvent(this.risk, control);

      const updatedContext = { risk: editedRisk };
      this.switcher.changeContext(updatedContext);

      this.switcher.goById(MitigateControlsModalEnum.Success);
    } catch (e) {
      this.switcher.goById(MitigateControlsModalEnum.Error);
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  private createForm(): void {
    this.form = new DynamicFormGroup({
      [MitigateFormControlKeys.framework]: new DropdownControl({
        initialInputs: {
          titleTranslationKey: this.buildTranslationKey('framework'),
          placeholderTranslationKey: this.buildTranslationKey('select'),
          data: this.frameworks,
          validateOnDirty: true,
          required: true,
          displayValueSelector: (item) => item.framework_name,
        },
        validators: [Validators.required],
      }),
      [MitigateFormControlKeys.control]: new DropdownControl({
        initialInputs: {
          titleTranslationKey: this.buildTranslationKey('control'),
          placeholderTranslationKey: this.buildTranslationKey('select'),
          searchEnabled: true,
          searchFieldPlaceholder: this.buildTranslationKey('search'),
          data: this.controls,
          displayValueSelector: (item) => item.control_name,
          isDisabled: true,
          validateOnDirty: true,
          required: true,
        },
        validators: [Validators.required],
      }),
    });

    this.subscribeForFrameworkChanges();
  }

  private subscribeForFrameworkChanges(): void {
    this.form.items[MitigateFormControlKeys.framework].valueChanges
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((valueChanged: Framework) => {
        this.getAssignableControlsByFramework(valueChanged, this.risk.mitigation_control_ids);

        this.form.items[MitigateFormControlKeys.control].inputs.isDisabled = false;

        this.cd.detectChanges();
      });
  }

  private getAssignableControlsByFramework(framework: Framework, filteredControls: string[]): void {
    this.controlsFacade
      .getControlsByFrameworkId(framework.framework_id)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((allControls) => {
        this.controls = allControls.filter((control) => {
          return !filteredControls.includes(control.control_id);
        });
        this.form.items[MitigateFormControlKeys.control].inputs.data = this.controls;

        this.cd.detectChanges();
      });
  }
}
