import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChildren
} from '@angular/core';
import { SubscriptionDetacher } from 'core/utils';
import { SearchableTextComponent, SearchResultsPaginationComponent } from '../../components';
import { SearchInstancesManagerService } from '../../services';
import { RENDER_TIMEOUT } from './constants';

@Directive({
  selector: '[searchableRow]',
  queries: {
    query: new ViewChildren(SearchableTextComponent),
  },
})
export class SearchableRowDirective implements OnDestroy, AfterViewInit {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private isInFocus: boolean;
  private prevRowIndex: number;
  private highlitableElements: { wrapper: Element; highlitable: Element }[] = [];
  private currentlyHighlited: { wrapper: Element; highlitable: Element };

  currentHighlightedResult: number;

  private get _rowTrackBy(): (x) => any {
    return this.rowTrackBy || ((x) => x); // if rowTrackBy is null returns default rowTrackBy
  }

  @Input()
  searchableRow: any;

  @Input()
  scrollToElementOnFocus = false;

  @Input()
  rowTrackBy: (x) => any;

  @Output()
  searchFocusChange = new EventEmitter();

  @Output()
  searchFocusIn = new EventEmitter();

  @Output()
  searchFocusLeave = new EventEmitter();

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private searchInstancesManagerService: SearchInstancesManagerService
  ) {
    this.elementRef.nativeElement.classList.add('x-searchable-row');
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  ngAfterViewInit(): void {
    this.searchInstancesManagerService
      .getSearchResultsPaginator(this.searchInstancesManagerService.getSearchScopeKey(this.elementRef.nativeElement))
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((searchPaginator) => {
        if (searchPaginator) {
          searchPaginator.dataFocusChange.pipe(this.detacher.takeUntilDetach()).subscribe(() => {
            this.handleDataFocusChange(searchPaginator, true);
          });

          this.handleDataFocusChange(searchPaginator);
        }
      });
  }

  // *** ROW Focus Actions ***

  private rowGetsFocus(currentRowIndex: number): void {
    // we want to save the currentrow index as prev so that we will be able to use it when loosing focus.
    this.prevRowIndex = currentRowIndex;
  }

  private rowLoosesFocus(currentRowIndex: number): void {
    // When loossing focus on the row we need to remove the main highlight from the item.
    this.currentlyHighlited?.highlitable.classList.remove('current-highlight');
    delete this.currentlyHighlited;
    delete this.highlitableElements;

    // if we are going up in the search, we should "wrap up" all the changes done in the component.
    // Therefore, we emit serchFocusLeave only when we are going back in the search results.
    // e.g, we want to close expanded control.
    if (this.prevRowIndex > currentRowIndex) {
      this.searchFocusLeave.emit();
    }
  }

  // *** LOGIC ***

  private handleDataFocusChange(searchPaginator: SearchResultsPaginationComponent, dispatchEvents = false): void {
    const isCurrent = this.isCurrent(searchPaginator);
    if (isCurrent && !this.isInFocus) {
      this.rowGetsFocus(searchPaginator.currentRowIndex);
      this.isInFocus = true;
    } else if (this.isInFocus && !isCurrent) {
      this.rowLoosesFocus(searchPaginator.currentRowIndex);
      delete this.isInFocus;
    }

    if (isCurrent) {
      this.handleElemFind(searchPaginator, dispatchEvents);
    }
  }

  private changeOverlap(overlapIndex: number): boolean {
    // responsible for changing the currently highlighted item within the row (if there are more than one).
    const prev = this.highlitableElements[this.currentHighlightedResult];

    this.currentHighlightedResult = overlapIndex;
    this.currentlyHighlited = this.highlitableElements[overlapIndex];

    if (!this.currentlyHighlited) {
      return false;
    }

    prev?.highlitable?.classList.remove('current-highlight');

    this.dispatchLeave(prev);
    this.dispatchFocus(this.currentlyHighlited);

    this.currentlyHighlited?.highlitable?.classList.add('current-highlight');
    return true;
  }

  private queryHighlitableElements(): void {
    this.highlitableElements = [];
    this.elementRef.nativeElement.querySelectorAll('app-searchable-text').forEach((x) => {
      if ((x as HTMLElement).offsetParent !== null) {
        // to check if the element is actually visible currently
        const searchHighlight = Array.from(x.querySelectorAll('.search-highlight'));
        if (searchHighlight?.length > 0) {
          this.highlitableElements.push(
            ...searchHighlight.map((t) => ({
              wrapper: x,
              highlitable: t as Element,
            }))
          );
        }
      }
    });
  }

  // *** Dispatch focus change events to the the ELEMENT within the row (searchable text) ***

  private dispatchFocus(el: { wrapper: Element; highlitable: Element }): void {
    el?.wrapper.dispatchEvent(new Event('focusTerm'));

    if (this.scrollToElementOnFocus) {
      setTimeout(() => el?.highlitable.scrollIntoView({ block: 'center' }), RENDER_TIMEOUT);
    }
  }

  private dispatchLeave(el: { wrapper: Element; highlitable: Element }): void {
    el?.wrapper.dispatchEvent(new Event('focusTermRemoved'));
  }

  // *** HELPERS ***

  private handleElemFind(searchPaginator: SearchResultsPaginationComponent, dispatchEvents = false): void {
    // check if the item was found.
    if (this.findAndFocusOnElement(searchPaginator.currentOverlapIndex, dispatchEvents)) {
      return;
    }
    // If not, treat it as a case in which it wasn't rendered.
    // try notifiyng whoever listens on the eventEmmiter searchFocusBeforeChange that it should render the element
    // and retry.
    this.searchFocusIn.emit();
    setTimeout(() => this.findAndFocusOnElement(searchPaginator.currentOverlapIndex, dispatchEvents), RENDER_TIMEOUT);
  }

  private isCurrent(searchPaginator: SearchResultsPaginationComponent): boolean {
    return this._rowTrackBy(searchPaginator.currentRow) === this._rowTrackBy(this.searchableRow);
  }

  private findAndFocusOnElement(currentOverlapIndex: number, dispatchEvents: boolean): boolean {
    this.queryHighlitableElements();
    const elementFound = this.changeOverlap(currentOverlapIndex);
    if (elementFound && dispatchEvents) {
      this.searchFocusChange.emit();
    }
    return elementFound;
  }
}
