import { ChangeDetectionStrategy, Component, HostListener, Input, OnInit } from '@angular/core';
import { EvidenceTypeIconMapping } from 'core/models/evidence-type-icon.mapping';
import { convertToEvidenceLike } from 'core/modules/data/models';
import { CalculatedEvidence } from 'core/modules/data/models/calculated-evidence.model';
import { EvidenceService, FrameworksFacadeService } from 'core/modules/data/services';
import { ModalWindowService } from 'core/modules/modals';
import { EvidenceSourcesEnum } from 'core/modules/shared-controls/models';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { RootTranslationkey } from './../../constants/translation-keys.constant';
import { EvidenceUserEventService } from 'core/modules/data/services/event-tracking/evidence-user-event.service';
import { EvidenceModalService } from 'core/modules/shared-controls/modules/evidence/services';
import { Framework } from 'core/modules/data/models/domain';
import { EvidencePreviewService } from 'core/modules/shared-controls/services';

@Component({
  selector: 'app-evidence-pool-item',
  templateUrl: './evidence-pool-item.component.html',
  styleUrls: ['./evidence-pool-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvidencePoolItemComponent implements OnInit {
  evidenceSource = EvidenceSourcesEnum.EvidencePool;
  fileTypeMapping: { icon: string };
  evidenceRelatedFrameworksNames$: Observable<{
    [frameworkName: string]: string[];
  }>;

  private applicableFrameworks$: Observable<Framework[]>;

  @Input()
  evidence: CalculatedEvidence;

  frameworkNames: { [p: string]: string[] };
  @HostListener('click', ['$event'])
  private hostClick(event: MouseEvent): void {
    this.openFullData();
  }

  constructor(
    protected evidenceService: EvidenceService,
    private modalWindowService: ModalWindowService,
    private frameworksFacade: FrameworksFacadeService,
    private evidenceEventService: EvidenceUserEventService,
    private evidenceModalService: EvidenceModalService,
    private evidencePreviewService: EvidencePreviewService
  ) {}

  ngOnInit(): void {
    this.fileTypeMapping = EvidenceTypeIconMapping[this.evidence.evidence_type];
    this.applicableFrameworks$ = this.frameworksFacade.getApplicableFrameworks();

    this.evidenceRelatedFrameworksNames$ = this.applicableFrameworks$.pipe(
      map((applicableFrameworks) =>
        this.evidence.evidence_related_framework_names
          ? Object.keys(this.evidence.evidence_related_framework_names)
              .filter((frameworkName) => {
                return applicableFrameworks.some(
                  (f) =>
                    f.framework_name === frameworkName &&
                    !(this.evidence.evidence_service_id in f.framework_excluded_plugins)
                );
              })
              .reduce((obj, key) => {
                return {
                  ...obj,
                  [key]: this.evidence.evidence_related_framework_names[key],
                };
              }, {})
          : {}
      )
    );
  }

  clickOnLinkEvidenceButton(event: MouseEvent): void {
    event.stopPropagation();
    this.openLinkEvidenceModal();
  }

  rowTrackBy(evidence: CalculatedEvidence): any {
    return evidence?.evidence_id;
  }

  buildTranslationKey(key: string): string {
    return `${RootTranslationkey}.evidencePoolItem.${key}`;
  }

  private openLinkEvidenceModal(): void {
    this.evidenceModalService.openEvidenceConnectComponent(convertToEvidenceLike(this.evidence));
  }

  private async openFullData(): Promise<void> {
    const frameworks = await this.evidenceRelatedFrameworksNames$.pipe(take(1)).toPromise();

    this.evidencePreviewService.openEvidencePreviewModal({
      eventSource: this.evidenceSource,
      evidenceId: this.evidence.evidence_id,
      controlId: this.evidence.related_control?.control_id,
      requirementId: this.evidence.related_requirement?.requirement_id,
    });

    const frameworks_names = Object.keys(frameworks).join(', ');
    await this.evidenceEventService.trackViewFullData(
      null,
      this.evidence.related_control?.control_id,
      this.evidence.related_requirement?.requirement_id,
      this.evidence.evidence_name,
      this.evidence.evidence_type,
      frameworks_names
    );
  }
}
