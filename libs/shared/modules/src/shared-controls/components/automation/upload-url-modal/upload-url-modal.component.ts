import { Component, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  TextFieldControl,
} from 'core/models';
import {
  EvidenceCollectionMessages,
  MessageBusService,
} from 'core/services';
import { ModalWindowService } from 'core/modules/modals';
import { ControlRequirement, EvidenceInstance, EvidenceTypeEnum, Framework } from 'core/modules/data/models/domain';
import { EvidenceFacadeService, RequirementService } from 'core/modules/data/services';
import { CustomValidators, DynamicFormGroup } from 'core/modules/dynamic-form';
import { BehaviorSubject } from 'rxjs';
import { filter, take, timeout } from 'rxjs/operators';
import { CalculatedControl, CollectingEvidence } from 'core/modules/data/models';
import { MANUAL } from 'core/modules/data/constants';

const urlPlaceholder = 'https://www.example.com';

const updateServiceRequestTimeout = 120000; // 120 seconds

export const UploadUrlModalComponentInputFields = {
  controlRequirement: 'controlRequirement',
  isEditMode: 'isEditMode',
  evidence: 'evidence',
  controlInstance: 'controlInstance',
  framework: 'framework',
};

@Component({
  selector: 'app-upload-url-modal',
  templateUrl: './upload-url-modal.component.html',
  styleUrls: ['./upload-url-modal.component.scss'],
})
export class UploadUrlModalComponent {
  @Input(UploadUrlModalComponentInputFields.controlRequirement)
  controlRequirement: ControlRequirement;

  @Input(UploadUrlModalComponentInputFields.isEditMode)
  isEditMode: boolean;

  @Input(UploadUrlModalComponentInputFields.evidence)
  evidence: EvidenceInstance;

  @Input(UploadUrlModalComponentInputFields.controlInstance)
  controlInstance: CalculatedControl;

  @Input(UploadUrlModalComponentInputFields.framework)
  framework: Framework;

  form = new DynamicFormGroup({
    url: new TextFieldControl({
      initialInputs: {
        required: true,
        label: this.buildTranslationKey('form.url.label'),
        placeholder: urlPlaceholder,
        validateOnDirty: true
      },
      validators: [Validators.required, CustomValidators.url],
    }),
    evidenceName: new TextFieldControl({
      initialInputs: {
        required: true,
        label: this.buildTranslationKey('form.evidenceName.label'),
        validateOnDirty: true
      },
      validators: [Validators.required],
    }),
  });

  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private messageBusService: MessageBusService,
    private modalWindowService: ModalWindowService,
    private requirementService: RequirementService,
    private evidencesFacade: EvidenceFacadeService
  ) {}

  ngOnInit(): void {
    if (this.isEditMode) {
      this.form.setValue({ url: this.evidence.evidence_url, evidenceName: this.evidence.evidence_name });
    }
  }

  async updateUrl(): Promise<void> {
    this.isLoading$.next(true);

    try {
      await this.requirementService
        .updateRequirementUrlEvidence(
          this.controlRequirement.requirement_id,
          this.evidence.evidence_id,
          this.form.get('url').value,
          this.form.get('evidenceName').value
        )
        .pipe(take(1))
        .toPromise();

      await this.evidencesFacade
        .getEvidence(this.evidence.evidence_id)
        .pipe(
          filter(
            (evidence) =>
              evidence?.evidence_name === this.form.get('evidenceName').value &&
              evidence?.evidence_url === this.form.get('url').value
          ),
          timeout(updateServiceRequestTimeout),
          take(1)
        )
        .toPromise();

      this.modalWindowService.close();
    } finally {
      this.isLoading$.next(false);
    }
  }

  async addUrl(): Promise<void> {
    this.isLoading$.next(true);
    try {
      const evidenceIds = await this.evidencesFacade.createRequirementUrlEvidenceAsync(
        this.form.get('url').value,
        this.controlRequirement.requirement_id,
        this.form.get('evidenceName').value,
        this.controlInstance.control_id,
        this.framework.framework_id
      );

      const collectingEvidences = evidenceIds.map((evidenceId) => ({
        evidenceId,
        serviceId: MANUAL,
        evidenceType: EvidenceTypeEnum.URL,
      }));

      this.messageBusService.sendMessage<CollectingEvidence[]>(
        EvidenceCollectionMessages.COLLECTION_STARTED,
        collectingEvidences,
        this.controlRequirement.requirement_id
      );

      this.modalWindowService.close();
    } finally {
      this.isLoading$.next(false);
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `uploadUrlModal.${relativeKey}`;
  }
}
