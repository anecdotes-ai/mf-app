import { OnboardingUserEventService } from './../../services/onboarding-user-event.service';
import { MultiselectingItem } from 'core/models/multiselecting-item.model';
import { Framework } from 'core/modules/data/models/domain';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { OnboardingComponentIds } from './../../constants/onboarding.constants';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingFrameworksComponent } from './onboarding-frameworks.component';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { UserEventService } from 'core/services/user-event/user-event.service';


describe('OnboardingFrameworksComponent', () => {
  let component: OnboardingFrameworksComponent;
  let fixture: ComponentFixture<OnboardingFrameworksComponent>;
  let switcher: ComponentSwitcherDirective;
  let frameworkFacade: FrameworksFacadeService;
  let onboardingUserService: OnboardingUserEventService;

  const frameworks: Framework[] = [
    { framework_id: '1', framework_name: 'name1' },
    { framework_id: '2', framework_name: 'name2' },
  ];

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingFrameworksComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ComponentSwitcherDirective, useValue: {} },
        { provide: UserEventService, useValue: {} },
        { provide: FrameworksFacadeService, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingFrameworksComponent);
    component = fixture.componentInstance;
    switcher = TestBed.inject(ComponentSwitcherDirective);
    switcher.goById = jasmine.createSpy('goById');
    frameworkFacade = TestBed.inject(FrameworksFacadeService);
    frameworkFacade.getAvailableFrameworks = jasmine
      .createSpy('getAvailableFrameworks')
      .and.returnValue(of(frameworks));

    onboardingUserService = TestBed.inject(OnboardingUserEventService);
    onboardingUserService.trackFrameworkChoosingEvent = jasmine.createSpy('trackFrameworkChoosingEvent');
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
      expect(actualTranslationKey).toBe(`onboardingWizard.frameworks.${relativeKey}`);
    });
  });

  describe('onSkipClick method', () => {
    it('should navigate to policy page', async () => {
      // Arrange
      await detectChanges();

      // Act
      component.onSkipClick();

      // Assert
      expect(switcher.goById).toHaveBeenCalledWith(OnboardingComponentIds.Plugins);
    });

    it('should call trackFrameworkChoosingEvent with selected framework names', async () => {
      // Arrange
      component.multiselectItems = [
        {
          data : {
            framework_name : 'fakeName',
          
          },
          selected: true
        }
      ];      

      // Act
      component.onSkipClick();

      // Assert
      expect(onboardingUserService.trackFrameworkChoosingEvent).toHaveBeenCalledWith(['fakeName']);
    });
  });

  describe('ngOnInit', () => {
    it('getAvailableFrameworks should be called', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(frameworkFacade.getAvailableFrameworks).toHaveBeenCalled();
    });

    it('getAvailableFrameworks subscription should set multiselectItems', async () => {
      // Arrange
      const expectedItemsresult = frameworks.map(
        (framework) =>
          ({
            text: framework.framework_name,
            icon: `frameworks/${framework.framework_id}`,
            data: framework,
          } as MultiselectingItem)
      );

      // Act
      await detectChanges();

      // Assert
      expect(component.multiselectItems).toEqual(expectedItemsresult);
    });
  });

  describe('isAnyPluginSelected method', () => {
    it('should return true when atleast one framework is selected', async () => {
      // Arrange
      let expectedItemsResult = frameworks.map(
        (framework) =>
          ({
            text: framework.framework_name,
            icon: `frameworks/${framework.framework_id}`,
            data: framework,
          } as MultiselectingItem)
      );
      expectedItemsResult[0].selected = true;
      component.multiselectItems = expectedItemsResult;

      // Act
      const result = component.isAnyFrameworkSelected();

      // Assert
      expect(result).toEqual(true);
    });
    
    it('should return false when no one framework is selected', async () => {
      // Arrange
      let expectedItemsResult = frameworks.map(
        (framework) =>
          ({
            text: framework.framework_name,
            icon: `frameworks/${framework.framework_id}`,
            data: framework,
          } as MultiselectingItem)
      );
      component.multiselectItems = expectedItemsResult;

      // Act
      const result = component.isAnyFrameworkSelected();

      // Assert
      expect(result).toEqual(false);
    });
  });
});
