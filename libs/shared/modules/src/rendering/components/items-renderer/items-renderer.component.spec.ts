/* tslint:disable:no-unused-variable */
import { Component, EventEmitter } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SearchInstancesManagerService, SearchResultsPaginationComponent } from 'core/modules/data-manipulation/search';
import { configureTestSuite } from 'ng-bullet';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { ItemsRendererComponent } from './items-renderer.component';

interface FakeData {
  fakeId: string;
}

@Component({
  selector: '',
  template: `
    <app-items-renderer
      [scrollOffset]="scrollOffset"
      [idSelector]="idSelector"
      [buildRenderingItemsCallback]="buildRenderingItemsCallback"
      [itemAddingStream]="itemAddingStream"
      [allItemsStream]="allItemsStream"
      [filteredItemsStream]="filteredItemsStream"
      [scrollToNewlyAddedItem]="scrollToNewlyAddedItem"
      [scrollToFocusedItem]="scrollToFocusedItem"
    >
      <ng-template #itemTemplate let-item="item" let-index="index">
        <div class="item-from-template">{{ item.name }}</div>
      </ng-template>
    </app-items-renderer>
  `,
})
class HostComponent {
  idSelector: (item) => string;
  buildRenderingItemsCallback = jasmine.createSpy('buildRenderingItemsCallback').and.callFake((items) => items);
  itemAddingStream = new Subject<any>();
  allItemsStream = new BehaviorSubject<any[]>([]);
  filteredItemsStream = new Subject<any[]>();
  scrollToNewlyAddedItem: boolean;
  scrollToFocusedItem: boolean;
}

describe('ItemsRendererComponent', () => {
  configureTestSuite();

  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let componentUnderTest: ItemsRendererComponent;

  let fakeSearchScope: string;
  let searchInstancesManagerMock: SearchInstancesManagerService;
  let searchResultsPaginationMock: SearchResultsPaginationComponent;
  const fakeItem: FakeData = { fakeId: 'some-fake-id' };

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HostComponent, ItemsRendererComponent],
        imports: [VirtualScrollerModule],
        providers: [{ provide: SearchInstancesManagerService, useValue: {} }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    componentUnderTest = fixture.debugElement.query(By.directive(ItemsRendererComponent)).componentInstance;
    hostComponent.idSelector = (item: FakeData) => item.fakeId;
    searchResultsPaginationMock = {} as SearchResultsPaginationComponent;
    searchResultsPaginationMock.dataFocusChange = new EventEmitter();
    fakeSearchScope = 'fake-search-scope';
    searchInstancesManagerMock = TestBed.inject(SearchInstancesManagerService);
    searchInstancesManagerMock.getSearchScopeKey = jasmine
      .createSpy('getSearchScopeKey')
      .and.callFake(() => fakeSearchScope);
    searchInstancesManagerMock.getSearchResultsPaginator = jasmine
      .createSpy('getSearchResultsPaginator')
      .and.callFake(() => of(searchResultsPaginationMock));
  });

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    return fixture.whenStable();
  }

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
    expect(componentUnderTest).toBeTruthy();
  });

  it('should have "items-container" class', async () => {
    // Arrange
    // Act
    await detectChanges();

    // Assert
    expect(fixture.debugElement.query(By.directive(ItemsRendererComponent)).classes['items-container']).toBeTruthy();
  });

  describe('rendering', () => {
    const firstItem: FakeData = { fakeId: 'fake1' };
    const secondItem: FakeData = { fakeId: 'fake2' };
    const thirdItem: FakeData = { fakeId: 'fake3' };
    const fourthItem: FakeData = { fakeId: 'fake4' };
    const allItems = [firstItem, secondItem, thirdItem, fourthItem];
    const itemWrapperClass = 'item-wrapper';

    function queryAllItems(): HTMLElement[] {
      return fixture.debugElement.queryAll(By.css(`.${itemWrapperClass}`)).map((x) => x.nativeElement);
    }

    beforeEach(() => {
      hostComponent.allItemsStream.next(allItems);
    });

    it('should render all items in element with container class', async () => {
      // Arrange
      // Act
      await detectChanges();
      const renderedItems = queryAllItems();

      // Assert
      expect(renderedItems.length).toBe(allItems.length);
    });

    it('should assign ids for items', async () => {
      // Arrange
      // Act
      await detectChanges();
      const renderedItems = queryAllItems();

      // Assert
      allItems.forEach((item, index) => {
        expect(renderedItems[index].id).toBe(item.fakeId);
      });
    });

    describe('isHidden returns false', () => {
      it('should not have hidden class', async () => {
        // Arrange
        spyOn(componentUnderTest, 'isHidden').and.callFake((item) => item !== thirdItem);

        // Act
        await detectChanges();
        const renderedItems = queryAllItems();

        // Assert
        expect(renderedItems[2].classList.contains('hidden')).toBeFalse();
      });
    });

    describe('isHidden returns true', () => {
      it('should have hidden class', async () => {
        // Arrange
        spyOn(componentUnderTest, 'isHidden').and.callFake((item) => item === thirdItem);

        // Act
        await detectChanges();
        const renderedItems = queryAllItems();

        // Assert
        expect(renderedItems[2].classList.contains('hidden')).toBeTrue();
      });
    });
  });

  describe('renderedItems property', () => {
    beforeEach(() => detectChanges());

    it('should have all items in renderedItems', fakeAsync(() => {
      // Arrange
      const expectedItems = [1, 2, 3, 4, 5, 6, 999].map((n) => ({ fakeId: `fake-id-${n}` } as FakeData));

      // Act
      hostComponent.allItemsStream.next(expectedItems);
      tick(100);

      // Assert
      expect(componentUnderTest.renderedItems).toBe(expectedItems);
    }));
  });

  describe('isHidden()', () => {
    beforeEach(() => detectChanges());

    it('should return true if displayedItemIds does not have item id', () => {
      // Arrange
      componentUnderTest.displayedItemIds = new Set([]);

      // Act
      const actual = componentUnderTest.isHidden(fakeItem);

      // Assert
      expect(actual).toBeTrue();
    });

    it('should return true if displayedItemIds has item id', () => {
      // Arrange
      componentUnderTest.displayedItemIds = new Set([fakeItem.fakeId]);

      // Act
      const actual = componentUnderTest.isHidden(fakeItem);

      // Assert
      expect(actual).toBeFalse();
    });
  });

  describe('createItemTemplateContext()', () => {
    const fakeIndex = 133212312;

    beforeEach(() => {
      componentUnderTest.displayedItemIds = new Set();
      detectChanges();
    });

    it('should return an object with property item', () => {
      // Arrange
      // Act
      const actual = componentUnderTest.createItemTemplateContext(fakeItem, fakeIndex);

      // Assert
      expect(actual.item).toBe(fakeItem);
    });

    it('should return an object with property index', () => {
      // Arrange
      // Act
      const actual = componentUnderTest.createItemTemplateContext(fakeItem, fakeIndex);

      // Assert
      expect(actual.index).toBe(fakeIndex);
    });

    it('should return an object with isHidden equal to true if displayedItemIds does not have item id', () => {
      // Arrange
      componentUnderTest.displayedItemIds = new Set([]);

      // Act
      const actual = componentUnderTest.createItemTemplateContext(fakeItem, fakeIndex);

      // Assert
      expect(actual.isHidden).toBeTrue();
    });

    it('should return an object with isHidden equal to false if displayedItemIds has item id', () => {
      // Arrange
      componentUnderTest.displayedItemIds = new Set([fakeItem.fakeId]);

      // Act
      const actual = componentUnderTest.createItemTemplateContext(fakeItem, fakeIndex);

      // Assert
      expect(actual.isHidden).toBeFalse();
    });
  });
});
