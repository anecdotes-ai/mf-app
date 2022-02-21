import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlsExportMenuComponent, ExportType } from './controls-export-menu.component';
import { FileDownloadingHelperService, MessageBusService, RouterExtensionService, SocTwoFrameworkName } from 'core';
import { ActionsIds } from 'core/modules/shared-controls/models';
import { skip, take } from 'rxjs/operators';
import { ControlsCsvExportService } from 'core/modules/shared-controls';
import { ControlsFacadeService, EvidenceService } from 'core/modules/data/services';
import { ModalWindowService } from 'core/modules/modals';
import { CalculatedControl } from 'core/modules/data/models';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { SimpleChanges } from '@angular/core';
import { AccountFeaturesService, ExclusiveFeatureModalService } from 'core/modules/account-features';
import { AccountFeatureEnum, Framework } from 'core/modules/data/models/domain';

describe('ControlsExportMenuComponent', () => {
  configureTestSuite();

  let component: ControlsExportMenuComponent;
  let fixture: ComponentFixture<ControlsExportMenuComponent>;
  let controlsCsvExporter: ControlsCsvExportService;
  let evidenceService: EvidenceService;
  let fileDownloadService: FileDownloadingHelperService;
  let messageBusService: MessageBusService;
  let modalWindowService: ModalWindowService;
  let logsUrl;
  let controlsFacade: ControlsFacadeService;
  let exclusiveModal: ExclusiveFeatureModalService;
  let accountFeaturesService: AccountFeaturesService;
  let doesHaveFeature: boolean;

  const applicableControls: CalculatedControl[] = [
    {
      control_category: 'category',
      control_name: 'control-name',
      control_is_applicable: true,
    },
  ];
  const framework: Framework = { framework_id: 'some-id', framework_name: 'some-name' };

  let changes: SimpleChanges = {
    filteredData: {
      currentValue: applicableControls,
      previousValue: applicableControls,
      firstChange: true,
      isFirstChange(): boolean {
        return true;
      },
    },
  };

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      declarations: [ControlsExportMenuComponent],
      providers: [
        { provide: EvidenceService, useValue: {} },
        { provide: FileDownloadingHelperService, useValue: {} },
        { provide: MessageBusService, useValue: {} },
        { provide: ModalWindowService, useValue: {} },
        { provide: RouterExtensionService, useValue: {} },
        { provide: ControlsFacadeService, useValue: {} },
        { provide: ExclusiveFeatureModalService, useValue: {} },
        { provide: AccountFeaturesService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlsExportMenuComponent);
    component = fixture.componentInstance;

    evidenceService = TestBed.inject(EvidenceService);
    evidenceService.downloadLogs = jasmine.createSpy('downloadLogs').and.callFake(() => of(logsUrl));
    evidenceService.downloadAllEvidences = jasmine.createSpy('downloadAllEvidences').and.callFake(() => of(logsUrl));

    messageBusService = TestBed.inject(MessageBusService);
    messageBusService.sendMessage = jasmine.createSpy('sendMessage');

    modalWindowService = TestBed.inject(ModalWindowService);
    modalWindowService.openInSwitcher = jasmine.createSpy('openInSwitcher');

    fileDownloadService = TestBed.inject(FileDownloadingHelperService);
    fileDownloadService.downloadFileByUrl = jasmine.createSpy('downloadFileByUrl');

    controlsCsvExporter = TestBed.inject(ControlsCsvExportService);
    controlsCsvExporter.exportControlsToCsv = jasmine.createSpy('exportControlsToCsv');

    accountFeaturesService = TestBed.inject(AccountFeaturesService);
    accountFeaturesService.doesAccountHaveFeature = jasmine
      .createSpy('doesAccountHaveFeature')
      .and.callFake((_: any) => of(doesHaveFeature));

    controlsFacade = TestBed.inject(ControlsFacadeService);
    controlsFacade.getControlsByFrameworkId = jasmine
      .createSpy('getControlsByFrameworkId')
      .and.callFake(() => of(applicableControls));
    controlsFacade.trackControlsExporting = jasmine.createSpy('trackControlsExporting');

    exclusiveModal = TestBed.inject(ExclusiveFeatureModalService);
    exclusiveModal.openExclusiveFeatureModal = jasmine.createSpy('openExclusiveFeatureModal').and.callFake(() => {});
    component.framework = framework;
    component.allControls = applicableControls;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('export menu', () => {
    beforeEach(() => {
      doesHaveFeature = true;
      fixture.detectChanges();
    });

    describe('export all controls', () => {
      it(`should call controlsCsvExporter.exportControlsToCsv if framework name is not ${SocTwoFrameworkName}`, async () => {
        // Arrange
        component.framework = framework;
        component.allControls = applicableControls;

        // Act
        fixture.detectChanges();
        component.ngOnChanges(changes);
        await fixture.whenStable();
        component.exportMenuActions.find((value) => value.id === ActionsIds.ExportAllControls).action();

        // Assert
        expect(controlsCsvExporter.exportControlsToCsv).toHaveBeenCalledWith(applicableControls, framework);
      });

      it(`should call modalWindowService.openInSwitcher if framework name is ${SocTwoFrameworkName}`, async () => {
        // Arrange
        component.framework = framework;
        component.framework.framework_name = SocTwoFrameworkName;
        component.filteredData = applicableControls;

        // Act
        fixture.detectChanges();
        component.ngOnChanges(changes);
        await fixture.whenStable();
        component.exportMenuActions.find((value) => value.id === ActionsIds.ExportAllControls).action();

        // Assert
        expect(modalWindowService.openInSwitcher).toHaveBeenCalled();
      });
    });

    describe('export filtered controls', () => {
      it(`should call controlsCsvExporter.exportControlsToCsv if framework name is not ${SocTwoFrameworkName}`, async () => {
        // Arrange
        await detectChanges();
        component.framework = framework;
        component.framework.framework_name = 'some-name';
        component.filteredData = applicableControls;
        component.allControls = [
          ...applicableControls,
          {
            control_category: 'category',
            control_name: 'control-name',
            control_is_applicable: true,
          },
        ];
        component.appliedFiltersNames = ['someFilter'];

        // Act
        component.ngOnChanges(changes);
        component.exportMenuActions.find((value) => value.id === ActionsIds.ExportFilteredControls).action();

        // Assert
        expect(controlsCsvExporter.exportControlsToCsv).toHaveBeenCalledWith(
          applicableControls,
          framework,
          component.appliedFiltersNames
        );
      });

      it(`should call modalWindowService.openInSwitcher if framework name is ${SocTwoFrameworkName}`, async () => {
        // Arrange
        await detectChanges();
        framework.framework_name = SocTwoFrameworkName;
        component.framework = framework;
        component.filteredData = applicableControls;
        component.allControls = [
          ...applicableControls,
          {
            control_category: 'category',
            control_name: 'control-name',
            control_is_applicable: true,
          },
        ];

        // Act
        component.ngOnChanges(changes);
        component.exportMenuActions.find((value) => value.id === ActionsIds.ExportFilteredControls).action();

        // Assert
        expect(modalWindowService.openInSwitcher).toHaveBeenCalled();
      });
    });

    describe('#downloadLogs', () => {
      it('should emit true to exportLoading$', (done) => {
        // Assert
        component.exportLoading$.pipe(take(1)).subscribe((loading) => {
          expect(loading).toBeTrue();
          done();
        });

        // Act
        component.ngOnChanges(changes);
        component.exportMenuActions.find((value) => value.id === ActionsIds.ExportAllLogs).action();
      });

      it('should call fileDownloadingHelperService.downloadFileByUrl with url returned from evidenceService.downloadLogs', async () => {
        // Arrange
        logsUrl = 'some-logs';

        // Act
        component.ngOnChanges(changes);
        await component.exportMenuActions.find((value) => value.id === ActionsIds.ExportAllLogs).action();

        // Assert
        expect(fileDownloadService.downloadFileByUrl).toHaveBeenCalledWith(logsUrl);
      });

      it('should emit false to exportLoading$ after fileDownloadingHelperService.downloadFileByUrl call', (done) => {
        // Assert
        component.exportLoading$.pipe(skip(1)).subscribe((loading) => {
          expect(loading).toBeFalse();
          done();
        });

        // Act
        component.ngOnChanges(changes);
        component.exportMenuActions.find((value) => value.id === ActionsIds.ExportAllLogs).action();
      });
    });

    describe('#downloadAllEvidences', () => {
      // eslint-disable-next-line jasmine/no-spec-dupes
      it('should emit true to exportLoading$', (done) => {
        // Assert
        component.framework = framework;
        component.allControls = applicableControls;
        component.exportLoading$.pipe(take(1)).subscribe((loading) => {
          expect(loading).toBeTrue();
          done();
        });

        // Act
        component.ngOnChanges(changes);
        component.exportMenuActions.find((value) => value.id === ActionsIds.ExportAllEvidence).action();
      });

      it('should call fileDownloadingHelperService.downloadFileByUrl with url returned from evidenceService.downloadAllEvidences', async () => {
        // Arrange
        component.framework = framework;
        component.allControls = applicableControls;
        logsUrl = 'some-logs';

        // Act
        component.ngOnChanges(changes);
        await component.exportMenuActions.find((value) => value.id === ActionsIds.ExportAllEvidence).action();

        // Assert
        expect(fileDownloadService.downloadFileByUrl).toHaveBeenCalledWith(logsUrl);
      });

      it('should emit false to exportLoading$ after fileDownloadingHelperService.downloadFileByUrl call', (done) => {
        // Assert
        component.framework = framework;
        component.allControls = applicableControls;
        component.exportLoading$.pipe(skip(1)).subscribe((loading) => {
          expect(loading).toBeFalse();
          done();
        });

        // Act
        component.ngOnChanges(changes);
        component.exportMenuActions.find((value) => value.id === ActionsIds.ExportAllEvidence).action();
      });
    });
  });

  describe('#when can export is false', () => {
    it(`should  open exclusive modal`, () => {
      // Arrange
      doesHaveFeature = false;
      component.framework = framework;
      component.allControls = applicableControls;

      // Act
      fixture.detectChanges();
      fixture.whenStable();
      component.ngOnChanges(changes);
      component.exportMenuActions.find((value) => value.id === ActionsIds.ExportAllEvidence).action();

      expect(exclusiveModal.openExclusiveFeatureModal).toHaveBeenCalledWith(AccountFeatureEnum.ExportControls);
    });
  });
});
