import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileDownloadingHelperService } from 'core';
import { EvidenceService } from 'core/modules/data/services';
import { from, Observable } from 'rxjs';
import { shareReplay, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-view-evidence',
  templateUrl: './view-evidence.component.html',
  styleUrls: ['./view-evidence.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewEvidenceComponent implements OnInit, AfterViewChecked {
  private renderingStarted: boolean;
  private dataLoaded: boolean;
  fileStream$: Observable<File>;
  jsonStream$: Observable<object>;

  loaderDisplayed = true;

  constructor(
    private evidenceService: EvidenceService,
    private activatedRoute: ActivatedRoute,
    private fileDownloadingHelperService: FileDownloadingHelperService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const evidence_instance_id = this.activatedRoute.snapshot.params['evidence_instance_id'];

    this.fileStream$ = this.evidenceService
      .downloadEvidence(evidence_instance_id)
      .pipe(shareReplay())
      .pipe(tap(() => (this.dataLoaded = true)));
    this.jsonStream$ = this.fileStream$.pipe(switchMap((file) => from(this.readFile(file))));
  }

  downloadFile(file: File): void {
    this.fileDownloadingHelperService.downloadFile(file);
  }

  ngAfterViewChecked(): void {
    if (this.loaderDisplayed) {
      // this needed in order to display loader while the json-viewer is rendering json (it takes time depending of json complexity).
      if (this.renderingStarted) {
        this.loaderDisplayed = false;
        this.cd.detectChanges();
        delete this.renderingStarted;
      }

      if (this.dataLoaded) {
        this.renderingStarted = true;
      }
    }
  }

  private async readFile(file: File): Promise<object> {
    return JSON.parse(await file.text());
  }
}
