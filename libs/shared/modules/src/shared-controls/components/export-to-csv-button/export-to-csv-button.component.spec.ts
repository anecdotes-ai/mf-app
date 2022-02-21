import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvidenceSourcesEnum } from 'core/modules/shared-controls/models';
import { ExportToCsvButtonComponent } from './export-to-csv-button.component';
import { EvidenceUserEventService } from 'core/modules/data/services/event-tracking/evidence-user-event.service';
import { LocalDatePipe } from 'core/modules/pipes';
import { TranslateModule } from '@ngx-translate/core';
import { CsvFormatterService, FileDownloadingHelperService } from 'core';
import { configureTestSuite } from 'ng-bullet';
import { DataAggregationFacadeService } from 'core/modules/data/services';
import { of } from 'rxjs';

describe('ExportToCsvButtonComponent', () => {
  configureTestSuite();

  let component: ExportToCsvButtonComponent;
  let fixture: ComponentFixture<ExportToCsvButtonComponent>;
  let fakeEvidenceFullData = { key1: ['value1', 'value3'], key2: ['value2', 'value4'] };
  let csvFormatterService: CsvFormatterService;
  let fileDownloadingHelperService: FileDownloadingHelperService;
  let localDatePipe: LocalDatePipe;
  let evidenceEventService: EvidenceUserEventService;
  let dataAggregationFacadeService: DataAggregationFacadeService;

  const evidenceBlob = new Blob(['some-csv'], { type: 'text/csv;charset=utf-8;' });

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ExportToCsvButtonComponent],
      providers: [
        { provide: EvidenceUserEventService, useValue: {} },
        { provide: LocalDatePipe, useValue: {} },
        { provide: FileDownloadingHelperService, useValue: {} },
        { provide: DataAggregationFacadeService, useValue: {} },

      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportToCsvButtonComponent);
    component = fixture.componentInstance;

    component.controlInstance = { control_id: 'control_id' };
    component.controlRequirement = { requirement_id: 'requirement_id' };
    component.framework = { framework_id: 'framework_id' };
    component.evidence = { evidence_id: 'evidence_id' };

    component.evidenceDistinct = {
      evidence_name: 'some-evidence-name',
      evidence_collection_timestamp: new Date(2021, 1, 1),
    };
    component.evidenceFullData = fakeEvidenceFullData;

    csvFormatterService = TestBed.inject(CsvFormatterService);
    csvFormatterService.createCsvBlob = jasmine.createSpy('createCsvBlob').and.returnValue(evidenceBlob);

    fileDownloadingHelperService = TestBed.inject(FileDownloadingHelperService);
    fileDownloadingHelperService.downloadBlob = jasmine.createSpy('downloadBlob');

    evidenceEventService = TestBed.inject(EvidenceUserEventService);
    evidenceEventService.trackCsvExport = jasmine.createSpy('trackCscExport');

    localDatePipe = TestBed.inject(LocalDatePipe);
    localDatePipe.transform = jasmine.createSpy('transform').and.returnValue('01_Feb_2021');

    dataAggregationFacadeService = TestBed.inject(DataAggregationFacadeService);
    dataAggregationFacadeService.getEvidenceReferences = jasmine.createSpy('getEvidenceReferences').and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  describe('#downloadFullCsvData', () => {
    beforeEach(() => {
      component.evidence = {
        evidence_name: 'some-evidence-name',
        evidence_collection_timestamp: new Date(2021, 1, 1),
      };
      component.evidence = {
        evidence_name: 'some-evidence-name',
        evidence_collection_timestamp: new Date(2021, 1, 1),
      };
    });

    it('should call csvFormatterService.createCsvBlob with proper parameters', async () => {
      // Act
      // Arrange
      await detectChanges();
      await component.downloadFullCsvData();

      // Assert
      expect(csvFormatterService.createCsvBlob).toHaveBeenCalledWith(
        [
          ['value1', 'value2'],
          ['value3', 'value4'],
        ],
        ['key1', 'key2']
      );
    });

    it('should call fileDownloadingHelperService.downloadBlob with proper parameters', async () => {
      // Act
      // Arrange
      await detectChanges();
      await component.downloadFullCsvData();

      // Assert
      expect(fileDownloadingHelperService.downloadBlob).toHaveBeenCalledWith(
        evidenceBlob,
        'some-evidence-name-01_Feb_2021.csv'
      );
    });

    const dataForTest = [
      {
        mainSourceInDescr: EvidenceSourcesEnum.EvidencePool,
        secondarySourceInDescr: EvidenceSourcesEnum.EvidencePool,
        eventSource: EvidenceSourcesEnum.EvidencePool,
        viewFullData: true,
        eventSourceParam: EvidenceSourcesEnum.EvidencePool
      },
      {
        mainSourceInDescr: EvidenceSourcesEnum.FullData,
        secondarySourceInDescr: EvidenceSourcesEnum.Controls,
        eventSource: EvidenceSourcesEnum.Controls,
        viewFullData: true,
        eventSourceParam: EvidenceSourcesEnum.FullData
      },
      {
        mainSourceInDescr: EvidenceSourcesEnum.Preview,
        secondarySourceInDescr: EvidenceSourcesEnum.Controls,
        eventSource: EvidenceSourcesEnum.Controls,
        viewFullData: false,
        eventSourceParam: EvidenceSourcesEnum.Preview
      }
    ];

    dataForTest.forEach(value => {
      it(`should call evidenceEventService.trackCscExport with ${value.mainSourceInDescr}
      source name if eventSource === ${value.secondarySourceInDescr}`, async () => {
        // Act
        // Arrange
        await detectChanges();
        component.eventSource = value.eventSource;
        component.viewFullData = value.viewFullData;
        await component.downloadFullCsvData();

        // Assert
        expect(evidenceEventService.trackCsvExport).toHaveBeenCalledWith(
          component.framework.framework_id,
          component.controlInstance.control_id,
          component.controlRequirement.requirement_id,
          component.evidence.evidence_name,
          component.evidence.evidence_type,
          value.eventSourceParam,
          null
        );
      });
    });
  });
});
