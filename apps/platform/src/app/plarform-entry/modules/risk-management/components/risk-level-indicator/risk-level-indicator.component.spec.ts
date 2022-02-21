import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { RiskFacadeService } from 'core/modules/risk/services';
import { RiskLevelIndicatorComponent } from './risk-level-indicator.component';
import { InherentRiskLevelEnum, ResidualRiskLevelEnum, Risk } from 'core/modules/risk/models';
import { of } from 'rxjs';
import { RiskLevelBGClasses } from '../../constants';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

describe('RiskItemComponent', () => {
  configureTestSuite();

  let component: RiskLevelIndicatorComponent;
  let fixture: ComponentFixture<RiskLevelIndicatorComponent>;

  let riskFacade: RiskFacadeService;

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [RiskLevelIndicatorComponent],
        providers: [{ provide: RiskFacadeService, useValue: {} }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskLevelIndicatorComponent);
    component = fixture.componentInstance;
    component.riskId = 'some-id';

    riskFacade = TestBed.inject(RiskFacadeService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('risk level resolving testing', () => {
    const testData = [
      {
        risk: {
          inherent_risk_level: null,
          residual_risk_level: null,
        } as Risk,
        expectedRiskLevel: 'Not Set',
      },
      {
        risk: {
          inherent_risk_level: InherentRiskLevelEnum.Critical,
          residual_risk_level: null,
        } as Risk,
        expectedRiskLevel: InherentRiskLevelEnum.Critical,
      },
      {
        risk: {
          inherent_risk_level: InherentRiskLevelEnum.High,
          residual_risk_level: InherentRiskLevelEnum.Critical,
        } as Risk,
        expectedRiskLevel: InherentRiskLevelEnum.Critical,
      },
    ];

    testData.forEach((testCase) => {
      it(`should return ${testCase.expectedRiskLevel} if
      inherent_risk_level === ${testCase.risk.inherent_risk_level} and
      residual_risk_level === ${testCase.risk.residual_risk_level}`, async () => {
        // Arrange
        riskFacade.getRiskById = jasmine.createSpy('getRiskById').and.returnValue(of(testCase.risk));

        // Act
        fixture.detectChanges();

        // Assert
        expect(component.riskLevel).toEqual(testCase.expectedRiskLevel);
      });
    });
  });

  describe('risk level component bg class testing', () => {
    const testData = [
      {
        class: RiskLevelBGClasses[InherentRiskLevelEnum.Low],
        risk: {
          residual_risk_level: InherentRiskLevelEnum.Low,
        },
      },
      {
        class: RiskLevelBGClasses[InherentRiskLevelEnum.Medium],
        risk: {
          residual_risk_level: InherentRiskLevelEnum.Medium,
        },
      },
      {
        class: RiskLevelBGClasses[InherentRiskLevelEnum.High],
        risk: {
          residual_risk_level: InherentRiskLevelEnum.High,
        },
      },
      {
        class: RiskLevelBGClasses[InherentRiskLevelEnum.Critical],
        risk: {
          residual_risk_level: InherentRiskLevelEnum.Critical,
        },
      },
      {
        class: RiskLevelBGClasses[ResidualRiskLevelEnum.NotSet],
        risk: {
          residual_risk_level: ResidualRiskLevelEnum.NotSet,
        },
      },
    ];

    testData.forEach((testCase) => {
      it(`app-chip should have "${testCase.class}" class if level is "${testCase.risk.residual_risk_level}"`, async () => {
        // Arrange
        riskFacade.getRiskById = jasmine.createSpy('getRiskById').and.returnValue(of(testCase.risk));

        // Act
        fixture.detectChanges();

        // Assert
        expect(fixture.debugElement.query(By.css('app-chip')).nativeElement).toHaveClass(testCase.class);
      });
    });
  });

  it('should display app-chip if editable prop === false and riskLevel is truthy', () => {
    // Arrange
    component.editable = false;
    riskFacade.getRiskById = jasmine.createSpy('getRiskById').and.returnValue(
      of({
        inherent_risk_level: null,
        residual_risk_level: null,
      })
    );

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.debugElement.query(By.css('app-chip'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('app-colored-dropdown-control'))).toBeFalsy();
  });

  it('should display app-colored-dropdown-control if editable prop === true', () => {
    // Arrange
    component.editable = true;

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.debugElement.query(By.css('app-chip'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('app-colored-dropdown-control'))).toBeTruthy();
  });
});
