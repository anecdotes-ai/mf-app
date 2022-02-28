import { EvidenceTypeEnum } from 'core/modules/data/models/domain';
import { EvidenceInstance } from './../../../data/models/domain/evidenceInstance';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportToCsvButtonComponent } from './export-to-csv-button.component';
import { EvidenceUserEventService } from 'core/modules/data/services/event-tracking/evidence-user-event.service';
import { LocalDatePipe } from 'core/modules/pipes';
import { TranslateModule } from '@ngx-translate/core';
import { CsvFormatterService, FileDownloadingHelperService } from 'core';
import { configureTestSuite } from 'ng-bullet';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ExportToCsvButtonComponent', () => {
  configureTestSuite();

  let component: ExportToCsvButtonComponent;
  let fixture: ComponentFixture<ExportToCsvButtonComponent>;
  let csvFormatterService: CsvFormatterService;
  let fileDownloadingHelperService: FileDownloadingHelperService;
  let localDatePipe: LocalDatePipe;
  let evidenceEventService: EvidenceUserEventService;

  const evidenceBlob = new Blob(['some-csv'], { type: 'text/csv;charset=utf-8;' });
  const fakeEvidenceFullData = { key1: ['value1', 'value3'], key2: ['value2', 'value4'] };
  const fakeEvidence: EvidenceInstance = {
    evidence_name: 'some-evidence-name',
    evidence_id: 'evidence_id',
    evidence_type: EvidenceTypeEnum.APP,
    evidence_collection_timestamp: new Date(2021, 1, 1),
  };

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ExportToCsvButtonComponent],
      providers: [
        { provide: EvidenceUserEventService, useValue: {} },
        { provide: LocalDatePipe, useValue: {} },
        { provide: FileDownloadingHelperService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportToCsvButtonComponent);
    component = fixture.componentInstance;

    component.evidenceDistinct = fakeEvidence;
    component.evidenceFullData = fakeEvidenceFullData;

    csvFormatterService = TestBed.inject(CsvFormatterService);
    csvFormatterService.createCsvBlob = jasmine.createSpy('createCsvBlob').and.returnValue(evidenceBlob);

    fileDownloadingHelperService = TestBed.inject(FileDownloadingHelperService);
    fileDownloadingHelperService.downloadBlob = jasmine.createSpy('downloadBlob');

    evidenceEventService = TestBed.inject(EvidenceUserEventService);
    evidenceEventService.trackCsvExport = jasmine.createSpy('trackCscExport');

    localDatePipe = TestBed.inject(LocalDatePipe);
    localDatePipe.transform = jasmine.createSpy('transform').and.returnValue('01_Feb_2021');

    component.evidence = fakeEvidence;
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
    it('should call csvFormatterService.createCsvBlob with proper parameters', () => {
      // Act
      // Arrange
      component.downloadFullCsvData();

      // Assert
      expect(csvFormatterService.createCsvBlob).toHaveBeenCalledWith(
        [
          ['value1', 'value2'],
          ['value3', 'value4'],
        ],
        ['key1', 'key2']
      );
    });

    it('should call fileDownloadingHelperService.downloadBlob with proper parameters', () => {
      // Act
      // Arrange
      component.downloadFullCsvData();

      // Assert
      expect(fileDownloadingHelperService.downloadBlob).toHaveBeenCalledWith(
        evidenceBlob,
        'some-evidence-name-01_Feb_2021.csv'
      );
    });

    it('should call evidenceEventService.trackCsvExport with args', () => {
      // Arrange
      // Act
      component.downloadFullCsvData();

      // Assert
      expect(evidenceEventService.trackCsvExport).toHaveBeenCalledWith(
        fakeEvidence.evidence_id,
        fakeEvidence.evidence_name,
        fakeEvidence.evidence_type,
        component.eventSource
      );
    });
  });
});
