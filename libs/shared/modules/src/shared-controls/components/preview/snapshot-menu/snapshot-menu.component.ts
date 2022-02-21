import { EvidenceFacadeService } from './../../../../data/services/facades/evidences-facade/evidences-facade.service';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuAction } from 'core/modules/dropdown-menu';
import { RegularDateFormat } from 'core/constants/date';
import { EvidenceInstance, EvidenceRunHistoryEntity, Service } from 'core/modules/data/models/domain';
import { EvidenceService } from 'core/modules/data/services';
import { LocalDatePipe } from 'core/modules/pipes';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-snapshot-menu',
  templateUrl: './snapshot-menu.component.html',
  styleUrls: ['./snapshot-menu.component.scss'],
})
export class SnapshotMenuComponent implements OnChanges {
  evidenceRunHistory$: Observable<EvidenceRunHistoryEntity>;

  @Input()
  evidenceId: string;

  @Input()
  lastDate: number = undefined;

  @Input()
  service: Service;

  @Output()
  selectSnapshot = new EventEmitter<EvidenceInstance>();

  @Output()
  selectHistoryPeriod = new EventEmitter<string>();

  menuActions$: Observable<MenuAction[]>;

  constructor(
    private evidenceService: EvidenceService,
    private evidenceFacade: EvidenceFacadeService,
    private translateService: TranslateService,
    private localDatePipe: LocalDatePipe
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (('service' in changes || 'evidenceId' in changes) && this.service && this.evidenceId) {
      if (this.service.service_multi_account) {
        this.menuActions$ = this.evidenceFacade.getEvidenceHistoryRun(this.evidenceId, this.lastDate).pipe(
          map((erh) => {
            return Object.keys(erh.history_per_run)
              .map((date) => ({
                translationKey: this.localDatePipe.transform(
                  date,
                  RegularDateFormat,
                  undefined,
                  this.translateService.currentLang
                ),
                value: date,
              }))
              .sort((a, b) => new Date(b.value).getTime() - new Date(a.value).getTime());
          })
        );
      } else {
        this.menuActions$ = this.evidenceService.getEvidenceSnapshots(this.evidenceId, this.lastDate).pipe(
          map((evidences) => {
            return evidences.map((evidence) => ({
              translationKey: this.localDatePipe.transform(
                evidence.evidence_collection_timestamp,
                RegularDateFormat,
                undefined,
                this.translateService.currentLang
              ),
              value: evidence,
            }));
          })
        );
      }
    }
  }

  select(menuAction: MenuAction): void {
    if (this.service.service_multi_account) {
      this.selectHistoryPeriod.emit(menuAction.value);
    } else {
      this.selectSnapshot.emit(menuAction.value);
    }
  }

  displayValueSelector(menuAction: MenuAction): string {
    return menuAction.translationKey;
  }
}
