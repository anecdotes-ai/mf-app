import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { PolicySettingsModalEnum } from '../../constants';
import { TextFieldControl } from 'core/models';
import { ApproverInstance, PolicySettings } from 'core/modules/data/models/domain';
import { CustomValidators, DynamicFormGroup } from 'core/modules/dynamic-form';


@Component({
  selector: 'app-policy-role',
  templateUrl: './policy-role.component.html',
  styleUrls: ['./policy-role.component.scss'],
})
export class PolicyRoleComponent implements OnChanges {
  formGroups: Array<DynamicFormGroup<any>> = [];
  emails = new Set();

  @Input()
  isAddMoreVisible: boolean;
  @Input()
  translationKey: string;
  @Input()
  stage: string;
  @Input()
  policySettings: PolicySettings;

  get invalid(): boolean {
    return !!this.formGroups.some((form) => form.invalid);
  }

  get touched(): boolean {
    return !!this.formGroups.some((form) => Object.values(form.controls).find((control) => control.value));
  }

  get isAddMoreDisable(): boolean {
    return !this.formGroups.some((form) => Object.values(form.controls).find((control) => control.value));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('policySettings' in changes && changes['policySettings'].firstChange && !this.policySettings) {
      this.addMore();
    } else if ('policySettings' in changes && this.policySettings) {
      if (this.stage !== PolicySettingsModalEnum.Owner && this.policySettings?.owner) {
        this.emails.add(this.policySettings.owner.email);
      }
      if (this.stage !== PolicySettingsModalEnum.Approvers && this.policySettings?.approvers) {
        this.policySettings.approvers.forEach((approver) => this.emails.add(approver.email));
      }
      if (this.stage !== PolicySettingsModalEnum.Reviewers && this.policySettings?.reviewers) {
        this.policySettings.reviewers.forEach((reviewer) => this.emails.add(reviewer.email));
      }
      if (!this.policySettings[this.stage]) {
        return;
      }
      const currStageDate = this.policySettings[this.stage];
      this.formGroups = [];
      if (Array.isArray(currStageDate) && currStageDate.length) {
        currStageDate.forEach((role) => this.addMore(role));
      } else {
        this.addMore(currStageDate);
      }
    }
  }

  formData(): ApproverInstance | Array<ApproverInstance> {
    const approvers: Array<ApproverInstance> = [];
    this.formGroups.forEach((form) => {
      if (form.items.role.value) {
        approvers.push({
          role: form.items.role.value,
          email: form.items.email.value,
          name: form.items.name.value,
        });
      }
    });
    if (!this.isAddMoreVisible) {
      return approvers.length ? approvers[0] : undefined;
    }
    return approvers;
  }

  removeRow(index: number): void {
    this.formGroups.splice(index, 1);
  }

  buildTranslationKey(relativeKey: string): string {
    return `${this.translationKey}.${relativeKey}`;
  }
  buildCurrTranslationKey(relativeKey: string): string {
    return `${this.translationKey}.${this.stage}.${relativeKey}`;
  }

  addMore(role?: ApproverInstance): void {
    const form = new DynamicFormGroup(
      {
        name: new TextFieldControl({
          initialInputs: {
            placeholder: this.buildTranslationKey('fields.name'),
            validateOnDirty: true,
          },
        }),
        role: new TextFieldControl({
          initialInputs: {
            placeholder: this.buildTranslationKey('fields.role'),
            validateOnDirty: true,
          },
        }),
        email: new TextFieldControl({
          initialInputs: {
            placeholder: this.buildTranslationKey('fields.email'),
            validateOnDirty: true,
            errorTexts: {
              email: this.buildTranslationKey('fields.emailIsInvalid'),
              sameEmail: this.buildTranslationKey('fields.sameEmailIsInvalid'),
            },
          },
          validators: [CustomValidators.emailCustomValidator],
        }),
      },
      this.fieldConditionalRequiredValidation
    );
    if (role) {
      form.patchValue({ name: role.name, email: role.email, role: role.role });
    }
    this.formGroups.push(form);
  }

  private fieldConditionalRequiredValidation(formGroup: FormGroup): any {
    const hasValue = Object.values(formGroup.controls).find((control) => control.value);
    const notValue = Object.values(formGroup.controls).find((control) => !control.value);
    if (hasValue && notValue) {
      return { fieldConditionalRequiredValidation: true };
    }
    return undefined;
  }
}
