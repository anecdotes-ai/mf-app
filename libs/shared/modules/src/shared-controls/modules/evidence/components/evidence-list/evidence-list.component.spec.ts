import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { EvidenceListComponent } from './evidence-list.component';
import { CalculatedEvidence } from 'core/modules/data/models';

describe('EvidenceListComponent', () => {
  configureTestSuite();
  let component: EvidenceListComponent;
  let fixture: ComponentFixture<EvidenceListComponent>;

  beforeAll(() => {
    TestBed.configureTestingModule({
      declarations: [EvidenceListComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenceListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  describe('selecEvidenceId', () => {
    it('should return evidence id', () => {
      // Arrange
      const evidence: CalculatedEvidence = {
        evidence_id: 'fake id',
      };
      // Act
      // Assert
      expect(component.selecEvidenceId(evidence)).toBe(evidence.evidence_id);
    });
  });

  describe('buildTranslationKey', () => {
    it('should return value based on relative key', () => {
      // Arrange
      const relativeKey = 'fake';

      // Act
      const actualFullKey = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actualFullKey).toBe(`connectEvidenceModal.${relativeKey}`);
    });
  });
});
