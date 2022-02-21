import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvidencePreviewHostComponent, EvidencePreviewTypeEnum } from './evidence-preview-host.component';
import {
  ControlsFacadeService,
  EvidenceFacadeService,
  EvidenceService,
  FrameworksFacadeService,
  RequirementsFacadeService,
  SnapshotsFacadeService,
} from 'core/modules/data/services';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CalculatedControl, CalculatedRequirement } from 'core/modules/data/models';
import { EvidenceInstance, Framework } from 'core/modules/data/models/domain';

describe('EvidencePreviewHostComponent', () => {
  configureTestSuite();

  let component: EvidencePreviewHostComponent;
  let fixture: ComponentFixture<EvidencePreviewHostComponent>;

  let evidenceService: EvidenceService;
  let evidenceFacade: EvidenceFacadeService;
  let controlFacade: ControlsFacadeService;
  let requirementFacade: RequirementsFacadeService;
  let frameworkFacade: FrameworksFacadeService;
  let snapshotFacade: SnapshotsFacadeService;

  const preview = 'some-preview';

  const tabularPreviewSelector = 'app-evidence-tabular-preview';
  const filePreviewSelector = 'app-file-preview';

  const evidence: EvidenceInstance = {
    evidence_id: 'id',
    evidence_instance_id: 'id',
    evidence_type: 'LOG',
  };

  const control: CalculatedControl = {
    control_id: 'id',
  };

  const requirement: CalculatedRequirement = {
    requirement_id: 'id',
  };

  const framework: Framework = {
    framework_id: 'id',
  };

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvidencePreviewHostComponent],
      providers: [
        { provide: EvidenceService, useValue: {} },
        { provide: SnapshotsFacadeService, useValue: {} },
        { provide: FrameworksFacadeService, useValue: {} },
        { provide: EvidenceFacadeService, useValue: {} },
        { provide: ControlsFacadeService, useValue: {} },
        { provide: RequirementsFacadeService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidencePreviewHostComponent);
    component = fixture.componentInstance;

    evidenceService = TestBed.inject(EvidenceService);
    evidenceService.getEvidencePreview = jasmine.createSpy('getEvidencePreview').and.returnValue(of(preview));

    evidenceFacade = TestBed.inject(EvidenceFacadeService);
    evidenceFacade.getEvidence = jasmine.createSpy('getEvidence').and.returnValue(of(evidence));

    controlFacade = TestBed.inject(ControlsFacadeService);
    controlFacade.getControl = jasmine.createSpy('getControl').and.returnValue(of(control));

    requirementFacade = TestBed.inject(RequirementsFacadeService);
    requirementFacade.getRequirement = jasmine.createSpy('getRequirement').and.returnValue(of(framework));

    frameworkFacade = TestBed.inject(FrameworksFacadeService);
    frameworkFacade.getFrameworkById = jasmine.createSpy('getFrameworkById').and.returnValue(of(requirement));

    component.evidenceLike$ = of({
      evidence: evidence,
    });
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it(`evidencePreviewData$ prop should be truthy if evidenceType === ${EvidencePreviewTypeEnum.EvidencePreview}`, async () => {
    // Arrange
    // Act
    fixture.detectChanges();
    await fixture.detectChanges();

    // Assert
    expect(component.evidencePreviewData$).toBeTruthy();
    expect(await component.evidencePreviewData$.toPromise()).toEqual(preview);
  });

  describe('template resolving testing', () => {
    const testData = [
      {
        previewType: EvidencePreviewTypeEnum.EvidencePreview,
        shouldBeDisplayed: tabularPreviewSelector,
        shouldNotBeDisplayed: filePreviewSelector,
      },
      {
        previewType: EvidencePreviewTypeEnum.FilePreview,
        shouldBeDisplayed: filePreviewSelector,
        shouldNotBeDisplayed: tabularPreviewSelector,
      },
    ];

    testData.forEach((testCase) => {
      it(` ${testCase.shouldBeDisplayed} should be truthy and ${testCase.shouldNotBeDisplayed} should be falsy if evidenceType === ${testCase.previewType}`,  () => {
        // Arrange
        fixture.detectChanges();
        component.evidenceType$ = of(testCase.previewType);

        // Act
        fixture.detectChanges();

        // Assert
        expect(fixture.debugElement.query(By.css(testCase.shouldBeDisplayed))).toBeTruthy();
        expect(fixture.debugElement.query(By.css(testCase.shouldNotBeDisplayed))).toBeFalsy();
      });
    });
  });
});
