import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ButtonType } from 'core/modules/buttons/types';
import { transposeMatrix } from 'core/utils';
import { LocalDatePipe } from 'core/modules/pipes';
import { TranslateService } from '@ngx-translate/core';
import { CsvFormatterService, FileDownloadingHelperService } from 'core/services';
import { EvidenceUserEventService } from 'core/modules/data/services/event-tracking/evidence-user-event.service';
import { EvidenceInstance } from 'core/modules/data/models/domain';
import { EvidenceSourcesEnum } from 'core/modules/shared-controls/models';

@Component({
  selector: 'app-export-to-csv-button',
  templateUrl: './export-to-csv-button.component.html',
  styleUrls: ['./export-to-csv-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportToCsvButtonComponent {
  @Input()
  isDataToPreviewExists: boolean;

  @Input()
  type: ButtonType = 'primary';

  @Input()
  eventSource: EvidenceSourcesEnum;

  @Input()
  evidence: EvidenceInstance;

  @Input()
  evidenceFullData: { [key: string]: string[] };

  @Input()
  evidenceDistinct: EvidenceInstance;

  @Input()
  class: string;

  @Input()
  iconPath: string;

  constructor(
    private localDatePipe: LocalDatePipe,
    private translateService: TranslateService,
    private csvFormatterService: CsvFormatterService,
    private fileDownloadingHelperService: FileDownloadingHelperService,
    private evidenceEventService: EvidenceUserEventService,
  ) {}

  buildTranslationKey(relativeKey: string): string {
    return `evidencePreview.${relativeKey}`;
  }

  async downloadFullCsvData(): Promise<void> {
    const data = this.evidenceFullData;
    const { evidence_name, evidence_collection_timestamp } = this.evidenceDistinct;
    const formattedDate = this.localDatePipe.transform(
      evidence_collection_timestamp,
      'dd_MMM_yyyy',
      undefined,
      this.translateService.currentLang
    );
    const headers = Object.keys(data);
    const rows = transposeMatrix(Object.values(data));
    const csv = this.csvFormatterService.createCsvBlob(rows, headers);

    this.fileDownloadingHelperService.downloadBlob(csv, `${evidence_name}-${formattedDate}.csv`);

    await this.evidenceEventService.trackCsvExport(
      this.evidence.evidence_id,
      this.evidence.evidence_name,
      this.evidence.evidence_type,
      this.eventSource
    );
  }
}
