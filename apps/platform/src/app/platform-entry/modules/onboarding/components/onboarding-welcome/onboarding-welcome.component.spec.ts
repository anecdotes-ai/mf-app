import { OnboardingComponentIds } from './../../constants/onboarding.constants';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher/directives/component-switcher/component-switcher.directive';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { OnboardingWelcomeComponent } from './onboarding-welcome.component';
import { configureTestSuite } from 'ng-bullet';
import { OnboardingUserEventService } from '../../services/onboarding-user-event.service';

describe('OnboardingWelcomeComponent', () => {
  configureTestSuite();
  let component: OnboardingWelcomeComponent;
  let fixture: ComponentFixture<OnboardingWelcomeComponent>;
  let switcher: ComponentSwitcherDirective;
  let onboardingEventService: OnboardingUserEventService;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingWelcomeComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ComponentSwitcherDirective, useValue: {} },
        { provide: OnboardingUserEventService, useValue: {} }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingWelcomeComponent);
    component = fixture.componentInstance;
    switcher = TestBed.inject(ComponentSwitcherDirective);
    switcher.goById = jasmine.createSpy('goById');
    onboardingEventService = TestBed.inject(OnboardingUserEventService);
    onboardingEventService.trackGetStartedEvent = jasmine.createSpy('trackGetStartedEvent');
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
      expect(actualTranslationKey).toBe(`onboardingWizard.welcome.${relativeKey}`);
    });
  });

  describe('getStartedClick method', () => {
    it('should navigate to policy page', () => {
      // Act
      component.getStartedClick();

      // Assert
      expect(switcher.goById).toHaveBeenCalledWith(OnboardingComponentIds.Frameworks);
      expect(onboardingEventService.trackGetStartedEvent).toHaveBeenCalledWith();
    });
  });
});
