import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DatepickerControl, RadioButtonsGroupControl, TextFieldControl } from 'core/models';
import { SocTwoFrameworkId } from 'core/constants';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { Audit, Framework } from 'core/modules/data/models/domain';
import { FrameworkService } from 'core/modules/data/services';
import { SubscriptionDetacher } from 'core/utils';
import { CustomValidators, DynamicFormGroup } from 'core/modules/dynamic-form';
import { AuditStartedModalService } from 'core/services';
import { SocTypes } from '../../constants';

export const enum ConfigureAuditModalEnum {
    Configure = 'Configure-audit',
    Success = 'Success-item',
    Error = 'Error-item',
}

export const FormControlKeys = {
    product_name: 'product_name',
    audit_date: 'audit_date',
    soc_type: 'soc_type',
    audit_range: 'audit_range',
    start_date: 'start_date',
    end_date: 'end_date'
};

@Component({
    selector: 'app-configure-audit-modal',
    templateUrl: './configure-audit-modal.component.html',
    styleUrls: ['./configure-audit-modal.component.scss', '../../shared-framework-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigureAuditModalComponent implements OnInit, OnDestroy {
    private detacher: SubscriptionDetacher = new SubscriptionDetacher();

    @Input('framework')
    framework: Framework;

    @Input('action')
    action: (framework: Framework, audit: Audit) => Promise<void>;

    audit: Audit;
    form: any;
    isLoading: boolean;

    constructor(
        private cd: ChangeDetectorRef,
        private frameworkService: FrameworkService,
        private translateService: TranslateService,
        private switcher: ComponentSwitcherDirective,
        private auditStartedModalService: AuditStartedModalService
    ) { }

    ngOnInit(): void {
        this.audit = this.framework?.framework_current_audit;
        this.createForm();
    }

    ngOnDestroy(): void {
        this.detacher.detach();
    }

    buildTranslationKey(relativeKey: string): string {
        return `frameworks.frameworkManager.overview.configureAuditModal.${relativeKey}`;
    }

    getCurrentFrameworkIcon(): string {
        if (this.framework) {
            return this.frameworkService.getFrameworkIconLink(this.framework.framework_id);
        }
    }

    async saveAudit(): Promise<void> {
        this.isLoading = true;

        const audit: Audit = Object.assign({}, {
            product_name: this.form.value[FormControlKeys.product_name],
            audit_date: this.form.value[FormControlKeys.audit_date]
        },
            this.getFrameworkFields(this.framework.framework_id)
        );

        try {
            await this.action(this.framework, audit);

            this.switcher.goById(ConfigureAuditModalEnum.Success);
            this.auditStartedModalService.setModalForOpening(this.framework.framework_name);
        } catch (e) {
            this.switcher.goById(ConfigureAuditModalEnum.Error);
        } finally {
            this.isLoading = false;
            this.cd.detectChanges();
        }
    }

    private getFrameworkFields(frameworkId: string): any {
        let fields: Audit = { framework_fields: null };

        switch (frameworkId) {
            case SocTwoFrameworkId:
                fields.framework_fields = {
                    type: this.form.value[FormControlKeys.soc_type]
                };

                if (this.form.value[FormControlKeys.soc_type] === SocTypes.type2) {
                    fields.framework_fields = Object.assign({}, fields.framework_fields, {
                        range_start: this.form.items[FormControlKeys.audit_range].value[FormControlKeys.start_date],
                        range_end: this.form.items[FormControlKeys.audit_range].value[FormControlKeys.end_date]
                    });
                }

                break;
            default:
                return null;
        }

        return fields;
    }

    private createForm(): void {
        this.form = new DynamicFormGroup({
            [FormControlKeys.product_name]: new TextFieldControl({
                initialInputs: {
                    label: this.translateService.instant(this.buildTranslationKey('productName'), { framework_name: this.framework.framework_name }),
                    validateOnDirty: true,
                    required: true,
                },
                initialValue: this.audit?.product_name,
                validators: [Validators.required],
            }),
            [FormControlKeys.audit_date]: new DatepickerControl({
                initialInputs: {
                    label: this.buildTranslationKey('auditDate'),
                    validateOnDirty: true,
                    placeholder: this.buildTranslationKey('selectDate'),
                    isCustomHeader: false
                },
            })
        });

        if (this.framework.framework_id === SocTwoFrameworkId) {
            const socTypeControl = new RadioButtonsGroupControl({
                initialInputs: {
                    required: true,
                    label: this.buildTranslationKey('socType'),
                    infoTooltip: this.translateService.instant(this.buildTranslationKey('socInfo')),
                    infoTooltipPlacement: 'top-left',
                    buttons: [
                        {
                            value: SocTypes.type1,
                            label: this.buildTranslationKey(SocTypes.type1),
                        },
                        {
                            value: SocTypes.type2,
                            label: this.buildTranslationKey(SocTypes.type2),
                        },
                    ],
                },
                validators: [Validators.required],
            });

            socTypeControl.setValue(this.audit?.framework_fields?.type);
            this.form.addControl(FormControlKeys.soc_type, socTypeControl);

            if (this.audit?.framework_fields?.type === SocTypes.type2) {
                this.addAuditTimeRange();
            }

            this.subscribeForSocTypeChanges();
        }

        this.form.items[FormControlKeys.audit_date].setValue(new Date(this.audit?.audit_date));
    }

    private subscribeForSocTypeChanges(): void {
        this.form.items[FormControlKeys.soc_type].valueChanges.pipe(this.detacher.takeUntilDetach()).subscribe((valueChanged: string) => {
            if (valueChanged === SocTypes.type2) {
                this.addAuditTimeRange();
            } else {
                this.removeAuditTimeRange();
            }
        });
    }

    private removeAuditTimeRange(): void {
        this.form.removeControl(FormControlKeys.audit_range);
        this.cd.detectChanges();
    }

    private addAuditTimeRange(): void {
        const timeRangeControl = new DynamicFormGroup({
            [FormControlKeys.start_date]: new DatepickerControl({
                initialInputs: {
                    label: this.buildTranslationKey('auditRange'),
                    validateOnDirty: true,
                    placeholder: this.buildTranslationKey('from'),
                    isCustomHeader: false
                },
            }),
            [FormControlKeys.end_date]: new DatepickerControl({
                initialInputs: {
                    validateOnDirty: true,
                    placeholder: this.buildTranslationKey('until'),
                    isCustomHeader: false
                },
            })
        },
            [CustomValidators.dateRangeValidator(FormControlKeys.start_date, FormControlKeys.end_date)],
        );
        timeRangeControl.items[FormControlKeys.start_date].setValue(this.audit?.framework_fields?.range_start);
        timeRangeControl.items[FormControlKeys.end_date].setValue(this.audit?.framework_fields?.range_end);

        this.form.addControl(FormControlKeys.audit_range, timeRangeControl);
        this.cd.detectChanges();
    }
}
