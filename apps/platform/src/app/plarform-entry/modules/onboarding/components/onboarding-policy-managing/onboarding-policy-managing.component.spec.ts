import { OnboardingUserEventService } from './../../services/onboarding-user-event.service';
import { MultiselectingItem } from 'core/models/multiselecting-item.model';
import { Service } from 'core/modules/data/models/domain';
import { PluginFacadeService } from 'core/modules/data/services/facades';
import { PluginService } from 'core/modules/data/services';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher/directives/component-switcher/component-switcher.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { OnboardingComponentIds } from './../../constants/onboarding.constants';
import { OnboardingPolicyManagingComponent } from './onboarding-policy-managing.component';
import { of } from 'rxjs';
import { UserEventService } from 'core/services/user-event/user-event.service';

describe('OnboardingPolicyManagingComponent', () => {
  let component: OnboardingPolicyManagingComponent;
  let fixture: ComponentFixture<OnboardingPolicyManagingComponent>;
  let switcher: ComponentSwitcherDirective;
  let pluginsFacade: PluginFacadeService;
  let onboardingUserService: OnboardingUserEventService;
  let pluginsService: PluginService;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }

  const plugins: Service[] = [
    { service_id: '1', service_display_name: 'name1', service_families: ['Cloud infrastructure'] },
    { service_id: '2', service_display_name: 'name2', service_families: ['Ticketing'] },
    { service_id: '3', service_display_name: 'name3', service_families: ['family1'] },
    { service_id: '4', service_display_name: 'name4', service_families: ['family2'] },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnboardingPolicyManagingComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ComponentSwitcherDirective, useValue: {} },
        { provide: PluginFacadeService, useValue: {} },
        { provide: PluginService, useValue: {} },
        { provide: UserEventService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingPolicyManagingComponent);
    component = fixture.componentInstance;
    switcher = TestBed.inject(ComponentSwitcherDirective);
    switcher.goById = jasmine.createSpy('goById');

    pluginsFacade = TestBed.inject(PluginFacadeService);
    pluginsService = TestBed.inject(PluginService);

    pluginsFacade.getPluginsForOnboardingPolicy = jasmine
      .createSpy('getPluginsForOnboardingPolicy')
      .and.returnValue(of(plugins));

    pluginsService.getServiceIconLinkSync = jasmine.createSpy('getServiceIconLinkAsync').and.returnValue('iconsrc');

    onboardingUserService = TestBed.inject(OnboardingUserEventService);
    onboardingUserService.trackFilesPoliciesChoosingEvent = jasmine.createSpy('trackFilesPoliciesChoosingEvent');

    fixture.detectChanges();
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
    it('should navigate to policy page', () => {
      // Act
      component.onBackClick();

      // Assert
      expect(switcher.goById).toHaveBeenCalledWith(OnboardingComponentIds.Policy);
    });
  });

  describe('onNextClick method', () => {
    it('should navigate to company page', () => {
      // Act
      component.onNextClick();

      // Assert
      expect(switcher.goById).toHaveBeenCalledWith(OnboardingComponentIds.Company);
    });

    it('should call trackFilesPoliciesChoosingEvent with policies names', async () => {
      // Arrange
      component.multiselectableItems = [
        {
          data : {
            service_display_name : 'fakeName',
          
          },
          selected: true
        }
      ];      

      // Act
      component.onNextClick();

      // Assert
      expect(onboardingUserService.trackFilesPoliciesChoosingEvent).toHaveBeenCalledWith(['fakeName']);
    });

  });

  describe('isAnyPluginSelected method', () => {
    it('should return true when atleast one plugin is selected', async () => {
      // Arrange
      let expectedItemsResult = plugins.map(
        (plugin) =>
          ({
            text: plugin.service_display_name,
            icon: `plugins/${plugin.service_id}`,
            data: plugin,
          } as MultiselectingItem)
      );
      expectedItemsResult[0].selected = true;
      component.multiselectableItems = expectedItemsResult;

      // Act
      const result = component.isAnyPluginSelected();

      // Assert
      expect(result).toEqual(true);
    });
  });

  it('should return false when no plugins selected', async () => {
    // Arrange
    const expectedItemsresult = plugins.map(
      (plugin) =>
        ({
          text: plugin.service_display_name,
          icon: `plugins/${plugin.service_id}`,
          data: plugin,
        } as MultiselectingItem)
    );
    component.multiselectableItems = expectedItemsresult;

    // Act
    const result = component.isAnyPluginSelected();

    // Assert
    expect(result).toEqual(false);
  });
});
