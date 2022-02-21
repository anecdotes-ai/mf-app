import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import {
  CalculatedControl,
  CalculatedRequirement,
  EvidenceLike,
  ResourceType,
  CollectingEvidence
} from 'core/modules/data/models';
import { Framework } from 'core/modules/data/models/domain';
import { DataAggregationFacadeService } from 'core/modules/data/services/facades';
import { ControlContextService } from 'core/modules/shared-controls';
import { ExpandCollapseRequirementAnimations } from '../../expand-collapse-requirement-animations';
import { EvidenceSourcesEnum, RequirementLike } from 'core/modules/shared-controls/models';
import { SubscriptionDetacher } from 'core/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

@Component({
  selector: 'app-evidences-list',
  templateUrl: './evidences-list.component.html',
  styleUrls: ['./evidences-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: ExpandCollapseRequirementAnimations,
})
export class EvidencesListComponent implements OnInit, OnChanges, OnDestroy {
  private detacher = new SubscriptionDetacher();
  private displayedEvidenceIds = new Set<string>();
  private dataToDisplay: Set<string>;
  private newEvidenceIds: Set<string>;
  private _requirementLike: RequirementLike;
  private requirementLikeSubject = new BehaviorSubject<RequirementLike>(null);
  private applicableEvidence: EvidenceLike[] = [];

  @Input()
  framework: Framework;
  @Input()
  forceExpand: boolean;
  @Input()
  viewPreviewMode: boolean;
  @Input()
  controlInstance: CalculatedControl;
  @Input()
  controlRequirement: CalculatedRequirement;

  @Input()
  collectionStarted = new EventEmitter(true);

  @Input()
  source: EvidenceSourcesEnum = EvidenceSourcesEnum.Controls;

  @Input()
  set requirementLike(v: RequirementLike) {
    this._requirementLike = v;
    this.requirementLikeSubject.next(v);
  }

  get requirementLike(): RequirementLike {
    return this._requirementLike;
  }

  @Input()
  noEvidencesTemplate: TemplateRef<any>;
  @Input()
  allRequirementsHidden: boolean;

  @Input()
  set displayedEvidences(value: string[]) {
    if (value) {
      this.displayedEvidenceIds = new Set(value);
    } else {
      delete this.displayedEvidenceIds;
    }
  }

  @Output()
  tryAgain = new EventEmitter();

  isEvidenceUploading: boolean;
  controlsSource = EvidenceSourcesEnum.Controls;

  evidenceList$: Observable<EvidenceLike[]>;
  evidenceExists$: Observable<boolean>;

  constructor(
    private cd: ChangeDetectorRef,
    private dataAggregationFacadeService: DataAggregationFacadeService,
    @Optional() private controlContext: ControlContextService
  ) {}

  ngOnInit(): void {
    this.changeEvidenceList();
    if (this.controlRequirement) {
      this.controlContext
        ?.getRequirementNewEvidence(this.controlRequirement.requirement_id)
        .pipe(this.detacher.takeUntilDetach())
        .subscribe((newIds) => {
          this.newEvidenceIds = newIds;
          this.cd.detectChanges();
        });
    }
    this.evidenceList$
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((evidence) => (this.applicableEvidence = evidence.filter((e) => e.is_applicable) || []));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      'controlRequirement' in changes &&
      this._requirementLike &&
      (changes.controlRequirement.firstChange ||
        changes.controlRequirement.currentValue.is_snapshot !== changes.controlRequirement.previousValue?.is_snapshot)
    ) {
      this.changeEvidenceList();
    }

    if ('allRequirementsHidden' in changes || 'controlRequirement' in changes) {
      this.setEvidenceToDisplay();
    }
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  private setEvidenceToDisplay(): void {
    this.dataToDisplay = new Set<string>(this.applicableEvidence.map((evidence) => evidence.id));
  }

  isEvidenceHidden(item: EvidenceLike): boolean {
    // we have filtering on only for controlRequirement
    if (this.controlRequirement) {
      const isHiddenByApplicability = !this.dataToDisplay.has(item.id) && this.allRequirementsHidden;
      const isHiddenByFilter = !this.displayedEvidenceIds.has(item.id);
      const isNotNew = !this.newEvidenceIds.has(item.id);
      return isNotNew && (isHiddenByApplicability || isHiddenByFilter);
    }
    return false;
  }

  trackCollectingEvidencesByIds(_, obj: CollectingEvidence): string {
    return obj.evidenceId || obj.temporaryId;
  }

  trackEvidenceByIds(index: number, obj: EvidenceLike): any {
    if (obj) {
      return obj.id;
    }
    return index;
  }

  evidenceAnimationDone(): void {
    this.isEvidenceUploading = false;
  }

  private changeEvidenceList(): void {
    if (this._requirementLike.resourceType === ResourceType.Policy || this.controlInstance.is_snapshot) {
      this.evidenceList$ = this.requirementLikeSubject.pipe(
        map((requirementLike) => requirementLike?.evidence || []),
        shareReplay()
      );
    } else {
      this.evidenceList$ = this.dataAggregationFacadeService.getRelevantEvidence(
        this.framework.framework_id,
        this.requirementLike.resourceId
      );
    }
    this.evidenceExists$ = this.evidenceList$.pipe(map((evidences) => !!evidences.length));
  }
}
