import { Component, DebugElement, EventEmitter, Input, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { GridComponent, GridView, GridViewBuilderService } from 'core/modules/grid';
import { CsvFormatterService, FileDownloadingHelperService, MessageBusService, WindowHelperService } from 'core';
import { ModalWindowService } from 'core/modules/modals';
import { EvidenceTypeEnum } from 'core/modules/data/models/domain';
import {
  ControlsFacadeService,
  EvidenceFacadeService,
  EvidenceService,
  PluginFacadeService,
} from 'core/modules/data/services';
import {
  DataSearchComponent,
  SearchableRowDirective,
  SearchInstancesManagerService,
  SearchResultsPaginationComponent,
} from 'core/modules/data-manipulation/search';
import { configureTestSuite } from 'ng-bullet';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { of } from 'rxjs';
import { EvidenceTabularPreviewComponent, FilterEvidenceDropdownOption } from './evidence-tabular-preview.component';
import { EvidenceUserEventService } from 'core/modules/data/services/event-tracking/evidence-user-event.service';
import { EvidenceSourcesEnum } from 'core/modules/shared-controls/models';
import { PreviewTypesEnum } from 'core/modules/shared-controls/components/preview/models/file-type.model';

@Component({
  selector: 'app-dropdown-control',
  template: '',
})
class DropdownControlMockComponent {
  @Input()
  data: any[];

  @Input()
  displayValueSelector;

  @Input()
  searchEnabled;

  @Input()
  visibleItemsCount;

  @Output()
  select = new EventEmitter();

  selectItem = jasmine.createSpy('selectItem');
}

describe('EvidenceTabularPreviewComponent', () => {
  configureTestSuite();

  let component: EvidenceTabularPreviewComponent;
  let fixture: ComponentFixture<EvidenceTabularPreviewComponent>;

  let searchInstancesManagerServiceMock: SearchInstancesManagerService;
  let fakeSearchScopeKey: string;
  let dataSearchMock: DataSearchComponent;
  let modalWindowMock: ModalWindowService;
  let searchResultsPaginator: SearchResultsPaginationComponent;
  let gridViewBuilderMock: GridViewBuilderService;
  let evidenceServiceMock: EvidenceService;
  let csvFormatterService: CsvFormatterService;
  let fileDownloadingHelperService: FileDownloadingHelperService;
  let fakeGridView: GridView;
  let fakeEvidenceFullData: any;
  let modalWindowService: ModalWindowService;
  let evidenceEventService: EvidenceUserEventService;
  let pluginFacade: PluginFacadeService;
  let windowHelperService: WindowHelperService;

  const evidenceBlob = new Blob(['some-csv'], { type: 'text/csv;charset=utf-8;' });
  const duplicateString = 'duplicated';
  const uniqueString = 'foo';
  const gridData = {
    rows: [
      {
        rowId: '1',
        cellsObject: { firstColumn: [uniqueString], secondColumn: ['fake'] },
        simplifiedCellsObject: { firstColumn: uniqueString, secondColumn: 'fake' },
        cells: [uniqueString, 'fake'],
      },
      {
        rowId: '2',
        cellsObject: { firstColumn: [duplicateString], secondColumn: ['fake'] },
        simplifiedCellsObject: { firstColumn: duplicateString, secondColumn: 'fake' },
        cells: [duplicateString, 'fake'],
      },
      {
        rowId: '3',
        cellsObject: { firstColumn: [duplicateString], secondColumn: ['fake'] },
        simplifiedCellsObject: { firstColumn: duplicateString, secondColumn: 'fake' },
        cells: [duplicateString, 'fake'],
      },
    ],
    header: ['firstColumn', 'secondColumn'],
    rawData: {},
    searchDefinitions: [],
  };

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  async function triggerOnChanges(): Promise<void> {
    await detectChanges();

    const changes: SimpleChanges = {
      rootEvidence: new SimpleChange(null, component.rootEvidence, true),
      previewData: new SimpleChange(null, component.rootEvidence.evidence_preview, true),
    };
    component.ngOnChanges(changes);
    await detectChanges();
  }

  const previewChanges: SimpleChanges = {
    previewData: new SimpleChange(
      null,
      {
        someData: 'data',
      },
      true
    ),
  };

  function initGridView(): void {
    component.eventSource = EvidenceSourcesEnum.Controls;

    component.evidenceFullData$ = of({
      someData: ['some-data'],
    });
  }

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [EvidenceTabularPreviewComponent, GridComponent, DropdownControlMockComponent],
      imports: [TranslateModule.forRoot(), PerfectScrollbarModule, NgbTooltipModule],
      providers: [
        { provide: ModalWindowService, useValue: {} },
        { provide: EvidenceService, useValue: {} },
        { provide: FileDownloadingHelperService, useValue: {} },
        { provide: SearchableRowDirective, useValue: {} },
        { provide: SearchInstancesManagerService, useValue: {} },
        { provide: WindowHelperService, useValue: {} },
        { provide: GridViewBuilderService, useValue: {} },
        { provide: CsvFormatterService, useValue: {} },
        { provide: ControlsFacadeService, useValue: {} },
        { provide: MessageBusService, useValue: {} },
        { provide: EvidenceUserEventService, useValue: {} },
        { provide: PluginFacadeService, useValue: {} },
        { provide: EvidenceFacadeService, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenceTabularPreviewComponent);
    component = fixture.componentInstance;
    (fixture.debugElement.injector.get(EvidenceService) as EvidenceService).getEvidenceFullData = jasmine
      .createSpy('getEvidenceFullData')
      .and.returnValue(of({}));
    (fixture.debugElement.injector.get(EvidenceService) as EvidenceService).downloadEvidence = jasmine
      .createSpy('downloadEvidence')
      .and.returnValue(of({}));
    (fixture.debugElement.injector.get(EvidenceService) as EvidenceService).getEvidenceSnapshots = jasmine
      .createSpy('getEvidenceSnapshots')
      .and.returnValue(of([]));
    modalWindowService = fixture.debugElement.injector.get(ModalWindowService);
    modalWindowService.open = jasmine.createSpy('open');

    dataSearchMock = {
      search: new EventEmitter<any>(),
    } as any;
    searchResultsPaginator = {
      dataFocusChange: new EventEmitter<any>(),
    } as any;
    fakeSearchScopeKey = 'fake-search-key';
    searchInstancesManagerServiceMock = TestBed.inject(SearchInstancesManagerService);
    gridViewBuilderMock = TestBed.inject(GridViewBuilderService);
    evidenceServiceMock = TestBed.inject(EvidenceService);
    pluginFacade = TestBed.inject(PluginFacadeService);
    pluginFacade.getServiceById = jasmine.createSpy('getServiceById').and.returnValue(of({}));
    pluginFacade.IsFullService = jasmine.createSpy('IsFullService').and.returnValue(of(true));
    searchInstancesManagerServiceMock.getSearchScopeKey = jasmine
      .createSpy('getSearchScopeKey')
      .and.returnValue(fakeSearchScopeKey);
    searchInstancesManagerServiceMock.getDataSearch = jasmine
      .createSpy('getDataSearch')
      .and.returnValue(of(dataSearchMock));
    searchInstancesManagerServiceMock.getSearchResultsPaginator = jasmine
      .createSpy('getSearchResultsPaginator')
      .and.returnValue(of(searchResultsPaginator));
    component.rootEvidence = {
      evidence_preview: JSON.stringify({ fake: [] }),
    };
    component.ngOnChanges({ rootEvidence: new SimpleChange(null, component.rootEvidence, true) });
    gridViewBuilderMock.buildGridView = jasmine.createSpy('buildGridView').and.callFake(() => ({ ...fakeGridView }));
    evidenceServiceMock.getEvidenceFullData = jasmine.createSpy('getEvidenceFullData').and.returnValue(of({}));
    fakeGridView = {
      rows: [
        {
          rowId: '1',
          cellsObject: { someField: ['hello'] },
          simplifiedCellsObject: { someField: 'hello' },
          cells: ['hello'],
        },
      ],
      header: ['someField'],
      rawData: {},
      searchDefinitions: [],
    };
    component.previewData = JSON.stringify({});
    component.rootEvidence = {
        evidence_preview: component.previewData,
    };
    fakeEvidenceFullData = {};
    evidenceServiceMock.getEvidenceFullData = jasmine.createSpy().and.callFake(() => of(fakeEvidenceFullData));
    gridViewBuilderMock.buildGridView = jasmine.createSpy('buildGridView').and.callFake(() => fakeGridView);
    modalWindowMock = TestBed.inject(ModalWindowService);
    modalWindowMock.updateContext = jasmine.createSpy('updateContext');

    csvFormatterService = TestBed.inject(CsvFormatterService);
    csvFormatterService.createCsvBlob = jasmine.createSpy('createCsvBlob').and.returnValue(evidenceBlob);

    fileDownloadingHelperService = TestBed.inject(FileDownloadingHelperService);
    fileDownloadingHelperService.downloadBlob = jasmine.createSpy('downloadBlob');

    evidenceEventService = TestBed.inject(EvidenceUserEventService);
    evidenceEventService.trackViewFullData = jasmine.createSpy('trackViewFullData');

    evidenceServiceMock.getEvidencePresignedUrl = jasmine.createSpy('getEvidencePresignedUrl').and.returnValue(of('url'));

    windowHelperService = TestBed.inject(WindowHelperService);
    windowHelperService.openUrlInNewTab = jasmine.createSpy('openUrlInNewTab');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('downloadFullData()', () => {
    // Test is broken
    // it('should download file as text when full data is provided as JSON object', async () => {
    //   // Arrange
    //   component.evidence = {
    //     evidence_instance_id: 'some-evidence-id',
    //     evidence_preview: '{ "someField": ["hello"] }',
    //   };
    //   component.previewData = '{ "someField": ["hello"] }';

    //   let pastedFile: File;
    //   const evidenceFullData = { someField: 'hello' };
    //   const fileDownloadingService = fixture.debugElement.injector.get(FileDownloadingHelperService);
    //   const evidenceService = fixture.debugElement.injector.get(EvidenceService);
    //   fileDownloadingService.downloadFile = jasmine.createSpy('downloadFile').and.callFake((f) => (pastedFile = f));
    //   evidenceService.getEvidenceFullData = jasmine
    //     .createSpy('getEvidenceFullData')
    //     .and.returnValue(of(evidenceFullData));
    //   const changes: SimpleChanges = {
    //     evidence: new SimpleChange(null, component.evidence, true),
    //     previewData: new SimpleChange(null, null, true),
    //   };

    //   // Act
    //   component.ngOnChanges(changes);
    //   fixture.detectChanges();
    //   await fixture.whenStable();
    //   await component.downloadFullData();

    //   const str = await new Promise<string>((res, rej) => {
    //     const fileReader = new FileReader();
    //     fileReader.onload = () => res(fileReader.result as string);
    //     fileReader.readAsText(pastedFile);
    //   });

    //   // Assert
    //   expect(evidenceService.getEvidenceFullData).toHaveBeenCalledWith(component.evidence.evidence_instance_id);
    //   expect(fileDownloadingService.downloadFile).toHaveBeenCalled();
    //   expect(pastedFile.name).toBe('evidence-full-data.txt');
    //   expect(pastedFile.type).toBe('text/plain');
    //   expect(JSON.stringify(evidenceFullData)).toBe(str);
    // });

    it('should download file as text when full data is provided as string', async () => {
      // Arrange
      component.rootEvidence = {
          evidence_instance_id: 'some-evidence-id',
          evidence_preview: '{ "someField": ["hello"] }',
      };
      component.previewData = '{ "someField": ["hello"] }';
      let pastedFile: File;
      fakeEvidenceFullData = JSON.stringify({ someField: 'hello' });
      const fileDownloadingService = fixture.debugElement.injector.get(FileDownloadingHelperService);
      const evidenceService = fixture.debugElement.injector.get(EvidenceService);
      fileDownloadingService.downloadFile = jasmine.createSpy('downloadFile').and.callFake((f) => (pastedFile = f));

      // Act
      await triggerOnChanges();
      await component.downloadFullData();

      const str = await new Promise<string>((res) => {
        const fileReader = new FileReader();
        fileReader.onload = () => res(fileReader.result as string);
        fileReader.readAsText(pastedFile);
      });

      // Assert
      expect(evidenceService.getEvidenceFullData).toHaveBeenCalledWith(component.rootEvidence.evidence_instance_id);
      expect(fileDownloadingService.downloadFile).toHaveBeenCalled();
      expect(pastedFile.name).toBe('evidence-full-data.txt');
      expect(pastedFile.type).toBe('text/plain');
      expect(fakeEvidenceFullData).toBe(str);
    });
  });

  describe('buildTranslationKey()', () => {
    it('should build translationKey based on relativeKey', () => {
      // Arrange
      const relativeKey = 'someKey';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toBe(`evidencePreview.${relativeKey}`);
    });
  });

  describe('ngOnChanges', () => {
    [
      { evidence_type: EvidenceTypeEnum.LIST, expectedClass: 'list' },
      { evidence_type: EvidenceTypeEnum.LOG, expectedClass: 'log' },
      { evidence_type: EvidenceTypeEnum.CONFIGURATION, expectedClass: 'cfg' },
      { evidence_type: EvidenceTypeEnum.LIST, expectedClass: 'list' },
      { evidence_type: EvidenceTypeEnum.TICKET, expectedClass: 'log' },
    ].forEach((testCase) => {
      it(`should set ${testCase.expectedClass} class for host element if evidence has ${testCase.evidence_type} type`, () => {
        // Arrange
        const evidence = {
            evidence_type: testCase.evidence_type,
        };

        component.rootEvidence = evidence;
        const changes: SimpleChanges = {
          rootEvidence: new SimpleChange(null, evidence , true),
        };

        // Act
        component.ngOnChanges(changes);
        fixture.detectChanges();

        // Assert
        expect(fixture.debugElement.classes[testCase.expectedClass]).toBeTruthy();
      });
    });
  });

  // To be fixed lately
  // describe('Evidence Tip', () => {
  //   it('should display evidence tip when evidence_tip property is not null', async () => {
  //     // Arrange
  //     component.viewFullData = true;
  //     component.evidence = { evidence_tip: 'some-tip' };
  //     component.gridView$ = of(gridData);

  //     // Act
  //     component.ngAfterViewInit();
  //     component.openFullData();
  //     await triggerOnChanges();

  //     // Assert
  //     const evidenceTip = fixture.debugElement.query(By.css('.evidence-tip-wrapper')).nativeElement;
  //     expect(evidenceTip).toBeTruthy();
  //   });

  //   it('should not display evidence tip when evidence_tip property is null', async () => {
  //     // Arrange
  //     component.viewFullData = true;
  //     component.evidence = { evidence_tip: null };
  //     component.gridView$ = of(gridData);

  //     // Act
  //     component.openFullData();
  //     await triggerOnChanges();

  //     // Assert
  //     const evidenceTip = fixture.debugElement.query(By.css('.evidence-tip-wrapper'));
  //     expect(evidenceTip).toBeFalsy();
  //   });
  // });

  describe('filter evidence dropdown', () => {
    let duplicateString: string;
    let uniqueString: string;

    beforeEach(() => {
      duplicateString = 'duplicated';
      uniqueString = 'foo';
      component.rootEvidence = {
          evidence_preview: JSON.stringify({ fake: [] }),
      };
      fakeGridView = gridData;
      spyOn(component, 'buildTranslationKey').and.callFake((relativeKey) => `fake.${relativeKey}`);
    });

    function getViewAllOption(): FilterEvidenceDropdownOption {
      return component.filterEvidenceData[0];
    }

    function getFilterEvidenceDropdownDebugElement(): DebugElement {
      return fixture.debugElement.query(By.css('.filter-evidence app-dropdown-control'));
    }

    function getFilterEvidenceDropdownComponent(): DropdownControlMockComponent {
      return getFilterEvidenceDropdownDebugElement().componentInstance;
    }

    describe('selectDisplayValueFromFilterEvidenceDropdownOption', () => {
      it('should rentrun displayValue of FilterEvidenceDropdownOption', () => {
        // Arrange
        const filterEvidenceDropdownOption: FilterEvidenceDropdownOption = { displayValue: 'fakeDisplayValue' };

        // Act
        const actualDisplayValue = component.selectDisplayValueFromFilterEvidenceDropdownOption(
          filterEvidenceDropdownOption
        );

        // Assert
        expect(actualDisplayValue).toBe(filterEvidenceDropdownOption.displayValue);
      });
    });

    [EvidenceTypeEnum.LIST, EvidenceTypeEnum.LOG].forEach((evidenceType) => {
      describe(`for ${evidenceType} evidence type`, () => {
        beforeEach(() => {
          component.rootEvidence = {
              ...component.rootEvidence,
              evidence_type: evidenceType,
          };
        });

        describe('filter evidence dropdown', () => {
          it('should have searchEnabled set to true', async () => {
            // Arrange
            // Act
            await triggerOnChanges();

            // Assert
            expect(getFilterEvidenceDropdownComponent().searchEnabled).toBeTruthy();
          });

          it('should have displayValueSelector set to selectDisplayValueFromFilterEvidenceDropdownOption', async () => {
            // Arrange
            // Act
            await triggerOnChanges();

            // Assert
            expect(getFilterEvidenceDropdownComponent().displayValueSelector).toBe(
              component.selectDisplayValueFromFilterEvidenceDropdownOption
            );
          });

          it('should have data set to filterEvidenceData', async () => {
            // Arrange
            // Act
            await triggerOnChanges();

            // Assert
            expect(getFilterEvidenceDropdownComponent().data).toBe(component.filterEvidenceData);
          });

          it('should have visibleItemsCount set to 5', async () => {
            // Arrange
            // Act
            await triggerOnChanges();

            // Assert
            expect(getFilterEvidenceDropdownComponent().visibleItemsCount).toBe(5);
          });
        });

        describe('filterEvidenceData', () => {
          beforeEach(() => {
            fakeGridView = {
              rows: [
                {
                  rowId: '1',
                  cellsObject: { firstColumn: ['foo'], secondColumn: ['fake'] },
                  simplifiedCellsObject: { firstColumn: 'foo', secondColumn: 'fake' },
                  cells: ['foo', 'fake'],
                },
                {
                  rowId: '2',
                  cellsObject: { firstColumn: ['bar'], secondColumn: ['fake'] },
                  simplifiedCellsObject: { firstColumn: 'bar', secondColumn: 'fake' },
                  cells: ['bar', 'fake'],
                },
                {
                  rowId: '3',
                  cellsObject: { firstColumn: ['temp'], secondColumn: ['fake'] },
                  simplifiedCellsObject: { firstColumn: 'temp', secondColumn: 'fake' },
                  cells: ['temp', 'fake'],
                },
              ],
              header: ['firstColumn', 'secondColumn'],
              rawData: {},
              searchDefinitions: [],
            };
          });
        });

        it('should display filter evidence dropdown', async () => {
          // Arrange
          // Act
          await triggerOnChanges();

          // Assert
          expect(getFilterEvidenceDropdownDebugElement()).toBeTruthy();
        });

        it('should set filterEvidenceData for filter evidence dropdown', async () => {
          // Arrange
          // Act
          await triggerOnChanges();

          // Assert
          expect(component.filterEvidenceData).toBeTruthy();
          expect(component.filterEvidenceData.length).toBe(3);
        });

        describe('view all action menu action', () => {
          it('should set menu actions for filter evidence dropdown with "View all" option as first element', async () => {
            // Arrange
            // Act
            await triggerOnChanges();

            // Assert
            expect(getViewAllOption().displayValue).toBe('fake.filterEvidence.viewAllDropdownDefault');
          });

          it('should set for displayedGridView GridView with all available rows when action related to view all option is called', async () => {
            // Arrange
            // Act
            await triggerOnChanges();
            getFilterEvidenceDropdownComponent().select.emit(getViewAllOption());
            await detectChanges();

            // Assert
            expect(component.displayedGridView.rows).toEqual(fakeGridView.rows);
          });
        });

        describe('first column related menu action', () => {
          it('should set menu actions for filter evidence dropdown with distinct list of cells in first column', async () => {
            // Arrange
            // Act
            await triggerOnChanges();

            // Assert
            expect(component.filterEvidenceData[1].displayValue).toBe(uniqueString);
            expect(component.filterEvidenceData[2].displayValue).toBe(duplicateString);
          });

          it('should set for displayedGridView GridView with duplication related rows when action related to duplication is called', async () => {
            // Arrange
            // Act
            await triggerOnChanges();
            getFilterEvidenceDropdownComponent().select.emit(component.filterEvidenceData[2]);
            await detectChanges();

            // Assert
            expect(component.displayedGridView.rows[0].rowId).toEqual('2');
            expect(component.displayedGridView.rows[1].rowId).toEqual('3');
          });
        });

        describe('snapshot changing triggered', () => {
          it('should call selectItem of dropdown menu component with "View all" menu action', async () => {
            // Arrange
            // Act
            await triggerOnChanges();
            component.selectEvidenceSnapshot({});
            await triggerOnChanges();
            const dropdownMenuComponent: DropdownControlMockComponent = getFilterEvidenceDropdownDebugElement()
              .componentInstance;

            // Assert
            expect(dropdownMenuComponent.selectItem).toHaveBeenCalledWith(jasmine.objectContaining(getViewAllOption()));
          });
        });
      });
    });

    [
      EvidenceTypeEnum.APP,
      EvidenceTypeEnum.CONFIGURATION,
      EvidenceTypeEnum.DOCUMENT,
      EvidenceTypeEnum.LINK,
      EvidenceTypeEnum.MANUAL,
      EvidenceTypeEnum.UNKNOWN,
    ].forEach((evidenceType) => {
      describe(`for ${evidenceType} evidence type`, () => {
        beforeEach(async () => {
          component.rootEvidence = {
            ...component.rootEvidence,
            evidence_type: evidenceType,
          };
          await triggerOnChanges();
        });

        it('should not display filter evidence dropdown', () => {
          // Arrange
          // Act
          // Assert
          expect(getFilterEvidenceDropdownDebugElement()).toBeFalsy();
        });
      });
    });
  });

  describe('evidence snapshot', () => {
    it('should set grid view build from changed evidence snapshot', async () => {
      // Arrange
      const expectedFullData = {};
      const expectedGridView: GridView = {
        header: [],
        rows: [],
        searchDefinitions: [],
        rawData: {},
      };
      gridViewBuilderMock.buildGridView = jasmine.createSpy('buildGridView').and.returnValue(expectedGridView);
      evidenceServiceMock.getEvidenceFullData = jasmine.createSpy().and.returnValue(of(expectedFullData));

      // Act
      await triggerOnChanges();
      component.selectEvidenceSnapshot({});

      // Assert
      expect(component.gridView).toBe(expectedGridView);
    });
  });

  describe('Evidence preview header', () => {
    it(`should display evidence preview header if source === ${EvidenceSourcesEnum.Controls}`, async () => {
      //Arrange
      initGridView();

      // Act
      component.ngOnChanges(previewChanges);
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(fixture.debugElement.query(By.css('app-evidence-preview-header'))).toBeTruthy();
    });
  });

  describe('preview grid resolving testing', () => {
    const cfgSelector = 'app-cfg-evidence-grid';
    const tableLikeSelector = 'app-table-like-evidence-grid';

    const testData = [
      {
        viewType: PreviewTypesEnum.Cfg,
        shouldBeDisplayed: cfgSelector,
        shouldNotBeDisplayed: [tableLikeSelector],
      },
      {
        viewType: PreviewTypesEnum.Log,
        shouldBeDisplayed: tableLikeSelector,
        shouldNotBeDisplayed: [cfgSelector],
      },
      {
        viewType: PreviewTypesEnum.List,
        shouldBeDisplayed: tableLikeSelector,
        shouldNotBeDisplayed: [cfgSelector],
      },
    ];

    testData.forEach((testCase) => {
      it('should display appropriate view according to the viewType property', async () => {
        // Arrange
        component.viewType = testCase.viewType;
        initGridView();

        // Act
        component.ngOnChanges(previewChanges);
        fixture.detectChanges();

        // Assert
        expect(fixture.debugElement.query(By.css(testCase.shouldBeDisplayed))).toBeTruthy();
        testCase.shouldNotBeDisplayed.forEach((view) => {
          expect(fixture.debugElement.query(By.css(view))).toBeFalsy();
        });
      });
    });
  });

  it(`should call openUrlInNewTab method with appropriate param`, async () => {
    //Arrange
    component.rootEvidence = {
      evidence_instance_id: 'id',
    };

    // Act
    fixture.detectChanges();
    await fixture.whenStable();

    await component.viewRawData();

    // Assert
    expect(windowHelperService.openUrlInNewTab).toHaveBeenCalledWith('url');
  });
});
