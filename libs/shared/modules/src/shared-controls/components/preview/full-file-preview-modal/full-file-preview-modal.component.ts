import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EvidenceTypeIconMapping, TipTypeEnum } from 'core/models';
import { FileDownloadingHelperService } from 'core/services';
import { EvidenceService } from 'core/modules/data/services';
import { CombinedEvidenceInstance, Framework } from 'core/modules/data/models/domain';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { EvidenceUserEventService } from 'core/modules/data/services/event-tracking/evidence-user-event.service';
import { CalculatedControl, CalculatedRequirement } from 'core/modules/data/models';
import { EvidenceSourcesEnum } from 'core/modules/shared-controls/models';

export interface FullFilePreviewContext {
  file: File;
  evidence: CombinedEvidenceInstance;
  framework: Framework;
  control: CalculatedControl;
  requirement: CalculatedRequirement;
}

@Component({
  selector: 'app-full-file-preview-modal',
  templateUrl: './full-file-preview-modal.component.html',
  styleUrls: ['./full-file-preview-modal.component.scss'],
})
export class FullFilePreviewModalComponent implements OnInit {
  framework: Framework;
  controlInstance: CalculatedControl;
  requirement: CalculatedRequirement;
  evidenceIcon$: Observable<string>;

  fileTypeMapping: { icon: string };
  evidence: CombinedEvidenceInstance;
  file: File;
  tipTypes = TipTypeEnum;

  constructor(
    private componentSwitcher: ComponentSwitcherDirective,
    private evidenceService: EvidenceService,
    private fileDownloadingHelper: FileDownloadingHelperService,
    private cd: ChangeDetectorRef,
    private evidenceEventService: EvidenceUserEventService
  ) {}

  async ngOnInit(): Promise<void> {
    const {
      evidence,
      file,
      framework,
      control,
      requirement,
    }: FullFilePreviewContext = await this.componentSwitcher.sharedContext$.pipe(take(1)).toPromise();
    this.evidence = evidence;
    this.file = file;
    this.framework = framework;
    this.requirement = requirement;
    this.controlInstance = control;

    this.fileTypeMapping = EvidenceTypeIconMapping[this.evidence.evidence_type];
    this.evidenceIcon$ = this.evidenceService.getIcon(this.evidence.evidence_service_id);

    this.cd.detectChanges();
  }

  buildTranslationKey(relativeKey: string): string {
    return `evidences.filePreview.${relativeKey}`;
  }

  async downloadEvidence(): Promise<void> {
    this.fileDownloadingHelper.downloadFile(this.file);
    await this.evidenceEventService.trackEvidenceDownload(
      this.framework ? this.framework.framework_id : null,
      this.controlInstance.control_id,
      this.requirement.requirement_id,
      this.evidence.evidence_name,
      this.evidence.evidence_type,
      EvidenceSourcesEnum.Controls,
      null
    );
  }
}
