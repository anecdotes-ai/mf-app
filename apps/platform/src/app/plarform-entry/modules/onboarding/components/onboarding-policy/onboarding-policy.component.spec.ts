import { OnboardingUserEventService } from './../../services/onboarding-user-event.service';
import { OnboardingComponentIds } from './../../constants/onboarding.constants';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher/directives/component-switcher/component-switcher.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingPolicyComponent } from './onboarding-policy.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserEventService } from 'core/services/user-event/user-event.service';


describe('OnboardingPolicyComponent', () => {
  let component: OnboardingPolicyComponent;
  let fixture: ComponentFixture<OnboardingPolicyComponent>;
  let switcher: ComponentSwitcherDirective;
  let onboardingUserService: OnboardingUserEventService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnboardingPolicyComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ComponentSwitcherDirective, useValue: {} },
        { provide: UserEventService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingPolicyComponent);
    component = fixture.componentInstance;
    switcher = TestBed.inject(ComponentSwitcherDirective);
    switcher.goById = jasmine.createSpy('goById');

    onboardingUserService = TestBed.inject(OnboardingUserEventService);
    onboardingUserService.trackPolicyChoosingEvent = jasmine.createSpy('trackPolicyChoosingEvent');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('buildTranslationKey method', () => {
    it('should build correct translation key', () => {
      // Arrange
      const relativeKey = 'fake-relative-key';

      // Act
      const actualTranslationKey = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actualTranslationKey).toBe(`onboardingWizard.policy.${relativeKey}`);
    });
  });

  describe('onBackClick method', () => {
    it('should navigate to plugins page', () => {
      // Act
      component.onBackClick();

      // Assert
      expect(switcher.goById).toHaveBeenCalledWith(OnboardingComponentIds.Plugins);
    });
  });

  describe('onNextClick method', () => {
    it('should navigate to policy page', () => {
      // Act
      component.onNextClick();

      // Assert
      expect(switcher.goById).toHaveBeenCalledWith(OnboardingComponentIds.PolicyManaging);
    });

    it('should call trackPolicyChoosingEvent with buttonControl value', () => {
      // Arrange 
      component.formGroup.controls.buttonsControl.setValue(true);

      // Act
      component.onNextClick();

      // Assert
      expect(onboardingUserService.trackPolicyChoosingEvent).toHaveBeenCalledWith(component.formGroup.controls.buttonsControl.value);
    });
  });

  describe('onSkipClick method', () => {
    it('should navigate to company page', () => {
      // Act
      component.onSkipClick();

      // Assert
      expect(switcher.goById).toHaveBeenCalledWith(OnboardingComponentIds.Company);
    });

    it('should call trackPolicyChoosingEvent with buttonControl value ', () => {
      // Arrange 
      component.formGroup.controls.buttonsControl.setValue(true);

      // Act
      component.onSkipClick();

      // Assert
      expect(onboardingUserService.trackPolicyChoosingEvent).toHaveBeenCalledWith(component.formGroup.controls.buttonsControl.value);
    });
  });
});
