import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TipTypeEnum } from 'core/models';
import { FileDownloadingHelperService } from 'core/services';
import { ModalWindowService } from 'core/modules/modals';
import { CombinedEvidenceInstance, Framework } from 'core/modules/data/models/domain';
import { DataAggregationFacadeService, EvidenceService } from 'core/modules/data/services';
import { FileTypeHandlerService } from 'core/modules/file-viewer/services';
import { SubscriptionDetacher } from 'core/utils';
import { CalculatedControl, CalculatedRequirement } from 'core/modules/data/models';
import { EvidenceUserEventService } from 'core/modules/data/services/event-tracking/evidence-user-event.service';
import { EvidenceSourcesEnum } from 'core/modules/shared-controls/models';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-file-preview',
  templateUrl: './file-preview.component.html',
  styleUrls: ['./file-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilePreviewComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  evidenceSources = EvidenceSourcesEnum;

  @HostBinding('class.preview-not-supported')
  notSupportedPreview: boolean;

  @HostBinding('class.have-control-header')
  get hostHaveControlHeader(): boolean {
    return this.eventSource === this.evidenceSources.Controls;
  }

  @Input()
  evidence: CombinedEvidenceInstance;

  @Input()
  framework: Framework;

  @Input()
  controlInstance: CalculatedControl;

  @Input()
  requirement: CalculatedRequirement;

  @Input()
  eventSource: string;
  frameworksNames: { [p: string]: string[] };

  isLoaded: boolean;

  tipTypes = TipTypeEnum;

  file: File;

  constructor(
    private evidenceService: EvidenceService,
    private fileDownloadingHelper: FileDownloadingHelperService,
    private cd: ChangeDetectorRef,
    private modalWindowService: ModalWindowService,
    private fileTypeHandler: FileTypeHandlerService,
    private evidenceEventService: EvidenceUserEventService,
    private dataAggregationService: DataAggregationFacadeService
  ) {}

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  ngOnInit(): void {
    this.evidenceService
      .downloadEvidence(this.evidence.evidence_instance_id)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((file) => {
        this.file = new File([file], this.evidence.evidence_name);
        this.isLoaded = true;
        this.setFileType();
        this.cd.detectChanges();
      });
  }

  buildTranslationKey(relativeKey: string): string {
    return `evidencePreview.file.${relativeKey}`;
  }

  async downloadEvidence(): Promise<void> {
    this.fileDownloadingHelper.downloadFile(this.file, this.evidence.evidence_name);
    const frameworks = await this.dataAggregationService
      .getEvidenceReferences(this.evidence.evidence_id)
      .pipe(
        map((references) => references.map((reference) => reference.framework.framework_name)),
        take(1)
      )
      .toPromise();
    await this.evidenceEventService.trackEvidenceDownload(
      this.framework ? this.framework.framework_id : null,
      this.controlInstance.control_id,
      this.requirement.requirement_id,
      this.evidence.evidence_name,
      this.evidence.evidence_type,
      this.eventSource,
      frameworks?.length ? frameworks.join(', ') : null
    );
  }

  private setFileType(): void {
    this.notSupportedPreview = !this.fileTypeHandler.isFileSupported(this.file.name);
  }
}
