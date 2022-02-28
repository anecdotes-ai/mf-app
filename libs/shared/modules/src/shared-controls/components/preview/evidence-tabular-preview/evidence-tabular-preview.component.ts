import { EvidenceFacadeService } from 'core/modules/data/services/facades';
import { PluginFacadeService } from './../../../../data/services/facades/plugin-facade/plugin-facade.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DropdownControlComponent } from 'core/modules/dropdown-menu/components/dropdown-control/dropdown-control.component';
import { TipTypeEnum } from 'core/models';
import { MAX_API_CALLS } from 'core/modules/data/constants';
import { EvidenceInstance, EvidenceTypeEnum, Service } from 'core/modules/data/models/domain';
import { EvidenceService } from 'core/modules/data/services';
import { GridRow, GridView, GridViewBuilderService } from 'core/modules/grid';
import { DataSearchComponent } from 'core/modules/data-manipulation/search';
import { LocalDatePipe } from 'core/modules/pipes';
import { FileDownloadingHelperService, WindowHelperService } from 'core/services';
import { SubscriptionDetacher, convertToUTCTimestamp } from 'core/utils';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  shareReplay,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { EvidenceSourcesEnum } from 'core/modules/shared-controls/models';
import { PreviewTypesEnum } from 'core/modules/shared-controls/components/preview/models/file-type.model';

export interface FilterEvidenceDropdownOption {
  displayValue: string;
}

export const evidencePreviewTranslationRoot = 'evidencePreview';

@Component({
  selector: 'app-evidence-tabular-preview',
  templateUrl: './evidence-tabular-preview.component.html',
  styleUrls: ['./evidence-tabular-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LocalDatePipe],
})
export class EvidenceTabularPreviewComponent implements OnInit, OnDestroy, OnChanges {
  // ** PRIVATE **
  private static supportedEvidenceTypesByTicketing = {
    [EvidenceTypeEnum.LIST]: true,
    [EvidenceTypeEnum.LOG]: true,
    [EvidenceTypeEnum.TICKET]: true,
  };
  private viewAllFilterEvidenceOption: FilterEvidenceDropdownOption = { displayValue: null };
  private evidenceSubject$ = new BehaviorSubject<EvidenceInstance>(null);
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  // ** HOST **
  @HostBinding('attr.searchScope')
  private searchScope = true;

  @HostBinding('class')
  viewType: PreviewTypesEnum;

  @HostBinding('class.grid-empty')
  isGridEmpty: boolean;

  // ** VIEW **
  @ViewChild(DataSearchComponent)
  private searchComponent: DataSearchComponent;

  @ViewChild('filterEvidenceDropdown')
  private filterEvidenceDropdown: DropdownControlComponent;

  @ViewChild('searchComponent')
  search: DataSearchComponent;

  // ** INPUT **
  @Input()
  eventSource: EvidenceSourcesEnum;

  @Input()
  rootEvidence: EvidenceInstance;

  @Input()
  headerDataToDisplay: string[];

  @Input()
  previewData: any;

  // ** GETTER **
  get evidenceCollectionTimestamp(): Observable<Date> {
    return this.evidenceDistinct$.pipe(map((ev) => ev.evidence_collection_timestamp));
  }

  get displayLoader(): Observable<boolean> {
    if (!this.evidenceFullData$) {
      return of(false);
    }
    return this.evidenceFullData$.pipe(mapTo(false), startWith(true));
  }

  get isNotFoundScreenDisplayed(): boolean {
    return this.notFoundData && !this.isGridEmpty;
  }

  get snapshotLastTime(): number | undefined {
    if (!this.rootEvidence?.snapshot_id) {
      return undefined;
    }
    // Convert timestamp to unix time
    return convertToUTCTimestamp(this.rootEvidence.evidence_collection_timestamp);
  }

  // ** PUBLIC **
  displayAnimationLoader = true;
  fullDataLoading$ = new BehaviorSubject<boolean>(false);
  relatedService$: Observable<Service>;
  maxApiCalls = MAX_API_CALLS;
  tipTypes = TipTypeEnum;
  gridView: GridView;
  displayedGridView: GridView;
  gridView$: Observable<GridView>;
  filterEvidenceData: FilterEvidenceDropdownOption[];
  notFoundData: boolean;
  evidenceApiCallsCount: number;
  isDataToPreviewExists: boolean;
  shouldDisplayServiceInstances: boolean;
  evidenceSources = EvidenceSourcesEnum;
  searchItemAmount: number;
  previewTypesEnum = PreviewTypesEnum;
  evidenceHistoryPeriodSubject$ = new Subject<string>();
  evidenceFullData$: Observable<{ [key: string]: string[] }>;
  evidenceDistinct$ = this.evidenceSubject$.pipe(
    distinctUntilChanged(
      (prevEvidence, currEvidence) => prevEvidence?.evidence_instance_id === currEvidence?.evidence_instance_id
    )
  );

  constructor(
    private evidenceService: EvidenceService,
    private fileDownloadingHelperService: FileDownloadingHelperService,
    private cd: ChangeDetectorRef,
    private gridViewBuilder: GridViewBuilderService,
    protected windowHelper: WindowHelperService,
    private translateService: TranslateService,
    private pluginFacade: PluginFacadeService,
    private evidenceFacade: EvidenceFacadeService
  ) {}

  // ** LIFECYCLE HOOKS **
  ngOnChanges(changes: SimpleChanges): void {
    if ('rootEvidence' in changes) {
      this.relatedService$ = this.pluginFacade.getServiceById(this.rootEvidence.evidence_service_id).pipe(
        filter((service) => !!service),
        distinctUntilChanged((prev, curr) => prev?.service_id === curr?.service_id),
        switchMap((service) => {
          return this.pluginFacade.IsFullService(service.service_id).pipe(
            take(1),
            map((isFull) => {
              return {
                isFull: isFull,
                service: service,
              };
            })
          );
        }),
        switchMap((result) => {
          if (!result.isFull && result.service?.service_multi_account) {
            return this.pluginFacade.loadSpecificPlugin(result.service.service_id);
          } else {
            return of(result.service);
          }
        }),

        tap((service) => {
          if (service?.service_multi_account) {
            this.evidenceFacade.loadEvidenceHistoryRun(this.rootEvidence.evidence_id, this.snapshotLastTime);
          }
          this.shouldDisplayServiceInstances =
            service?.service_multi_account && service?.service_instances_list?.length !== 1;
        })
      );
      this.evidenceApiCallsCount = this.resolveCallsCount();
      this.evidenceSubject$.next(this.rootEvidence);
      this.viewType = this.resolveHostClassByType();
    }

    // previewData = false is OK.
    if ('previewData' in changes && this.previewData !== null) {
      this.gridView$ = this.evidenceDistinct$.pipe(
        switchMap(() => this.evidenceFullData$),
        map((data) => this.gridViewBuilder.buildGridView(data)),
        shareReplay()
      );

      this.gridView$
        .pipe(
          filter(
            () => EvidenceTabularPreviewComponent.supportedEvidenceTypesByTicketing[this.rootEvidence.evidence_type]
          ),
          this.detacher.takeUntilDetach()
        )
        .subscribe((gridView: GridView) => this.setDataForFilterEvidenceDropdown(gridView));

      this.gridView$.pipe(this.detacher.takeUntilDetach()).subscribe((gridView) => {
        this.gridView = gridView;
        this.displayedGridView = gridView;
        this.isDataToPreviewExists = !!gridView && !!gridView.rawData && !!gridView.header.length;
        this.isGridEmpty = !gridView.rows.length;
        this.fullDataLoading$.next(false);
        this.displayAnimationLoader = false;
        this.cd.detectChanges();
      });
    }
  }

  ngOnInit(): void {
    this.evidenceDistinct$.pipe(this.detacher.takeUntilDetach()).subscribe((evidence) => {
      this.evidenceFullData$ = this.getEvidenceFullData(evidence.evidence_instance_id);
      this.cd.detectChanges();
    });

    this.translateService
      .get(this.buildTranslationKey('filterEvidence.viewAllDropdownDefault'))
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((keyValue) => {
        this.viewAllFilterEvidenceOption.displayValue = keyValue;
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  async emitViewRawData(): Promise<void> {
    const currentSelectedEvidence = await this.evidenceDistinct$.pipe(take(1)).toPromise();
    const signedUrl = await this.evidenceService
      .getEvidencePresignedUrl(currentSelectedEvidence.evidence_instance_id)
      .toPromise();

    this.windowHelper.openUrlInNewTab(signedUrl);
  }

  async downloadFullData(): Promise<any> {
    const data = await this.evidenceFullData$.pipe(take(1)).toPromise();

    const dataString = typeof data === 'string' ? data : JSON.stringify(data);

    const file = new File([dataString], 'evidence-full-data.txt', { type: 'text/plain' });
    this.fileDownloadingHelperService.downloadFile(file);
  }

  buildTranslationKey(relativeKey: string): string {
    return `${evidencePreviewTranslationRoot}.${relativeKey}`;
  }

  evidenceApiQuery(): Observable<string[]> {
    return this.evidenceDistinct$.pipe(map((value) => value.evidence_api_query));
  }

  selectDisplayValueFromFilterEvidenceDropdownOption(
    filterEvidenceDropdownOption: FilterEvidenceDropdownOption
  ): string {
    return filterEvidenceDropdownOption.displayValue;
  }

  searchData(gridView: GridRow[]): void {
    this.notFoundData = !gridView.length;
    this.searchItemAmount = gridView.length;
    this.cd.detectChanges();
  }

  resetSearch(): void {
    this.searchComponent.reset();
  }

  selectEvidenceSnapshot(evidence: EvidenceInstance): void {
    this.evidenceSubject$.next(evidence);
  }

  selectHistoryPeriod(date: string): void {
    this.evidenceHistoryPeriodSubject$.next(date);
  }

  filterByFirstColumnCell(filterEvidenceDropdownOption: FilterEvidenceDropdownOption): void {
    if (filterEvidenceDropdownOption === this.viewAllFilterEvidenceOption) {
      this.viewAllData();
    } else {
      this.filterGrid(filterEvidenceDropdownOption);
    }

    this.cd.detectChanges();
  }

  async viewRawData(): Promise<void> {
    const currentSelectedEvidence = await this.evidenceDistinct$.pipe(take(1)).toPromise();
    const signedUrl = await this.evidenceService
      .getEvidencePresignedUrl(currentSelectedEvidence.evidence_instance_id)
      .toPromise();
    this.windowHelper.openUrlInNewTab(signedUrl);
  }

  private setDataForFilterEvidenceDropdown(gridView: GridView): void {
    const firstColumnName = gridView.header[0];
    const firstColumnValues: string[] = gridView.rows.map((row) => row.simplifiedCellsObject[firstColumnName]);

    const distinctStrings = Array.from(new Set<string>(firstColumnValues));

    this.filterEvidenceData = [
      this.viewAllFilterEvidenceOption,
      ...distinctStrings.map((str) => ({ displayValue: str })),
    ];

    this.filterEvidenceDropdown?.selectItem(this.viewAllFilterEvidenceOption); // reset to "View all" state
    this.cd.detectChanges();
  }

  private filterGrid(option: FilterEvidenceDropdownOption): void {
    const firstColumn = this.gridView.header[0];
    const result = this.gridView.rows.filter((row) => row.simplifiedCellsObject[firstColumn] === option.displayValue);
    this.displayedGridView = { ...this.gridView, rows: result };
    this.cd.detectChanges();
  }

  private viewAllData(): void {
    this.displayedGridView = this.gridView;
    this.cd.detectChanges();
  }

  private resolveHostClassByType(): PreviewTypesEnum {
    if (this.rootEvidence) {
      switch (this.rootEvidence.evidence_type) {
        case EvidenceTypeEnum.LIST:
          return PreviewTypesEnum.List;
        case EvidenceTypeEnum.LOG:
        case EvidenceTypeEnum.TICKET:
          return PreviewTypesEnum.Log;
        case EvidenceTypeEnum.CONFIGURATION:
          return PreviewTypesEnum.Cfg;
      }
    }
  }

  private resolveCallsCount(): number {
    return this.rootEvidence.evidence_api_query?.length || 0;
  }

  private getEvidenceFullData(evidence_instance_id: string): Observable<{ [key: string]: string[] }> {
    return this.evidenceService.getEvidenceFullData(evidence_instance_id).pipe(
      catchError(() => of({})),
      shareReplay()
    );
  }
}
