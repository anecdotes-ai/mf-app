import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Risk } from 'core/modules/risk/models';
import { RiskFacadeService } from 'core/modules/risk/services';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { RiskAanlysisItemComponent } from './risk-analysis-item.component';

describe('RiskAanlysisItemComponent', () => {
  configureTestSuite();

  let riskFacadeServiceMock: RiskFacadeService;

  let component: RiskAanlysisItemComponent;
  let fixture: ComponentFixture<RiskAanlysisItemComponent>;

  const mockRisk: Risk = { id: 'risk-id', mitigation_control_ids: ['control-id'] };

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [RiskAanlysisItemComponent],
        providers: [
          { provide: RiskFacadeService, useValue: {} }
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    riskFacadeServiceMock = TestBed.inject(RiskFacadeService);
    riskFacadeServiceMock.getRiskById = jasmine.createSpy('getRiskById').and.callFake(() => of(mockRisk));
    riskFacadeServiceMock.editFinancialImpactAsync = jasmine.createSpy('editFinancialImpactAsync');

    fixture = TestBed.createComponent(RiskAanlysisItemComponent);
    component = fixture.componentInstance;
    component.analysisType = 'Inherent';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set risk with correct value', () => {
      // Act
      fixture.detectChanges();

      // Assert
      expect(component.risk).toEqual(mockRisk);
    });
  });

  describe('editFinancialImpact', () => {
      it('should call editFinancialImpactAsync', () => {
        // Arrange
        const value = '1000';
        component.risk = mockRisk;

        // Act
        fixture.detectChanges();
        component.editFinancialImpact(value);

        // Assert
        expect(riskFacadeServiceMock.editFinancialImpactAsync).toHaveBeenCalledWith(mockRisk.id, {inherent_risk_level_financial_impact: value });
      });
  });

  describe('onEditing', () => {
    it('should change isLoading to true when both impact and liklihood fields has values', () => {
      // Arrange
      component.risk = mockRisk;
      component.risk.inherent_risk_level_impact = 'Catastrophic';
      // Act
      fixture.detectChanges();
      component.onEditing('inherent_risk_level_like_hood');

      // Assert
      expect(component.isLoading).toBeTrue();
    });

    it('should NOT change isLoading to true when impact field has no value', () => {
        // Arrange
        component.risk = mockRisk;
        component.risk.inherent_risk_level_impact = null;

        // Act
        fixture.detectChanges();
        component.onEditing('inherent_risk_level_like_hood');
  
        // Assert
        expect(component.isLoading).toBeFalse();
      });

      it('should NOT change isLoading to true when liklihood field has no value', () => {
        // Arrange
        component.risk = mockRisk;
        
        // Act
        fixture.detectChanges();
        component.onEditing('inherent_risk_level_impact');
  
        // Assert
        expect(component.isLoading).toBeFalse();
      });
});
});
