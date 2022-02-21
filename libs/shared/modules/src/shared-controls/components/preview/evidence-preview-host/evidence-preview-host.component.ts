import { Component, Input, OnInit } from '@angular/core';
import { convertToRequirementLike, EvidenceSourcesEnum, RequirementLike } from 'core/modules/shared-controls/models';
import { CalculatedControl, convertToEvidenceLike, EvidenceLike } from 'core/modules/data/models';
import { ControlRequirement, EvidenceInstance, EvidenceTypeEnum, Framework } from 'core/modules/data/models/domain';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import {
  ControlsFacadeService,
  DataAggregationFacadeService,
  EvidenceFacadeService,
  EvidenceService,
  FrameworksFacadeService,
  RequirementsFacadeService,
  SnapshotsFacadeService,
} from 'core/modules/data/services';

export enum EvidencePreviewTypeEnum {
  EvidencePreview = 'evidence-preview',
  FilePreview = 'file-preview',
  UrlPreview = 'url-preview',
}

@Component({
  selector: 'app-evidence-preview-host',
  templateUrl: './evidence-preview-host.component.html',
  styleUrls: ['./evidence-preview-host.component.scss'],
})
export class EvidencePreviewHostComponent implements OnInit {
  evidencePreviewTypeEnum = EvidencePreviewTypeEnum;

  @Input()
  eventSource: EvidenceSourcesEnum;

  @Input()
  evidenceId: string;

  @Input()
  requirementId: string;

  @Input()
  controlId: string;

  @Input()
  frameworkId: string;

  @Input()
  isSnapshot?: boolean;

  evidence$: Observable<EvidenceInstance>;
  evidenceLike$: Observable<EvidenceLike>;
  control$: Observable<CalculatedControl>;
  controlRequirement$: Observable<ControlRequirement>;
  framework$: Observable<Framework>;
  requirementLike$: Observable<RequirementLike>;

  evidencePreviewData$: Observable<string>;
  evidenceType$: Observable<EvidencePreviewTypeEnum>;

  constructor(
    private evidenceService: EvidenceService,
    private evidenceFacade: EvidenceFacadeService,
    private controlFacade: ControlsFacadeService,
    private requirementFacade: RequirementsFacadeService,
    private frameworkFacade: FrameworksFacadeService,
    private snapshotsFacadeService: SnapshotsFacadeService
  ) {}

  ngOnInit(): void {
    if (this.isSnapshot) {
      this.evidence$ = this.snapshotsFacadeService.getSingleEvidenceSnapshot(this.evidenceId);
      this.control$ = this.snapshotsFacadeService.getSingleControlSnapshot(this.controlId);
      this.controlRequirement$ = this.snapshotsFacadeService.getSingleRequirementSnapshot(this.requirementId);
    } else {
      this.evidence$ = this.evidenceFacade.getEvidence(this.evidenceId);
      this.control$ = this.controlFacade.getControl(this.controlId);
      this.controlRequirement$ = this.requirementFacade.getRequirement(this.requirementId);
    }
    this.requirementLike$ = this.controlRequirement$.pipe(map((req) => convertToRequirementLike(req)));
    this.evidenceLike$ = this.evidence$.pipe(map((evidence) => convertToEvidenceLike(evidence)));
    this.framework$ = this.frameworkFacade.getFrameworkById(this.frameworkId);
    this.evidenceType$ = this.evidence$.pipe(map((evidence) => this.getCurrentEvidencePreviewType(evidence)));
    this.evidencePreviewData$ = this.evidenceType$.pipe(
      filter((evidenceType) => evidenceType === EvidencePreviewTypeEnum.EvidencePreview),
      switchMap(() =>
        this.evidence$.pipe(
          switchMap((evidence) => this.evidenceService.getEvidencePreview(evidence.evidence_instance_id))
        )
      )
    );
  }

  private getCurrentEvidencePreviewType(evidence: EvidenceInstance): EvidencePreviewTypeEnum {
    switch (evidence.evidence_type) {
      case EvidenceTypeEnum.LOG:
      case EvidenceTypeEnum.LIST:
      case EvidenceTypeEnum.CONFIGURATION:
      case EvidenceTypeEnum.TICKET: {
        return EvidencePreviewTypeEnum.EvidencePreview;
      }
      case EvidenceTypeEnum.LINK:
      case EvidenceTypeEnum.DOCUMENT:
      case EvidenceTypeEnum.MANUAL: {
        return EvidencePreviewTypeEnum.FilePreview;
      }
      case EvidenceTypeEnum.URL: {
        return EvidencePreviewTypeEnum.UrlPreview;
      }
    }
  }
}
