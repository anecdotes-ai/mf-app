import { RoleEnum } from 'core/modules/auth-core/models/domain';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { ControlContextService, ControlsFocusingService, EvidenceCollectionModalService } from 'core/modules/shared-controls/services';
import { ModalWindowService } from 'core/modules/modals';
import { MenuAction, ThreeDotsMenuComponent } from 'core/modules/dropdown-menu';
import {
  LoaderManagerService,
  MessageBusService,
  EvidenceCollectionMessages
} from 'core/services';
import {
  EvidenceSourcesEnum,
  ModalWindowWithSwitcher
} from 'core/models';
import {
  CalculatedControl,
  CalculatedRequirement,
  EvidenceLike,
  NameEntity,
  ResourceType,
  CollectingEvidence
} from 'core/modules/data/models';
import {
  ControlRequirement,
  EvidenceInstance,
  EvidenceTypeEnum,
  Framework,
  Policy,
} from 'core/modules/data/models/domain';
import {
  DataAggregationFacadeService,
  EvidenceFacadeService,
  OperationsTrackerService,
  PoliciesFacadeService,
  TrackOperations,
} from 'core/modules/data/services';
import {
  ChangeApprovalAction,
  ControlRequirementApplicabilityChangeAction,
  DismissRequirementTaskSlackAction,
} from 'core/modules/data/store';
import { SubscriptionDetacher } from 'core/utils';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { ExpandCollapseRequirementAnimations } from '../../expand-collapse-requirement-animations';
import { convertToRequirementLike, RequirementLike } from '../../models';
import { RequirementCustomizationModalService } from '../../modules/customization/requirement/services';
import { CheckSendSlackTaskRequestStatus, SlackModalService } from '../../services/slack-modal/slack-modal.service';
import {
  LinkEntityComponent,
  TicketingModalComponent,
  UploadUrlModalComponent,
} from '../automation';
import { LinkEntityIds, LinkEntityModalInputFields, statusModals } from '../automation/constants';
import { RegularDateFormat } from 'core/constants/date';
import { EvidenceModalService } from 'core/modules/shared-controls/modules/evidence/services';

@Component({
  selector: 'app-control-requirement',
  templateUrl: './control-requirement.component.html',
  styleUrls: ['./control-requirement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: ExpandCollapseRequirementAnimations,
})
export class ControlRequirementComponent implements OnInit, OnChanges, OnDestroy {
  // ** PRIVATE FIELDS **
  private _controlRequirement: CalculatedRequirement;
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private allRequirementEvidence = new Set<string>();
  private userRole: RoleEnum;

  // ** VIEW **
  @ViewChild('slackModal')
  private slackModalTemplate: TemplateRef<any>;

  @ViewChild('threeDotsMenuRef')
  public set threeDotsMenuComponent(comp: ThreeDotsMenuComponent) {
    if (comp) {
      // Set listener for initial threeDotsMenuComponent open, so then we pull for slackModalIsAllowed

      comp.dirty
        .pipe(
          filter((dirty) => !!dirty),
          take(1),
          switchMap(() => {
            return this.slackModalService.isSlackModalAllowedToDisplay().pipe(
              filter((response) => response !== CheckSendSlackTaskRequestStatus.INITIAL_REQUEST),
              // If response is ALLOWED status - returns true, else returns false
              map((response) => response === CheckSendSlackTaskRequestStatus.ALLOWED)
            );
          }),
          this.detacher.takeUntilDetach()
        )
        .subscribe((slackAllowed) => {
          this.slackModalAllowed = slackAllowed;
          this.cd.detectChanges();
        });
    }
  }

  readonly notVisibleForAuditor = [RoleEnum.Admin, RoleEnum.Collaborator, RoleEnum.It, RoleEnum.User];

  @HostBinding('class.ignored')
  private get ignoredRequirement(): boolean {
    return this.controlRequirement && !this.controlRequirement.requirement_applicability;
  }

  // ** INPUTS **

  @Input()
  controlInstance: CalculatedControl;

  @Input()
  set controlRequirement(requirement: CalculatedRequirement) {
    this._controlRequirement = requirement;
    this.requirementLike = convertToRequirementLike(requirement);
  }

  get controlRequirement(): CalculatedRequirement {
    return this._controlRequirement;
  }

  @Input()
  displayedRequirementsAndEvidences: { requirement_id: string; evidence_ids: string[] }[] = [];

  @Input()
  currentFramework?: Framework;

  @Input()
  displayPlaceholders: boolean;

  get isReadonly(): boolean {
    return this.controlInstance?.is_snapshot;
  }

  @Input()
  viewOnly?: boolean;

  // ** FIELDS **

  slackModalAllowed?: boolean;
  expanded = true;
  requirementLike: RequirementLike;

  // Manual upload related properties
  resourceType = ResourceType.Requirement;
  manualUploadResult: boolean;
  isEvidenceUploading: boolean;
  isEvidenceUploadingErrorOccured: boolean;
  manualUploadingPercentage: number;
  displayActionAnimation: boolean;
  resourceTypeEnum = ResourceType;
  dateFormat = RegularDateFormat;

  pluginConnectionButtonsVisibleFor = [RoleEnum.Admin, RoleEnum.User, RoleEnum.Collaborator];

  translationRootKey = 'requirements';
  sources = EvidenceSourcesEnum;
  evidenceExists$: Observable<boolean>;

  threeDotsMenuActions: MenuAction<ControlRequirement>[] = [
    {
      translationKeyFactory: (r) =>
        this.buildTranslationKey(r.requirement_applicability ? 'threeDotsMenu.ignore' : 'threeDotsMenu.markAsRelevant'),
      action: this.toggleApplicability.bind(this),
    },
    {
      translationKeyFactory: (r) => this.buildTranslationKey('threeDotsMenu.edit'),
      action: () =>
        this.requirementCustomizationModalService.openEditRequirementModal(
          this.controlInstance,
          this.controlRequirement,
          this.currentFramework
        ),
    },
    {
      translationKeyFactory: (r) => this.buildTranslationKey('threeDotsMenu.remove'),
      displayCondition: (r) => r.requirement_is_custom,
      action: () => this.remove(),
    },
    {
      translationKey: this.buildTranslationKey('threeDotsMenu.sendSlackTask'),
      displayCondition: (r) => r.requirement_applicability && this.userRole !== RoleEnum.Auditor,
      action: this.openSlackModal.bind(this),
    },
  ];

  attachLinkMethods: {};

  @Input()
  allRequirementsHidden: boolean;

  @Input() set forceExpanded(value: boolean) {
    if (value) {
      this.expanded = value;
    }
  }

  evidence: EvidenceLike[];

  dataToDisplay: { [evidenceId: string]: boolean } = {};

  collectingEvidences: CollectingEvidence[] = [];

  displayedEvidences: string[] = [];

  collectEvidenceMenuActions: MenuAction[] = [
    {
      translationKey: this.buildTranslationKey('collectEvidenceMenu.linkedDocuments'),
      icon: 'linked-files',
      iconColorMode: 'fill',
      action: () => this.openLinkFilesModal(),
    },
    {
      translationKey: this.buildTranslationKey('collectEvidenceMenu.workflow'),
      icon: 'tickets',
      iconColorMode: 'stroke',
      action: () => this.openTicketingModal(),
    },
    {
      translationKey: this.buildTranslationKey('collectEvidenceMenu.evidencePool'),
      icon: 'link-evidence',
      iconColorMode: 'stroke',
      action: () => this.openEvidenceListModal(),
    },
    {
      translationKey: this.buildTranslationKey('collectEvidenceMenu.policy'),
      icon: 'policy',
      iconColorMode: 'stroke',
      action: () => this.openPolicyAttachModal(),
    },
    {
      translationKey: this.buildTranslationKey('collectEvidenceMenu.url'),
      icon: 'url-link',
      iconColorMode: 'stroke',
      action: () => this.openUploadUrlModal(),
    },
    {
      translationKey: this.buildTranslationKey('collectEvidenceMenu.file'),
      icon: 'manual-file',
      iconColorMode: 'fill',
      action: () => this.evidenceCollectionModalService.openFileUploadingModal({
        targetResource: {
          resourceId: this.requirementLike.resourceId,
          resourceType: this.requirementLike.resourceType,
        },
        frameworkId: this.currentFramework.framework_id,
        controlId: this.controlInstance.control_id,
      }),
    },
  ];

  // ** GETTERS **

  get applicableEvidence(): EvidenceLike[] {
    return this.controlRequirement.requirement_related_evidences.filter((e) => e.is_applicable);
  }

  private get getPolicies(): Observable<NameEntity<Policy>[]> {
    return this.policiesFacade.getAllStartedPolicies().pipe(
      map((policies) =>
        policies.filterMap(
          (policy) => !this.controlRequirement.requirement_related_policies_ids.includes(policy.policy_id),
          (policy) => ({ id: policy.policy_id, name: policy.policy_name, entity: policy } as NameEntity<Policy>)
        )
      )
    );
  }

  constructor(
    private modalWindowService: ModalWindowService,
    private operationsTrackerService: OperationsTrackerService,
    private cd: ChangeDetectorRef,
    private store: Store,
    private router: Router,
    private slackModalService: SlackModalService,
    private loaderManagerService: LoaderManagerService,
    private requirementCustomizationModalService: RequirementCustomizationModalService,
    private evidencesFacade: EvidenceFacadeService,
    private policiesFacade: PoliciesFacadeService,
    private messageBus: MessageBusService,
    private controlContext: ControlContextService,
    private evidenceModalService: EvidenceModalService,
    private controlsFocusing: ControlsFocusingService,
    private elementRef: ElementRef<HTMLElement>,
    private dataAggregationFacadeService: DataAggregationFacadeService,
    private evidenceCollectionModalService: EvidenceCollectionModalService
  ) { }

  // **** LIFECYCLE HOOKS ****

  ngOnInit(): void {
    this.evidenceCollectionHandler();
    this.allRequirementEvidence = new Set(this.controlRequirement.requirement_related_evidences?.map((e) => e.id));

    this.controlsFocusing.getSpecificRequirementFocusingStream(this.requirementLike.resourceId).pipe(this.detacher.takeUntilDetach()).subscribe(() => {
      this.elementRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    this.evidenceExists$ = this.dataAggregationFacadeService.getRelevantEvidence(this.currentFramework.framework_id, this.requirementLike.resourceId).pipe(map((evidences) => !!evidences.length));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('controlInstance' in changes || 'controlRequirement' in changes) {
      if (this.controlRequirement?.requirement_related_evidences?.length) {
        this.evidence = this.controlRequirement.requirement_related_evidences;
      } else if (this.displayPlaceholders) {
        this.evidence = new Array(this.controlInstance.control_number_of_total_evidence_collected || 0);
      }
    }

    if (
      'controlRequirement' in changes &&
      !changes.controlRequirement.isFirstChange() &&
      this.controlRequirement?.requirement_related_evidences?.length
    ) {
      this.allRequirementEvidence = this.controlContext.detectNewRequirementEvidence(
        this.controlRequirement,
        this.allRequirementEvidence
      );
    }

    if ('displayedRequirementsAndEvidences' in changes && this.displayedRequirementsAndEvidences) {
      this.displayedEvidences =
        this.displayedRequirementsAndEvidences.find(
          (data) => data.requirement_id === this.controlRequirement.requirement_id
        )?.evidence_ids || [];
    }
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  // **** APPEARANCE ****

  rowClick(evidenceExist: boolean): void {
    if (
      this.controlRequirement.requirement_applicability &&
      evidenceExist
    ) {
      this.expanded = !this.expanded;
      this.cd.detectChanges();
    }
  }

  expandCollapseReqAnimationDone(): void {
    this.displayActionAnimation = false;
    this.cd.detectChanges();
  }

  // **** UPLOAD EVIDENCE LOGIC ****

  uploading(collectingEvidence: CollectingEvidence): void {
    this.collectingEvidences = [...this.collectingEvidences, collectingEvidence];
  }

  uploadDone(collectingEvidence: CollectingEvidence): void {
    const collectingEvidenceIndex = this.collectingEvidences.findIndex(
      (evidence) => evidence.temporaryId === collectingEvidence.temporaryId
    );
    this.collectingEvidences.splice(collectingEvidenceIndex, 1);
    this.cd.detectChanges();
  }

  // **** TRACK BY ****

  trackEvidenceByIds(index: number, obj: EvidenceInstance): any {
    if (obj) {
      return obj.evidence_id;
    }

    return index;
  }

  trackCollectingEvidencesByIds(_, obj: CollectingEvidence): string {
    return obj.evidenceId || obj.temporaryId;
  }

  // **** TRANSLATION ****

  buildTranslationKey(relativeKey: string): string {
    return `${this.translationRootKey}.${relativeKey}`;
  }

  // **** SLACK ****

  dismissSlackTask(): void {
    this.store.dispatch(
      new DismissRequirementTaskSlackAction(this.controlInstance.control_id, this.controlRequirement)
    );
  }

  openSlackModal(): void {
    // We check for 'false' value as we need to handle the case when we recieve 'bad' response
    // Else we show Slack modal when the result 'true' or 'undefined'
    if (this.slackModalAllowed === false) {
      // Do explicit global loader occurrence in case to overlap empty plugin page artifacts.
      this.loaderManagerService.show();
      this.router.navigate(['/plugins/slack']).finally(() => this.loaderManagerService.hide());
    } else {
      this.modalWindowService.open({
        template: this.slackModalTemplate,
      });
    }
  }

  // **** APPROVAL ****

  changeApproval(): void {
    this.store.dispatch(new ChangeApprovalAction(this.controlInstance, this.controlRequirement));

    this.operationsTrackerService
      .getOperationStatus(this.controlRequirement.requirement_id, TrackOperations.CHANGE_REQ_APPROVAL)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe(() => {
        this.cd.detectChanges();
      });
  }

  // **** REQUIREMENT CHANGES ****

  remove(): void {
    this.requirementCustomizationModalService.openRemoveRequirmentConfirmationModal(
      this.controlInstance.control_id,
      this.currentFramework.framework_id,
      this.controlRequirement
    );
  }

  private toggleApplicability(): void {
    this.handleRequirementChange(
      TrackOperations.TOGGLE_REQ_APPLICABILITY,
      () => new ControlRequirementApplicabilityChangeAction(this.controlRequirement)
    );
  }

  private async handleRequirementChange(operationName: string, actionFactory: () => Action): Promise<any> {
    try {
      this.displayActionAnimation = true;
      this.cd.detectChanges();

      const delayedSuccessCheck = this.operationsTrackerService
        .getOperationStatus(this.controlRequirement.requirement_id, operationName)
        .pipe(map((x) => !(x instanceof Error)))
        .toPromise();

      this.store.dispatch(actionFactory());

      if (!(await delayedSuccessCheck)) {
        throw new Error();
      }
    } catch (error) {
      this.displayActionAnimation = false;
    } finally {
      this.cd.detectChanges(); // We need to display some error in that case
    }
  }

  // **** EVIDENCE COLLECTION ****

  private evidenceCollectionHandler(): void {
    this.messageBus
      .getObservable<CollectingEvidence[]>(
        EvidenceCollectionMessages.COLLECTION_STARTED,
        this.requirementLike.resourceId
      )
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((collectingEvidences) => {
        this.collectingEvidences = [...this.collectingEvidences, ...collectingEvidences];
        this.cd.detectChanges();
      });
  }

  tryAgainCollectEvidence(collectingEvidence: CollectingEvidence): void {
    switch (collectingEvidence.evidenceType) {
      case EvidenceTypeEnum.MANUAL:
        this.evidenceCollectionModalService.openFileUploadingModal({ targetResource: { resourceId: this.requirementLike.resourceId, resourceType: this.requirementLike.resourceType } });
        break;
      case EvidenceTypeEnum.URL:
        this.openUploadUrlModal();
        break;
    }
  }

  // **** OPEN EVIDENCE COLLECTION MODALS ****

  private openLinkFilesModal(): void {
    this.evidenceCollectionModalService.openSharedLinkEvidenceCreationModal({
      targetResource: {
        resourceId: this.requirementLike.resourceId,
        resourceType: ResourceType.Requirement,
      },
      serviceIds: this.controlRequirement.services_that_automates,
      entityPath: [this.controlInstance.control_name, this.requirementLike.name],
      frameworkId: this.currentFramework.framework_id,
      controlId: this.controlInstance.control_id,
    });
  }

  private openTicketingModal(): void {
    this.modalWindowService.openInSwitcher({
      componentsToSwitch: [
        {
          id: 'ticketing-modal',
          componentType: TicketingModalComponent,
          contextData: {
            controlInstance: this.controlInstance,
            controlRequirement: this.controlRequirement,
            framework: this.currentFramework,
          },
        },
      ],
    });
  }

  private openUploadUrlModal(): void {
    this.modalWindowService.openInSwitcher({
      componentsToSwitch: [
        {
          id: 'upload-url-modal',
          componentType: UploadUrlModalComponent,
          contextData: {
            controlRequirement: this.controlRequirement,
            controlInstance: this.controlInstance,
            framework: this.currentFramework,
          },
        },
      ],
    });
  }

  private async openEvidenceListModal(): Promise<void> {
    this.evidenceModalService.openEvidenceListComponent(
      this.requirementLike,
      this.currentFramework,
      this.controlInstance
    );
  }

  private openPolicyAttachModal(): void {
    const componentsToSwitch = [
      {
        id: LinkEntityIds.MainModal,
        componentType: LinkEntityComponent,
        contextData: {
          [LinkEntityModalInputFields.parentResourceId]: this.controlRequirement.requirement_id,
          [LinkEntityModalInputFields.cornerTitle]: this.controlRequirement.requirement_name,
          [LinkEntityModalInputFields.icon]: 'link-policy',
          [LinkEntityModalInputFields.linkEntityToParent]: ((entityId) =>
            this.evidencesFacade.attachPolicyToRequirementAsync(
              this.controlRequirement,
              entityId,
              this.controlInstance.control_id,
              this.currentFramework.framework_id
            )).bind(this),
          [LinkEntityModalInputFields.entities]: this.getPolicies,
          [LinkEntityModalInputFields.helpLink]: './policy-manager',
        },
      },
      ...statusModals,
    ];

    const modalWindowSwitcher: ModalWindowWithSwitcher<any> = {
      componentsToSwitch: componentsToSwitch,
      options: {
        closeOnBackgroundClick: false,
      },
      context: { translationKey: 'requirements.linkEntityModal' },
    };

    this.modalWindowService.openInSwitcher(modalWindowSwitcher);
  }
}
