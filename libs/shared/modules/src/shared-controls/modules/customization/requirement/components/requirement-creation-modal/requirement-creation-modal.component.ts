import { SubscriptionDetacher } from 'core/utils/subscription-detacher.class';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Validators } from '@angular/forms';
import { TextAreaControl, TextFieldControl } from 'core/models/form';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { Control, Framework, Requirement } from 'core/modules/data/models/domain';
import { ControlsFacadeService, FrameworksFacadeService, RequirementsFacadeService } from 'core/modules/data/services';
import { DynamicFormGroup } from 'core/modules/dynamic-form';
import { take } from 'rxjs/operators';
import { AddRequirementModalEnum } from '../../models';
import { RequirementCreationSharedContext } from '../../services/requirement-customization-modal-service/requirement-creation-shared-context';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-requirement-creation-modal',
  templateUrl: './requirement-creation-modal.component.html',
  styleUrls: ['./requirement-creation-modal.component.scss'],
})
export class RequirementCreationModalComponent implements OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  isLoading: boolean;
  requirementCreationSharedContext: RequirementCreationSharedContext;

  control: Observable<Control>;
  framework: Observable<Framework>;

  formGroup = new DynamicFormGroup({
    newRequirementName: new TextFieldControl({
      initialInputs: {
        displayCharactersCounter: true,
        validateOnDirty: true,
        required: true,
      },
      validators: [Validators.required],
    }),
    description: new TextAreaControl({
      initialInputs: {
        displayCharactersCounter: true,
        rows: 3,
        resizable: false,
      },
    }),
  });

  constructor(
    private cd: ChangeDetectorRef,
    private requirementsFacade: RequirementsFacadeService,
    private switcher: ComponentSwitcherDirective,
    private controlFacade: ControlsFacadeService,
    private frameworksFacade: FrameworksFacadeService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.switcher.sharedContext$.pipe(this.detacher.takeUntilDetach()).subscribe((context: RequirementCreationSharedContext) => {
      this.control = this.controlFacade.getControl(context.control_id).pipe(this.detacher.takeUntilDetach()) as Observable<Control>;
      this.framework = this.frameworksFacade.getFrameworkById(context.framework_id).pipe(this.detacher.takeUntilDetach()) as Observable<Framework>;
    });
    this.requirementCreationSharedContext = await this.switcher.sharedContext$.pipe(take(1)).toPromise();
    this.formGroup.items.newRequirementName.inputs.label = this.buildTranslationKey('newRequirementForm.newRequirementNameLabel');
    this.formGroup.items.description.inputs.label = this.buildTranslationKey('newRequirementForm.descriptionLabel');
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `${this.requirementCreationSharedContext?.translationKey}.${relativeKey}`;
  }

  switchToSelectExistingView(): void {
    this.switcher.goById(AddRequirementModalEnum.SelectExisting);
  }

  async addNewRequirement(): Promise<void> {
    this.isLoading = true;
    this.cd.detectChanges();

    const requirement: Requirement = {
      requirement_help: this.formGroup.items.description.value,
      requirement_description: this.formGroup.items.newRequirementName.value,
      requirement_related_controls: [this.requirementCreationSharedContext.control_id],
      requirement_related_frameworks: [this.requirementCreationSharedContext.framework_id],
    };

    try {
      await this.requirementsFacade.addNewRequirement(requirement);
      this.switcher.goById(AddRequirementModalEnum.Success);
    } catch {
      this.switcher.goById(AddRequirementModalEnum.Error);
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }
}
