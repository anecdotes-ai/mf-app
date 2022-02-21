import { ModalsBuilderService } from '../services';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CalculatedControl } from 'core/modules/data/models';
import { ControlRequirement, Service, ServiceStatusEnum, Framework } from 'core/modules/data/models/domain';
import { PluginFacadeService } from 'core/modules/data/services';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { AutomationState } from '../../models/automation-state';
import { TicketingModalComponent } from './ticketing-modal.component';

describe('TicketingModalComponent', () => {
  configureTestSuite();

  let component: TicketingModalComponent;
  let fixture: ComponentFixture<TicketingModalComponent>;

  let pluginsFacade: PluginFacadeService;
  let modalsBuilderService: ModalsBuilderService;

  let plugins: Service[];
  const controlRequirement: ControlRequirement = { requirement_id: 'some-id', requirement_name: 'some-name' };
  const controlInstance: CalculatedControl = { control_id: 'some-id' };
  const framework: Framework = { framework_id: 'some-id' };

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [TicketingModalComponent],
      providers: [
        { provide: PluginFacadeService, useValue: {} },
        { provide: ModalsBuilderService, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketingModalComponent);
    component = fixture.componentInstance;

    pluginsFacade = TestBed.inject(PluginFacadeService);
    modalsBuilderService = TestBed.inject(ModalsBuilderService);

    pluginsFacade.getTicketingServices = jasmine.createSpy('getTicketingServices').and.callFake(() => of(plugins));
    modalsBuilderService.openAllTicketingPlugins = jasmine.createSpy('openAllTicketingPlugins');
    modalsBuilderService.openTicketingModalForPlugin = jasmine.createSpy('openTicketingModalForPlugin');

    component.controlRequirement = controlRequirement;
    component.controlInstance = controlInstance;
    component.framework = framework;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should retrieve ticketing services and assign them to plugins property', () => {
      // Arrange
      plugins = [{ service_id: 'service-1' }, { service_id: 'service-2' }, { service_id: 'service-3' }];

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.plugins).toEqual(plugins);
    });

    it('should set automationState to NOT_CONNECTED if no plugin is installed', () => {
      // Arrange
      plugins = [{ service_id: 'service-1' }, { service_id: 'service-2' }, { service_id: 'service-3' }];

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.automationState).toEqual(AutomationState.NOT_CONNECTED);
    });

    it('should set automationState to ALL_CONNECTED if every plugin is installed', () => {
      // Arrange
      plugins = [
        { service_id: 'service-1', service_status: ServiceStatusEnum.INSTALLED },
        { service_id: 'service-2', service_status: ServiceStatusEnum.INSTALLED },
        { service_id: 'service-3', service_status: ServiceStatusEnum.INSTALLED },
      ];

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.automationState).toEqual(AutomationState.ALL_CONNECTED);
    });

    it('should set automationState to ANY_CONNECTED if some plugin is installed', () => {
      // Arrange
      plugins = [
        { service_id: 'service-1', service_status: ServiceStatusEnum.CONNECTIVITYFAILED },
        { service_id: 'service-2', service_status: ServiceStatusEnum.INSTALLED },
        { service_id: 'service-3', service_status: ServiceStatusEnum.INSTALLED },
      ];

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.automationState).toEqual(AutomationState.ANY_CONNECTED);
    });
  });

  describe('#buildTranslationKey', () => {
    it('should correctly build translation key', () => {
      // Arrange
      const relativeKey = 'some-key';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toEqual(`automationModals.ticketing.${relativeKey}`);
    });
  });

  describe('#openAllTicketingPlugins', () => {
    it('should call modalWindowService.openInSwitcher with proper parameters', () => {
      // Arrange
      plugins = [{ service_id: 'service-1' }, { service_id: 'service-2' }, { service_id: 'service-3' }];
      component.plugins = plugins;
      const baseModalConfig = {
        titleKey: component.buildTranslationKey('plugins.title'),
        descriptionKey: component.buildTranslationKey('plugins.description'),
      };

      // Act
      fixture.detectChanges();
      component.openAllTicketingPlugins();

      // Assert
      expect(modalsBuilderService.openAllTicketingPlugins).toHaveBeenCalledWith(
        plugins,
        controlInstance,
        controlRequirement,
        baseModalConfig
      );
    });
  });

  describe('#pluginClickHandler', () => {
    it('should call modalWindowService.openInSwitcher with jira modal if plugin is jira', () => {
      // Arrange
      const plugin = { service_id: 'jira' };

      // Act
      component.pluginClickHandler(plugin);

      // Assert
      expect(modalsBuilderService.openTicketingModalForPlugin).toHaveBeenCalledWith(
        plugin,
        controlInstance,
        controlRequirement,
        framework
      );
    });
  });
});
