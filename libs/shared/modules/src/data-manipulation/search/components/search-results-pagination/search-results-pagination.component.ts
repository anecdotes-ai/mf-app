import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { SubscriptionDetacher } from 'core/utils';
import { filter, take } from 'rxjs/operators';
import { SearchOverlap, SearchOverlapsFoundEvent } from '../../models';
import { SearchInstancesManagerService } from '../../services';
import { DataSearchComponent } from '../data-search/data-search.component';

@Component({
  selector: 'app-search-results-pagination',
  templateUrl: './search-results-pagination.component.html',
  styleUrls: ['./search-results-pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultsPaginationComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private overlaps: SearchOverlap[];
  private index: { rowIndex: number; row: any; overlapIndex: number }[] = [];
  private currentSearchScopeKey: string;
  private dataSearch: DataSearchComponent;

  currentRowIndex: any;
  currentRow: any;
  currentOverlapIndex: number;

  totalSearchResults: number;

  @HostBinding('class.hidden')
  get isHidden(): boolean {
    return !this.totalSearchResults;
  }

  @Output()
  dataFocusChange = new EventEmitter(true);

  currentHighlightedResult: number;

  constructor(
    private cd: ChangeDetectorRef,
    private searchInstancesManagerService: SearchInstancesManagerService,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    this.currentSearchScopeKey = this.searchInstancesManagerService.getSearchScopeKey(this.elementRef.nativeElement);
    this.searchInstancesManagerService.addSearchResultsPaginator(this.currentSearchScopeKey, this);
    this.setupDataBasedSubscriptions();
  }

  ngOnDestroy(): void {
    this.detacher.detach();
    this.searchInstancesManagerService.removeSearchResultsPaginator(this.currentSearchScopeKey);
  }

  clearSearch(): void {
    this.executeDataSearch((dataSearch) => dataSearch.reset());
  }

  goToNextSearchHighlight(): void {
    const currentIndex = this.currentHighlightedResult + 1;

    this.currentRow = this.index[currentIndex].row;
    this.currentRowIndex = this.index[currentIndex].rowIndex;
    this.currentOverlapIndex = this.index[currentIndex].overlapIndex;

    this.dataFocusChange.emit(this.currentRow);
    this.currentHighlightedResult = currentIndex;
  }

  goToPrevSearchHighlight(): void {
    const currentIndex = this.currentHighlightedResult - 1;

    this.currentRow = this.index[currentIndex].row;
    this.currentRowIndex = this.index[currentIndex].rowIndex;
    this.currentOverlapIndex = this.index[currentIndex].overlapIndex;

    this.dataFocusChange.emit(this.currentRow);
    this.currentHighlightedResult = currentIndex;
  }

  private setupDataBasedSubscriptions(): void {
    this.executeDataSearch((dataSearch) => {
      dataSearch.overlapsFound
        .pipe(this.detacher.takeUntilDetach())
        .subscribe((searchOverlapsEvent: SearchOverlapsFoundEvent) => {
          this.overlaps = [];
          this.index = [];

          if (searchOverlapsEvent.overlaps.length) {
            searchOverlapsEvent.overlaps.forEach((o, rowIndex) => {
              for (let overlapIndex = 0; overlapIndex < o.overlapsCount; overlapIndex++) {
                this.overlaps.push(o);
                this.index.push({ rowIndex, row: o.object, overlapIndex });
              }
            });

            this.totalSearchResults = this.overlaps.length;
            this.currentHighlightedResult = -1;
            this.goToNextSearchHighlight();
          } else {
            delete this.currentRow;
            delete this.currentRowIndex;
            delete this.currentOverlapIndex;
            delete this.totalSearchResults;
            delete this.currentHighlightedResult;
          }

          this.cd.detectChanges();
        });
    });
  }

  private executeDataSearch(callback: (dataSearch: DataSearchComponent) => void): void {
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
}
