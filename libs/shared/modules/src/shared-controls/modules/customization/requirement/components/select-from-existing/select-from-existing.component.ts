import { AddRequirementSharedContextTranslationKey } from './../../services/models/translation-key.constant';
import { SubscriptionDetacher } from 'core/utils/subscription-detacher.class';
import { FrameworksFacadeService } from 'core/modules/data/services/facades/frameworks-facade/frameworks-facade.service';
import { ControlsFacadeService } from 'core/modules/data/services/facades/controls-facade/controls-facade.service';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Validators } from '@angular/forms';
import { DropdownControl } from 'core/models/form';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { Control, ControlRequirement, Framework, Requirement } from 'core/modules/data/models/domain';
import { RequirementsFacadeService } from 'core/modules/data/services';
import { DynamicFormGroup } from 'core/modules/dynamic-form';
import { filter, map, take } from 'rxjs/operators';
import { AddRequirementModalEnum } from '../../models/modal-ids.constants';
import { RequirementCreationSharedContext } from '../../services/requirement-customization-modal-service/requirement-creation-shared-context';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-select-from-existing',
  templateUrl: './select-from-existing.component.html',
  styleUrls: ['./select-from-existing.component.scss'],
})
export class SelectFromExistingComponent implements OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  isLoading: boolean;
  requirementCreationSharedContext: RequirementCreationSharedContext;

  control: Observable<Control>;
  framework: Observable<Framework>;

  formGroup = new DynamicFormGroup({
    requirement: new DropdownControl({
      initialInputs: {
        data: [],
        searchEnabled: true,
        displayValueSelector: (c: ControlRequirement) => c.requirement_name,
      },
      validators: [Validators.required],
    }),
  });

  constructor(
    private cd: ChangeDetectorRef,
    private requirementsFacade: RequirementsFacadeService,
    private controlFacade: ControlsFacadeService,
    private frameworksFacade: FrameworksFacadeService,
    private switcher: ComponentSwitcherDirective
  ) {}

  async ngOnInit(): Promise<void> {
    this.switcher.sharedContext$.pipe(this.detacher.takeUntilDetach()).subscribe((context: RequirementCreationSharedContext) => {
      this.control = this.controlFacade.getControl(context.control_id).pipe(filter((control) => !!control));
      this.framework = this.frameworksFacade.getFrameworkById(context.framework_id);
      this.requirementCreationSharedContext = context;
    });

    // Provide correct translation key to shared context usually. It is an adhoc by improving add custom control with new flow.
    this.switcher.changeContext({...this.requirementCreationSharedContext, translationKey: AddRequirementSharedContextTranslationKey } as RequirementCreationSharedContext);
    this.formGroup.items.requirement.inputs.titleTranslationKey = this.buildTranslationKey('newRequirementForm.selectRequirementLabel'),
    this.formGroup.items.requirement.inputs.searchFieldPlaceholder = this.buildTranslationKey('newRequirementForm.search'),
    this.formGroup.items.requirement.inputs.placeholderTranslationKey = this.buildTranslationKey('newRequirementForm.selectRequirement'),
    this.formGroup.items.requirement.inputs.data = await this.requirementsFacade
      .getRequirements()
      .pipe(map(requirements => requirements.filter(req => !!req.requirement_name)),take(1))
      .toPromise();
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  async addExistingRequirement(): Promise<void> {
    this.isLoading = true;
    this.cd.detectChanges();
    const selectedRequirement: ControlRequirement = this.formGroup.items.requirement.value;

    const requirement: Requirement = {
      requirement_id: selectedRequirement.requirement_id,
      requirement_related_controls: [this.requirementCreationSharedContext.control_id],
      requirement_related_frameworks: [this.requirementCreationSharedContext.framework_id],
    };

    try {
      await this.requirementsFacade.addExistingRequirement(requirement);
      this.switcher.goById(AddRequirementModalEnum.Success);
    } catch (e) {
      this.switcher.goById(AddRequirementModalEnum.Error);
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `${this.requirementCreationSharedContext?.translationKey}.${relativeKey}`;
  }

  switchToCreateNewView(): void {
    this.switcher.goById(AddRequirementModalEnum.AddNew);
  }
}
