import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DynamicFormGroup } from 'core/modules/dynamic-form';
import { DatepickerControl, DropdownControl } from 'core/models';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ScheduleSettings } from 'core/modules/data/models/domain';

@Component({
  selector: 'app-policy-scheduling',
  templateUrl: './policy-scheduling.component.html',
  styleUrls: ['./policy-scheduling.component.scss']
})
export class PolicySchedulingComponent implements OnInit, OnChanges {
  @Input()
  translationKey: string;

  @Input()
  policyScheduling: ScheduleSettings;

  formGroup: DynamicFormGroup<any>;
  frequencyPool: Array<string>;
  notifyPool: Array<string>;

  get invalid(): boolean {
    return false;
  }
  get touched(): boolean {
    return true;
  }

  constructor(private translateService: TranslateService) { }

  ngOnInit(): void {
    this.frequencyPool = ['yearly', 'quarterly', 'monthly'];
    this.notifyPool = ['never', 'day', 'week', 'month'];
    this.formGroup = this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('policyScheduling' in changes && this.policyScheduling) {
      this.formGroup.items.frequency.setValue(this.policyScheduling.approval_frequency || this.frequencyPool[0]);
      this.formGroup.items.startTime.setValue(this.policyScheduling.start_from || new Date().toISOString());
      this.formGroup.items.notifyMe.setValue(this.policyScheduling.notify_me || this.notifyPool[0]);
      this.formGroup.items.notifyRoles.setValue(this.policyScheduling.notify_approvers || this.notifyPool[0]);
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `${this.translationKey}.${relativeKey}`;
  }

  formData(): ScheduleSettings {
    return {
      approval_frequency: this.formGroup.items.frequency.value,
      start_from: this.formGroup.items.startTime.value,
      notify_me: this.formGroup.items.notifyMe.value,
      notify_approvers: this.formGroup.items.notifyRoles.value
    };
  }

  private createForm(): DynamicFormGroup<any> {
    return new DynamicFormGroup({
      frequency: new DropdownControl({
        initialInputs: {
          titleTranslationKey: this.buildTranslationKey('frequency.label'),
          infoTooltip: this.translateService.instant(this.buildTranslationKey('frequency.info')),
          data: this.frequencyPool,
          displayValueSelector: (key: string) => this.translateService.instant(this.buildTranslationKey(`frequency.${key}`)),
        },
        validators: [Validators.required]
      }),
      startTime: new DatepickerControl({
        initialInputs: {
          label: this.buildTranslationKey('startFrom.label'),
          errorTexts: {
            invalidDate: this.buildTranslationKey('startFrom.invalidDate'),
          },
        },
        validators: [Validators.required],
      }),
      notifyMe: new DropdownControl({
        initialInputs: {
          titleTranslationKey: this.buildTranslationKey('notifyMe.label'),
          infoTooltip: this.translateService.instant(this.buildTranslationKey('notifyMe.info')),
          data: this.notifyPool,
          displayValueSelector: (key: string) => this.translateService.instant(this.buildTranslationKey(`notify.${key}`))
        },
        validators: [Validators.required],
      }),
      notifyRoles: new DropdownControl({
        initialInputs: {
          titleTranslationKey: this.buildTranslationKey('notifyRoles.label'),
          infoTooltip: this.translateService.instant(this.buildTranslationKey('notifyRoles.info')),
          data: this.notifyPool,
          displayValueSelector: (key: string) => this.translateService.instant(this.buildTranslationKey(`notify.${key}`)),
        },
        validators: [Validators.required],
      }),
    });
  }
}
