import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { FileDownloadingHelperService } from 'core';
import { ModalWindowService } from 'core/modules/modals';
import { DataAggregationFacadeService, EvidenceService } from 'core/modules/data/services';
import { configureTestSuite } from 'ng-bullet';
import { NEVER, of } from 'rxjs';
import { FilePreviewComponent } from './file-preview.component';
import { FileTypeHandlerService } from 'core/modules/file-viewer/services';
import { EvidenceUserEventService } from 'core/modules/data/services/event-tracking/evidence-user-event.service';
import { EvidenceSourcesEnum } from 'core/modules/shared-controls/models';

describe('FilePreviewComponent', () => {
  configureTestSuite();

  let component: FilePreviewComponent;
  let fixture: ComponentFixture<FilePreviewComponent>;

  let evidenceServiceMock: EvidenceService;
  let fileDownloadingHelperServiceMock: FileDownloadingHelperService;
  let fakeFile: File;
  let fileTypeHandlerServiceMock: FileTypeHandlerService;
  let modalWindowService: ModalWindowService;
  let evidenceEventService: EvidenceUserEventService;
  let dataAggregationFacadeService: DataAggregationFacadeService;

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [FilePreviewComponent],
        providers: [
          { provide: EvidenceService, useValue: {} },
          { provide: FileDownloadingHelperService, useValue: {} },
          { provide: ModalWindowService, useValue: {} },
          { provide: FileTypeHandlerService, useValue: {} },
          { provide: EvidenceUserEventService, useValue: {} },
          { provide: DataAggregationFacadeService, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function getDownloadEvidenceButton(): DebugElement {
    return fixture.debugElement.query(By.css('.download-evidence-btn'));
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(FilePreviewComponent);
    component = fixture.componentInstance;

    component.evidence = { evidence_name: 'fakeEvidence' };
    component.controlInstance = {};
    component.requirement = {};
    fakeFile = new File([], 'fake-file-name.any');
    evidenceServiceMock = TestBed.inject(EvidenceService);
    fileDownloadingHelperServiceMock = TestBed.inject(FileDownloadingHelperService);
    evidenceServiceMock.downloadEvidence = jasmine.createSpy('downloadEvidence').and.callFake(() => of(fakeFile));
    fileTypeHandlerServiceMock = TestBed.inject(FileTypeHandlerService);
    modalWindowService = TestBed.inject(ModalWindowService);
    modalWindowService.openInSwitcher = jasmine.createSpy('openInSwitcher');
    fileTypeHandlerServiceMock.isFileSupported = jasmine.createSpy('isFileSupported').and.returnValue(true);
    evidenceEventService = TestBed.inject(EvidenceUserEventService);
    evidenceEventService.trackViewFullData = jasmine.createSpy('trackViewFullData');
    evidenceEventService.trackEvidenceDownload = jasmine.createSpy('trackEvidenceDownload');

    dataAggregationFacadeService = TestBed.inject(DataAggregationFacadeService);
    dataAggregationFacadeService.getEvidenceReferences = jasmine
      .createSpy('getEvidenceReferences')
      .and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('preview-not-supported class', () => {
    it('should be set for host element when currentFileType is not truthy', async () => {
      // Arrange
      fileTypeHandlerServiceMock.isFileSupported = jasmine.createSpy('isFileSupported').and.returnValue(false);

      // Act
      await detectChanges();

      // Assert
      expect(fixture.debugElement.classes['preview-not-supported']).toBeTruthy();
    });
  });

  it('should download evidence file by evidence_instance_id', async () => {
    // Arrange
    component.evidence.evidence_instance_id = 'fake-instance-id';

    // Act
    await detectChanges();

    // Assert
    expect(evidenceServiceMock.downloadEvidence).toHaveBeenCalledWith(component.evidence.evidence_instance_id);
  });

  describe('loader', () => {
    describe('isLoaded property', () => {
      it('should be false when data is not loaded yet', async () => {
        component.evidence = { ...component.evidence, evidence_name: `fake` };
        // Arrange
        evidenceServiceMock.downloadEvidence = jasmine.createSpy('downloadEvidence').and.returnValue(NEVER);

        // Act
        await detectChanges();

        // Assert
        expect(component.isLoaded).toBeFalsy();
      });

      it('should be true when data is loaded', fakeAsync(() => {
        // Arrange
        evidenceServiceMock.downloadEvidence = jasmine
          .createSpy('downloadEvidence')
          .and.returnValue(of(new File([], 'fake')));

        // Act
        detectChanges();
        tick(200);

        // Assert
        expect(component.isLoaded).toBeTrue();
      }));
    });

    describe('loader component', () => {
      function getLoaderDebugElement(): DebugElement {
        return fixture.debugElement.query(By.css('app-loading-animation'));
      }

      it('should not be displayed when data is not loaded yet', async () => {
        // Arrange
        evidenceServiceMock.downloadEvidence = jasmine.createSpy('downloadEvidence').and.returnValue(NEVER);

        // Act
        await detectChanges();

        // Assert
        expect(getLoaderDebugElement()).toBeTruthy();
      });

      it('should be displayed when data is loaded', fakeAsync(() => {
        component.evidence = { ...component.evidence, evidence_name: `fake` };
        // Arrange
        evidenceServiceMock.downloadEvidence = jasmine
          .createSpy('downloadEvidence')
          .and.returnValue(of(new File([], 'fake')));

        // Act
        detectChanges();
        tick(200);

        // Assert
        expect(getLoaderDebugElement()).toBeFalsy();
      }));
    });
  });

  describe('downloadEvidence function', () => {
    it('should trigger file downloading got from evidence service', async () => {
      component.evidence = { ...component.evidence, evidence_name: 'fakeFile' };
      // Arrange
      fileDownloadingHelperServiceMock.downloadFile = jasmine.createSpy('downloadFile');

      // Act
      await detectChanges();
      await component.downloadEvidence();

      // Assert
      expect(fileDownloadingHelperServiceMock.downloadFile).toHaveBeenCalledWith(fakeFile, 'fakeFile');
    });
  });

  describe('Evidence Tip', () => {
    it('should display when evidence_tip property is not null', async () => {
      // Arrange
      component.evidence = { evidence_tip: 'some-tip', evidence_name: 'fakeFile' };
      // Act
      await detectChanges();
      // Assert
      const evidenceTip = fixture.debugElement.query(By.css('.evidence-tip-wrapper')).nativeElement;

      expect(evidenceTip).toBeTruthy();
    });

    it('should not display when evidence_tip property is null', async () => {
      // Arrange
      component.evidence = { evidence_tip: null };

      // Act
      // Assert
      const evidenceTip = fixture.debugElement.query(By.css('.evidence-tip-wrapper'));

      expect(evidenceTip).toBeFalsy();
    });
  });

  describe('when currentFileType is not truthy', () => {
    beforeEach(() => {
      component.isLoaded = true;
    });

    describe('download-evidence button rendering', () => {
      beforeEach(() => {
        fileTypeHandlerServiceMock.isFileSupported = jasmine.createSpy('isFileSupported').and.returnValue(false);
      });

      it('should be rendered', async () => {
        // Arrange
        // Act
        await detectChanges();

        // Assert
        expect(getDownloadEvidenceButton()).toBeTruthy();
      });

      it('should call downloadEvidence() when clicked', async () => {
        // Arrange
        spyOn(component, 'downloadEvidence');

        // Act
        await detectChanges();
        getDownloadEvidenceButton()?.triggerEventHandler('click', {});

        // Assert
        expect(component.downloadEvidence).toHaveBeenCalledWith();
      });

      it('should display fallback', async () => {
        // Arrange

        // Act
        await detectChanges();

        // Assert
        expect(fixture.debugElement.query(By.css('.not-available-preview-fallback'))).toBeTruthy();
      });

      it('should be present', async () => {
        // Arrange

        // Act
        await detectChanges();

        // Assert
        expect(getDownloadEvidenceButton()).toBeTruthy();
      });
    });
  });

  describe('buildTranslationKey()', () => {
    it('should build translationKey based on relativeKey', () => {
      // Arrange
      const relativeKey = 'someKey';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toBe(`evidencePreview.file.${relativeKey}`);
    });
  });

  describe('Evidence preview header', () => {
    it(`should display evidence preview header if source === ${EvidenceSourcesEnum.Controls}`, async () => {
      //Arrange
      component.eventSource = EvidenceSourcesEnum.Controls;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(fixture.debugElement.query(By.css('app-evidence-preview-header'))).toBeTruthy();
    });
  });
});
