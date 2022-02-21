import { EditRequirementModalEnum } from '../../models';
import { RequirementsFacadeService } from 'core/modules/data/services';
import { DynamicFormGroup } from 'core/modules/dynamic-form';
import { RequirementEditSharedContext } from './../../services/requirement-customization-modal-service/requirement-edit-shared-context';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { Control, ControlRequirement, Framework } from 'core/modules/data/models/domain';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import { Validators } from '@angular/forms';
import { TextFieldControl, TextAreaControl } from 'core/models';
import { ModalWindowService } from 'core/modules/modals';
import { Subject } from 'rxjs';

export const translationRootKey = 'requirements.editRequirementModal';

@Component({
  selector: 'app-requirement-edit-modal',
  templateUrl: './requirement-edit-modal.component.html',
  styleUrls: ['./requirement-edit-modal.component.scss'],
})
export class RequirementEditModalComponent implements OnInit {
  constructor(
    private switcher: ComponentSwitcherDirective,
    private modalWindowService: ModalWindowService,
    private cd: ChangeDetectorRef,
    private requirementFacade: RequirementsFacadeService
  ) {}

  controlInstance: Control;

  controlRequirement: ControlRequirement;

  currentFramework: Framework;

  formGroup: DynamicFormGroup<any>;

  sendingRequestBtnLoader$: Subject<boolean> = new Subject();

  async ngOnInit(): Promise<void> {
    await this.getSwitcherContextData();
    this.createEditRequirementDynamicForm();
    this.cd.detectChanges();
  }

  close(): void {
    this.modalWindowService.close();
  }

  async updateFormBtnClick(): Promise<void> {
    this.sendingRequestBtnLoader$.next(true);
    const updatedRequirement = {
      ...this.controlRequirement,
      requirement_name: this.formGroup.controls['newRequirementName'].value,
      requirement_help: this.formGroup.controls['description'].value
    };

    try {
      await this.requirementFacade.updateRequirement(updatedRequirement, this.controlInstance.control_id, this.currentFramework.framework_id);
      this.switcher.goById(EditRequirementModalEnum.SuccessModal);
    } catch (e) {
      this.switcher.goById(EditRequirementModalEnum.ErrorModal);
    } finally {
      this.sendingRequestBtnLoader$.next(false);
    }
  }

  buildTranslationKey(partialKey: string): string {
    return `${translationRootKey}.${partialKey}`;
  }

  private async getSwitcherContextData(): Promise<void> {
    const { control, requirement, framework }: RequirementEditSharedContext = await this.switcher.sharedContext$
      .pipe(
        filter((c) => !!c),
        take(1)
      )
      .toPromise();

    this.controlInstance = control;
    this.controlRequirement = requirement;
    this.currentFramework = framework;
  }

  private async createEditRequirementDynamicForm(): Promise<void> {
    this.formGroup = new DynamicFormGroup({
      newRequirementName: new TextFieldControl({
        initialInputs: {
          label: this.buildTranslationKey('requirementNameLabel'),
          displayCharactersCounter: true,
          required: true,
        },
        initialValue: this.controlRequirement.requirement_name,
        validators: [Validators.required],
      }),
      description: new TextAreaControl({
        initialInputs: {
          label: this.buildTranslationKey('descriptionLabel'),
          displayCharactersCounter: true,
          rows: 3,
          resizable: false,
        },
        initialValue: this.controlRequirement.requirement_help,
      }),
    });
  }
}
