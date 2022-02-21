import { evidencePreviewTranslationRoot } from '../evidence-tabular-preview/evidence-tabular-preview.component';
import { DropdownControlComponent, MenuAction } from 'core/modules/dropdown-menu';
import { EvidenceFacadeService } from 'core/modules/data/services/facades';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { EvidenceInstance, EvidenceRunHistoryEntity, Service } from 'core/modules/data/models/domain';
import { Observable } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';

export interface HistoryServiceInstanceViewModel {
  service_instance_id: string;
  service_instance_display_name: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-service-instance-menu',
  templateUrl: './service-instance-menu.component.html',
  styleUrls: ['./service-instance-menu.component.scss']
})
export class ServiceInstanceMenuComponent implements OnChanges, AfterViewInit {
  private runHistoryLoaded: boolean;
  evidenceRunHistory$: Observable<EvidenceRunHistoryEntity>;
  allHistoryServiceInstances$: Observable<HistoryServiceInstanceViewModel[]>;
  dataToDisplay$: Observable<MenuAction<HistoryServiceInstanceViewModel>[]>;
  onItemHoverTooltipObj: {
    displayCondition: (x: any) => boolean;
    templateTooltip: TemplateRef<any>;
  };

  @ViewChild(DropdownControlComponent)
  dropdownComponent: DropdownControlComponent;

  @ViewChild('itemTooltip', { static: true })
  itemTooltipTemplate: TemplateRef<any>;

  @Input()
  service: Service;

  @Input()
  evidenceId: string;

  @Input()
  selectedHistoryPeriod: string;

  @Output()
  selectSnapshot = new EventEmitter<EvidenceInstance>();

  @Input()
  ininialEvidenceOriginatedBy: string;
  
  @Input()
  lastDate: number = undefined;

  selectedItem: MenuAction;

  constructor(private evidenceFacadeService: EvidenceFacadeService, private cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.onItemHoverTooltipObj = {
      displayCondition: (item: HistoryServiceInstanceViewModel) => {
        return item.disabled;
      },
      templateTooltip: this.itemTooltipTemplate,
    };
    this.cd.detectChanges();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if ('selectedHistoryPeriod' in changes && this.selectedHistoryPeriod) {
      this.dataToDisplay$ = this.evidenceRunHistory$.pipe(map((h) => h.history_per_run[this.selectedHistoryPeriod]), switchMap((selectedHPeriodEvidenceList) => {
        return this.allHistoryServiceInstances$.pipe(map((historyServiceInstanceViewModels) => {
          return historyServiceInstanceViewModels.map((hs) => {
            const isDisabled = !selectedHPeriodEvidenceList.find((ei) => ei.evidence_originated_by_instance_id === hs.service_instance_id);
            const isGap = selectedHPeriodEvidenceList.some((e) => !!e.evidence_gap?.length && e.evidence_originated_by_instance_id === hs.service_instance_id);
            return { value: hs, icon: isGap ? 'Flag' : undefined, disabled: isDisabled } as MenuAction<HistoryServiceInstanceViewModel>;
          });
        }));
      }));

      if (!changes['selectedHistoryPeriod'].previousValue) {
        this.selectedItem = await this.dataToDisplay$.pipe(
          map(value => value.find(value1 => value1.value.service_instance_id === this.ininialEvidenceOriginatedBy)),
          take(1)
        ).toPromise();
        this.cd.detectChanges();
      }

      if (this.dropdownComponent?.value) {
        const selectedCurrValue = this.dropdownComponent.value as MenuAction<HistoryServiceInstanceViewModel>;
        const isAvailableToSelectForNewSelectedHistoryPeriod = await this.dataToDisplay$.pipe(map((instancesToDisplay) => !!instancesToDisplay.find((v) => v.value.service_instance_id === selectedCurrValue.value.service_instance_id && !v.disabled)), take(1)).toPromise();
        if (!isAvailableToSelectForNewSelectedHistoryPeriod) {
          this.selectedItem = await this.dataToDisplay$
            .pipe(
              map((instancesToDisplay) => instancesToDisplay.filter((v) => !v.disabled)[0]),
              take(1)
            )
            .toPromise();
        } else {
          this.selectedItem = selectedCurrValue;
        }
        this.cd.detectChanges();
      }
    }

    if ('evidenceId' in changes || ('service' in changes && this.evidenceId && this.service)) {
      if (!this.runHistoryLoaded || 'evidenceId' in changes) {
        this.loadRunHistory();
      }
    }
  }

  displayValueSelector(item: MenuAction<HistoryServiceInstanceViewModel>): string {
    return item.value.service_instance_display_name;
  }

  disableValueSelector(item: MenuAction<HistoryServiceInstanceViewModel>): boolean {
    return item.disabled;
  }

  async select(item: MenuAction<HistoryServiceInstanceViewModel>): Promise<void> {
    const res = await this.evidenceRunHistory$.pipe(map((erh) => {
      return erh.history_per_run[this.selectedHistoryPeriod].find((ei) => ei.evidence_originated_by_instance_id === item.value.service_instance_id);
    }), take(1)).toPromise();
    if (res) {
      this.selectSnapshot.emit(res);
    }
  }

  private loadRunHistory(): void {
    this.evidenceRunHistory$ = this.evidenceFacadeService.getEvidenceHistoryRun(this.evidenceId, this.lastDate);
    this.allHistoryServiceInstances$ = this.evidenceRunHistory$.pipe(
      map((e) => {
        return Object.keys(e.details_per_instance).map((serviceInstanceId) => ({
          service_instance_display_name: e.details_per_instance[serviceInstanceId].service_display_name,
          service_instance_id: serviceInstanceId
        }));
      }));
    this.runHistoryLoaded = true;
  }

  buildTranslationKey(key: string): string {
    return `${evidencePreviewTranslationRoot}.selectInstanceDropdown.${key}`;
  }
}
