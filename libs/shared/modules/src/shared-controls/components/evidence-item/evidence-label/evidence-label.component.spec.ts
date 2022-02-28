import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvidenceLabelComponent } from './evidence-label.component';
import { By } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CombinedEvidenceInstance } from 'core/modules/data/models/domain';
import { EvidenceUserEventService } from 'core/modules/data/services/event-tracking/evidence-user-event.service';
import { PoliciesFacadeService } from 'core/modules/data/services';
import { CalculatedPolicy, ResourceType } from 'core/modules/data/models';

describe('EvidenceLabelComponent', () => {
  configureTestSuite();

  let component: EvidenceLabelComponent;
  let fixture: ComponentFixture<EvidenceLabelComponent>;
  let translateService: TranslateService;
  let policiesFacadeServiceMock: PoliciesFacadeService;
  let evidenceUserEventServiceMock: EvidenceUserEventService;

  const evidence: CombinedEvidenceInstance = {
    evidence_is_beta: true,
    evidence_name: 'some-evidence',
    evidence_service_display_name: 'some-evidence-service-display-name',
    evidence_id: 'evidence_id',
    evidence_type: 'DOCUMENT',
  };
  const fakePolicy: CalculatedPolicy = {
    policy_name: 'policy_name'
  };

  beforeAll(() => {
    TestBed.configureTestingModule({
      declarations: [EvidenceLabelComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        TranslateService,
        {
          provide: EvidenceUserEventService,
          useValue: {},
        },
        {
          provide: PoliciesFacadeService,
          useValue: {},
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(EvidenceLabelComponent);
    component = fixture.componentInstance;

    policiesFacadeServiceMock = TestBed.inject(PoliciesFacadeService);
    policiesFacadeServiceMock.getPolicy = jasmine.createSpy('getPolicy').and.returnValue(of(fakePolicy));

    evidenceUserEventServiceMock = TestBed.inject(EvidenceUserEventService);
    evidenceUserEventServiceMock.trackFlagHover = jasmine.createSpy('trackFlagHover').and.callFake(() => {});

    translateService = TestBed.inject(TranslateService);
    translateService.get = jasmine.createSpy('get').and.returnValue(of('Beta'));

    component.evidence = evidence;
    component.betaLabel = 'Beta';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#setEvidenceNameFromPolicy', () => {
    it('should set evidenceName', () => {
      // Arrange
      component.resourceType = ResourceType.Policy;

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.evidenceName).toBe(fakePolicy.policy_name);
    });
  });

  describe('#createEvidenceName', () => {
    it('should set evidenceName when evidence_is_beta property is true', () => {
      // Arrange
      component.resourceType = ResourceType.Control;

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.evidenceName).toEqual('some-evidence (Beta)');
    });

    it('should set evidenceName when evidence_is_beta property is false', () => {
      // Arrange
      component.resourceType = ResourceType.Control;
      evidence.evidence_is_beta = false;

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.evidenceName).toEqual('some-evidence');
    });
  });

  describe('#sendEvent', () => {
    it('should call evidenceEventService.trackFlagHover with args', () => {
      // Arrange
      component.resourceType = ResourceType.Policy;
      component.evidenceComply = false;

      // Act
      fixture.detectChanges();

      const gapMark = fixture.debugElement.query(By.css('app-gap-mark')).nativeElement;
      gapMark.dispatchEvent(new MouseEvent('mouseover'));

      // Assert
      expect(evidenceUserEventServiceMock.trackFlagHover).toHaveBeenCalledWith(
        evidence.evidence_id,
        evidence.evidence_type,
        evidence.evidence_name,
        component.eventSource
      );
    });
  });
});
