import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Optional,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { SearchInstancesManagerService } from 'core/modules/data-manipulation/search';
import { BaseRenderer } from '../base-renderer/base-renderer';

@Component({
  selector: 'app-items-renderer',
  templateUrl: './items-renderer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsRendererComponent extends BaseRenderer {
  // This renderer is intend to be implemented for items that we can't use virtual-scroller with
  // Frameworks and Plugins are data that cannot be rendered by virutal-scroller since they aren't row-based
  @HostBinding('class')
  private classes = 'items-container';

  @ViewChildren('itemWrapper')
  private itemWrappers: QueryList<ElementRef<HTMLDivElement>>;

  constructor(
    @Optional() searchInstancesManagerService: SearchInstancesManagerService,
    elementRef: ElementRef<HTMLElement>,
    cd: ChangeDetectorRef
  ) {
    super(searchInstancesManagerService, elementRef, cd);
  }

  async scrollToId(id: string): Promise<void> {
    const element = this.itemWrappers.find((elementRef) => elementRef.nativeElement.id === id);
    element?.nativeElement.scrollIntoView({ block: 'center' });
  }

  isHidden(item: any): boolean {
    return !this.displayedItemIds?.has(this.selectId(item));
  }

  createItemTemplateContext(item: any, index: number): { item: any; index: number; isHidden: boolean } {
    return { ...super.createItemTemplateContext(item, index), isHidden: this.isHidden(item) };
  }

  protected getItemsForRendering(): any[] {
    return this.allItems;
  }
}
