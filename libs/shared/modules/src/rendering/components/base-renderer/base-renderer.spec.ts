import { Component, EventEmitter } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { SearchInstancesManagerService, SearchResultsPaginationComponent } from 'core/modules/data-manipulation/search';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { BaseRenderer } from './base-renderer';

interface FakeData {
  id: string;
  customId: string;
  name: string;
}

@Component({
  selector: 'app-base-renderer-inheritor',
})
class InheritorComponent extends BaseRenderer {
  protected getItemsForRendering(): any[] {
    return this.filteredItems;
  }

  scrollToId = jasmine.createSpy('scrollToId');
}

describe('BaseRenderer', () => {
  configureTestSuite();

  let fixture: ComponentFixture<InheritorComponent>;
  let componentUnderTest: InheritorComponent;

  const fakeItem1: FakeData = { id: 'foo1', customId: 'foo2', name: 'foo' };
  const fakeItem2: FakeData = { id: 'foo2', customId: 'foo2', name: 'foobar' };
  const fakeItem3: FakeData = { id: 'bar4', customId: 'bar4', name: 'bar' };
  const fakeItem4: FakeData = { id: 'bar4d', customId: 'bar4d', name: 'bard' };

  let fakeAllData: FakeData[];
  let fakeSearchScope: string;
  let searchInstancesManagerMock: SearchInstancesManagerService;
  let searchResultsPaginationMock: SearchResultsPaginationComponent;
  let allItemsEventEmitter = new EventEmitter();
  let filteredItemsEventEmitter = new EventEmitter();
  let itemAddingEventEmitter = new EventEmitter();

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InheritorComponent],
        providers: [{ provide: SearchInstancesManagerService, useValue: {} }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InheritorComponent);
    componentUnderTest = fixture.componentInstance;
    fakeAllData = [fakeItem1, fakeItem2, fakeItem3, fakeItem4];
    componentUnderTest.allItemsStream = allItemsEventEmitter;
    componentUnderTest.filteredItemsStream = filteredItemsEventEmitter;
    componentUnderTest.itemAddingStream = itemAddingEventEmitter;
    componentUnderTest.idSelector = (item: FakeData) => item.customId;
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
    expect(componentUnderTest).toBeTruthy();
  });

  describe('trackBy', () => {
    describe('item is defined', () => {
      describe('idSelector is specified', () => {
        it('should return id of item using idSelector', async () => {
          // Arrange
          componentUnderTest.idSelector = (item) => item.customId;
          await detectChanges();

          // Act
          const actual = componentUnderTest.trackBy(0, fakeItem3);

          // Assert
          expect(actual).toBe(fakeItem3.customId);
        });
      });

      describe('idSelector is not specified', () => {
        it('should return id of item using "id" property', async () => {
          // Arrange
          // Act
          const actual = componentUnderTest.trackBy(0, fakeItem3);

          // Assert
          expect(actual).toBe(fakeItem3.id);
        });
      });
    });

    describe('item is not defined', () => {
      it('should return index being passed', () => {
        // Arrange
        const index = 123132133;

        // Act
        const actual = componentUnderTest.trackBy(index, undefined);

        // Assert
        expect(actual).toBe(index);
      });
    });
  });

  describe('createItemTemplateContext()', () => {
    it('should return object reflecting properties of item and index', () => {
      // Arrange
      const fakeIndex = 12331;
      const fakeItem = {};

      // Act
      const actualContext = componentUnderTest.createItemTemplateContext(fakeItem, fakeIndex);

      // Assert
      expect(actualContext).toEqual({ item: fakeItem, index: fakeIndex });
    });
  });

  describe('when an item gets deleted from all items', () => {
    [true, false].forEach((idSelectorTestCase) => {
      let expectedItems: FakeData[];
      let itemToDeleteFromAllData: FakeData;

      describe(`idSelector is ${idSelectorTestCase ? '' : 'not'}`, () => {
        beforeEach(async () => {
          componentUnderTest.idSelector = idSelectorTestCase ? (item: FakeData) => item.customId : undefined;
          expectedItems = [fakeItem2, fakeItem3];
          itemToDeleteFromAllData = fakeItem4;
          componentUnderTest.buildRenderingItemsCallback = jasmine
            .createSpy('buildRenderingItemsCallback')
            .and.callFake(() => expectedItems);
          await detectChanges();
          filteredItemsEventEmitter.next([fakeItem2, itemToDeleteFromAllData, fakeItem3]);
        });

        describe('buildRenderingItemsCallback is specified', () => {
          it('should call buildRenderingItemsCallback without deleted item from filtered items', fakeAsync(() => {
            // Arrange
            // Act
            allItemsEventEmitter.next(fakeAllData.filter((item) => item !== itemToDeleteFromAllData));
            tick(500);

            // Assert
            expect(componentUnderTest.buildRenderingItemsCallback).toHaveBeenCalledWith(expectedItems);
          }));

          it('should set rendered items with value from buildRenderingItemsCallback', fakeAsync(() => {
            // Arrange
            expectedItems = [];

            // Act
            allItemsEventEmitter.next(fakeAllData.filter((item) => item !== itemToDeleteFromAllData));
            tick(500);

            // Assert
            expect(componentUnderTest.renderedItems).toBe(expectedItems);
          }));
        });

        describe('buildRenderingItemsCallback is not specified', () => {
          beforeEach(async () => {
            componentUnderTest.buildRenderingItemsCallback = undefined;
            await detectChanges();
          });

          it('should set renderedItems without deleted item from filtered items', fakeAsync(() => {
            // Arrange
            // Act
            allItemsEventEmitter.next(fakeAllData.filter((item) => item !== itemToDeleteFromAllData));
            tick(500);

            // Assert
            expect(componentUnderTest.renderedItems).toEqual(expectedItems);
          }));
        });
      });
    });
  });

  describe('itemAddingStream input', () => {
    let fakeFilteredItems: FakeData[];
    let expectedItems: FakeData[];
    let itemToAdd: FakeData;

    beforeEach(async () => {
      fakeFilteredItems = [fakeItem2, fakeItem4];
      itemToAdd = fakeItem1;
      expectedItems = [...fakeFilteredItems, itemToAdd];
      await detectChanges();
      filteredItemsEventEmitter.next(fakeFilteredItems);
    });

    describe('buildRenderingItemsCallback is set', () => {
      it('should be called with filtered items and added item', async () => {
        // Arrange
        const fakeRenderedItems = [fakeItem4, fakeItem3];
        componentUnderTest.buildRenderingItemsCallback = jasmine
          .createSpy('buildRenderingItemsCallback')
          .and.returnValue(fakeRenderedItems);

        // Act
        await detectChanges();
        itemAddingEventEmitter.next(itemToAdd);

        // Assert
        expect(componentUnderTest.buildRenderingItemsCallback).toHaveBeenCalledWith(expectedItems);
        expect(componentUnderTest.renderedItems).toBe(fakeRenderedItems);
      });
    });

    describe('buildRenderingItemsCallback is not set', () => {
      beforeEach(() => {
        componentUnderTest.buildRenderingItemsCallback = undefined;
      });

      it('should set renderedItems with filteredItems and added item', async () => {
        // Arrange
        // Act
        await detectChanges();
        itemAddingEventEmitter.next(itemToAdd);

        // Assert
        expect(componentUnderTest.renderedItems).toEqual(expectedItems);
      });
    });

    describe('scrollToNewlyAddedItem input is true', () => {
      beforeEach(async () => {
        componentUnderTest.scrollToNewlyAddedItem = true;
        await detectChanges();
      });

      it('should call scrollInto with new item after 500 ms delay when new item added', fakeAsync(() => {
        // Arrange
        componentUnderTest.scrollInto = jasmine.createSpy('scrollInto');

        // Act
        itemAddingEventEmitter.next(itemToAdd);
        expect(componentUnderTest.scrollInto).not.toHaveBeenCalled(); // check that the method is not called immediately
        tick(500);

        // Assert
        expect(componentUnderTest.scrollInto).toHaveBeenCalledWith(itemToAdd);
      }));
    });

    describe('scrollToNewlyAddedItem is false', () => {
      beforeEach(() => {
        componentUnderTest.scrollToNewlyAddedItem = false;
      });

      it('should not scroll when new item added', fakeAsync(() => {
        // Arrange
        componentUnderTest.scrollInto = jasmine.createSpy('scrollInto');

        // Act
        itemAddingEventEmitter.next(itemToAdd);
        tick(1000);

        // Assert
        expect(componentUnderTest.scrollInto).not.toHaveBeenCalled();
      }));
    });
  });

  describe('buildRenderingItemsCallback input', () => {
    let fakeFilteredItems;

    beforeEach(() => {
      fakeFilteredItems = [fakeItem2, fakeItem4];
    });

    describe('is set', () => {
      it('should be called with filtered items', async () => {
        // Arrange
        const fakeRenderedItems = [fakeItem4, fakeItem3];
        componentUnderTest.buildRenderingItemsCallback = jasmine
          .createSpy('buildRenderingItemsCallback')
          .and.returnValue(fakeRenderedItems);

        // Act
        await detectChanges();
        filteredItemsEventEmitter.next(fakeFilteredItems);

        // Assert
        expect(componentUnderTest.buildRenderingItemsCallback).toHaveBeenCalledOnceWith(fakeFilteredItems);
        expect(componentUnderTest.renderedItems).toBe(fakeRenderedItems);
      });
    });

    describe('is not set', () => {
      beforeEach(() => {
        componentUnderTest.buildRenderingItemsCallback = undefined;
      });

      it('should set renderedItems with filteredItems', async () => {
        // Arrange
        // Act
        await detectChanges();
        filteredItemsEventEmitter.next(fakeFilteredItems);

        // Assert
        expect(componentUnderTest.renderedItems).toBe(fakeFilteredItems);
      });
    });
  });

  describe('scrollToFocusedItem input', () => {
    beforeEach(() => {
      componentUnderTest.scrollInto = jasmine.createSpy('scrollInto');
    });

    describe('is true', () => {
      beforeEach(async () => {
        componentUnderTest.scrollToFocusedItem = true;
        await detectChanges();
      });

      it('should scroll to focused item', fakeAsync(() => {
        // Arrange
        searchResultsPaginationMock.currentRow = fakeItem4;

        // Act
        searchResultsPaginationMock.dataFocusChange.emit(fakeItem4);
        tick(500);

        // Assert
        expect(componentUnderTest.scrollInto).toHaveBeenCalledWith(fakeItem4);
      }));
    });

    describe('is false', () => {
      beforeEach(async () => {
        componentUnderTest.scrollToFocusedItem = false;
        await detectChanges();
      });

      it('should not scroll to focused item', fakeAsync(() => {
        // Arrange
        searchResultsPaginationMock.currentRow = fakeItem4;

        // Act
        searchResultsPaginationMock.dataFocusChange.emit(fakeItem4);
        tick(500);

        // Assert
        expect(componentUnderTest.scrollInto).not.toHaveBeenCalled();
      }));
    });
  });

  describe('scrollInto', () => {
    it('should call scrollToId with item id got from id selector', () => {
      // Arrange
      // Act
      componentUnderTest.scrollInto(fakeItem3);

      // Assert
      expect(componentUnderTest.scrollToId).toHaveBeenCalledWith(fakeItem3.customId);
    });

    it('should call scrollToId with item id property', () => {
      // Arrange
      componentUnderTest.idSelector = undefined;
      
      // Act
      componentUnderTest.scrollInto(fakeItem3);

      // Assert
      expect(componentUnderTest.scrollToId).toHaveBeenCalledWith(fakeItem3.id);
    });
  });

  describe('displayedItemIds property', () => {
    let fakeFilteredItems;

    beforeEach(() => {
      fakeFilteredItems = [fakeItem3, fakeItem4];
    });

    describe('idSelector is specified', () => {
      it('should reflect item ids being filtered', async () => {
        // Arrange
        componentUnderTest.idSelector = (item: FakeData) => item.customId;

        // Act
        await detectChanges();
        filteredItemsEventEmitter.next(fakeFilteredItems);

        // Assert
        expect(componentUnderTest.displayedItemIds.size).toBe(2);
        expect(componentUnderTest.displayedItemIds.has(fakeItem3.customId)).toBeTrue();
        expect(componentUnderTest.displayedItemIds.has(fakeItem3.customId)).toBeTrue();
      });
    });

    describe('idSelector is not specified', () => {
      it('should reflect item ids being filtered', async () => {
        // Arrange
        componentUnderTest.idSelector = undefined;
        
        // Act
        await detectChanges();
        filteredItemsEventEmitter.next(fakeFilteredItems);

        // Assert
        expect(componentUnderTest.displayedItemIds.size).toBe(2);
        expect(componentUnderTest.displayedItemIds.has(fakeItem3.id)).toBeTrue();
        expect(componentUnderTest.displayedItemIds.has(fakeItem3.id)).toBeTrue();
      });
    });
  });
});
