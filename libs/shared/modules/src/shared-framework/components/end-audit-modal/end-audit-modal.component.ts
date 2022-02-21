import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppRoutes } from 'core/constants';
import { TextFieldControl, TipTypeEnum } from 'core/models';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { Framework } from 'core/modules/data/models/domain';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { CustomValidators, DynamicFormGroup } from 'core/modules/dynamic-form';

export const enum EndAuditModalEnum {
    EndAudit = 'End-audit',
    Success = 'Success-item',
    Error = 'Error-item',
}

const END_AUDIT_CONTROL = 'endAudit';
const END_AUDIT_TEXT = 'END AUDIT';

@Component({
    selector: 'app-end-audit-modal',
    templateUrl: './end-audit-modal.component.html',
    styleUrls: ['./end-audit-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndAuditModal {
    @Input('framework')
    framework: Framework;

    @Input('onAuditEnded')
    onAuditEnded: (boolean) => Promise<void>;

    form = new DynamicFormGroup({
        [END_AUDIT_CONTROL]: new TextFieldControl({
            initialInputs: {
                validateOnDirty: true,
                required: true,
            },
            validators: [Validators.required, CustomValidators.exactMatchValidator(END_AUDIT_TEXT)],
        })
    });
    isLoading: boolean;
    tipTypes = TipTypeEnum;

    constructor(
        private cd: ChangeDetectorRef,
        private switcher: ComponentSwitcherDirective,
        private frameworksFacade: FrameworksFacadeService,
        private router: Router) { }

    buildTranslationKey(relativeKey: string): string {
        return `frameworks.frameworkManager.endAuditModal.${relativeKey}`;
    }

    async endAudit(): Promise<void> {
        this.isLoading = true;
        try {
            await this.frameworksFacade.endFrameworkAudit(this.framework);
            await this.switcher.goById(EndAuditModalEnum.Success);
            this.router.navigate([`/${AppRoutes.Frameworks}/${this.framework.framework_name}/${AppRoutes.FrameworkAuditHistory}`]);
        } catch (e) {
            this.switcher.goById(EndAuditModalEnum.Error);
        } finally {
            this.isLoading = false;
            this.cd.detectChanges();

           this.onAuditEnded(this.switcher?.currentComponent?.id === EndAuditModalEnum.Success);
        }
    }
}
