import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { EvidenceTypeIconMapping, MessageBusService } from 'core';
import { CalculatedEvidence, convertToEvidenceLike } from 'core/modules/data/models';
import { EvidenceTypeEnum } from 'core/modules/data/models/domain';
import { EvidenceService, FrameworksFacadeService } from 'core/modules/data/services';
import { EvidenceUserEventService } from 'core/modules/data/services/event-tracking/evidence-user-event.service';
import { ModalWindowService } from 'core/modules/modals';
import { EvidenceModalService } from 'core/modules/shared-controls/modules/evidence/services';
import { configureTestSuite } from 'ng-bullet';
import { Observable, of } from 'rxjs';
import { RootTranslationkey } from './../../constants/translation-keys.constant';
import { EvidencePoolItemComponent } from './evidence-pool-item.component';
import { EvidencePreviewService } from 'core/modules/shared-controls/services/evidence-preview-service/evidence-preview.service';

describe('EvidencePoolItemComponent', () => {
  configureTestSuite();

  let component: EvidencePoolItemComponent;
  let fixture: ComponentFixture<EvidencePoolItemComponent>;

  let evidenceService: EvidenceService;
  let icon: Observable<string>;

  let modalWindowService: ModalWindowService;
  let frameworksFacade: FrameworksFacadeService;
  let evidenceModalService: EvidenceModalService;
  let evidencePreviewService: EvidencePreviewService;

  const evidence_type = EvidenceTypeEnum.DOCUMENT;
  const evidence_id = 'evidence_id';
  const related_control = { control_id: 'control_id' };
  const related_requirement = { requirement_id: 'requirement_id' };
  const evidence: CalculatedEvidence = {
    evidence_type,
    evidence_id,
    related_control,
    related_requirement,
    evidence_related_framework_names: {},
    evidence_instance_id: 'some-id',
  };

  async function detectChanges(): Promise<any> {
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
  }

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [EvidencePoolItemComponent],
      providers: [
        { provide: EvidenceService, useValue: {} },
        { provide: ModalWindowService, useValue: {} },
        { provide: FrameworksFacadeService, useValue: {} },
        { provide: EvidenceModalService, useValue: {} },
        { provide: EvidenceUserEventService, useValue: {} },
        { provide: MessageBusService, useValue: {} },
        { provide: EvidencePreviewService, useValue: {} },
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidencePoolItemComponent);
    component = fixture.componentInstance;

    evidenceService = TestBed.inject(EvidenceService);
    evidenceService.getIcon = jasmine.createSpy('getIcon').and.callFake(() => icon);
    evidenceService.getEvidencePreview = jasmine.createSpy('getEvidencePreview').and.returnValue(of('some-value'));

    modalWindowService = TestBed.inject(ModalWindowService);
    modalWindowService.open = jasmine.createSpy('open');

    frameworksFacade = TestBed.inject(FrameworksFacadeService);
    frameworksFacade.getApplicableFrameworks = jasmine.createSpy('getApplicableFrameworks').and.returnValue(of([]));

    evidenceModalService = TestBed.inject(EvidenceModalService);
    evidenceModalService.openEvidenceInfoModal = jasmine.createSpy('openEvidenceInfoModal').and.callThrough();
    evidenceModalService.openEvidenceConnectComponent = jasmine.createSpy('openEvidenceConnectComponent');

    evidencePreviewService = TestBed.inject(EvidencePreviewService);
    evidencePreviewService.openEvidencePreviewModal = jasmine.createSpy('openEvidencePreviewModal');

    component.evidence = evidence;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
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
      expect(actual).toBe(`${RootTranslationkey}.evidencePoolItem.${relativeKey}`);
    });
  });

  describe('#rowTrackBy', () => {
    it('should return evidence id', () => {
      // Act
      const actual = component.rowTrackBy(evidence);

      // Assert
      expect(actual).toBe(evidence_id);
    });
  });

  describe('host click', () => {
    it('should open full data modal with proper parameters', async () => {
      // Act

      await detectChanges();
      await fixture.nativeElement.click();

      // Assert
      expect(evidencePreviewService.openEvidencePreviewModal).toHaveBeenCalledWith({
        eventSource: component.evidenceSource,
        evidenceId: component.evidence.evidence_id,
        requirementId: component.evidence.related_requirement.requirement_id,
        controlId: component.evidence.related_control.control_id,
      });
    });
  });

  describe('link evidence click', () => {
    it('should open modal for linking evidence', async () => {
      // Arrange
      // Act
      await detectChanges();
      fixture.nativeElement.querySelector('app-new-button').click();
      // Assert
      expect(evidenceModalService.openEvidenceConnectComponent).toHaveBeenCalled();
    });
  });
});
