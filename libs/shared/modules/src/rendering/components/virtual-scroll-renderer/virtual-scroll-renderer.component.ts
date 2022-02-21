import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, Optional, ViewChild
} from '@angular/core';
import { toDictionary } from 'core/utils';
import { SearchInstancesManagerService } from 'core/modules/data-manipulation/search';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { BaseRenderer } from '../base-renderer/base-renderer';

export const VIRTUAL_SCROLL_BUFFER = 10;
export const SCROLL_OFFSET = -100;

@Component({
  selector: 'app-virtual-scroll-renderer',
  templateUrl: './virtual-scroll-renderer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualScrollRendererComponent extends BaseRenderer {
  @ViewChild('scroller', { static: true })
  private virtualScroller: VirtualScrollerComponent;

  @Input() virtualScrollBuffer = VIRTUAL_SCROLL_BUFFER;
  @Input() scrollOffset: number;
  @Input() parentScroller: PerfectScrollbarComponent;

  get parentScrollElement(): HTMLElement {
    return (this.parentScroller || this.injectedParentScroller)?.directiveRef?.elementRef.nativeElement;
  }

  constructor(
    searchInstancesManagerService: SearchInstancesManagerService,
    elementRef: ElementRef<HTMLElement>,
    cd: ChangeDetectorRef,
    @Optional() private injectedParentScroller: PerfectScrollbarComponent
  ) {
    super(searchInstancesManagerService, elementRef, cd);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  async scrollToId(id: string): Promise<void> {
    if (this.displayedItemIds.has(id)) {
      const itemToScrollInto = this.allItemsDictionary[id];

      if (itemToScrollInto) {
        await new Promise((resolve, _) =>
          this.virtualScroller.scrollInto(itemToScrollInto, true, this.scrollOffset ?? SCROLL_OFFSET, undefined, () =>
            resolve(undefined)
          )
        );
      }
    }
  }

  protected getItemsForRendering(): any[] {
    // it's because rendered items should preserve items ordering during rendering
    if (this.allItems && this.displayedItemIds) {
      return this.allItems.filter((item) => this.displayedItemIds.has(this.selectId(item)));
    }

    return [];
  }
}
