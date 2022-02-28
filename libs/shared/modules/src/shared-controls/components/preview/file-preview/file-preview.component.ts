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
import { CombinedEvidenceInstance } from 'core/modules/data/models/domain';
import { EvidenceService } from 'core/modules/data/services';
import { FileTypeHandlerService } from 'core/modules/file-viewer/services';
import { SubscriptionDetacher } from 'core/utils';
import { EvidenceUserEventService } from 'core/modules/data/services/event-tracking/evidence-user-event.service';
import { EvidenceSourcesEnum } from 'core/modules/shared-controls/models';

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
  headerDataToDisplay: string[];

  @Input()
  evidence: CombinedEvidenceInstance;

  @Input()
  eventSource: string;

  isLoaded: boolean;

  tipTypes = TipTypeEnum;

  file: File;

  constructor(
    private evidenceService: EvidenceService,
    private fileDownloadingHelper: FileDownloadingHelperService,
    private cd: ChangeDetectorRef,
    private fileTypeHandler: FileTypeHandlerService,
    private evidenceEventService: EvidenceUserEventService,
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

    await this.evidenceEventService.trackEvidenceDownload(
      this.evidence.evidence_id,
      this.evidence.evidence_name,
      this.evidence.evidence_type,
      this.eventSource,
    );
  }

  private setFileType(): void {
    this.notSupportedPreview = !this.fileTypeHandler.isFileSupported(this.file.name);
  }
}
