import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { EvidenceTypeIconMapping, FileDownloadingHelperService } from 'core';
import { EvidenceService } from 'core/modules/data/services';
import { EvidenceTypeEnum } from 'core/modules/data/models/domain';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { configureTestSuite } from 'ng-bullet';
import { Observable, of } from 'rxjs';
import { FullFilePreviewModalComponent } from './full-file-preview-modal.component';
import { By } from '@angular/platform-browser';
import { EvidenceUserEventService } from 'core/modules/data/services/event-tracking/evidence-user-event.service';

describe('FullFilePreviewModalComponent', () => {
  configureTestSuite();

  let component: FullFilePreviewModalComponent;
  let fixture: ComponentFixture<FullFilePreviewModalComponent>;

  let evidenceService: EvidenceService;
  let icon: Observable<string>;

  let fileDownloadingHelperServiceMock: FileDownloadingHelperService;

  const evidence_type = EvidenceTypeEnum.DOCUMENT;
  const evidence = { evidence_type, evidence_id: 'fff' };
  const control = { control_id: 'control' };
  const file = new File([], 'fake-file-name.any');
  const requirementLike = { resourceId: 'fake-requirement-id' };

  async function detectChanges(): Promise<any> {
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
  }

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [FullFilePreviewModalComponent],
        providers: [
          { provide: EvidenceService, useValue: {} },
          { provide: FileDownloadingHelperService, useValue: {} },
          {
            provide: ComponentSwitcherDirective,
            useValue: { sharedContext$: of({ evidence, file, control, requirementLike }) },
          },
          {
            provide: EvidenceUserEventService,
            useValue: {
              trackEvidenceDownload() {},
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FullFilePreviewModalComponent);
    component = fixture.componentInstance;

    evidenceService = TestBed.inject(EvidenceService);
    evidenceService.getIcon = jasmine.createSpy('getIcon').and.callFake(() => icon);

    fileDownloadingHelperServiceMock = TestBed.inject(FileDownloadingHelperService);
    fileDownloadingHelperServiceMock.downloadFile = jasmine.createSpy('downloadFile');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should correctly set evidence', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(component.evidence).toBe(evidence);
    });

    it('should correctly set file', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(component.file).toBe(file);
    });

    it('should correctly set fileTypeMapping', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(component.fileTypeMapping).toEqual(EvidenceTypeIconMapping[evidence_type]);
    });
  });

  describe('buildTranslationKey()', () => {
    it('should build translationKey based on relativeKey', () => {
      // Arrange
      const relativeKey = 'someKey';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toBe(`evidences.filePreview.${relativeKey}`);
    });
  });

  describe('#downloadEvidence', () => {
    it('should trigger file downloading', async () => {
      // Act
      await detectChanges();
      await component.downloadEvidence();

      // Assert
      expect(fileDownloadingHelperServiceMock.downloadFile).toHaveBeenCalledWith(file);
    });
  });

  it('should have "data-private" attribute on it"', async () => {
    // Act
    await detectChanges();

    // Assert
    expect(fixture.debugElement.query(By.css('.file-wrapper'))?.attributes['data-private']).toBeDefined();
  });
});
