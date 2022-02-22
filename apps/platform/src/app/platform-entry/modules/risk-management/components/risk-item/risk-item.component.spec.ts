import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader } from '@angular/material/expansion';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { MitigationControlsSection } from '../mitigation-controls-section/mitigation-controls-section.component';
import { RiskAnalysisComponent } from '../risk-analysis/risk-analysis.component';
import { RiskInfoComponent } from '../risk-info/risk-info.component';
import { RiskItemHeaderComponent } from '../risk-item-header/risk-item-header.component';
import { RiskSupportingDocumentsComponent } from '../supporting-documents';
import { RiskItemComponent } from './risk-item.component';
import { RiskFacadeService } from 'core/modules/risk/services';

const FAKE_DATA = {
  risk: {
    id: 'fake_id',
  },
};

describe('RiskItemComponent', () => {
  configureTestSuite();

  let fixture: ComponentFixture<RiskItemComponent>;
  let componentUnderTest: RiskItemComponent;
  let riskFacadeServiceSpy: jasmine.SpyObj<RiskFacadeService>;

  beforeAll(() => {
    riskFacadeServiceSpy = jasmine.createSpyObj('RiskFacadeService', ['getRiskById']);

    TestBed.configureTestingModule({
      declarations: [RiskItemComponent],
      providers: [
        { provide: RiskFacadeService, useValue: riskFacadeServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskItemComponent);
    componentUnderTest = fixture.componentInstance;
    riskFacadeServiceSpy.getRiskById.and.returnValue(of(FAKE_DATA.risk));

    fixture.detectChanges();
  });

  it('should render the component', () => {
    // Arrange
    // Act
    // Assert
    expect(componentUnderTest).toBeTruthy();
  });

  it('should set the value of risk object when observable completes', () => {
    // Arrange
    // Act
    // Assert
    expect(componentUnderTest['risk']).toBe(FAKE_DATA.risk);
  });

  it('should render the child components', () => {
    // Arrange
    const childSelectors = [
      MatExpansionPanel,
      MatExpansionPanelHeader,
      MatExpansionPanelDescription,
      RiskItemHeaderComponent,
      RiskInfoComponent,
      RiskAnalysisComponent,
      MitigationControlsSection,
      RiskSupportingDocumentsComponent,
    ];

    // Act
    // Assert
    childSelectors.forEach((selector) => {
      expect(fixture.debugElement.query(By.directive(selector))).toBeDefined();
    });
  });
});
