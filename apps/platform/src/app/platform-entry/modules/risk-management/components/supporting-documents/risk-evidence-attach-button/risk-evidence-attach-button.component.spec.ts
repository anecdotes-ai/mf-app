import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';

import { ActionMenuButtonComponent } from 'core/modules/dropdown-menu';
import { RiskResourceType } from 'core/modules/risk/constants';
import { RiskFacadeService } from 'core/modules/risk/services';
import { EvidenceCollectionModalService } from 'core/modules/shared-controls';
import { RiskEvidenceAttachButtonComponent } from './risk-evidence-attach-button.component';

const FAKE_DATA = {
  risk: { id: 'fake_id', name: 'fake_name' },
  svgElement: document.createElement('svg') as (HTMLElement & SVGSVGElement),
};

describe('RiskEvidenceAttachButtonComponent', () => {
  configureTestSuite();

  let fixture: ComponentFixture<RiskEvidenceAttachButtonComponent>;
  let componentUnderTest: RiskEvidenceAttachButtonComponent;
  let childComponent: ActionMenuButtonComponent;

  let evidenceCollectionModalServiceSpy: jasmine.SpyObj<EvidenceCollectionModalService>;
  let riskFacadeServiceSpy: jasmine.SpyObj<RiskFacadeService>;

  beforeAll(() => {
    evidenceCollectionModalServiceSpy = jasmine.createSpyObj('EvidenceCollectionModalService', ['openFileUploadingModal', 'openSharedLinkEvidenceCreationModal']);
    riskFacadeServiceSpy = jasmine.createSpyObj('RiskFacadeService', ['getRiskById']);

    TestBed.configureTestingModule({
      declarations: [RiskEvidenceAttachButtonComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: EvidenceCollectionModalService, useValue: evidenceCollectionModalServiceSpy },
        { provide: RiskFacadeService, useValue: riskFacadeServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskEvidenceAttachButtonComponent);

    componentUnderTest = fixture.componentInstance;
    componentUnderTest.riskId = FAKE_DATA.risk.id;
    childComponent = (fixture.debugElement.query(By.css('app-action-menu-button')).componentInstance) as ActionMenuButtonComponent;

    evidenceCollectionModalServiceSpy.openFileUploadingModal.and.returnValue();
    evidenceCollectionModalServiceSpy.openSharedLinkEvidenceCreationModal.and.returnValue();
    riskFacadeServiceSpy.getRiskById.and.returnValue(of(FAKE_DATA.risk));

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

  it('should set the value of risk object when observable completes', () => {
    // Arrange
    // Act
    const actual = componentUnderTest['risk'];

    // Assert
    expect(actual).toBe(FAKE_DATA.risk);
  });

  describe('buildTranslationKey method', () => {
    it('should return full translation key', () => {
      // Arrange
      const translationKey = 'addItem';

      // Act
      const actual = componentUnderTest.buildTranslationKey(translationKey);

      // Assert
      expect(actual).toBe(`riskManagement.supportingDocuments.collectEvidenceMenu.${ translationKey }`);
    });
  });

  describe('menuActions', () => {
    it('should pass the menu actions to child component in the unchanged order', () => {
      // Arrange
      // Act
      // Assert
      expect(childComponent.menuActions).toEqual(componentUnderTest.menuActions);
    });

    describe('openLinkFilesModal method', () => {
      it('should be called with correct params', () => {
        // Arrange
        const params = {
          targetResource: { resourceId: FAKE_DATA.risk.id, resourceType: RiskResourceType },
          entityPath: [FAKE_DATA.risk.name],
        };

        // Act
        componentUnderTest.menuActions[0].action();

        // Assert
        expect(evidenceCollectionModalServiceSpy.openSharedLinkEvidenceCreationModal).toHaveBeenCalledWith(params);
      });
    });

    describe('openFileBrowser method', () => {
      it('should be called with correct params', () => {
        // Arrange
        const params = {
          targetResource: { resourceId: FAKE_DATA.risk.id, resourceType: RiskResourceType },
        };

        // Act
        componentUnderTest.menuActions[1].action();

        // Assert
        expect(evidenceCollectionModalServiceSpy.openFileUploadingModal).toHaveBeenCalledWith(params);
      });
    });
  });
});
