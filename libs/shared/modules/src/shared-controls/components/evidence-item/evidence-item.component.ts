import { EvidenceFromPolicyPreviewService } from './../../services/evidence-from-policy-preview/evidence-from-policy-preview.service';
import { FullFilePreviewModalComponent } from './../preview/full-file-preview-modal/full-file-preview-modal.component';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { EvidenceTypeIconMapping } from 'core/models/evidence-type-icon.mapping';
import { CalculatedControl, EvidenceLike, isRequirement, ResourceType } from 'core/modules/data/models';
import {
  CombinedEvidenceInstance,
  ControlRequirement,
  EvidenceStatusEnum,
  Framework,
} from 'core/modules/data/models/domain';
import {
  EvidenceFacadeService,
  EvidenceService,
  OperationsTrackerService,
  TrackOperations,
} from 'core/modules/data/services';
import { RemoveEvidenceFromResourceAction, RemoveRequirementPolicy } from 'core/modules/data/store/actions';
import { ModalWindowService } from 'core/modules/modals';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';
import { isAnecdotesEvidence } from 'core/utils/userflow';
import { map } from 'rxjs/operators';
import { FileDownloadingHelperService } from 'core/services';
import { EvidenceItemAnimations } from '../../evidence-item-animations';
import { RequirementLike, EvidenceSourcesEnum } from '../../models';
import { TestControlUpdationService } from '../../services/test-control-updation/test-control-updation.service';
import { EvidenceUserEventService } from 'core/modules/data/services/event-tracking/evidence-user-event.service';
import { DateViewTypeEnum } from 'core/modules/shared-controls/constants/dateViewType';
import { ControlsFocusingService } from '../../services';
import { SubscriptionDetacher } from 'core/utils';
import { EvidencePreviewService } from 'core/modules/shared-controls/services/evidence-preview-service/evidence-preview.service';

@Component({
  selector: 'app-evidence-item',
  templateUrl: './evidence-item.component.html',
  styleUrls: ['./evidence-item.component.scss'],
  animations: EvidenceItemAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvidenceItemComponent implements OnInit, OnDestroy, OnChanges {
  private detacher = new SubscriptionDetacher();
  private _evidenceLike: EvidenceLike;
  private _requirementLike: RequirementLike;

  @ViewChild('confirmationModal')
  protected confirmationModalTemplate: TemplateRef<any>;
  @ViewChild('policyConfirmationModal')
  protected policyConfirmationModalTemplate: TemplateRef<any>;
  @ViewChild('ignoreConfirmationModal')
  protected ignoreConfirmationTemplate: TemplateRef<any>;
  @ViewChild('restoreConfirmationModal')
  protected restoreConfirmationTemplate: TemplateRef<any>;

  @HostBinding('class')
  protected get ignoredRequirement(): string {
    return this.evidence &&
      !this.evidence.evidence_is_applicable &&
      this.evidenceSource !== this.evidenceSources.EvidencePool
      ? 'opacity-50 line-through ignored'
      : '';
  }

  @HostBinding('class.preview-opened')
  previewOpened: boolean;

  get isNewStatus(): boolean {
    return this.evidence.evidence_status === EvidenceStatusEnum.NEW;
  }

  get isMitigatedStatus(): boolean {
    return this.evidence.evidence_status === EvidenceStatusEnum.MITIGATED;
  }

  get isInPolicyContext(): boolean {
    return this.requirementLike?.resourceType === ResourceType.Policy;
  }

  get isPolicyEvidence(): boolean {
    return this._evidenceLike?.resourceType === ResourceType.Policy;
  }

  get removeResourceType(): string {
    if (this.isInPolicyContext) {
      return 'document';
    }
    return this._evidenceLike?.resourceType === ResourceType.Policy ? 'policy' : 'evidence';
  }

  get isPolicyPreview(): boolean {
    return this.isInPolicyContext || this.isPolicyEvidence;
  }

  get isReadOnly(): boolean {
    return !!this.evidenceLike?.snapshot_id;
  }

  get evidenceMetadatIcon(): string {
    if (this.isReadOnly && !this.framework.is_snapshot) {
      return 'freeze';
    }
    return '';
  }

  get shouldDisplayHeader(): boolean {
    return this.fullViewMode && this.requirementLike.resourceType === this.resourceTypes.Policy;
  }

  get headerDataToDisplay(): string[] {
    return [this.controlInstance?.control_name, this.controlRequirement?.requirement_name];
  }

  displayActionLoader: boolean;
  evidence: CombinedEvidenceInstance;
  evidenceComply = true;
  eventSources = EvidenceSourcesEnum;
  evidenceSources = EvidenceSourcesEnum;
  dateViewTypes = DateViewTypeEnum;
  resourceTypes = ResourceType;

  @Input()
  evidenceSource: EvidenceSourcesEnum = this.evidenceSources.Controls;

  @Input()
  set forceExpand(isOpen: boolean) {
    if (isOpen) {
      this.previewOpened = true;
    }
  }

  @Input()
  set evidenceLike(evidenceLike: EvidenceLike) {
    this.evidence = evidenceLike.evidence;
    this.evidenceComply = evidenceLike.evidence.evidence_gap === null;
    this.resourceType = evidenceLike.resourceType;
    this.isRemovable = this.evidence.evidence_is_custom || this.resourceType === ResourceType.Policy;
    this._evidenceLike = evidenceLike;
  }

  get evidenceLike(): EvidenceLike {
    return this._evidenceLike;
  }

  @Input()
  set requirementLike(requirementLike: RequirementLike) {
    this._requirementLike = requirementLike;
    if (requirementLike && isRequirement(requirementLike.resource)) {
      this.controlRequirement = requirementLike.resource as ControlRequirement;
    }
  }

  get requirementLike(): RequirementLike {
    return this._requirementLike;
  }

  controlRequirement: ControlRequirement;

  @Input()
  framework: Framework;

  @Input()
  controlInstance: CalculatedControl;

  @HostBinding('class.view-preview-mode')
  @Input()
  viewPreviewMode: boolean;

  @Input()
  fullViewMode: boolean;

  evidenceOnChanging: EventEmitter<boolean> = new EventEmitter<boolean>(true);

  fileTypeMapping: { icon: string };

  isAnecdotesEvidence: boolean;
  resourceType: ResourceType;
  isRemovable: boolean;
  isMitigationMarkClickedBeforeUnhover = false;

  constructor(
    protected modalWindowService: ModalWindowService,
    protected store: Store,
    protected evidenceService: EvidenceService,
    protected operationsTrackerService: OperationsTrackerService,
    protected testControlUpdation: TestControlUpdationService,
    protected fileDownloadingHelperService: FileDownloadingHelperService,
    protected cd: ChangeDetectorRef,
    protected windowHelper: WindowHelperService,
    protected evidenceFacade: EvidenceFacadeService,
    private evidenceEventService: EvidenceUserEventService,
    private controlsFocusing: ControlsFocusingService,
    private elementRef: ElementRef<HTMLElement>,
    private evidencePreviewService: EvidencePreviewService,
    private evidenceFromPolicyPreviewService: EvidenceFromPolicyPreviewService
  ) {}

  ngOnInit(): void {
    this.isAnecdotesEvidence = isAnecdotesEvidence(this.evidence.evidence_id);
    this.controlsFocusing
      .getSpecificEvidenceFocusingStream(this.evidence.evidence_id)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe(() => {
        this.elementRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (('evidence' in changes || 'evidenceLike' in changes) && this.evidence) {
      this.fileTypeMapping = EvidenceTypeIconMapping[this.evidence.evidence_type];
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `evidences.${relativeKey}`;
  }

  async viewDocument(): Promise<void> {
    const response = (await this.evidenceService
      .downloadEvidence(this.evidence.evidence_instance_id)
      .toPromise()) as File;

    const file = new File([response], this.evidence.evidence_name);

    this.modalWindowService.openInSwitcher({
      id: 'full-file-preview-modal',
      context: {
        evidence: this.evidence,
        file: file,
        entityPath: [this.requirementLike?.name],
      },
      componentsToSwitch: [
        {
          id: 'full-file-preview-modal',
          componentType: FullFilePreviewModalComponent,
        },
      ],
    });
  }

  async toggleEvidenceApplicability(): Promise<void> {
    try {
      this.showSecondaryLoader();
      await this.evidenceFacade.updateEvidence(this.evidence);
    } finally {
      this.previewOpened = false;
      this.displayActionLoader = false;
      this.setMitigatedStatusForNewEvidence();
      this.cd.detectChanges();
    }
  }

  async confirmRemoving(): Promise<any> {
    try {
      switch (this.resourceType) {
        case ResourceType.Policy:
          if (this.controlRequirement) {
            await this.handleEvidenceChange(
              TrackOperations.DELETE_POLICY_FROM_REQUIREMENT,
              () => new RemoveRequirementPolicy(this.controlRequirement, this._evidenceLike.id)
            );
          }
          break;
        case ResourceType.Evidence:
          await this.handleEvidenceChange(
            TrackOperations.EVIDENCE_REMOVE_LINK,
            () =>
              new RemoveEvidenceFromResourceAction({
                resourceId: this.requirementLike.resourceId,
                resourceType: this.requirementLike.resourceType,
                evidenceId: this.evidence.evidence_id,
                resource: this.requirementLike.resource,
              })
          );
      }
    } finally {
      this.displayActionLoader = false;

      await this.evidenceEventService.trackEvidenceRemove(
        this.evidence.evidence_id,
        this.evidence.evidence_name,
        this.evidence.evidence_type,
      );
      this.cd.detectChanges();
    }
  }

  remove(): void {
    this.modalWindowService.open({
      template:
        this.evidenceSource === EvidenceSourcesEnum.PolicyManager
          ? this.policyConfirmationModalTemplate
          : this.confirmationModalTemplate,
    });
  }

  async downloadEvidence(): Promise<any> {
    const response = (await this.evidenceService
      .downloadEvidence(this.evidence.evidence_instance_id)
      .toPromise()) as File;

    this.fileDownloadingHelperService.downloadFile(response);
  }

  openLink(): void {
    this.windowHelper.openUrlInNewTab(this.evidence.evidence_url);
  }

  async rowClick(): Promise<void> {
    if (this.isPolicyEvidence && this.evidenceSource === EvidenceSourcesEnum.Controls) {
      this.evidenceFromPolicyPreviewService.openEvidenceFromPolicyPreviewModal({
        eventSource: this.evidenceSource,
        evidenceLike: this.evidenceLike,
        entityPath: [this.controlInstance.control_name, this.controlRequirement.requirement_name],
      });
    }

    if (!this.isPolicyEvidence && this.evidenceSource === EvidenceSourcesEnum.Controls) {
      this.evidencePreviewService.openEvidencePreviewModal({
        eventSource: this.evidenceSource,
        evidence: this.evidence,
        entityPath: [this.controlInstance.control_name, this.controlRequirement.requirement_name],
      });
    }
  }

  ignoreClick(): void {
    this.toggleEvidenceApplicability();
  }

  mitigationMarkClicked(): void {
    this.isMitigationMarkClickedBeforeUnhover = true;
  }

  private async handleEvidenceChange(operationName: string, actionFactory: () => Action): Promise<any> {
    this.showSecondaryLoader();

    const delayedSuccessCheck = this.operationsTrackerService
      .getOperationStatus(this._evidenceLike?.id, operationName)
      .pipe(map((x) => !(x instanceof Error)))
      .toPromise();

    this.store.dispatch(actionFactory());

    if (!(await delayedSuccessCheck) && this.controlInstance) {
      throw new Error();
    }
  }

  private showSecondaryLoader(): void {
    if (!this.displayActionLoader) {
      this.displayActionLoader = true;
      this.cd.detectChanges();
    }
  }

  setMitigatedStatusForNewEvidence(): void {
    if (this.isNewStatus) {
      this.evidenceFacade.setMitigatedStatus(
        this.evidence,
        this.controlRequirement.requirement_id,
        this.controlInstance.control_id,
        this.framework.framework_id
      );
    }
  }
}
