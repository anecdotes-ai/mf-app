import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { DateViewComponent } from 'core';
import {
  EvidenceLabelComponent
} from 'core/modules/shared-controls/components/evidence-item/evidence-label/evidence-label.component';
import { EvidenceWrapperComponent } from 'core/modules/shared-evidence/components';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';

import { EvidenceFacadeService } from 'core/modules/data/services';
import { EvidencePreviewService } from 'core/modules/shared-controls';
import { RiskEvidenceMenuComponent } from '../risk-evidence-menu/risk-evidence-menu.component';
import { RiskEvidenceComponent } from './risk-evidence.component';

const FAKE_DATA = {
  evidence: {
    evidence_id: 'fake_evidence_id',
    evidence_name: 'fake_evidence_name',
  },
  riskId: 'fake_risk_id',
};

describe('RiskEvidenceComponent', () => {
  configureTestSuite();

  let fixture: ComponentFixture<RiskEvidenceComponent>;
  let componentUnderTest: RiskEvidenceComponent;

  let evidenceFacadeServiceSpy: jasmine.SpyObj<EvidenceFacadeService>;
  let evidencePreviewServiceSpy: jasmine.SpyObj<EvidencePreviewService>;

  beforeAll(() => {
    evidenceFacadeServiceSpy = jasmine.createSpyObj('EvidenceFacadeService', ['getEvidence']);
    evidencePreviewServiceSpy = jasmine.createSpyObj('EvidencePreviewService', ['openEvidencePreviewModal']);

    TestBed.configureTestingModule({
      declarations: [RiskEvidenceComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: EvidenceFacadeService, useValue: evidenceFacadeServiceSpy },
        { provide: EvidencePreviewService, useValue: evidencePreviewServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskEvidenceComponent);

    componentUnderTest = fixture.componentInstance;
    componentUnderTest.evidenceId = FAKE_DATA.evidence.evidence_id;
    componentUnderTest.riskId = FAKE_DATA.riskId;

    evidenceFacadeServiceSpy.getEvidence.and.returnValue(of(FAKE_DATA.evidence));
    evidencePreviewServiceSpy.openEvidencePreviewModal.and.returnValue();

    fixture.detectChanges();
  });

  it('should render the component', () => {
    // Arrange
    // Act
    // Assert
    expect(componentUnderTest).toBeTruthy();
  });

  it('should render the child components', () => {
    // Arrange
    const childSelectors = [
      EvidenceWrapperComponent,
      EvidenceLabelComponent,
      DateViewComponent,
      RiskEvidenceMenuComponent,
    ];

    // Act
    // Assert
    childSelectors.forEach((selector) => {
      expect(fixture.debugElement.query(By.directive(selector))).toBeDefined();
    });
  });

  it('should bind classes to the host', () => {
    // Arrange
    // Act
    // Assert
    expect(fixture.nativeElement.classList.contains('block')).toEqual(true);
    expect(fixture.nativeElement.classList.contains('cursor-pointer')).toEqual(true);
  });

  describe('host click listener', () => {
    it('should be called with correct params', () => {
      // Arrange
      const params = {
        evidence: FAKE_DATA.evidence,
      };

      // Act
      fixture.debugElement.triggerEventHandler('click', null);

      // Assert
      expect(evidencePreviewServiceSpy.openEvidencePreviewModal).toHaveBeenCalledWith(params);
    });
  });

  describe('buildTranslationKey method', () => {
    it('should return full translation key', () => {
      // Arrange

      // Act
      const actual = componentUnderTest.buildTranslationKey('automaticallyCollectedText');

      // Assert
      expect(actual).toBe('riskManagement.supportingDocuments.automaticallyCollectedText');
    });
  });
});
