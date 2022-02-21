import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { RiskFacadeService } from 'core/modules/risk/services';
import { RiskLiklihoodIndicatorComponent } from './risk-liklihood-indicator.component';
import { InherentRiskLevelLikeHoodEnum, Risk } from 'core/modules/risk/models';
import { of } from 'rxjs';
import { LiklihoodBGClasses, notSetClass } from '../../constants';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

describe('RiskLiklihoodIndicatorComponent', () => {
  configureTestSuite();

  let component: RiskLiklihoodIndicatorComponent;
  let fixture: ComponentFixture<RiskLiklihoodIndicatorComponent>;

  let riskFacade: RiskFacadeService;

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [RiskLiklihoodIndicatorComponent],
        providers: [{ provide: RiskFacadeService, useValue: {} }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskLiklihoodIndicatorComponent);
    component = fixture.componentInstance;
    component.riskId = 'some-id';

    riskFacade = TestBed.inject(RiskFacadeService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('risk liklihood value testing', () => {
    const testData = [
      {
        risk: {
          inherent_risk_level_like_hood: null,
        } as Risk,
        riskField: 'inherent_risk_level_like_hood',
        expectedRiskLiklihood: null,
      },
      {
        risk: {
          residual_risk_level_like_hood: InherentRiskLevelLikeHoodEnum.AlmostCertain,
        } as Risk,
        riskField: 'residual_risk_level_like_hood',
        expectedRiskLiklihood: InherentRiskLevelLikeHoodEnum.AlmostCertain,
      },
      {
        risk: {
            inherent_risk_level_like_hood: InherentRiskLevelLikeHoodEnum.Likely,
        } as Risk,
        riskField: 'inherent_risk_level_like_hood',
        expectedRiskLiklihood: InherentRiskLevelLikeHoodEnum.Likely,
      },
    ];

    testData.forEach((testCase) => {
      it(`should assign to control value of ${testCase.expectedRiskLiklihood} when
      riskField is ${testCase.riskField} and its value is ${
        testCase.risk.residual_risk_level_like_hood || testCase.risk.inherent_risk_level_like_hood
      }`, async () => {
        // Arrange
        component.riskField = testCase.riskField;
        riskFacade.getRiskById = jasmine.createSpy('getRiskById').and.returnValue(of(testCase.risk));

        // Act
        fixture.detectChanges();

        // Assert
        expect(await component.control.value).toEqual(testCase.expectedRiskLiklihood);
      });
    });
  });

  describe('risk liklihood component bg class testing', () => {
    const testData = [
      {
        class: LiklihoodBGClasses[InherentRiskLevelLikeHoodEnum.Unlikely],
        risk: {
            inherent_risk_level_like_hood: InherentRiskLevelLikeHoodEnum.Unlikely,
        },
      },
      {
        class: LiklihoodBGClasses[InherentRiskLevelLikeHoodEnum.Rare],
        risk: {
            inherent_risk_level_like_hood: InherentRiskLevelLikeHoodEnum.Rare,
        },
      },
      {
        class: LiklihoodBGClasses[InherentRiskLevelLikeHoodEnum.Possible],
        risk: {
            inherent_risk_level_like_hood: InherentRiskLevelLikeHoodEnum.Possible,
        },
      },
      {
        class: LiklihoodBGClasses[InherentRiskLevelLikeHoodEnum.Likely],
        risk: {
            inherent_risk_level_like_hood: InherentRiskLevelLikeHoodEnum.Likely,
        },
      },
      {
        class: LiklihoodBGClasses[InherentRiskLevelLikeHoodEnum.AlmostCertain],
        risk: {
            inherent_risk_level_like_hood: InherentRiskLevelLikeHoodEnum.AlmostCertain,
        },
      },
      {
        class: notSetClass,
        risk: {
            inherent_risk_level_like_hood: null,
        },
      },
    ];

    testData.forEach((testCase) => {
      it(`Component should have "${testCase.class}" class if liklihood is "${testCase.risk.inherent_risk_level_like_hood}"`, async () => {
        // Arrange
        component.riskField ='inherent_risk_level_like_hood';
        riskFacade.getRiskById = jasmine.createSpy('getRiskById').and.returnValue(of(testCase.risk));
        
        // Act
        fixture.detectChanges();

        // Assert
          expect(fixture.debugElement.query(By.css('app-colored-dropdown-control')).properties['buttonBackgroundClass']).toEqual(testCase.class);
      });
    });
  });
});
