import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ModalWindowService } from 'core/modules/modals';
import { RequirementLike, EvidenceCreationModalParams } from '../../../../models';
import { ControlRequirement, Service, ServiceStatusEnum } from 'core/modules/data/models/domain';
import { PluginFacadeService } from 'core/modules/data/services';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject, of } from 'rxjs';
import { AutomationState } from '../../models/automation-state';
import {
  PluginsAutomationModalInputFields,
  PluginsAutomationModalWindowComponent,
} from '../../plugins-automation-modal-window/plugins-automation-modal-window.component';
import { LinkedFilesModalComponent } from './linked-files-modal.component';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';

describe('LinkedFilesModalComponent', () => {
  configureTestSuite();

  let component: LinkedFilesModalComponent;
  let fixture: ComponentFixture<LinkedFilesModalComponent>;

  let pluginsFacade: PluginFacadeService;
  let modalWindowService: ModalWindowService;
  let sharedContext$: BehaviorSubject<EvidenceCreationModalParams>;
  let componentSwitcherDirective: ComponentSwitcherDirective;
  let plugins: Service[];
  const controlRequirement: ControlRequirement = { requirement_id: 'some-id', requirement_name: 'some-name' };
  const requirementLike: RequirementLike = { resourceId: 'some-id', name: 'some-name' };
  const installedPlugins = [
    { service_id: 'service-1', service_status: ServiceStatusEnum.INSTALLED },
    { service_id: 'service-2', service_status: ServiceStatusEnum.INSTALLED },
    { service_id: 'service-3', service_status: ServiceStatusEnum.INSTALLED },
  ];

  beforeAll(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [LinkedFilesModalComponent],
      providers: [
        { provide: PluginFacadeService, useValue: {} },
        { provide: ModalWindowService, useValue: {} },
        { provide: ComponentSwitcherDirective, useValue: { } }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedFilesModalComponent);
    component = fixture.componentInstance;

    pluginsFacade = TestBed.inject(PluginFacadeService);
    modalWindowService = TestBed.inject(ModalWindowService);

    pluginsFacade.getFileMonitorServices = jasmine.createSpy('getFileMonitorServices').and.callFake(() => of(plugins));
    modalWindowService.openInSwitcher = jasmine.createSpy('openInSwitcher');

    component.requirementLike = requirementLike;
    componentSwitcherDirective = TestBed.inject(ComponentSwitcherDirective);
    sharedContext$ = new BehaviorSubject<EvidenceCreationModalParams>({
      serviceIds: [],
      entityPath: [],
      targetResource: {
        resourceId: 'fakeResourceId',
        resourceType: 'fakeResourceType'
      }
    });
    (componentSwitcherDirective as any).sharedContext$ = sharedContext$;
    componentSwitcherDirective.upsertAndSwitch = jasmine.createSpy('upsertAndSwitch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should retrieve file monitor services and and assign them to plugins property', () => {
      // Arrange
      plugins = [
        ...installedPlugins,
        { service_id: 'service-4', service_status: ServiceStatusEnum.CONNECTIVITYFAILED },
      ];

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.plugins).toEqual(plugins);
    });

    it('should retrieve file monitor services, filter INSTALLED plugins and assign them to installedPlugins property', () => {
      // Arrange
      plugins = [
        ...installedPlugins,
        { service_id: 'service-4', service_status: ServiceStatusEnum.CONNECTIVITYFAILED },
      ];

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.installedPlugins).toEqual(installedPlugins);
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
      expect(actual).toEqual(`automationModals.fileMonitoring.${relativeKey}`);
    });
  });

  describe('#openAllFileCollectionPlugins', () => {
    it('should call modalWindowService.openInSwitcher with proper parameters', () => {
      // Arrange
      plugins = [
        ...installedPlugins,
        { service_id: 'service-4', service_status: ServiceStatusEnum.CONNECTIVITYFAILED },
      ];

      // Act
      fixture.detectChanges();
      component.openAllFileCollectionPlugins();

      // Assert
      expect(componentSwitcherDirective.upsertAndSwitch).toHaveBeenCalledWith({
        id: 'filemonitor-plugins-modal',
        componentType: PluginsAutomationModalWindowComponent,
        contextData: {
          [PluginsAutomationModalInputFields.relatedPlugins]: plugins,
          [PluginsAutomationModalInputFields.baseModalConfigData]: {
            titleKey: 'automationModals.fileMonitoring.plugins.title',
            descriptionKey: 'automationModals.fileMonitoring.plugins.description',
          },
        },
      });
    });
  });

  // describe('#pluginClickHandler', () => {
  //   it('should call modalWindowService.openInSwitcher with proper parameters', () => {
  //     // Arrange
  //     const plugin = { service_id: 'service-1' };
  //     const reqLike = {};
  //     // Act
  //     component.pluginClickHandler(plugin);

  //     // Assert
  //     expect(modalWindowService.openInSwitcher).toHaveBeenCalledWith({
  //       componentsToSwitch: [
  //         {
  //           id: `${plugin.service_id}-attachFile`,
  //           componentType: AttachLinkModalWindowComponent,
  //           contextData: {
  //             contextData: {
  //               [AttachLinkModalComponentInputFields.pluginData]: plugin,
  //               [AttachLinkModalComponentInputFields.requirementLike]: reqLike,
  //             },
  //           },
  //         },
  //       ],
  //     });
  //   });
  // });
});
