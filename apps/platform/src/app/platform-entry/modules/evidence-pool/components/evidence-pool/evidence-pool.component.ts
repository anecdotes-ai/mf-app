import { FilterDefinition } from 'core/modules/data-manipulation/data-filter';
import { EvidenceFacadeService } from 'core/modules/data/services/facades/evidences-facade/evidences-facade.service';
import { EvidenceInstance, Framework } from 'core/modules/data/models/domain';
import { FrameworkReference } from 'core/modules/data/models';
import { SubscriptionDetacher } from 'core/utils/subscription-detacher.class';
import { SearchInstancesManagerService } from 'core/modules/data-manipulation/search/services';
import { DataSearchComponent } from 'core/modules/data-manipulation/search/components';
import { RootTranslationkey } from './../../constants/translation-keys.constant';
import { TipTypeEnum } from 'core/models/tip.model';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, Subject } from 'rxjs';
import { LoaderManagerService } from 'core/services';
import { DataFilterManagerService } from 'core/modules/data-manipulation/data-filter/services';
import { filter, map, shareReplay, take } from 'rxjs/operators';
import {
  FrameworksFacadeService,
  DataAggregationFacadeService,
} from 'core/modules/data/services';
import { Router } from '@angular/router';
import { AppRoutes } from 'core/constants';

@Component({
  selector: 'app-evidence-pool',
  templateUrl: './evidence-pool.component.html',
  styleUrls: ['./evidence-pool.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvidencePoolComponent implements OnInit {
  // ** PRIVATES **
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private filterStream$: Observable<EvidenceInstance[]>;
  private filteringSubject = new Subject<EvidenceInstance[]>();
  private currentSearchScopeKey: string;
  private dataSearch: DataSearchComponent;
  private anyDataExists$ = new BehaviorSubject(false);
  private filteringDone$ = new BehaviorSubject(false);
  private allData: { [entityId: string]: EvidenceInstance } = {};
  private dictionaryOfFrameworkRefByEvidenceId: { [evidenceId: string]: FrameworkReference[] };
  private noEvidenceYet$ = new BehaviorSubject(false);

  // ** INPUTS / OUTPUTS **

  @Output()
  evidenceLoaded = new EventEmitter();

  // ** PUBLICS **

  isNotFoundState$ = new BehaviorSubject(false);
  tipTypes = TipTypeEnum;
  dataForSort: EvidenceInstance[];
  applicableFrameworks: Framework[];
  emptyStateRelativeKey: string;
  isEmptyState = false;
  filteringStream$: Observable<EvidenceInstance[]>;
  evidence$: Observable<EvidenceInstance[]>;
  noEvidenceYet: boolean;
  isOnSearch$: Observable<boolean>;
  sortedData$: BehaviorSubject<EvidenceInstance[]> = new BehaviorSubject<EvidenceInstance[]>([]);

  constructor(
    private cd: ChangeDetectorRef,
    private filterManager: DataFilterManagerService,
    private evidenceFacadeService: EvidenceFacadeService,
    private searchInstancesManagerService: SearchInstancesManagerService,
    private loaderManager: LoaderManagerService,
    private elementRef: ElementRef<HTMLElement>,
    private frameworksFacade: FrameworksFacadeService,
    private router: Router,
    private dataAggregationFacade: DataAggregationFacadeService
  ) {}

  async ngOnInit(): Promise<void> {
    this.filteringStream$ = this.filteringSubject.asObservable();
    this.loaderManager.show();
    this.currentSearchScopeKey = this.searchInstancesManagerService.getSearchScopeKey(this.elementRef.nativeElement);
    this.filterStream$ = this.filterManager.getDataFilterEvent<EvidenceInstance>();
    this.dataAggregationFacade.getReferencesForAllEvidence()
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((data) => this.dictionaryOfFrameworkRefByEvidenceId = data);
    this.evidence$ = this.evidenceFacadeService.getAllEvidences().pipe(shareReplay());

    this.frameworksFacade
      .getApplicableFrameworks()
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((applicableFrameworks) => {
        this.applicableFrameworks = applicableFrameworks;
      });

    await this.initAsync();
  }

  buildTranslationKey(key: string): string {
    return `${RootTranslationkey}.root.${key}`;
  }

  emptyStateBtnClick(): void {
    this.noEvidenceYet$.getValue() ? this.router.navigate([AppRoutes.Plugins]) : this.dataSearch.reset();
  }

  handleSort(evidences: EvidenceInstance[]): void {
    this.sortedData$.next(evidences);
  }

  ngAfterViewInit(): void {
    combineLatest([this.isNotFoundState$, this.noEvidenceYet$])
      .pipe(this.detacher.takeUntilDetach())
      .subscribe(([isNotFound, noEvidenceYet]) => {
        this.isEmptyState = isNotFound || noEvidenceYet;
        this.noEvidenceYet = noEvidenceYet;
        if (this.isEmptyState) {
          this.emptyStateRelativeKey = `evidencePool.${noEvidenceYet ? 'noEvidence' : 'notFound'}.`;
        }
        this.cd.detectChanges();
      });

    // Hide loader when any evidence recieved and filtering operation is done (that means that the render of elements is done)
    combineLatest([this.anyDataExists$, this.filteringDone$, this.noEvidenceYet$])
      .pipe(
        filter(([exists, filteringDone, noEvidenceYet]) => (exists && filteringDone) || noEvidenceYet),
        take(1)
      )
      .subscribe(() => {
        this.cd.detectChanges();
        this.loaderManager.hide();
      });
  }

  private async initAsync(): Promise<void> {
    this.dataSearch = await this.searchInstancesManagerService
      .getDataSearch(this.currentSearchScopeKey)
      .pipe(
        filter((x) => !!x),
        take(1)
      )
      .toPromise();
    this.isOnSearch$ = this.dataSearch.overlapsFound.pipe(
      map((overlapsEvent) => overlapsEvent.overlaps.length > 0),
      shareReplay()
    );
    this.handleFiltering();
    this.cd.detectChanges();
  }

  // **** SUBSCRIPTION HANDLERS ****

  private handleFiltering(): void {
    this.dataSearch.search.pipe(this.detacher.takeUntilDetach()).subscribe((filteredData) => {
      this.filterData(filteredData);
    });

    this.filterStream$.pipe(this.detacher.takeUntilDetach()).subscribe((filteredData) => {
      this.dataSearch.data = filteredData;
      this.cd.detectChanges();
    });

    this.evidence$.pipe(this.detacher.takeUntilDetach()).subscribe((evidenceList) => {
      evidenceList.forEach((item) => {
        this.allData[item.evidence_id] = item;
      });
      if (evidenceList.length) {
        this.anyDataExists$.next(true);
        this.noEvidenceYet$.next(false);
      } else {
        this.noEvidenceYet$.next(true);
        this.anyDataExists$.next(false);
      }
    });

    this.sortedData$.pipe(this.detacher.takeUntilDetach()).subscribe((evidenceList) => {
      this.filterManager.setData(evidenceList);
    });

    this.evidence$.pipe(take(1), this.detacher.takeUntilDetach()).subscribe(() => {
      this.loadFilteringDefinition();
    });

    this.filterManager
      .getDataFilterEvent()
      .pipe(take(1), this.detacher.takeUntilDetach())
      .subscribe(() => this.filterManager.open());
  }

  // **** FILTERING ****
  private loadFilteringDefinition(): void {
    const filterDefinitionTranslationKey = `${RootTranslationkey}.filterDefinition`;
    const filterDefinition: FilterDefinition<EvidenceInstance>[] = [
      {
        translationKey: `${filterDefinitionTranslationKey}.frameworks`,
        propertySelector: (e: EvidenceInstance) => {
          return this.dictionaryOfFrameworkRefByEvidenceId[e.evidence_id]?.map(ref => ref?.framework?.framework_name);
        },
        fieldId: 'frameworks',
        useSort: true,
        expanded: true,
      },
      {
        translationKey: `${filterDefinitionTranslationKey}.collectedFrom`,
        propertySelector: (e) => e.evidence_service_display_name,
        fieldId: 'plugins',
        useSort: true,
        expanded: true,
      },
    ];

    this.filterManager.setFilterDefinition(filterDefinition);
  }

  filterData(evidence: EvidenceInstance[]): void {
    this.isNotFoundState$.next(!evidence.length);
    this.filteringDone$.next(true);
    this.filteringSubject.next(evidence);
  }

  // **** DESTROY ****
  ngOnDestroy(): void {
    this.detacher.detach();
    this.filterManager.close(true);
    this.loaderManager.hide();
  }

  selectEvidenceId(evidence: EvidenceInstance): string {
    return evidence.evidence_id;
  }
}
