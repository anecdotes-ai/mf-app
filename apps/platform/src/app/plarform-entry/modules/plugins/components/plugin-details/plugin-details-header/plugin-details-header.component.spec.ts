import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PluginDetailsHeaderComponent } from './plugin-details-header.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfigService, WindowHelperService, PluginNavigationService } from 'core';
import { PluginService, ControlsFacadeService, EvidenceFacadeService } from 'core/modules/data/services';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { PluginConnectionFacadeService, PluginsDataService } from 'core/modules/plugins-connection/services';
import { ServiceStatusEnum } from 'core/modules/data/models/domain';
import { configureTestSuite } from 'ng-bullet';
import { PluginsEventService } from 'core/modules/plugins-connection/services/plugins-event-service/plugins-event.service';

describe('PluginDetailsHeaderComponent', () => {
  configureTestSuite();

  let component: PluginDetailsHeaderComponent;
  let fixture: ComponentFixture<PluginDetailsHeaderComponent>;
  let windowHelperService: WindowHelperService;
  let pluginsDataService: PluginsDataService;
  let pluginNavigationService: PluginNavigationService;
  let windowMock: Window;
  let pluginsEventService: PluginsEventService;
  const configServiceMock = {
    config: {
      redirectUrls: {
        howToConnectPlugins: 'https://intercom.help/',
      },
    },
  };

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [PluginDetailsHeaderComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), RouterTestingModule],
      providers: [
        PluginService,
        { provide: PluginService, useValue: {} },
        {
          provide: AppConfigService,
          useValue: configServiceMock,
        },
        { provide: WindowHelperService, useValue: {} },
        PluginsDataService,
        {
          provide: PluginNavigationService,
          useValue: {
            redirectToEvidencePool: jasmine.createSpy('redirectToEvidencePool'),
          },
        },
        {
          provide: EvidenceFacadeService,
          useValue: {},
        },
        {
          provide: PluginConnectionFacadeService,
          useValue: {}
        },
        {
          provide: PluginsEventService,
          useValue: {}
        }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginDetailsHeaderComponent);
    component = fixture.componentInstance;

    windowHelperService = TestBed.inject(WindowHelperService);
    windowMock = {} as Window;
    windowMock.open = jasmine.createSpy('open');
    windowHelperService.openUrlInNewTab = jasmine.createSpy('openUrlInNewTab').and.returnValue(windowMock.open);

    pluginsDataService = TestBed.inject(PluginsDataService);
    pluginNavigationService = TestBed.inject(PluginNavigationService);

    pluginsEventService = TestBed.inject(PluginsEventService);
    pluginsEventService.trackHowToConnectClick = jasmine.createSpy('trackHowToConnectClick');
    pluginsEventService.trackViewEvidenceClick = jasmine.createSpy('trackViewEvidenceClick');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Test: buildTranslationKey', () => {
    it('should return translationKey based on relativeKey', () => {
      // Arrange
      const relativeKey = 'someRelativeKey';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toBe(`openedPlugin.${relativeKey}`);
    });
  });

  describe('Test: howToConnect', () => {
    it('should redirect in new browser tab to generic url if no service_intercom_article provided', () => {
      // Arrange
      const url = configServiceMock.config.redirectUrls.howToConnectPlugins;
      component.service = { service_intercom_article: null };

      // Act
      component.howToConnect();

      // Assert
      expect(windowHelperService.openUrlInNewTab).toHaveBeenCalledWith(url);
    });

    it('should redirect in new browser tab to service_intercom_article url if service_intercom_article provided', () => {
      // Arrange
      component.service = { service_intercom_article: 'some-url' };

      // Act
      component.howToConnect();

      // Assert
      expect(windowHelperService.openUrlInNewTab).toHaveBeenCalledWith('some-url');
    });

    it('should redirect in new browser tab to generic url if no service_intercom_article provided', () => {
      // Arrange
      component.service = { service_intercom_article: null, service_display_name: 'some-name', service_type:'COLLABORATION', service_status: 'SERVICE_INSTALLED', service_evidence_list: [{}, {}] };

      // Act
      component.howToConnect();

      // Assert
      expect(pluginsEventService.trackHowToConnectClick).toHaveBeenCalledWith(component.service);
    });
  });

  describe('#redirectToEvidencePool', () => {
    it('should call redirectToEvidencePool method of pluginsDataService with proper service_display_name', () => {
      // Arrange
      component.service = { service_display_name: 'some-name' };

      // Act
      component.redirectToEvidencePool();

      // Assert
      expect(pluginNavigationService.redirectToEvidencePool).toHaveBeenCalledWith(component.service);
      expect(pluginsEventService.trackViewEvidenceClick).toHaveBeenCalledWith(component.service);
    });
  });

  describe('#isViewEvidenceButtonDisplayAllowed', () => {
    describe('when installation does not exist', () => {
      beforeEach(() => {
      });

      // it(`should return true when service status is ${ServiceStatusEnum.INSTALLED} and service type is ${ServiceTypeEnum.GENERIC}`, () => {
      //   // Arrange
      //   component.service = { service_status: ServiceStatusEnum.INSTALLED, service_type: ServiceTypeEnum.GENERIC };

      //   // Act
      //   const result = component.isViewEvidenceButtonDisplay$.subscribe();

      //   // Assert
      //   expect(result).toBeTrue();
      // });

      // Object.values(ServiceStatusEnum)
      //   .filter((x) => x !== ServiceStatusEnum.INSTALLED)
      //   .forEach((serviceStatus) => {
      //     Object.values(ServiceTypeEnum)
      //       .filter((x) => x !== ServiceTypeEnum.GENERIC)
      //       .forEach((serviceType) => {
      //         it(`should return false when service status is ${serviceStatus} and service type is ${serviceType}`, () => {
      //           // Arrange
      //           component.service = { service_status: serviceStatus, service_type: serviceType };

      //           // Act
      //           const result = component.isViewEvidenceButtonDisplayAllowed();

      //           // Assert
      //           expect(result).toBeFalsy();
      //         });
      //       });
      //   });
    });

    describe('when installation exists', () => {

      /* tslint:disable:max-line-length */
      // it(`should return true when service status is ${ServiceStatusEnum.INSTALLED}, installation phase is ${ServiceInstallationPhases.COLLECT_EVIDENCE} and service type is ${ServiceTypeEnum.GENERIC}`, () => {
      //   // Arrange
      //   component.service = { service_status: ServiceStatusEnum.INSTALLED, service_type: ServiceTypeEnum.GENERIC };
      //   component.serviceInstallationInfo.installationPhase = ServiceInstallationPhases.COLLECT_EVIDENCE;
      //   // Act
      //   const result = component.isViewEvidenceButtonDisplayAllowed();

      //   // Assert
      //   expect(result).toBeTrue();
      // });

      // Object.values(ServiceInstallationPhases)
      //   .filter((x) => x !== ServiceInstallationPhases.COLLECT_EVIDENCE)
      //   .forEach((installationPhase) => {
      //     Object.values(ServiceStatusEnum)
      //       .filter((x) => x !== ServiceStatusEnum.INSTALLED)
      //       .forEach((serviceStatus) => {
      //         Object.values(ServiceTypeEnum)
      //           .filter((x) => x !== ServiceTypeEnum.GENERIC)
      //           .forEach((serviceType) => {
      //             it(`should return false when service status is ${serviceType}, installation phase is ${installationPhase} and service type is ${serviceType}`, () => {
      //               // Arrange
      //               component.service = { service_status: serviceStatus, service_type: serviceType };
      //               component.serviceInstallationInfo.installationPhase = installationPhase as ServiceInstallationPhases;
      //               // Act
      //               const result = component.isViewEvidenceButtonDisplayAllowed();

      //               // Assert
      //               expect(result).toBeFalsy();
      //             });
      //           });
      //       });
      //   });
    });
  });

  describe('#getPluginStatusIcon', () => {
    it('should return status_complete for installed status', () => {
      // Arrange

      // Act
      const result = component.getPluginStatusIcon(ServiceStatusEnum.INSTALLED);

      // Assert
      expect(result).toEqual('status_complete');
    });

    it('should return status_not_started for installation fail status', () => {
      // Arrange

      // Act
      const result = component.getPluginStatusIcon(ServiceStatusEnum.INSTALLATIONFAILED);

      // Assert
      expect(result).toEqual('status_not_started');
    });

    it('should return status_not_started for connectivity fail status', () => {
      // Arrange

      // Act
      const result = component.getPluginStatusIcon(ServiceStatusEnum.CONNECTIVITYFAILED);

      // Assert
      expect(result).toEqual('status_not_started');
    });

    it('should return null for any other status', () => {
      // Arrange

      // Act
      const result = component.getPluginStatusIcon(ServiceStatusEnum.FETCHED);

      // Assert
      expect(result).toBeNull();
    });
  });
});
