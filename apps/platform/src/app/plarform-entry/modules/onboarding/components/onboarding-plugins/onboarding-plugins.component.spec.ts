import { OnboardingUserEventService } from './../../services/onboarding-user-event.service';
import { MultiselectingItem } from 'core/models/multiselecting-item.model';
import { Service } from 'core/modules/data/models/domain';
import { OnboardingComponentIds } from './../../constants/onboarding.constants';
import { PluginFacadeService, PluginService } from 'core/modules/data/services';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingPluginsComponent } from './onboarding-plugins.component';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { UserEventService } from 'core/services/user-event/user-event.service';


describe('OnboardingPluginsComponent', () => {
  let component: OnboardingPluginsComponent;
  let fixture: ComponentFixture<OnboardingPluginsComponent>;
  let switcher: ComponentSwitcherDirective;
  let pluginsFacade: PluginFacadeService;
  let pluginsService: PluginService;
  let onboardingUserService: OnboardingUserEventService;

  const plugins: Service[] = [
    { service_id: 'aws_1', service_display_name: 'AWSONE', service_families: ['Cloud infrastructure'] },
    { service_id: 'aws_2', service_display_name: 'AWSTWO', service_families: ['Cloud infrastructure'] },
    { service_id: 'gcp', service_display_name: 'GCP', service_families: ['Cloud infrastructure'] },
    { service_id: 'azure', service_display_name: 'AZURE', service_families: ['Cloud infrastructure'] },

    { service_id: '1', service_display_name: 'name1', service_families: ['Ticketing'] },
    { service_id: '2', service_display_name: 'name2', service_families: ['Ticketing'] },

    { service_id: '3', service_display_name: 'name3', service_families: ['family1'] },
    { service_id: '4', service_display_name: 'name4', service_families: ['family2'] },
  ];

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingPluginsComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ComponentSwitcherDirective, useValue: {} },
        { provide: PluginFacadeService, useValue: {} },
        { provide: UserEventService, useValue: {} },
        { provide: PluginService, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(OnboardingPluginsComponent);
    component = fixture.componentInstance;
    switcher = TestBed.inject(ComponentSwitcherDirective);
    switcher.goById = jasmine.createSpy('goById');
    switcher.sharedContext$ = of({});
    pluginsFacade = TestBed.inject(PluginFacadeService);
    pluginsService = TestBed.inject(PluginService);

    pluginsFacade.getPluginsForOnboardingPlugins = jasmine
      .createSpy('getPluginsForOnboardingPlugins')
      .and.returnValue(of(plugins));

    pluginsService.getServiceIconLinkSync = jasmine.createSpy('getServiceIconLinkAsync').and.returnValue('iconsrc');

    onboardingUserService = TestBed.inject(OnboardingUserEventService);
    onboardingUserService.trackPluginsChoosingEvent = jasmine.createSpy('trackPluginsChoosingEvent');

    await fixture.detectChanges();
  });

  it('should create', async () => {
    await detectChanges();
    expect(component).toBeTruthy();
  });

  describe('buildTranslationKey method', () => {
    it('should build correct translation key', () => {
      // Arrange
      const relativeKey = 'fake-relative-key';

      // Act
      const actualTranslationKey = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actualTranslationKey).toBe(`onboardingWizard.plugins.${relativeKey}`);
    });
  });

  describe('onBackClick method', () => {
    it('should navigate to frameworks page', () => {
      // Act
      component.onBackClick();

      // Assert
      expect(switcher.goById).toHaveBeenCalledWith(OnboardingComponentIds.Frameworks);
    });
  });

  describe('onNextClick method', () => {
    it('should navigate to policy page', () => {
      // Act
      component.onNextClick();

      // Assert
      expect(switcher.goById).toHaveBeenCalledWith(OnboardingComponentIds.Policy);
    });

    it('should call trackPluginsChoosingEvent with selected plugins names', async () => {
      // Arrange
      component.allMultiselectItems = [
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
      expect(onboardingUserService.trackPluginsChoosingEvent).toHaveBeenCalledWith(['fakeName']);
    });
  });

  describe('ngOnInit', () => {
    it('getPluginsForOnboarding should be called', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(pluginsFacade.getPluginsForOnboardingPlugins).toHaveBeenCalled();
    });

    it('getServiceIconLinkAsync should be called', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(pluginsService.getServiceIconLinkSync).toHaveBeenCalled();
    });

    it('getServiceIconLinkAsync should be mapped in multiselectingItems and grouped by categories', async () => {
      const expectedGroupedMultiselectItems: MultiselectingItem<Service>[][] = [
        [
          {
            arrayData: [
              { service_id: 'aws_1', service_display_name: 'AWSONE', service_families: ['Cloud infrastructure'] },
              { service_id: 'aws_2', service_display_name: 'AWSTWO', service_families: ['Cloud infrastructure'] },
            ],
            data: { service_id: 'aws_1', service_display_name: 'AWSONE', service_families: ['Cloud infrastructure'] },
            text: 'AWS',
            icon: 'iconsrc',
          },
          {
            data: { service_id: 'gcp', service_display_name: 'GCP', service_families: ['Cloud infrastructure'] },
            arrayData: [{ service_id: 'gcp', service_display_name: 'GCP', service_families: ['Cloud infrastructure'] }],
            text: 'GCP',
            icon: 'iconsrc',
          },
          {
            data: { service_id: 'azure', service_display_name: 'AZURE', service_families: ['Cloud infrastructure'] },
            arrayData: [
              { service_id: 'azure', service_display_name: 'AZURE', service_families: ['Cloud infrastructure'] },
            ],
            text: 'Azure',
            icon: 'iconsrc',
          },
        ],
        [
          {
            data: { service_id: '1', service_display_name: 'name1', service_families: ['Ticketing'] },
            arrayData: [{ service_id: '1', service_display_name: 'name1', service_families: ['Ticketing'] }],
            text: 'name1',
            icon: 'iconsrc',
          },
          {
            data: { service_id: '2', service_display_name: 'name2', service_families: ['Ticketing'] },
            arrayData: [{ service_id: '2', service_display_name: 'name2', service_families: ['Ticketing'] }],
            text: 'name2',
            icon: 'iconsrc',
          },
        ],
      ];

      // Act
      await detectChanges();

      // Assert
      expect(component.groupedMultiselectItems).toEqual(expectedGroupedMultiselectItems);
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
      component.allMultiselectItems = expectedItemsResult;

      // Act
      const result = component.isAnyPluginSelected();

      // Assert
      expect(result).toEqual(true);
    });
  });
});
