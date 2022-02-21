import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { SortDirection } from 'core/models';
import { DataSearchComponent } from 'core/modules/data-manipulation/search/components';
import { SearchInstancesManagerService } from 'core/modules/data-manipulation/search/services';
import { SubscriptionDetacher } from 'core/utils';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { fromEvent } from 'rxjs';
import { filter, startWith, take } from 'rxjs/operators';
import { GridRow, GridView } from '../../models';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private currentSearchScopeKey: string;

  @ViewChild('ps')
  private ownPerfectScrollBar: PerfectScrollbarComponent;
  @ViewChild('scroller')
  private scroller: VirtualScrollerComponent;

  private dataSearch: DataSearchComponent;

  sortedRows: GridRow[];

  displayedRows: GridRow[];

  currentSortDirection = SortDirection.ASC;

  sortedBy: string; // name of a field that the grid is sorted by

  @Input()
  firstColumnCellTemplate: TemplateRef<any>;

  @Input()
  lastColumnCellTemplate: TemplateRef<any>;

  @Input()
  cellTemplate: TemplateRef<any>;

  @Input()
  firstColumnHeaderTemplate: TemplateRef<any>;

  @Input()
  lastColumnHeaderTemplate: TemplateRef<any>;

  @Input()
  headerTemplate: TemplateRef<any>;

  @Input()
  scopeKey: string;

  @HostBinding('class.scroll-disabled')
  @Input()
  scrollDisabled: boolean;

  @Input()
  gridView: GridView;

  @HostBinding('class.virtual-scroll-enabled')
  @Input()
  useVirtualScroll: boolean;

  @Input()
  sortEnabled: boolean;

  @Input()
  searchEnabled = true;

  @Input()
  headerClass: string;

  get parentScroll(): HTMLElement {
    const perfectScrollBar = this.ownPerfectScrollBar || this.parentPerfectScrollBar;

    return perfectScrollBar?.directiveRef?.elementRef.nativeElement;
  }

  constructor(
    private cd: ChangeDetectorRef,
    @Optional() private parentPerfectScrollBar: PerfectScrollbarComponent,
    private elementRef: ElementRef<HTMLElement>,
    private searchInstancesManagerService: SearchInstancesManagerService
  ) {}

  ngAfterViewInit(): void {
    fromEvent(this.parentScroll, 'scroll')
      .pipe(
        startWith({}), // startWith is used in order to initially check whether scroll is on top
        this.detacher.takeUntilDetach()
        )
      .subscribe(this.handleScrollOnTop.bind(this));
  }

  ngOnInit(): void {
    this.executeDataSearch((dataSearch) =>
      dataSearch.search.pipe(this.detacher.takeUntilDetach()).subscribe((data) => {
        this.displayedRows = data;
        this.cd.detectChanges();
      })
    );

    const scrollerAdditionalOffset = -10;

    this.searchInstancesManagerService
      .getSearchResultsPaginator(this.currentSearchScopeKey)
      .pipe(
        filter((searchPaginator) => !!searchPaginator),
        this.detacher.takeUntilDetach()
      )
      .subscribe((searchPaginator) => {
        if (searchPaginator) {
          searchPaginator.dataFocusChange.pipe(this.detacher.takeUntilDetach()).subscribe(() => {
            this.scroller.scrollInto(searchPaginator.currentRow, undefined, scrollerAdditionalOffset, 0);
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    if ('gridView' in simpleChanges && this.gridView) {
      if (!this.searchEnabled) {
        this.displayedRows = [...this.gridView.rows];
        return;
      }
      this.executeDataSearch((dataSearch) => (dataSearch.searchDefinitions = this.gridView.searchDefinitions));
      this.sortBy(this.sortedBy || this.gridView.header[0], this.currentSortDirection || SortDirection.ASC);

      this.displayedRows = this.sortedRows;
    }
  }

  rowTrackBy(_, row: GridRow): string {
    return row.rowId;
  }

  headerTrackBy(_, header: string): string {
    return header;
  }

  createCellId(rowIndex: number, cellIndex: number): string {
    return `cell-${rowIndex}-${cellIndex}`;
  }

  createHeaderCellId(headerCellIndex: number): string {
    return `headercell-${headerCellIndex}`;
  }

  columnHeaderClick(headerValue: string): void {
    if (this.sortEnabled) {
      if (this.sortedBy === headerValue) {
        switch (this.currentSortDirection) {
          case SortDirection.ASC: {
            this.currentSortDirection = SortDirection.DESC;
            break;
          }
          default: {
            this.currentSortDirection = SortDirection.ASC;
          }
        }
      } else {
        this.currentSortDirection = SortDirection.ASC;
      }

      this.sortBy(headerValue, this.currentSortDirection);
      this.cd.detectChanges();
    }
  }

  private sortBy(fieldName: string, sortDir: SortDirection): void {
    this.sortedBy = fieldName;

    const sortOrder = sortDir === SortDirection.DESC ? -1 : 1;

    this.sortedRows = [...this.gridView.rows].sort((a, b) => {
      if (a.simplifiedCellsObject[fieldName] < b.simplifiedCellsObject[fieldName]) {
        return -1 * sortOrder;
      } else if (a.simplifiedCellsObject[fieldName] > b.simplifiedCellsObject[fieldName]) {
        return 1 * sortOrder;
      } else {
        return 0;
      }
    });
    this.executeDataSearch((dataSearch) => (dataSearch.data = this.sortedRows));
  }

  private executeDataSearch(callback: (dataSearch: DataSearchComponent) => void): void {
    if (!this.searchEnabled) {
      return;
    }
    if (!this.dataSearch) {
      if (!this.currentSearchScopeKey) {
        this.currentSearchScopeKey = this.searchInstancesManagerService.getSearchScopeKey(
          this.elementRef.nativeElement
        );
      }

      this.searchInstancesManagerService
        .getDataSearch(this.currentSearchScopeKey)
        .pipe(
          filter((x) => !!x),
          take(1),
          this.detacher.takeUntilDetach()
        )
        .subscribe((dataSearch) => {
          this.dataSearch = dataSearch;
          callback(dataSearch);
        });
    } else {
      callback(this.dataSearch);
    }
  }

  private handleScrollOnTop(): void {
    const className = 'scroll-at-top';
    const minScrollTopPosition = 12;

    if (this.parentScroll?.scrollTop < minScrollTopPosition) {
      this.elementRef.nativeElement.classList.add(className);
    } else {
      this.elementRef.nativeElement.classList.remove(className);
    }
  }
}
