import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { MessageBusService, EvidenceCollectionMessages } from 'core/services';
import { ResourceType, CollectingEvidence } from 'core/modules/data/models';
import { EvidenceTypeEnum } from 'core/modules/data/models/domain';
import { SubscriptionDetacher } from 'core/utils';
import { EvidenceCollectionModalService, ExpandCollapseRequirementAnimations } from 'core/modules/shared-controls';
import { RequirementLike, EvidenceSourcesEnum } from '../../models';

@Component({
  selector: 'app-requirement-like',
  templateUrl: './requirement-like.component.html',
  styleUrls: ['./requirement-like.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: ExpandCollapseRequirementAnimations,
})
export class RequirementLikeComponent implements OnInit, OnChanges, OnDestroy {
  protected detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @Input() requirementLike: RequirementLike;
  @Input() viewPreviewMode: boolean;
  @Input() actionBtnTemplate: TemplateRef<any>;
  @Input() noEvidenceTemplate: TemplateRef<any>;
  @Input() isNewlyAdded: boolean;
  @Input() expanded = true;
  @Input() expandFully = true;

  source = EvidenceSourcesEnum;

  collectingEvidences: CollectingEvidence[] = [];

  @Output() expandChanged = new EventEmitter<boolean>();

  // expand
  childrenExpanded = false;
  expandable = true;

  menuContext: any;

  // Manual upload related properties
  manualUploadResult: boolean;
  isEvidenceUploading = false;
  isEvidenceUploadingErrorOccured: boolean;
  manualUploadingPercentage: number;
  displayActionAnimation: boolean;
  displayRequirementStatusLoadingAction = false;
  resourceType = ResourceType.Policy;

  dateFormat = 'MMM d, yyyy | HH:mm:ss';
  sources = EvidenceSourcesEnum;

  constructor(private cd: ChangeDetectorRef, private messageBus: MessageBusService, private evidenceCollectionModalService: EvidenceCollectionModalService) {}

  ngOnInit(): void {
    this.evidenceCollectionHandler();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.expandable =
      this.requirementLike?.isEnabled &&
      !!(this.noEvidenceTemplate || this.requirementLike.evidence.length || this.isEvidenceUploading);
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  rowClick(_: MouseEvent): void {
    if (this.expandable) {
      this.expanded = !this.expanded;
      if (this.expandFully) {
        this.childrenExpanded = this.expanded;
      }
      this.expandChanged.emit(this.expanded);
      this.cd.detectChanges();
    }
  }

  expandCollapseReqAnimationDone(): void {
    this.displayActionAnimation = false;
    this.cd.detectChanges();
  }

  buildTranslationKey(relativeKey: string): string {
    return `${this.requirementLike.translationRootKey}.${relativeKey}`;
  }

  tryAgainCollectEvidence(collectingEvidence: CollectingEvidence): void {
    switch (collectingEvidence.evidenceType) {
      case EvidenceTypeEnum.MANUAL:
        this.uploadManually();
        break;
      case EvidenceTypeEnum.URL:
        // TODO: should be implemented when we will start using requirement-like in req as well
        break;
    }
  }

  uploading(collectingEvidence: CollectingEvidence): void {
    this.isEvidenceUploading = true;
    this.collectingEvidences = [...this.collectingEvidences, collectingEvidence];
    this.expandable = this.requirementLike?.isEnabled;
  }

  uploadDone(collectingEvidence: CollectingEvidence): void {
    this.isEvidenceUploading = false;
    const collectingEvidenceIndex = this.collectingEvidences.findIndex(
      (evidence) => evidence.temporaryId === collectingEvidence.temporaryId
    );
    const tempEvidences = [...this.collectingEvidences];
    tempEvidences.splice(collectingEvidenceIndex, 1);
    this.collectingEvidences = tempEvidences;
    this.cd.detectChanges();
  }

  uploadManually(): void {
    this.evidenceCollectionModalService.openFileUploadingModal({ targetResource: { resourceId: this.requirementLike.resourceId, resourceType: this.requirementLike.resourceType } });
  }

  private evidenceCollectionHandler(): void {
    this.messageBus
      .getObservable<CollectingEvidence[]>(
        EvidenceCollectionMessages.COLLECTION_STARTED,
        this.requirementLike.resourceId
      )
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((collectingEvidences) => {
        this.collectingEvidences.push(...collectingEvidences);
        this.expand();
      });
  }

  private expand(): void {
    this.expandable = true;
    this.expanded = true;
    this.expandChanged.emit(this.expanded);
    this.cd.detectChanges();
  }
}
