import { IntercomService } from 'core/services';
import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { OnboardingDoneComponent } from './onboarding-done.component';
import { AppRoutes } from 'core/constants';
import { configureTestSuite } from 'ng-bullet';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { OnboardingUserEventService } from '../../services/onboarding-user-event.service';
import { OnBoardingNextDestination } from 'core/models/user-events/user-event-data.model';

describe('OnboardingDoneComponent', () => {
  configureTestSuite();
  let component: OnboardingDoneComponent;
  let fixture: ComponentFixture<OnboardingDoneComponent>;
  let router: Router;
  let intercomService: IntercomService;
  let onboardingUserEventService: OnboardingUserEventService;
  let translate: TranslateService;

  function intercomLink(): DebugElement {
    return fixture.debugElement.query(By.css('.intercom'));
  }

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingDoneComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: IntercomService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: OnboardingUserEventService, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingDoneComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    intercomService = TestBed.inject(IntercomService);
    intercomService.openMessanger = jasmine.createSpy('openMessanger');
    router.navigate = jasmine.createSpy('navigate');
    translate = TestBed.inject(TranslateService);
    onboardingUserEventService = TestBed.inject(OnboardingUserEventService);
    onboardingUserEventService.trackNextStepEvent = jasmine.createSpy('trackNextStepEvent');
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
      expect(actualTranslationKey).toBe(`onboardingWizard.done.${relativeKey}`);
    });
  });

  describe('onPolicyClick method', () => {
    it('should navigate to policy page', () => {
      // Act
      component.onPolicyClick();

      // Assert
      expect(onboardingUserEventService.trackNextStepEvent).toHaveBeenCalledWith(OnBoardingNextDestination.Policy);
      expect(router.navigate).toHaveBeenCalledWith([AppRoutes.PolicyManager]);
    });
  });

  describe('onPluginsMarket method', () => {
    it('should navigate to plugins page', () => {
      // Act
      component.onPluginsMarketClick();

      // Assert
      expect(onboardingUserEventService.trackNextStepEvent).toHaveBeenCalledWith(OnBoardingNextDestination.Plugins);
      expect(router.navigate).toHaveBeenCalledWith([AppRoutes.Plugins]);
    });
  });

  describe('onIntercomClick', () => {
    it('should open intercom chat', async () => {
      // Act
      component.onIntercomClick();
      // Assert
      expect(intercomService.openMessanger).toHaveBeenCalled();
    });
  });
});
