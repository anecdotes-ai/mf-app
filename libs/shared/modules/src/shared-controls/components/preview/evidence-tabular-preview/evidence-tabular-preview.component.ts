import { CombinedEvidenceInstance } from './../../../../data/models/domain/combinedEvidenceInstance';
import { EvidenceFacadeService } from 'core/modules/data/services/facades';
import { PluginFacadeService } from './../../../../data/services/facades/plugin-facade/plugin-facade.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PusherMessage, TipTypeEnum } from 'core';
import { MenuAction, DropdownControlComponent } from 'core/modules/dropdown-menu';
import { CollectionResult } from 'core/models/collection-result.model';
import { MAX_API_CALLS } from 'core/modules/data/constants';
import {
  CalculatedControl,
  CalculatedRequirement,
  isRequirement,
} from 'core/modules/data/models';
import { EvidenceInstance, EvidenceTypeEnum, Service, Framework } from 'core/modules/data/models/domain';
import { ControlsFacadeService, EvidenceService } from 'core/modules/data/services';
import { GridRow, GridView, GridViewBuilderService } from 'core/modules/grid';
import { DataSearchComponent } from 'core/modules/data-manipulation/search';
import { LocalDatePipe } from 'core/modules/pipes';
import { CsvFormatterService, FileDownloadingHelperService, WindowHelperService } from 'core/services';
import { ModalWindowService } from 'core/modules/modals';
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
import { EvidenceSourcesEnum, RequirementLike } from '../../../models';
import { EvidenceItemComponent, UploadUrlModalComponent } from 'core/modules/shared-controls/components';
import { EvidenceUserEventService } from 'core/modules/data/services/event-tracking/evidence-user-event.service';
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
  // forwardRef here is needed for manage weird cyclic dependency
  providers: [
    LocalDatePipe,
    { provide: EvidenceTabularPreviewComponent, useExisting: forwardRef(() => EvidenceItemComponent) },
  ],
})
export class EvidenceTabularPreviewComponent implements OnInit, OnDestroy, OnChanges {
  evidenceSources = EvidenceSourcesEnum;

  @Input()
  eventSource: EvidenceSourcesEnum;

  @Input()
  rootEvidence: CombinedEvidenceInstance;

  @Input()
  set requirementLike(requirementLike: RequirementLike) {
    if (requirementLike && isRequirement(requirementLike.resource)) {
      this.controlRequirement = requirementLike.resource as CalculatedRequirement;
    }
    this._requirementLike = requirementLike;
  }

  get requirementLike(): RequirementLike {
    return this._requirementLike;
  }

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
    if (!this.rootEvidence?.snapshot_id) return undefined;
    // Convert timestamp to unix time
    return convertToUTCTimestamp(this.rootEvidence.evidence_collection_timestamp);
  }

  searchItemAmount: number;
  previewTypesEnum = PreviewTypesEnum;

  constructor(
    private modalWindowService: ModalWindowService,
    private evidenceService: EvidenceService,
    private fileDownloadingHelperService: FileDownloadingHelperService,
    private cd: ChangeDetectorRef,
    private gridViewBuilder: GridViewBuilderService,
    protected windowHelper: WindowHelperService,
    private translateService: TranslateService,
    private localDatePipe: LocalDatePipe,
    private csvFormatterService: CsvFormatterService,
    private controlsFacade: ControlsFacadeService,
    private evidenceEventService: EvidenceUserEventService,
    private pluginFacade: PluginFacadeService,
    private evidenceFacade: EvidenceFacadeService
  ) {}

  private static supportedEvidenceTypesByTicketing = {
    [EvidenceTypeEnum.LIST]: true,
    [EvidenceTypeEnum.LOG]: true,
    [EvidenceTypeEnum.TICKET]: true,
  };

  private _requirementLike: RequirementLike;
  private viewAllFilterEvidenceOption: FilterEvidenceDropdownOption = { displayValue: null };

  @ViewChild('attachLinkModal')
  protected attachLinkModalTemplate: TemplateRef<any>;
  @ViewChild(DataSearchComponent)
  private searchComponent: DataSearchComponent;
  @ViewChild('filterEvidenceDropdown')
  private filterEvidenceDropdown: DropdownControlComponent;
  private evidenceSubject$ = new BehaviorSubject<EvidenceInstance>(null);
  evidenceHistoryPeriodSubject$ = new Subject<string>();
  evidenceFullData$: Observable<{ [key: string]: string[] }>;
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  evidenceDistinct$ = this.evidenceSubject$.pipe(
    distinctUntilChanged(
      (prevEvidence, currEvidence) => prevEvidence?.evidence_instance_id === currEvidence?.evidence_instance_id
    )
  );

  @HostBinding('attr.searchScope')
  private searchScope = true;

  @ViewChild('searchComponent')
  search: DataSearchComponent;

  @HostBinding('class')
  viewType: PreviewTypesEnum;

  @Input()
  framework: Framework;

  controlRequirement: CalculatedRequirement;

  @Input()
  controlInstance: CalculatedControl;

  @Input()
  disableAnimation: boolean;

  @Input()
  previewData: any;

  @Output()
  evidenceSnapshotSelect: EventEmitter<EvidenceInstance> = new EventEmitter();

  displayAnimationLoader = true;
  fullDataLoading$ = new BehaviorSubject<boolean>(false);
  relatedService$: Observable<Service>;
  maxApiCalls = MAX_API_CALLS;
  tipTypes = TipTypeEnum;

  @HostBinding('class.grid-empty')
  isGridEmpty: boolean;

  gridView: GridView;
  displayedGridView: GridView;
  gridView$: Observable<GridView>;
  minCellLengthToShowFullData = 4;
  evidenceSnapshotsMenu: MenuAction[];
  filterEvidenceData: FilterEvidenceDropdownOption[];
  isHelpNeeded: boolean;
  notFoundData: boolean;
  evidenceApiCallsCount: number;
  isDataToPreviewExists: boolean;

  shouldDisplayServiceInstances: boolean;

  evidenceApiQuery(): Observable<string[]> {
    return this.evidenceDistinct$.pipe(map((value) => value.evidence_api_query));
  }

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
        switchMap((evidence) => this.evidenceFullData$),
        map((data) => this.gridViewBuilder.buildGridView(data)),
        shareReplay()
      );

      this.gridView$
        .pipe(
          filter(() => EvidenceTabularPreviewComponent.supportedEvidenceTypesByTicketing[this.rootEvidence.evidence_type]),
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

  ngOnInit(): void {
    this.evidenceDistinct$.pipe(this.detacher.takeUntilDetach()).subscribe((evidence) => {
      this.evidenceFullData$ = this.getEvidenceFullData(evidence.evidence_instance_id);

      this.isHelpNeeded = this.getIsHelpNeeded(evidence);
      this.cd.detectChanges();
    });

    this.translateService
      .get(this.buildTranslationKey('filterEvidence.viewAllDropdownDefault'))
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((keyValue) => {
        this.viewAllFilterEvidenceOption.displayValue = keyValue;
      });
  }

  selectDisplayValueFromFilterEvidenceDropdownOption(
    filterEvidenceDropdownOption: FilterEvidenceDropdownOption
  ): string {
    return filterEvidenceDropdownOption.displayValue;
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `${evidencePreviewTranslationRoot}.${relativeKey}`;
  }

  searchData(gridView: GridRow[]): void {
    this.notFoundData = !gridView.length;
    this.searchItemAmount = gridView.length;
    this.cd.detectChanges();
  }

  resetSearch(): void {
    this.searchComponent.reset();
  }

  resolveCellValue(obj: any): string[] {
    if (Array.isArray(obj)) {
      if (obj.some((entry) => typeof entry === 'object' && entry !== null)) {
        return [JSON.stringify(obj, null, 2)];
      }

      return obj;
    }

    return [obj];
  }

  editUrl(): void {
    this.modalWindowService.openInSwitcher({
      componentsToSwitch: [
        {
          id: 'upload-url-modal',
          componentType: UploadUrlModalComponent,
          contextData: {
            controlRequirement: this.controlRequirement,
            isEditMode: true,
            evidence: this.rootEvidence,
          },
        },
      ],
    });
  }

  selectEvidenceSnapshot(evidence: EvidenceInstance): void {
    this.evidenceSubject$.next(evidence);
    this.evidenceSnapshotSelect.emit(evidence);
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

  private getIsHelpNeeded(evidence: EvidenceInstance): boolean {
    return evidence.evidence_type !== EvidenceTypeEnum.LINK;
  }

  private getEvidenceFullData(evidence_instance_id: string): Observable<{ [key: string]: string[] }> {
    return this.evidenceService.getEvidenceFullData(evidence_instance_id).pipe(
      catchError(() => of({})),
      shareReplay()
    );
  }

  filterCollectionResult(msg: PusherMessage<CollectionResult>): boolean {
    return msg.message_object.collected_evidence_ids.includes(this.rootEvidence.evidence_id);
  }

  async wasParentResourceUpdated(): Promise<boolean> {
    if (this.controlInstance) {
      const expandedControl = await this.controlsFacade
        .getSingleControl(this.controlInstance.control_id)
        .pipe(take(1))
        .toPromise();

      return expandedControl.control_calculated_requirements.some(
        (x) => x.requirement_id === this.controlRequirement.requirement_id
      );
    }
  }
}
