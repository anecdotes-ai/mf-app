import { TestBed } from '@angular/core/testing';
import { PluginsEventService } from './plugins-event.service';
import { PluginEventDataPropertyNames, UserEvents } from 'core';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { Service, ServiceTypeEnum } from 'core/modules/data/models/domain';
import { PluginFacadeService } from 'core/modules/data/services';
import { of } from 'rxjs';

describe('PluginsEventService', () => {
  let testedService: PluginsEventService;
  let userEventService: UserEventService;
  let pluginFacadeService: PluginFacadeService;
  const pluginName = 'some-name';
  const changedFieldArray: { [key: string]: any } = {p: ['1','2'] };
  const changedField = 'p';
  const tabName = 'Logs';

  const service: Service = {service_display_name: pluginName, service_type: ServiceTypeEnum.FILEMONITOR, service_evidence_list: [{},{}], service_families: ['1', '2']};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PluginsEventService, { provide: UserEventService, useValue: {} }, { provide: PluginFacadeService, useValue: {} }],
    });
    testedService = TestBed.inject(PluginsEventService);
    userEventService = TestBed.inject(UserEventService);
    userEventService.sendEvent = jasmine.createSpy('sendEvent');
    pluginFacadeService = TestBed.inject(PluginFacadeService);
    pluginFacadeService.getServiceById = jasmine.createSpy('getServiceById').and.returnValue(of(service));
  });

  it('should be created', () => {
    expect(testedService).toBeTruthy();
  });

  describe('Amplitude events sending', () => {
    it('should call sendEvent method with proper data if trackConnectPluginClick was called',  () => {
      //Arrange
      //Act
      testedService.trackConnectPluginClick(service);

      //Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.CONNECT_PLUGIN, {
        [PluginEventDataPropertyNames.PluginName]: service.service_display_name,
        [PluginEventDataPropertyNames.PluginNumberOfEvidences]: service.service_evidence_list.length,
        [PluginEventDataPropertyNames.PluginCategory]: service.service_families
      });
    });

    it('should call sendEvent method with proper data if trackReconnectPluginClick was called', () => {
      //Arrange
      //Act
      testedService.trackReconnectPluginClick(service, changedFieldArray);

      //Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.PLUGIN_RECONNECT, {
        [PluginEventDataPropertyNames.PluginName]: service.service_display_name,
        [PluginEventDataPropertyNames.PluginNumberOfEvidences]: service.service_evidence_list.length,
        [PluginEventDataPropertyNames.ChangedField]: changedField,
        [PluginEventDataPropertyNames.PluginCategory]: service.service_families
      });
    });

    it('should call sendEvent method with proper data if trackDisconnectPluginClick was called', () => {
      //Arrange
      //Act
      testedService.trackDisconnectPluginClick(service);

      //Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.PLUGIN_DISCONNECT, {
        [PluginEventDataPropertyNames.PluginName]: service.service_display_name,
        [PluginEventDataPropertyNames.PluginNumberOfEvidences]: service.service_evidence_list.length,
        [PluginEventDataPropertyNames.PluginType]: service.service_type.toLowerCase(),
        [PluginEventDataPropertyNames.PluginCategory]: service.service_families
      });
    });

    it(`should call sendEvent method with proper data and ${UserEvents.PLUGIN_CONNECTION_SUCCEEDED} event if trackPluginConnectionResult was called and plugin was connected successfully`, function () {
      //Arrange
      //Act
      testedService.trackPluginConnectionResult(UserEvents.PLUGIN_CONNECTION_SUCCEEDED, service);

      //Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.PLUGIN_CONNECTION_SUCCEEDED, {
        [PluginEventDataPropertyNames.PluginName]: service.service_display_name,
        [PluginEventDataPropertyNames.PluginNumberOfEvidences]: service.service_evidence_list.length,
        [PluginEventDataPropertyNames.PluginCategory]: service.service_families
      });
    });

    it(`should call sendEvent method with proper data and ${UserEvents.PLUGIN_CONNECTION_FAILED} event if trackPluginConnectionResult was called and plugin was not connected`, function () {
      //Arrange
      //Act
      testedService.trackPluginConnectionResult(UserEvents.PLUGIN_CONNECTION_FAILED, service);

      //Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.PLUGIN_CONNECTION_FAILED, {
        [PluginEventDataPropertyNames.PluginName]: service.service_display_name,
        [PluginEventDataPropertyNames.PluginNumberOfEvidences]: service.service_evidence_list.length,
        [PluginEventDataPropertyNames.PluginCategory]: service.service_families
      });
    });

    it(`should call sendEvent method with proper data and ${UserEvents.EVIDENCE_COLLECTION_SUCCEEDED} event if trackEvidenceCollectionResult was called and evidences was collected`, async function () {
      //Arrange
      //Act
      await testedService.trackEvidenceCollectionResult(UserEvents.EVIDENCE_COLLECTION_SUCCEEDED, pluginName);

      //Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.EVIDENCE_COLLECTION_SUCCEEDED, {
        [PluginEventDataPropertyNames.PluginName]: pluginName,
        [PluginEventDataPropertyNames.PluginCategory]: service.service_families
      });
    });

    it(`should call sendEvent method with proper data and ${UserEvents.EVIDENCE_COLLECTION_FAILED} event if trackEvidenceCollectionResult was called and evidences was collected`, async function () {
      //Arrange
      //Act
      await testedService.trackEvidenceCollectionResult(UserEvents.EVIDENCE_COLLECTION_FAILED, pluginName);

      //Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.EVIDENCE_COLLECTION_FAILED, {
        [PluginEventDataPropertyNames.PluginName]: pluginName,
        [PluginEventDataPropertyNames.PluginCategory]: service.service_families
      });
    });

    it('should call sendEvent method with proper data if trackRunOnDemandClick was called', () => {
      //Arrange
      //Act
      testedService.trackRunOnDemandClick(service);

      //Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.PLUGIN_RUN_ON_DEMAND, {
        [PluginEventDataPropertyNames.PluginName]: service.service_display_name,
        [PluginEventDataPropertyNames.PluginNumberOfEvidences]: service.service_evidence_list.length,
        [PluginEventDataPropertyNames.PluginCategory]: service.service_families
      });
    });

    it('should call sendEvent method with proper data if trackEditPluginClick was called', () => {
      //Arrange
      //Act
      testedService.trackEditPluginClick(service);

      //Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.PLUGIN_EDIT_FORM, {
        [PluginEventDataPropertyNames.PluginName]: service.service_display_name,
        [PluginEventDataPropertyNames.PluginNumberOfEvidences]: service.service_evidence_list.length,
        [PluginEventDataPropertyNames.PluginCategory]: service.service_families
      });
    });

    it('should call sendEvent method with proper data if trackCancelEditPluginClick was called', () => {
      //Arrange
      //Act
      testedService.trackCancelEditPluginClick(service);

      //Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.PLUGIN_CANCEL_EDIT_FORM, {
        [PluginEventDataPropertyNames.PluginName]: service.service_display_name,
        [PluginEventDataPropertyNames.PluginNumberOfEvidences]: service.service_evidence_list.length,
        [PluginEventDataPropertyNames.PluginCategory]: service.service_families
      });
    });

    it('should call sendEvent method with proper data if trackHowToConnectClick was called', () => {
      //Arrange
      //Act
      testedService.trackHowToConnectClick(service);

      //Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.PLUGIN_HOW_TO_CONNECT, {
        [PluginEventDataPropertyNames.PluginName]: service.service_display_name,
        [PluginEventDataPropertyNames.PluginNumberOfEvidences]: service.service_evidence_list.length,
        [PluginEventDataPropertyNames.PluginType]: service.service_type.toLowerCase(),
        [PluginEventDataPropertyNames.PluginConnected]: false,
        [PluginEventDataPropertyNames.PluginCategory]: service.service_families
      });
    });

    it('should call sendEvent method with proper data if trackTabNavigation was called', () => {
      //Arrange
      //Act
      testedService.trackTabNavigation(service, tabName);

      //Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.PLUGINS_INNER_TAB_NAVIGATION, {
        [PluginEventDataPropertyNames.PluginName]: service.service_display_name,
        [PluginEventDataPropertyNames.TabName]: tabName,
        [PluginEventDataPropertyNames.PluginCategory]: service.service_families,

      });
    });

    it('should call sendEvent method with proper data if trackPluginClick was called', () => {
      //Arrange
      //Act
      testedService.trackPluginClick(service);

      //Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.PLUGIN_SELECT_PLUGIN_ON_MARKETPLACE, {
        [PluginEventDataPropertyNames.PluginName]: service.service_display_name,
        [PluginEventDataPropertyNames.PluginNumberOfEvidences]: service.service_evidence_list.length,
        [PluginEventDataPropertyNames.PluginCategory]: service.service_families,
        [PluginEventDataPropertyNames.PluginConnected]: false,
      });
    });

    it('should call sendEvent method with proper data if trackUpdatePermissionClick was called', () => {
      //Arrange
      //Act
      testedService.trackUpdatePermissionClick(service);

      //Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.UPDATE_PERMISSIONS, {
        [PluginEventDataPropertyNames.PluginName]: service.service_display_name,
        [PluginEventDataPropertyNames.PluginNumberOfEvidences]: service.service_evidence_list.length,
        [PluginEventDataPropertyNames.PluginCategory]: service.service_families,
      });
    });
  });
});
