import { ControlsFacadeService } from 'core/modules/data/services/facades';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlsExportModalComponent, ExportMethods } from './controls-export-modal.component';
import { FileDownloadingHelperService, MessageBusService, RouterExtensionService, SocTwoFrameworkName } from 'core';
import { TranslateModule } from '@ngx-translate/core';
import { CalculatedControl } from 'core/modules/data/models';
import { configureTestSuite } from 'ng-bullet';
import { ControlsCsvExportService } from 'core/modules/shared-controls';
import { Framework } from 'core/modules/data/models/domain';

describe('ControlsExportModalComponent', () => {
  configureTestSuite();

  let controlsFacadeService: ControlsFacadeService;
  let component: ControlsExportModalComponent;
  let fixture: ComponentFixture<ControlsExportModalComponent>;
  let fileDownloadService: FileDownloadingHelperService;
  let controlsCsvExporter: ControlsCsvExportService;
  let messageBusService: MessageBusService;
  const applicableControls: CalculatedControl[] = [
    {
      control_category: 'category',
      control_name: 'control-name',
      control_is_applicable: true,
      control_related_frameworks_names: {
        [SocTwoFrameworkName]: [],
      },
    },
  ];
  const framework: Framework = {
    framework_id: 'some-id',
    framework_name: 'some-name',
  };

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ControlsExportModalComponent],
      providers: [
        { provide: FileDownloadingHelperService, useValue: {} },
        { provide: MessageBusService, useValue: {} },
        { provide: RouterExtensionService, useValue: {} },
        { provide: ControlsFacadeService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlsExportModalComponent);
    component = fixture.componentInstance;
    component.framework = framework;
    component.controls = applicableControls;

    controlsFacadeService = TestBed.inject(ControlsFacadeService);
    controlsFacadeService.trackControlsExporting = jasmine.createSpy('trackControlsExporting');

    fileDownloadService = TestBed.inject(FileDownloadingHelperService);
    fileDownloadService.downloadBlob = jasmine.createSpy('downloadBlob');

    controlsCsvExporter = TestBed.inject(ControlsCsvExportService);
    controlsCsvExporter.exportControlsToCsv = jasmine.createSpy('exportControlsToCsv');
    controlsCsvExporter.exportControlsWithTsc = jasmine.createSpy('exportControlsWithTsc');

    messageBusService = TestBed.inject(MessageBusService);
    messageBusService.sendMessage = jasmine.createSpy('sendMessage');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#export Controls', () => {
    it(`should call controlsCsvExporter.exportControlsToCsv if exportMethod===${ExportMethods.category}`, () => {
      // Arrange
      component.currentFiltersNames = ['someFilters'];
      component.isFiltersApplied = true;
      component.form.setValue({ exportMethod: ExportMethods.category });

      // Act
      component.exportControls();

      // Assert
      expect(controlsCsvExporter.exportControlsToCsv).toHaveBeenCalledWith(applicableControls, framework, component.currentFiltersNames);
    });

    it(`should call controlsCsvExporter.exportControlsWithTsc if exportMethod === ${ExportMethods.tsc}`, () => {
      // Arrange
      component.isFiltersApplied = true;
      component.currentFiltersNames = ['someFilter'];
      component.form.setValue({ exportMethod: ExportMethods.tsc });

      // Act
      component.exportControls();

      // Assert
      expect(controlsCsvExporter.exportControlsWithTsc).toHaveBeenCalledWith(applicableControls, framework, component.currentFiltersNames);
    });

    it(`should call controlsCsvExporter.exportControlsToCsv without filters if exportMethod === ${ExportMethods.category} and isFilterApplied is false`, () => {
      // Arrange
      component.currentFiltersNames = ['someFilters'];
      component.isFiltersApplied = false;
      component.form.setValue({ exportMethod: ExportMethods.category });

      // Act
      component.exportControls();

      // Assert
      expect(controlsCsvExporter.exportControlsToCsv).toHaveBeenCalledWith(applicableControls, framework);
    });

    it(`should call controlsCsvExporter.exportControlsWithTsc without filters if exportMethod === ${ExportMethods.tsc} and isFilterApplied is false`, () => {
      // Arrange
      component.isFiltersApplied = false;
      component.currentFiltersNames = ['someFilter'];
      component.form.setValue({ exportMethod: ExportMethods.tsc });

      // Act
      component.exportControls();

      // Assert
      expect(controlsCsvExporter.exportControlsWithTsc).toHaveBeenCalledWith(applicableControls, framework);
    });
  });
});
