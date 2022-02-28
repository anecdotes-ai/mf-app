import { EvidenceTypeEnum, ApprovalFrequencyEnum } from 'core/modules/data/models/domain';
import { EvidenceSourcesEnum } from 'core/models/user-events/user-event-data.model';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { EvidenceFromPolicyPreviewComponent } from './evidence-from-policy-preview.component';
import { EvidenceService, PoliciesFacadeService } from 'core/modules/data/services';
import { FileDownloadingHelperService } from 'core/services';
import { FileTypeHandlerService } from 'core/modules/file-viewer/services';
import { EvidenceUserEventService } from 'core/modules/data/services/event-tracking/evidence-user-event.service';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CalculatedPolicy } from 'core/modules/data/models';
import { EvidenceFromPolicyModalsContext } from 'core/modules/shared-controls/services/evidence-from-policy-preview/evidence-from-policy-preview.service';
import { first } from 'rxjs/operators';

describe('EvidenceFromPolicyPreviewComponent', () => {
  configureTestSuite();
  let component: EvidenceFromPolicyPreviewComponent;
  let fixture: ComponentFixture<EvidenceFromPolicyPreviewComponent>;

  let evidenceServiceMock: EvidenceService;
  let fileDownloadingHelperServiceMock: FileDownloadingHelperService;
  let policiesFacadeServiceMock: PoliciesFacadeService;
  let evidenceEventServiceMock: EvidenceUserEventService;
  let switcher: ComponentSwitcherDirective;

  let fakeFile: File;
  const evidenceName = 'file_fake_name.txt';
  const payload: EvidenceFromPolicyModalsContext = {
    eventSource: EvidenceSourcesEnum.Controls,
    evidenceLike: {
      evidence: {
        evidence_instance_id: 'fake_evidence_id',
        evidence_name: evidenceName,
        evidence_type: EvidenceTypeEnum.DOCUMENT,
        evidence_tip: 'fake_tip'
      }
    },
    entityPath: ['fake', 'path']
  };
  const fakePolicy: CalculatedPolicy = {
    policy_settings: {
      scheduling: {
        approval_frequency: ApprovalFrequencyEnum.Monthly,
      }
    },
    has_roles: false,
    next_cycle_date: new Date()
  };

  class MockSwitcherDir {
    public sharedContext$ = new Subject<any>();
  }

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [EvidenceFromPolicyPreviewComponent],
        providers: [
          { provide: EvidenceService, useValue: {} },
          FileDownloadingHelperService,
          FileTypeHandlerService,
          { provide: EvidenceUserEventService, useValue: {} },
          {
            provide: ComponentSwitcherDirective,
            useClass: MockSwitcherDir,
          },
          { provide: PoliciesFacadeService, useValue: {} },
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenceFromPolicyPreviewComponent);
    component = fixture.debugElement.componentInstance;

    fakeFile = new File([], evidenceName);
    evidenceServiceMock = TestBed.inject(EvidenceService);
    evidenceServiceMock.downloadEvidence = jasmine.createSpy('downloadEvidence').and.returnValue(of(fakeFile));

    fileDownloadingHelperServiceMock = TestBed.inject(FileDownloadingHelperService);
    fileDownloadingHelperServiceMock.downloadFile =
      jasmine.createSpy('downloadFile').and.callFake(() => {});

    policiesFacadeServiceMock = TestBed.inject(PoliciesFacadeService);
    policiesFacadeServiceMock.getPolicy = jasmine.createSpy('getPolicy').and.returnValue(of(fakePolicy));

    evidenceEventServiceMock = TestBed.inject(EvidenceUserEventService);
    evidenceEventServiceMock.trackEvidenceDownload = jasmine.createSpy('trackEvidenceDownload').and.callFake(() => {});

    switcher = TestBed.inject(ComponentSwitcherDirective);
    switcher.sharedContext$ = of(payload);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#togglePreview method', () => {
    it('should toggle showTabular property', () => {
      // Arrange
      component.showTabular = true;

      // Act
      component.togglePreview();

      // Assert
      expect(component.showTabular).toBeFalse();
    });
  });

  describe('#ngOnInit method', () => {
    it('should set data from switcher payload', async () => {
      // Arrange
      const payloadFromContext = await switcher.sharedContext$.pipe(first()).toPromise();

      // Act
      // Assert
      expect(payloadFromContext).toEqual(payload);
    });

    it('should set file and set a notSupportedPreview to `true` if the file extension is not supported', () => {
      // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      expect(component.file.name).toBe(evidenceName);
      expect(component.notSupportedPreview).toBeTrue();
    });
  });

  describe('#downloadEvidence method', () => {
    it('should call downloadFile method', () => {
      // Arrange
      // Act
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('app-new-button'));
      button.triggerEventHandler('click', {});

      // Assert
      expect(fileDownloadingHelperServiceMock.downloadFile).toHaveBeenCalledWith(fakeFile, evidenceName);
    });

    it('should call trackEvidenceDownload method', () => {
      // Arrange
      // Act
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('app-new-button'));
      button.triggerEventHandler('click', {});

      // Assert
      expect(evidenceEventServiceMock.trackEvidenceDownload).toHaveBeenCalledWith(
        payload.evidenceLike.evidence.evidence_id,
        payload.evidenceLike.evidence.evidence_name,
        payload.evidenceLike.evidence.evidence_type,
        payload.eventSource,
      );
    });
  });
});
