import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  TemplateRef,
} from '@angular/core';
import { SearchInstancesManagerService, SearchResultsPaginationComponent } from 'core/modules/data-manipulation/search';
import { delayedPromise, SubscriptionDetacher, toDictionary } from 'core/utils';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-base-renderer',
  template: '',
})
export abstract class BaseRenderer implements OnInit, OnDestroy {
  private currentSearchScopeKey: string;

  @Input() idSelector: (item) => string;
  @Input() buildRenderingItemsCallback: (items: any[]) => any[];
  @Input() itemAddingStream: Observable<any>;
  @Input() allItemsStream: Observable<any[]>;
  @Input() filteredItemsStream: Observable<any[]>;
  @Input() scrollToNewlyAddedItem: boolean;
  @Input() scrollToFocusedItem: boolean;

  @ContentChild('itemTemplate', { static: true }) itemTemplate: TemplateRef<any>;

  renderedItems: any[];
  displayedItemIds: Set<string>;
  trackBy: (index: number, item: any) => string | number = this.itemTrackBy.bind(this);

  protected readonly detacher: SubscriptionDetacher = new SubscriptionDetacher();
  protected allItemsDictionary: { [key: string]: any };
  protected allItems: any[];
  protected filteredItems: any[];

  constructor(
    @Optional() private searchInstancesManagerService: SearchInstancesManagerService,
    private elementRef: ElementRef<HTMLElement>,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentSearchScopeKey = this.searchInstancesManagerService?.getSearchScopeKey(this.elementRef.nativeElement);

    this.allItemsStream.pipe(this.detacher.takeUntilDetach()).subscribe((allItems) => {
      this.handleAllItemsChange(allItems);
    });

    this.filteredItemsStream.pipe(this.detacher.takeUntilDetach()).subscribe((filteredItems) => {
      this.handleFilteredItems(filteredItems);
    }); 

    if (this.currentSearchScopeKey) {
      this.searchInstancesManagerService
        .getSearchResultsPaginator(this.currentSearchScopeKey)
        .pipe(this.detacher.takeUntilDetach())
        .subscribe((searchPaginator) => this.handleSearchPaginator(searchPaginator));
    }

    this.itemAddingStream
      ?.pipe(this.detacher.takeUntilDetach())
      .subscribe((newItem) => this.handleAddingNewItem(newItem));
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  createItemTemplateContext(item: any, index: number): { item: any; index: number } {
    return { item, index };
  }

  selectId(item: any): string {
    if (this.idSelector) {
      return this.idSelector(item);
    }

    return item.id;
  }

  scrollInto(item: any): Promise<void> {
    return this.scrollToId(this.selectId(item));
  }

  abstract scrollToId(id: string): Promise<void>;

  protected abstract getItemsForRendering(): any[];

  private buildRenderedItems(): any[] {
    const itemsForRendering = this.getItemsForRendering() || [];

    if (this.buildRenderingItemsCallback) {
      return this.buildRenderingItemsCallback(itemsForRendering);
    }

    return itemsForRendering;
  }

  private async handleAddingNewItem(newItem: any): Promise<any> {
    this.filteredItems = [...this.filteredItems, newItem];
    this.renderItems();

    if (this.scrollToNewlyAddedItem) {
      await delayedPromise(500);
      this.scrollInto(newItem);
    }
  }

  private handleAllItemsChange(allItems: any[]): void {
    if (allItems) {
      this.allItems = allItems;
      this.allItemsDictionary = toDictionary(allItems, (item) => this.selectId(item) as string);

      if (this.filteredItems) {
        this.filteredItems = this.filteredItems.reduce((result: Array<any>, item) => {
          const itemFromDictionary = this.allItemsDictionary[this.selectId(item)];

          if (itemFromDictionary) {
            result.push(itemFromDictionary);
          }

          return result;
        }, []);
      }
      this.renderItems();
    }
  }

  private handleSearchPaginator(searchPaginator: SearchResultsPaginationComponent): void {
    if (searchPaginator) {
      searchPaginator.dataFocusChange.pipe(this.detacher.takeUntilDetach()).subscribe(() => {
        if (this.scrollToFocusedItem) {
          this.scrollInto(searchPaginator.currentRow);
        }
      });
    }
  }

  private handleFilteredItems(filteredItems: any[]): void {
    this.filteredItems = filteredItems;
    this.renderItems();
  }

  private renderItems(): void {
    if (this.filteredItems) {
      this.displayedItemIds = new Set(this.filteredItems.map((item) => this.selectId(item)));
    } else {
      this.displayedItemIds = new Set();
    }

    this.renderedItems = this.buildRenderedItems();

    this.cd.detectChanges();
  }

  private itemTrackBy(index: number, item: any): any {
    if (item) {
      return this.selectId(item);
    }

    return index;
  }
}
