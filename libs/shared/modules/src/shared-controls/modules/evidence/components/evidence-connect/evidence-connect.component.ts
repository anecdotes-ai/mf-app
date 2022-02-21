import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CalculatedControl, CalculatedRequirement, EvidenceLike } from 'core/modules/data/models';
import { DynamicFormGroup } from 'core/modules/dynamic-form';
import { DropdownControl } from 'core/models';
import { ControlsFacadeService, DataAggregationFacadeService, FrameworksFacadeService, RequirementsFacadeService } from 'core/modules/data/services';
import { Validators } from '@angular/forms';
import { SubscriptionDetacher } from 'core/utils';
import { ModalWindowService } from 'core/modules/modals';
import { ControlsNavigator } from '../../../../services';
import { Framework } from 'core/modules/data/models/domain';

export interface ConnectEvidenceHeader {
  titleText?: string;
  icon?: string;
}

@Component({
  selector: 'app-evidence-connect',
  templateUrl: './evidence-connect.component.html',
  styleUrls: ['./evidence-connect.component.scss'],
})
export class EvidenceConnectComponent implements OnInit, OnChanges {
  private translationKey = 'connectEvidenceModal';
  private frameworksList: Framework[];
  private controlsList: CalculatedControl[];
  private requirementsList: CalculatedRequirement[];
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private requirementToUpdate: CalculatedRequirement = {};
  private selectedFramework: Framework;
  private selectedControl: CalculatedControl;
  private selectedRequirement: CalculatedRequirement;

  @Input() evidenceLike: EvidenceLike;
  connectEvidenceHeader: ConnectEvidenceHeader = {};
  isFormInvalid = true;
  isRequirementUpdating = false;
  isRequirementUpdated = false;
  form: DynamicFormGroup<{
    framework: DropdownControl;
    requirement: DropdownControl;
    control: DropdownControl;
  }>;

  constructor(
    private controlsFacade: ControlsFacadeService,
    private requirementsFacade: RequirementsFacadeService,
    private cd: ChangeDetectorRef,
    private modalWindowService: ModalWindowService,
    private controlsNavigator: ControlsNavigator,
    private dataAggregationService: DataAggregationFacadeService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('evidenceLike' in changes && this.evidenceLike) {
      this.connectEvidenceHeader = {
        titleText: `${this.evidenceLike.name}`,
      };
    }
  }

  ngOnInit(): void {
    this.getFrameworks();
    this.dynamicFormSetup();
    this.cd.detectChanges();
    this.formChangesListenerSetup();
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(key: string): string {
    return `${this.translationKey}.${key}`;
  }

  async updateRequirement(): Promise<void> {
    this.isRequirementUpdating = true;
    await this.updateRequirementWithNewEvidence();
    this.isRequirementUpdating = false;
    this.isRequirementUpdated = true;
    this.cd.detectChanges();
  }

  gotIt(): void {
    this.modalWindowService.close();
  }

  viewRequirement(): void {
    this.modalWindowService.close();
    this.controlsNavigator.navigateToRequirementAsync(
      this.selectedControl.control_id,
      this.selectedRequirement.requirement_id
    );
  }

  private dynamicFormSetup(): void {
    this.form = new DynamicFormGroup({
      framework: new DropdownControl({
        initialInputs: {
          titleTranslationKey: this.buildTranslationKey('form.framework.placeholder'),
          data: [],
          searchEnabled: false,
          displayValueSelector: (framework: Framework) => framework.framework_name,
          searchFieldPlaceholder: this.buildTranslationKey('form.framework.searchField'),
          placeholderTranslationKey: this.buildTranslationKey('form.framework.placeholder'),
        },
        validators: [Validators.required],
      }),
      control: new DropdownControl({
        initialInputs: {
          titleTranslationKey: this.buildTranslationKey('form.control.placeholder'),
          data: [],
          searchEnabled: false,
          displayValueSelector: (control: CalculatedControl) => control.control_name,
          searchFieldPlaceholder: this.buildTranslationKey('form.control.searchField'),
          placeholderTranslationKey: this.buildTranslationKey('form.control.placeholder'),
          disableValueSelector: (control: CalculatedControl) => control.is_snapshot,
        },
        validators: [Validators.required],
      }),
      requirement: new DropdownControl({
        initialInputs: {
          titleTranslationKey: this.buildTranslationKey('form.requirement.placeholder'),
          data: [],
          searchEnabled: false,
          displayValueSelector: (requirement: CalculatedRequirement) => requirement.requirement_name,
          searchFieldPlaceholder: this.buildTranslationKey('form.requirement.searchField'),
          placeholderTranslationKey: this.buildTranslationKey('form.requirement.placeholder'),
        },
        validators: [Validators.required],
      }),
    });
    this.form.items.framework.enable();
    this.form.items.control.disable();
    this.form.items.requirement.disable();
    this.form.items.framework.inputs.data = this.frameworksList;
  }

  private formChangesListenerSetup(): void {
    this.form.items.framework.valueChanges.pipe(this.detacher.takeUntilDetach()).subscribe((framework) => {
      this.selectedFramework = framework;
      this.getControlsByFramework(framework);
      this.form.items.control.inputs.data = this.controlsList;
      this.form.items.control.reset();
      this.form.items.control.enable();
      this.form.items.requirement.reset();
    });
    this.form.items.control.valueChanges.pipe(this.detacher.takeUntilDetach()).subscribe((control) => {
      if (!!control) {
        this.selectedControl = control;
        this.getRequirementsByControl(this.form.items.control.value);
        this.form.items.requirement.inputs.data = this.requirementsList;
        this.form.items.requirement.reset();
        this.form.items.requirement.enable();
      }
    });
    this.form.items.requirement.valueChanges.pipe(this.detacher.takeUntilDetach()).subscribe((requirement) => {
      if (!!requirement) {
        this.selectedRequirement = requirement;
        this.isFormInvalid = false;
        this.requirementToUpdate = this.form.items.requirement.value;
      }
    });
  }

  private getFrameworks(): void {
    this.dataAggregationService.getPluginRelatedFrameworks(this.evidenceLike.service_id)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((frameworks) => {
        this.frameworksList = frameworks.filter((framework) => framework.is_applicable);
      });
  }

  private getControlsByFramework(framework: Framework): void {
    this.controlsFacade
      .getControlsByFrameworkId(framework.framework_id)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((controls) => {
        this.controlsList = controls;
      });
  }

  private getRequirementsByControl(control: CalculatedControl): void {
    this.requirementsList = control.control_calculated_requirements;
  }

  private async updateRequirementWithNewEvidence(): Promise<void> {
    await this.requirementsFacade.linkEvidenceAsync(
      this.requirementToUpdate.requirement_id,
      this.evidenceLike.id,
      true,
      this.selectedControl.control_id,
      this.selectedFramework.framework_id
    );
  }
}
