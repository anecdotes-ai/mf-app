import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { PusherMessage } from 'core/models';
import { CollectionResult } from 'core/models/collection-result.model';
import { AccountFeaturesService, ExclusiveFeatureModalService } from 'core/modules/account-features/services';
import { CustomItemModel, ItemSharedContext } from 'core/modules/customization/models';
import { CustomizationModalService } from 'core/modules/customization/services';
import { CalculatedPolicy, convertToEvidenceLike, ResourceType } from 'core/modules/data/models';
import { AccountFeatureEnum, ControlRequirement, EvidenceInstance } from 'core/modules/data/models/domain';
import { PoliciesFacadeService } from 'core/modules/data/services';
import { MenuAction } from 'core/modules/dropdown-menu';
import { ModalWindowService } from 'core/modules/modals';
import { EvidenceCollectionModalService, ExpandCollapseRequirementAnimations } from 'core/modules/shared-controls';
import { AttachLinkFunctions } from 'core/modules/shared-controls/components/automation/models';
import { RequirementLikeComponent } from 'core/modules/shared-controls/components/requirement-like/requirement-like.component';
import { convertToRequirementLike, RequirementLike } from 'core/modules/shared-controls/models';
import { PolicyModalService } from 'core/modules/shared-policies/services';
import { SubscriptionDetacher } from 'core/utils';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { PolicyManagerEventService } from 'core/services/policy-manager-event-service/policy-manager-event.service';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: ExpandCollapseRequirementAnimations,
})
export class PolicyComponent implements OnInit {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private attachLinkFunctions: AttachLinkFunctions = {
    wasEvidenceAddedToResource: this.wasEvidenceAddedToPolicy.bind(this),
    filterCollectionResult: this.filterCollectionResult.bind(this),
  };

  @Input() policy: CalculatedPolicy;
  @Input() expanded: boolean;
  @Input() isNewlyAdded: boolean;

  @Output()
  toggled = new BehaviorSubject<boolean>(false);
  @Output()
  expandedChanged = new EventEmitter<boolean>();

  @ViewChild(RequirementLikeComponent)
  resourceComponent: RequirementLikeComponent;

  translationRootKey = 'policyManager.policy';

  displayActionAnimation: boolean;
  displayPolicyStatusLoadingAction = false;

  dateFormat = 'MMM d, yyyy | HH:mm:ss';

  threeDotsMenuActions: MenuAction<ControlRequirement>[];

  evidence: EvidenceInstance[];

  requirementLike: RequirementLike;
  resourceType = ResourceType.Policy;

  private disableTemplateDownload: boolean;

  collectEvidenceMenuActions: MenuAction[] = [
    {
      translationKey: this.buildTranslationKey('linkElementBtn'),
      icon: 'automated_evidence',
      action: () => this.openLinkFilesModal(),
    },
    {
      translationKey: this.buildTranslationKey('uploadFile'),
      icon: 'upload-manual',
      action: () => this.evidenceCollectionModalService.openFileUploadingModal({ targetResource: { resourceId: this.requirementLike.resourceId, resourceType: this.requirementLike.resourceType } }),
    },
  ];

  constructor(
    private modalWindowService: ModalWindowService,
    private policiesFacade: PoliciesFacadeService,
    private customizationService: CustomizationModalService,
    private policyModalService: PolicyModalService,
    private exclusiveModel: ExclusiveFeatureModalService,
    private accountFeaturesService: AccountFeaturesService,
    private policyManagerEventService: PolicyManagerEventService,
    private evidenceCollectionModalService: EvidenceCollectionModalService
  ) {}

  ngOnInit(): void {
    this.initThreeDotMenu();
    this.buildRequirementLike();
    this.accountFeaturesService
      .doesAccountHaveFeature(AccountFeatureEnum.PolicyTemplates)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((hasFeature) => (this.disableTemplateDownload = !hasFeature));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('policy' in changes && !changes.policy.isFirstChange()) {
      this.refreshRequirementPolicy();
      this.initThreeDotMenu();
      this.buildRequirementLike();
    }
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  trackEvidenceByIds(index: number, evidence: EvidenceInstance): any {
    return evidence ? evidence.evidence_id : index;
  }

  buildTranslationKey(relativeKey: string): string {
    return `${this.translationRootKey}.${relativeKey}`;
  }

  update(updatedPolicy: CustomItemModel): Promise<any> {
    return this.policiesFacade.editCustomPolicy(this.policy.policy_id, updatedPolicy);
  }

  downloadTemplate(): void {
    this.policyManagerEventService.trackDownloadPolicyTemplateEvent(this.policy);
    this.disableTemplateDownload
      ? this.exclusiveModel.openExclusiveFeatureModal(AccountFeatureEnum.PolicyTemplates)
      : this.policiesFacade.downloadPolicyTemplate(this.policy);
  }

  openLinkFilesModal(): void {
    this.evidenceCollectionModalService.openSharedLinkEvidenceCreationModal({
      targetResource: {
        resourceId: this.requirementLike.resourceId,
        resourceType: ResourceType.Policy,
      },
      entityPath: [this.requirementLike.name]
    });
  }

  openRemovePolicyModal(): void {
    this.customizationService.openRemoveItemConfirmation(this.translationRootKey, () => {
      return this.policiesFacade.removePolicy(this.policy);
    });
  }

  statusClicked(): void {
    this.policyModalService.addPolicySettingsModal({ policyId: this.policy.policy_id });
  }

  private buildRequirementLike(): void {
    this.requirementLike = {
      ...convertToRequirementLike(this.policy),
      translationRootKey: this.translationRootKey,
      threeDotsMenuActions: this.threeDotsMenuActions,
    };
  }

  private refreshRequirementPolicy(): void {
    const lastEditTime = this.policy.policy_last_edit_time || 0;
    this.requirementLike = {
      ...this.requirementLike,
      name: this.policy.policy_name,
      type: this.policy.policy_type,
      description: this.policy.policy_description,
      isCustom: this.policy.policy_is_custom,
      lastEditTime: lastEditTime,
      addedBy: this.policy.policy_edited_by,
      evidence: this.policy.evidence ? [convertToEvidenceLike(this.policy.evidence)] : [],
      resource: this.policy,
    };
  }

  private initThreeDotMenu(): void {
    const editContext: ItemSharedContext = {
      item: {
        name: this.policy.policy_name,
        type: this.policy.policy_type,
        description: this.policy.policy_description,
        status: this.policy.status,
      },
      translationKey: this.buildTranslationKey('editPolicyModal'),
      submitAction: this.update.bind(this),
    };

    this.threeDotsMenuActions = [
      {
        translationKeyFactory: (r) => this.buildTranslationKey('threeDotsMenu.edit'),
        action: () => this.customizationService.openEditPolicyModal(editContext),
      },
      {
        translationKeyFactory: (r) => this.buildTranslationKey('threeDotsMenu.remove'),
        action: () => this.openRemovePolicyModal(),
      },
    ];
  }

  private filterCollectionResult(msg: PusherMessage<CollectionResult>): boolean {
    return msg.message_object.collected_evidence_ids.includes(this.policy.policy_related_evidence);
  }

  private async wasEvidenceAddedToPolicy(): Promise<boolean> {
    const updatedPolicy = await this.policiesFacade.getPolicy(this.policy.policy_id).pipe(take(1)).toPromise();

    return !!updatedPolicy.evidence;
  }
}
