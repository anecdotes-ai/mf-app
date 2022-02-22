import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { RiskFacadeService } from 'core/modules/risk/services';
import { TranslateModule } from '@ngx-translate/core';
import { RiskEffectsComponent } from './risk-effects.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { of } from 'rxjs';
import { Risk } from 'core/modules/risk/models';

describe('RiskItemComponent', () => {
  configureTestSuite();

  let component: RiskEffectsComponent;
  let fixture: ComponentFixture<RiskEffectsComponent>;

  let riskFacade: RiskFacadeService;

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(), OverlayModule],
        declarations: [RiskEffectsComponent],
        providers: [{ provide: RiskFacadeService, useValue: {} }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskEffectsComponent);
    component = fixture.componentInstance;
    component.riskId = 'some-id';

    riskFacade = TestBed.inject(RiskFacadeService);
    riskFacade.getRiskById = jasmine.createSpy('getRiskById').and.returnValue(of({ effect: [] } as Risk));
    riskFacade.updateRiskEffectsAsync = jasmine.createSpy('updateRiskEffectsAsync');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('open', () => {
    it('should set true to isDropdownOpened prop', async () => {
      // Arrange
      component.isDropdownOpened = false;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      component.open();

      // Assert
      expect(component.isDropdownOpened).toBeTrue();
    });
  });

  describe('close', () => {
    it('should set false to isDropdownOpened prop', async () => {
      // Arrange
      component.isDropdownOpened = true;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      component.close();

      // Assert
      expect(component.isDropdownOpened).toBeFalse();
    });
  });

  describe('toggleDropdown', () => {
    it('should toggle isDropdownOpened prop to true', async () => {
      // Arrange
      component.isDropdownOpened = false;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      component.toggleDropdown(new Event('click') as MouseEvent);

      // Assert
      expect(component.isDropdownOpened).toBeTrue();
    });

    it('should toggle isDropdownOpened prop to false', async () => {
      // Arrange
      component.isDropdownOpened = true;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      component.toggleDropdown(new Event('click') as MouseEvent);

      // Assert
      expect(component.isDropdownOpened).toBeFalse();
    });
  });

  it('should set appropriate appliedEffects and selectedEffectsDictionary according to risk effects', async () => {
    // Arrange
    riskFacade.getRiskById = jasmine
      .createSpy('getRiskById')
      .and.returnValue(of({ effect: ['Confidentiality'] } as Risk));

    // Act
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    expect(component.appliedEffects).toEqual(new Set(['Confidentiality']));
    expect(component.selectedEffectsDictionary).toEqual({ Confidentiality: true });
  });

  it('should call riskFacade.updateRiskEffectsAsync on close and if there are new effects for risk', async () => {
    // Arrange
    riskFacade.getRiskById = jasmine
      .createSpy('getRiskById')
      .and.returnValue(of({ effect: ['Confidentiality'] } as Risk));
    fixture.detectChanges();
    await fixture.whenStable();

    // Act
    component.selectedEffectsDictionary = { Confidentiality: true, Availability: true };
    fixture.detectChanges();
    component.close();

    // Assert
    expect(riskFacade.updateRiskEffectsAsync).toHaveBeenCalledWith(component.riskId, [
      'Confidentiality',
      'Availability',
    ]);
  });

  it('should not call riskFacade.updateRiskEffectsAsync on close and if there are no new effects for risk', async () => {
    // Arrange
    riskFacade.getRiskById = jasmine
      .createSpy('getRiskById')
      .and.returnValue(of({ effect: ['Confidentiality'] } as Risk));
    fixture.detectChanges();
    await fixture.whenStable();

    // Act
    component.selectedEffectsDictionary = { Confidentiality: true };
    fixture.detectChanges();
    component.close();

    // Assert
    expect(riskFacade.updateRiskEffectsAsync).not.toHaveBeenCalled();
  });
});
