import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';

import { ThreeDotsMenuComponent } from 'core/modules/dropdown-menu';
import { GenericModalsService } from 'core/modules/modals';
import { RiskFacadeService } from 'core/modules/risk/services';
import { RiskEvidenceMenuComponent } from './risk-evidence-menu.component';

const FAKE_DATA = {
  riskId: 'fake_risk_id',
  evidenceId: 'fake_evidence_id',
};

const buildTranslationKey = (relativeKey: string): string => {
  return `riskManagement.supportingDocuments.${relativeKey}`;
};

describe('RiskEvidenceMenuComponent', () => {
  configureTestSuite();

  let fixture: ComponentFixture<RiskEvidenceMenuComponent>;
  let componentUnderTest: RiskEvidenceMenuComponent;
  let childComponent: ThreeDotsMenuComponent;

  let riskFacadeServiceSpy: jasmine.SpyObj<RiskFacadeService>;
  let genericModalsServiceSpy: jasmine.SpyObj<GenericModalsService>;

  beforeAll(() => {
    riskFacadeServiceSpy = jasmine.createSpyObj('RiskFacadeService', ['removeEvidenceFromRisk']);
    genericModalsServiceSpy = jasmine.createSpyObj('GenericModalsService', ['openConfirmationModal']);

    TestBed.configureTestingModule({
      declarations: [RiskEvidenceMenuComponent],
      providers: [
        { provide: RiskFacadeService, useValue: riskFacadeServiceSpy },
        { provide: GenericModalsService, useValue: genericModalsServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskEvidenceMenuComponent);

    componentUnderTest = fixture.componentInstance;
    componentUnderTest.riskId = FAKE_DATA.riskId;
    componentUnderTest.evidenceId = FAKE_DATA.evidenceId;
    childComponent = (fixture.debugElement.query(By.css('app-three-dots-menu')).componentInstance) as ThreeDotsMenuComponent;

    fixture.detectChanges();
  });

  it('should render the component', () => {
    // Arrange
    // Act
    // Assert
    expect(componentUnderTest).toBeTruthy();
  });

  it('should render the child component', () => {
    // Arrange
    // Act
    // Assert
    expect(childComponent).toBeDefined();
  });

  describe('buildTranslationKey method', () => {
    it('should return full translation key', () => {
      // Arrange
      // Act
      // Assert
      expect(componentUnderTest.menuActions[0].translationKey).toBe(buildTranslationKey('removeEvidenceOption'));
    });
  });

  describe('menuActions', () => {
    it('should pass the menu actions to child component in the unchanged order', () => {
      // Arrange
      // Act
      // Assert
      expect(childComponent.menuActions).toEqual(componentUnderTest.menuActions);
    });

    describe('removeAsync method', () => {
      it('should be called with correct params', fakeAsync(async () => {
        // Arrange
        const params = {
          confirmTranslationKey: buildTranslationKey('removeEvidenceConfirmationModal.yesBtn'),
          dismissTranslationKey: buildTranslationKey('removeEvidenceConfirmationModal.cancelBtn'),
          questionTranslationKey: buildTranslationKey('removeEvidenceConfirmationModal.question'),
          aftermathTranslationKey: buildTranslationKey('removeEvidenceConfirmationModal.aftermath'),
          dontShowTranslationKey: buildTranslationKey('removeEvidenceConfirmationModal.dontShowAgain'),
          localStorageKey: 'delete-risk-evidence',    
        };
        const modalsSpy = genericModalsServiceSpy.openConfirmationModal.and.returnValue(Promise.resolve(true));
        riskFacadeServiceSpy.removeEvidenceFromRisk.and.returnValue(Promise.resolve());

        // Act
        componentUnderTest.menuActions[0].action();

        // Assert
        expect(genericModalsServiceSpy.openConfirmationModal).toHaveBeenCalledWith(params);

        await modalsSpy.calls.mostRecent().returnValue;
        fixture.detectChanges();

        expect(riskFacadeServiceSpy.removeEvidenceFromRisk).toHaveBeenCalledWith(FAKE_DATA.riskId, FAKE_DATA.evidenceId);
      }));
    });
  });
});
