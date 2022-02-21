/* tslint:disable:no-unused-variable */
import { Component, EventEmitter } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchInstancesManagerService, SearchResultsPaginationComponent } from 'core/modules/data-manipulation/search';
import { configureTestSuite } from 'ng-bullet';
import { VirtualScrollerComponent, VirtualScrollerModule } from 'ngx-virtual-scroller';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { VirtualScrollRendererComponent } from './virtual-scroll-renderer.component';

interface FakeItem {
  customId: string;
}

@Component({
  selector: '',
  template: `
    <app-virtual-scroll-renderer
      [virtualScrollBuffer]="virtualScrollBuffer"
      [scrollOffset]="scrollOffset"
      [parentScroller]="parentScroller"
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
    </app-virtual-scroll-renderer>
  `,
})
class HostComponent {
  virtualScrollBuffer: number;
  scrollOffset: number;
  parentScroller: any;
  idSelector: (item) => string;
  buildRenderingItemsCallback = jasmine.createSpy('buildRenderingItemsCallback');
  itemAddingStream = new Subject<any>();
  allItemsStream = new BehaviorSubject<any[]>([]);
  filteredItemsStream = new BehaviorSubject<any[]>([]);
  scrollToNewlyAddedItem: boolean;
  scrollToFocusedItem: boolean;
}

describe('VirtualScrollRendererComponent', () => {
  configureTestSuite();

  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let componentUnderTest: VirtualScrollRendererComponent;

  let virutalScroller: VirtualScrollerComponent;
  let fakeSearchScope: string;
  let searchInstancesManagerMock: SearchInstancesManagerService;
  let searchResultsPaginationMock: SearchResultsPaginationComponent;

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HostComponent, VirtualScrollRendererComponent],
        imports: [VirtualScrollerModule, NoopAnimationsModule],
        providers: [{ provide: SearchInstancesManagerService, useValue: {} }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    componentUnderTest = fixture.debugElement.query(By.directive(VirtualScrollRendererComponent)).componentInstance;
    virutalScroller = fixture.debugElement.query(By.directive(VirtualScrollerComponent)).componentInstance;
    hostComponent.idSelector = (item: FakeItem) => item.customId;
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
    virutalScroller.scrollInto = jasmine.createSpy('scrollInto');
  });

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    return fixture.whenStable();
  }

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
    expect(componentUnderTest).toBeTruthy();
  });

  describe('scrolling methods', () => {
    const fakeItem: FakeItem = { customId: 'fake id' };

    beforeEach(() => {
      hostComponent.allItemsStream.next([fakeItem]);
      hostComponent.filteredItemsStream.next([fakeItem]);
      detectChanges();
    });

    describe('scrollToId()', () => {
      it('should call virutalScroller.scrollInto with new item after 500 ms delay when new item added', () => {
        // Arrange
        // Act
        componentUnderTest.scrollToId(fakeItem.customId);

        // Assert
        expect(virutalScroller.scrollInto).toHaveBeenCalledWith(fakeItem, jasmine.anything(), jasmine.anything(), undefined, jasmine.anything());
      });

      it('should call virutalScroller.scrollInto with new item after 500 ms delay when new item added', () => {
        // Arrange
        // Act
        componentUnderTest.scrollToId(fakeItem.customId);

        // Assert
        expect(virutalScroller.scrollInto).toHaveBeenCalledWith(jasmine.anything(), true, jasmine.anything(), undefined, jasmine.anything());
      });

      it('should call virutalScroller.scrollInto with default scroll offset when new item added', () => {
        // Arrange
        // Act
        componentUnderTest.scrollToId(fakeItem.customId);

        // Assert
        expect(virutalScroller.scrollInto).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), -100, undefined, jasmine.anything());
      });

      it('should call virutalScroller.scrollInto with default "scrollOffset" input when new item added', fakeAsync(() => {
        // Arrange
        const fakeOffset = 23131321313;
        hostComponent.scrollOffset = fakeOffset;
        detectChanges();
        tick(100);

        // Act
        componentUnderTest.scrollToId(fakeItem.customId);

        // Assert
        expect(virutalScroller.scrollInto).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), fakeOffset, undefined, jasmine.anything());
      }));

      it('should resolve being returned promise when animation callback is called', async () => {
        // Arrange
        virutalScroller.scrollInto = jasmine
          .createSpy('scrollInto')
          .and.callFake(
            (
              item: any,
              alignToBeginning?: boolean,
              additionalOffset?: number,
              animationMilliseconds?: number,
              animationCompletedCallback?: () => void
            ) => {
              setTimeout(() => {
                animationCompletedCallback();
              }, 50);
            }
          );

        const fakeOffset = 23131321313;
        hostComponent.scrollOffset = fakeOffset;
        await detectChanges();

        // Act
        await componentUnderTest.scrollToId(fakeItem.customId);

        // Assert
        // test will fail if the promise above is not resolved (await). it's intentional.
        expect(virutalScroller.scrollInto).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), fakeOffset, undefined, jasmine.any(Function));
      });
    });
  });
});
