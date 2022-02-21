import { Component, EventEmitter, Input, TemplateRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  DataSearchComponent,
  SearchResultsPaginationComponent,
  SearchInstancesManagerService,
} from 'core/modules/data-manipulation/search';
import { configureTestSuite } from 'ng-bullet';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { of } from 'rxjs';
import { GridRow, GridView } from '../../models';
import { SortDirection } from 'core/models';
import { GridComponent } from './grid.component';

@Component({
  /* tslint:disable:component-selector */
  selector: 'virtual-scroller',
  template: ` <ng-content></ng-content> `,
})
class FakeVirtualScrollerComponent {
  @Input()
  items: any[];

  @Input()
  parentScroll: any;

  @Input()
  enableUnequalChildrenSizes: boolean;
}

@Component({
  selector: 'app-host',
  template: `
    <app-grid
      [firstColumnCellTemplate]="firstColumnCellTemplate"
      [lastColumnCellTemplate]="lastColumnCellTemplate"
      [cellTemplate]="cellTemplate"
      [firstColumnHeaderTemplate]="firstColumnHeaderTemplate"
      [lastColumnHeaderTemplate]="lastColumnHeaderTemplate"
      [headerTemplate]="headerTemplate"
      [scrollDisabled]="scrollDisabled"
      [gridView]="gridView"
      [useVirtualScroll]="useVirtualScroll"
      [sortEnabled]="sortEnabled"
    ></app-grid>
  `,
})
class HostComponent {
  firstColumnCellTemplate: TemplateRef<any>;

  lastColumnCellTemplate: TemplateRef<any>;

  cellTemplate: TemplateRef<any>;

  firstColumnHeaderTemplate: TemplateRef<any>;

  lastColumnHeaderTemplate: TemplateRef<any>;

  headerTemplate: TemplateRef<any>;

  scrollDisabled: boolean;

  gridView: GridView;

  useVirtualScroll: boolean;

  sortEnabled: boolean;
}

describe('GridComponent', () => {
  configureTestSuite();

  let hostComponent: HostComponent;
  let componentUnderTest: GridComponent;
  let fixture: ComponentFixture<HostComponent>;

  let searchInstancesManagerServiceMock: SearchInstancesManagerService;
  let fakeSearchScopeKey: string;
  let dataSearchMock: DataSearchComponent;
  let searchResultsPaginator: SearchResultsPaginationComponent;
  let ascSortedRows: GridRow[];
  let dscSortedRows: GridRow[];
  let perfectScrollbar: PerfectScrollbarComponent;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function getFakeVirtualScroller(): FakeVirtualScrollerComponent {
    return fixture.debugElement.query(By.directive(FakeVirtualScrollerComponent))?.componentInstance;
  }

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent, GridComponent, FakeVirtualScrollerComponent],
      providers: [
        { provide: PerfectScrollbarComponent, useValue: {} },
        { provide: SearchInstancesManagerService, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    componentUnderTest = fixture.debugElement.query(By.directive(GridComponent)).componentInstance;
    const gridView = {
      header: ['1', '2'],
      rows: [{ rowId: 'id', cellsObject: {}, simplifiedCellsObject: {}, cells: [] }],
      rawData: {},
      searchDefinitions: [],
    };
    dataSearchMock = {
      search: new EventEmitter<any>(),
    } as any;
    searchResultsPaginator = {
      dataFocusChange: new EventEmitter<any>(),
    } as any;
    hostComponent.gridView = gridView;
    fakeSearchScopeKey = 'fake-search-key';
    searchInstancesManagerServiceMock = TestBed.inject(SearchInstancesManagerService);
    searchInstancesManagerServiceMock.getSearchScopeKey = jasmine
      .createSpy('getSearchScopeKey')
      .and.returnValue(fakeSearchScopeKey);
    searchInstancesManagerServiceMock.getDataSearch = jasmine
      .createSpy('getDataSearch')
      .and.returnValue(of(dataSearchMock));
    searchInstancesManagerServiceMock.getSearchResultsPaginator = jasmine
      .createSpy('getSearchResultsPaginator')
      .and.returnValue(of(searchResultsPaginator));
    hostComponent.gridView = {
      header: ['column-1', 'column-2'],
      rows: [
        { rowId: 'id-4', cellsObject: {}, simplifiedCellsObject: { 'column-1': '1' }, cells: [] },
        { rowId: 'id-1', cellsObject: {}, simplifiedCellsObject: { 'column-1': '4' }, cells: [] },
        { rowId: 'id-2', cellsObject: {}, simplifiedCellsObject: { 'column-1': '3' }, cells: [] },
        { rowId: 'id-3', cellsObject: {}, simplifiedCellsObject: { 'column-1': '2' }, cells: [] },
        { rowId: 'id-5', cellsObject: {}, simplifiedCellsObject: { 'column-1': '2' }, cells: [] },
      ],
      rawData: {},
      searchDefinitions: [],
    };
    ascSortedRows = [
      { rowId: 'id-4', cellsObject: {}, simplifiedCellsObject: { 'column-1': '1' }, cells: [] },
      { rowId: 'id-3', cellsObject: {}, simplifiedCellsObject: { 'column-1': '2' }, cells: [] },
      { rowId: 'id-5', cellsObject: {}, simplifiedCellsObject: { 'column-1': '2' }, cells: [] },
      { rowId: 'id-2', cellsObject: {}, simplifiedCellsObject: { 'column-1': '3' }, cells: [] },
      { rowId: 'id-1', cellsObject: {}, simplifiedCellsObject: { 'column-1': '4' }, cells: [] },
    ];
    dscSortedRows = [
      { rowId: 'id-1', cellsObject: {}, simplifiedCellsObject: { 'column-1': '4' }, cells: [] },
      { rowId: 'id-2', cellsObject: {}, simplifiedCellsObject: { 'column-1': '3' }, cells: [] },
      { rowId: 'id-3', cellsObject: {}, simplifiedCellsObject: { 'column-1': '2' }, cells: [] },
      { rowId: 'id-5', cellsObject: {}, simplifiedCellsObject: { 'column-1': '2' }, cells: [] },
      { rowId: 'id-4', cellsObject: {}, simplifiedCellsObject: { 'column-1': '1' }, cells: [] },
    ];

    perfectScrollbar = fixture.debugElement.injector.get(PerfectScrollbarComponent);
    const native = document.createElement('div');

    perfectScrollbar.directiveRef = {
      elementRef: {
        nativeElement: native,
      },
    } as any;

    spyOnProperty(componentUnderTest, 'parentScroll').and.returnValue(native);
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should set scroll-disabled class if passed scrollDisabled = true', async () => {
    // Arrange
    const host = fixture.debugElement.query(By.directive(GridComponent)).nativeElement;
    hostComponent.scrollDisabled = true;

    // Act
    await detectChanges();

    // Assert
    expect(host.classList.contains('scroll-disabled')).toBeTrue();
  });

  describe('search functionality', () => {
    it('should get search scope key by native element', () => {
      // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      expect(searchInstancesManagerServiceMock.getSearchScopeKey).toHaveBeenCalledWith(
        fixture.debugElement.query(By.directive(GridComponent)).nativeElement
      );
    });

    it('should get data search by search scope key', () => {
      // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      expect(searchInstancesManagerServiceMock.getDataSearch).toHaveBeenCalledWith(fakeSearchScopeKey);
    });
  });

  describe('#rowTrackBy', () => {
    it('should track row by row id', () => {
      // Arrange
      const row = { rowId: 'id', cellsObject: {}, simplifiedCellsObject: {}, cells: [] };

      // Act
      const actual = componentUnderTest.rowTrackBy(undefined, row);

      // Assert
      expect(actual).toBe(row.rowId);
    });
  });

  describe('#headerTrackBy', () => {
    it('should track header', () => {
      // Arrange
      const header = 'some-header';

      // Act
      const actual = componentUnderTest.headerTrackBy(undefined, header);

      // Assert
      expect(actual).toBe(header);
    });
  });

  describe('#createCellId', () => {
    it('should create correct cell id', () => {
      // Arrange
      const rowIndex = 1;
      const cellIndex = 2;

      // Act
      const actual = componentUnderTest.createCellId(rowIndex, cellIndex);

      // Assert
      expect(actual).toBe(`cell-${rowIndex}-${cellIndex}`);
    });
  });

  describe('#createHeaderCellId', () => {
    it('should create correct header cell id', () => {
      // Arrange
      const headerCellIndex = 1;

      // Act
      const actual = componentUnderTest.createHeaderCellId(headerCellIndex);

      // Assert
      expect(actual).toBe(`headercell-${headerCellIndex}`);
    });
  });

  describe('virtual scroll is enabled', () => {
    beforeEach(() => {
      hostComponent.useVirtualScroll = true;
    });

    it('should render virtual scroller component', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(getFakeVirtualScroller()).toBeTruthy();
    });

    it('should provide virtual scroller with parent scroll from injected perfect scrollbar', async () => {
      // Arrange
      await detectChanges();

      // Assert
      expect(getFakeVirtualScroller().parentScroll).toBe(perfectScrollbar.directiveRef.elementRef.nativeElement);
    });

    it('should provide virtual scroller with items', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(getFakeVirtualScroller().items).toEqual(componentUnderTest.displayedRows);
    });

    it('should set enableUnequalChildrenSizes of virtual scroller true value', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(getFakeVirtualScroller().enableUnequalChildrenSizes).toBeTrue();
    });

    describe('rendering inside virtual scroller', () => {
      beforeEach(async () => {
        await detectChanges();
      });

      it('should render table inside virtual scroller based on items property of virtual scroller', async () => {
        // Arrange
        getFakeVirtualScroller().items = [
          { rowId: 'id1', cellsObject: {}, simplifiedCellsObject: {}, cells: [] },
          { rowId: 'id2', cellsObject: {}, simplifiedCellsObject: {}, cells: [] },
        ] as GridRow[];

        // Act
        await detectChanges();

        // Assert
        expect(
          fixture.debugElement.query(By.directive(FakeVirtualScrollerComponent)).query(By.css('table'))
        ).toBeTruthy();
      });
    });
  });

  describe('virtual scroll is disabled', () => {
    beforeEach(() => {
      hostComponent.useVirtualScroll = false;
    });

    it('should not render virtual scroller component', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(getFakeVirtualScroller()).toBeFalsy();
    });
  });

  describe('columnHeaderClick()', () => {
    describe('sortEnabled is true', () => {
      beforeEach(() => {
        hostComponent.sortEnabled = true;
      });

      it('should set current sort direction to ASC if sorting on column different from previous sorted column', async () => {
        // Arrange
        componentUnderTest.sortedBy = 'some-column';

        // Act
        await detectChanges();
        componentUnderTest.columnHeaderClick('another-column');

        // Assert
        expect(componentUnderTest.currentSortDirection).toBe('ASC');
      });

      it('should set current sort direction to ASC if sorting on the same column and previous direction was DSC', async () => {
        // Arrange
        componentUnderTest.sortedBy = 'some-column';
        componentUnderTest.currentSortDirection = SortDirection.DESC;

        // Act
        await detectChanges();
        componentUnderTest.columnHeaderClick('some-column');

        // Assert
        expect(componentUnderTest.currentSortDirection).toBe('ASC');
      });

      it('should set current sort direction to DSC if sorting on the same column and previous direction was ASC', async () => {
        // Arrange
        componentUnderTest.sortedBy = 'some-column';
        componentUnderTest.currentSortDirection = SortDirection.ASC;

        // Act
        await detectChanges();
        componentUnderTest.columnHeaderClick('some-column');

        // Assert
        expect(componentUnderTest.currentSortDirection).toBe('DSC');
      });

      it('should set displayed rows with data got from data search', async () => {
        // Arrange
        const expectedData = [
          { rowId: 'id-1', cellsObject: {}, simplifiedCellsObject: { 'column-1': '4' }, cells: [] },
        ];

        // Act
        await detectChanges();
        componentUnderTest.columnHeaderClick('column-1');
        dataSearchMock.search.emit(expectedData);

        // Assert
        expect(componentUnderTest.displayedRows).toEqual(expectedData);
      });

      it('should provide data search with sorted rows by ASC order when sort direction is DSC', async () => {
        // Arrange
        componentUnderTest.currentSortDirection = SortDirection.DESC;

        // Act
        await detectChanges();
        componentUnderTest.columnHeaderClick('column-1');

        // Assert
        expect(dataSearchMock.data).toEqual(ascSortedRows);
      });

      it('should provide data search with sorted rows by DSC order', async () => {
        // Arrange
        componentUnderTest.sortedBy = 'column-1';
        componentUnderTest.currentSortDirection = SortDirection.ASC;

        // Act
        await detectChanges();
        componentUnderTest.columnHeaderClick('column-1');

        // Assert
        expect(dataSearchMock.data).toEqual(dscSortedRows);
      });
    });

    describe('sortEnabled is false', () => {
      beforeEach(() => {
        hostComponent.sortEnabled = false;
      });

      it('should not change sortedBy', async () => {
        // Arrange
        await detectChanges();
        const expectedSortedBy = componentUnderTest.sortedBy;

        // Act
        await detectChanges();
        componentUnderTest.columnHeaderClick('another-column');

        // Assert
        expect(componentUnderTest.sortedBy).toBe(expectedSortedBy);
      });

      it('should not change currentSortDirection', async () => {
        // Arrange
        // Act
        await detectChanges();
        componentUnderTest.columnHeaderClick('column-1');

        // Assert
        expect(componentUnderTest.currentSortDirection).toBe(SortDirection.ASC);
      });

      it('should not change data in dataSearch', async () => {
        // Arrange
        await detectChanges();
        const expectedData = [...dataSearchMock.data];

        // Act
        await detectChanges();
        componentUnderTest.columnHeaderClick('column-1');

        // Assert
        expect(dataSearchMock.data).toEqual(expectedData);
      });
    });
  });

  describe('ngOnChanges', () => {
    it('should set dipsplayedRows for first change of gridView with sorted rows by ASC', async () => {
      // Arrange
      // Act
      await detectChanges();

      // Assert
      expect(componentUnderTest.displayedRows).toEqual(ascSortedRows);
    });

    it('should not change dipsplayedRows for further changes of gridView', async () => {
      // Arrange
      await detectChanges(); // The First change

      const currentDisplayedRows = [...componentUnderTest.displayedRows];
      const newGridView = { ...componentUnderTest.gridView };
      hostComponent.gridView = newGridView;

      // Act
      await detectChanges(); // The second change

      // Assert
      expect(componentUnderTest.displayedRows).toEqual(currentDisplayedRows);
    });
  });
});
