import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { RiskFacadeService } from 'core/modules/risk/services';
import { RiskImpactIndicatorComponent } from './risk-impact-indicator.component';
import { InherentRiskLevelImpactEnum, Risk } from 'core/modules/risk/models';
import { of } from 'rxjs';
import { ImpactBGClasses, notSetClass } from '../../constants';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

describe('RiskImpactIndicatorComponent', () => {
  configureTestSuite();

  let component: RiskImpactIndicatorComponent;
  let fixture: ComponentFixture<RiskImpactIndicatorComponent>;

  let riskFacade: RiskFacadeService;

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [RiskImpactIndicatorComponent],
        providers: [{ provide: RiskFacadeService, useValue: {} }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskImpactIndicatorComponent);
    component = fixture.componentInstance;
    component.riskId = 'some-id';

    riskFacade = TestBed.inject(RiskFacadeService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('risk impact value testing', () => {
    const testData = [
      {
        risk: {
          residual_risk_level_impact: null,
        } as Risk,
        riskField: 'residual_risk_level_impact',
        expectedRiskImpact: null,
      },
      {
        risk: {
          residual_risk_level_impact: InherentRiskLevelImpactEnum.Catastrophic,
        } as Risk,
        riskField: 'residual_risk_level_impact',
        expectedRiskImpact: InherentRiskLevelImpactEnum.Catastrophic,
      },
      {
        risk: {
          inherent_risk_level_impact: InherentRiskLevelImpactEnum.Minor,
        } as Risk,
        riskField: 'inherent_risk_level_impact',
        expectedRiskImpact: InherentRiskLevelImpactEnum.Minor,
      },
    ];

    testData.forEach((testCase) => {
      it(`should assign to control value of ${testCase.expectedRiskImpact} when
      riskField is ${testCase.riskField} and its value is ${
        testCase.risk.residual_risk_level_impact || testCase.risk.inherent_risk_level_impact
      }`, async () => {
        // Arrange
        component.riskField = testCase.riskField;
        riskFacade.getRiskById = jasmine.createSpy('getRiskById').and.returnValue(of(testCase.risk));

        // Act
        fixture.detectChanges();

        // Assert
        expect(await component.control.value).toEqual(testCase.expectedRiskImpact);
      });
    });
  });

  describe('risk impact component bg class testing', () => {
    const testData = [
      {
        class: ImpactBGClasses[InherentRiskLevelImpactEnum.Minor],
        risk: {
          inherent_risk_level_impact: InherentRiskLevelImpactEnum.Minor,
        },
      },
      {
        class: ImpactBGClasses[InherentRiskLevelImpactEnum.Major],
        risk: {
          inherent_risk_level_impact: InherentRiskLevelImpactEnum.Major,
        },
      },
      {
        class: ImpactBGClasses[InherentRiskLevelImpactEnum.Moderate],
        risk: {
          inherent_risk_level_impact: InherentRiskLevelImpactEnum.Moderate,
        },
      },
      {
        class: ImpactBGClasses[InherentRiskLevelImpactEnum.Insignificant],
        risk: {
          inherent_risk_level_impact: InherentRiskLevelImpactEnum.Insignificant,
        },
      },
      {
        class: ImpactBGClasses[InherentRiskLevelImpactEnum.Catastrophic],
        risk: {
          inherent_risk_level_impact: InherentRiskLevelImpactEnum.Catastrophic,
        },
      },
      {
        class: notSetClass,
        risk: {
          inherent_risk_level_impact: null,
        },
      },
    ];

    testData.forEach((testCase) => {
      it(`Component should have "${testCase.class}" class if impact is "${testCase.risk.inherent_risk_level_impact}"`, async () => {
        // Arrange
        component.riskField ='inherent_risk_level_impact';
        riskFacade.getRiskById = jasmine.createSpy('getRiskById').and.returnValue(of(testCase.risk));
        
        // Act
        fixture.detectChanges();

        // Assert
          expect(fixture.debugElement.query(By.css('app-colored-dropdown-control')).properties['buttonBackgroundClass']).toEqual(testCase.class);
      });
    });
  });
});
