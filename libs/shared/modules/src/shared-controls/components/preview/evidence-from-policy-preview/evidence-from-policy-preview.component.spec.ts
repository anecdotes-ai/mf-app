import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { EvidenceFromPolicyPreviewComponent } from './evidence-from-policy-preview.component';
import { EvidenceService, DataAggregationFacadeService, PoliciesFacadeService } from 'core/modules/data/services';
import { FileDownloadingHelperService } from 'core/services';
import { FileTypeHandlerService } from 'core/modules/file-viewer/services';
import { EvidenceUserEventService } from 'core/modules/data/services/event-tracking/evidence-user-event.service';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { of, Subject } from 'rxjs';

describe('EvidenceFromPolicyPreviewComponent', () => {
  configureTestSuite();

  let component: EvidenceFromPolicyPreviewComponent;
  let fixture: ComponentFixture<EvidenceFromPolicyPreviewComponent>;

  let evidenceServiceMock: EvidenceService;
  let fileDownloadingHelperServiceMock: FileDownloadingHelperService;
  let fileTypeHandlerServiceMock: FileTypeHandlerService;
  let policiesFacadeServiceMock: PoliciesFacadeService;
  let evidenceEventServiceMock: EvidenceUserEventService;
  let dataAggregationFacadeServiceMock: DataAggregationFacadeService;
  let switcher: ComponentSwitcherDirective;

  let fakeFile: File;

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
          { provide: DataAggregationFacadeService, useValue: {} },
          {
            provide: ComponentSwitcherDirective,
            useClass: MockSwitcherDir,
          },
          { provide: PoliciesFacadeService, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenceFromPolicyPreviewComponent);
    component = fixture.debugElement.componentInstance;

    fakeFile = new File([], 'fake-file-name.any');
    evidenceServiceMock = TestBed.inject(EvidenceService);
    evidenceServiceMock.downloadEvidence = jasmine.createSpy('downloadEvidence').and.callFake(() => of(fakeFile));

    fileDownloadingHelperServiceMock = TestBed.inject(FileDownloadingHelperService);
    fileTypeHandlerServiceMock = TestBed.inject(FileTypeHandlerService);
    policiesFacadeServiceMock = TestBed.inject(PoliciesFacadeService);
    evidenceEventServiceMock = TestBed.inject(EvidenceUserEventService);
    dataAggregationFacadeServiceMock = TestBed.inject(DataAggregationFacadeService);
    switcher = TestBed.inject(ComponentSwitcherDirective);

    switcher.sharedContext$ = of();
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
});
