import { ControlsFacadeService } from 'core/modules/data/services/facades';
import { ControlsExportingType } from 'core/models/user-events/user-event-data.model';
import { TestBed } from '@angular/core/testing';
import { CalculatedControl } from 'core/modules/data/models';
import { Framework } from 'core/modules/data/models/domain';
import {
  CsvFormatterService,
  FileDownloadingHelperService,
  SocTwoFrameworkId,
  SocTwoFrameworkName,
} from 'core';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { AnecdotesUnifiedFramework } from 'core/modules/data/constants';
import { ControlsCsvExportService, csvHeaders, tscHeaders } from './controls-csv-export.service';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { of } from 'rxjs';

describe('ControlsCsvExportService', () => {
  let serviceUnderTest: ControlsCsvExportService;
  let controlsFacadeService: ControlsFacadeService;

  let csvFormatterService: CsvFormatterService;
  const csvBlob = new Blob(['some-csv'], { type: 'text/csv;charset=utf-8;' });

  let fileDownloadingHelperService: FileDownloadingHelperService;
  let userEventHub: UserEventService;
  let frameworkFacadeService: FrameworksFacadeService;
  let framework: Framework;
  const control_category = 'category';
  const control_name = 'name';
  const control_description = 'description';
  const control_calculated_requirements = [
    { requirement_name: 'req-name-1', requirement_applicability: true },
    { requirement_name: 'req-name-2', requirement_applicability: true },
    { requirement_name: 'req-name-3', requirement_applicability: false },
  ];
  const control_number_of_requirements = 2;

  const control: CalculatedControl = {
    control_category,
    control_name,
    control_description,
    control_calculated_requirements,
    control_number_of_requirements,
    control_is_applicable: true,
    control_status: {},
  };

  const controls = [control];

  function setTscArray(tscArray: string[]): void {
    control.control_related_frameworks_names = {
      [SocTwoFrameworkName]: tscArray,
    };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ControlsCsvExportService,
        { provide: CsvFormatterService, useValue: {} },
        { provide: FileDownloadingHelperService, useValue: {} },
        { provide: UserEventService, useValue: {} },
        { provide: FrameworksFacadeService, useValue: {} },
        { provide: ControlsFacadeService, useValue: {} }
      ],
    });
    serviceUnderTest = TestBed.inject(ControlsCsvExportService);

    controlsFacadeService = TestBed.inject(ControlsFacadeService);
    controlsFacadeService.trackControlsExporting = jasmine.createSpy('trackControlsExporting');

    csvFormatterService = TestBed.inject(CsvFormatterService);
    csvFormatterService.createCsvBlob = jasmine.createSpy('createCsvBlob').and.returnValue(csvBlob);

    fileDownloadingHelperService = TestBed.inject(FileDownloadingHelperService);
    fileDownloadingHelperService.downloadBlob = jasmine.createSpy('downloadBlob');
    userEventHub = TestBed.inject(UserEventService);
    userEventHub.sendEvent = jasmine.createSpy('sendEvent').and.callFake(() => of({}));

    frameworkFacadeService = TestBed.inject(FrameworksFacadeService);
    frameworkFacadeService.getFrameworkById = jasmine.createSpy('getFrameworkById').and.callFake(() => of({}));
  });

  it('should be created', () => {
    expect(serviceUnderTest).toBeTruthy();
  });

  describe('#exportControlsToCsv', () => {
    it('should call csvFormatterService.createCsvBlob with proper headers and controlsCsvData if passed framework is anecdotes', () => {
      // Arrange
      control.control_related_frameworks_names = {
        'some-framework-1': ['criteria-1 something', 'criteria-2'],
        'some-framework-2': ['criteria-4 something', 'criteria-3\ncriteria-extra'],
      };
      const framework = { framework_id: AnecdotesUnifiedFramework.framework_id, framework_name: 'Test' };

      const controlCsvData = [
        control_category,
        control_name,
        control_description,
        'criteria-1,criteria-2,criteria-3,criteria-extra,criteria-4',
        'req-name-1',
        'req-name-2',
      ];

      const filters = ['someFilter'];

      // Act
      serviceUnderTest.exportControlsToCsv(controls, framework, filters);

      // Assert
      expect(csvFormatterService.createCsvBlob).toHaveBeenCalledWith(
        [controlCsvData],
        [...csvHeaders, 'Requirement 1', 'Requirement 2']
      );

      expect(controlsFacadeService.trackControlsExporting).toHaveBeenCalledWith(controls, framework, ControlsExportingType.Controls, filters);
    });

    it('should call csvFormatterService.createCsvBlob with proper headers and controlsCsvData if passed framework is HIPAA || SOC2 || ITGC', () => {
      // Arrange
      control.control_related_frameworks_names = {
        soc2: ['criteria-2\ncriteria-extra', 'criteria-1 something'],
        'some-framework-2': ['criteria-3', 'criteria-4'],
      };
      const framework = { framework_id: SocTwoFrameworkId, framework_name: 'soc2' };

      const controlCsvData = [
        control_category,
        control_name,
        control_description,
        'criteria-1,criteria-2,criteria-extra',
        'req-name-1',
        'req-name-2',
      ];

      // Act
      serviceUnderTest.exportControlsToCsv(controls, framework);

      // Assert
      expect(csvFormatterService.createCsvBlob).toHaveBeenCalledWith(
        [controlCsvData],
        [...csvHeaders, 'Requirement 1', 'Requirement 2']
      );
    });

    it('should call fileDownloadingHelperService.downloadBlob with proper parameters', () => {
      // Arrange
      const framework = { framework_name: 'soc2' };

      // Act
      serviceUnderTest.exportControlsToCsv(controls, framework);

      // Assert
      expect(fileDownloadingHelperService.downloadBlob).toHaveBeenCalledWith(
        csvBlob,
        'soc2_controls_list_by_anecdotes.csv'
      );
    });
  });

  describe('#exportControlsWithTsc', () => {
    beforeEach(() => {
      framework = { framework_id: AnecdotesUnifiedFramework.framework_id, framework_name: 'Test' };
      control.control_name = control_name;
      control.control_description = control_description;
    });

    const controlCsvData = [
      {
        data: [['', control_name, control_description]],
        tscArray: null,
        case: 'tsc column should be empty if TSC array of control is null',
      },
      {
        data: [['', control_name, control_description]],
        tscArray: [''],
        case: 'tsc column should be empty if TSC array of control contains only one item which equal to ""',
      },
      {
        data: [
          ['1', control_name, control_description],
          ['2', control_name, control_description],
          ['3', control_name, control_description],
        ],
        tscArray: ['1', '2', '3'],
        case: 'if the control belongs to several TSC, it should appear for each one',
      },
    ];

    controlCsvData.forEach((value) => {
      it(value.case, () => {
        // Arrange
        const controlCsvData = value.data;
        setTscArray(value.tscArray);

        // Act
        serviceUnderTest.exportControlsWithTsc(controls, framework);

        // Assert
        expect(csvFormatterService.createCsvBlob).toHaveBeenCalledWith(controlCsvData, tscHeaders);
      });
    });
  });
});
