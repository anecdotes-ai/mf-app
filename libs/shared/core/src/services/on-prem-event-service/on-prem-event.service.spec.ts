import { TestBed } from '@angular/core/testing';

import { OnPremEventService } from './on-prem-event.service';
import { OnPremEventDataProperty, UserEvents } from 'core';
import { UserEventService } from 'core/services/user-event/user-event.service';

describe('OnPremEventService', () => {
  let service: OnPremEventService;
  let userEventService: UserEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserEventService,
          useValue: {},
        },
      ],
    });
    service = TestBed.inject(OnPremEventService);

    userEventService = TestBed.inject(UserEventService);
    userEventService.sendEvent = jasmine.createSpy('sendEvent');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('trackNavigationFromPluginToConnectors', () => {
    it(`should call userEventService.sendEvent with ${UserEvents.FROM_PLUGIN_TO_CONNECTORS} event`, () => {
      // Arrange
      // Act
      service.trackNavigationFromPluginToConnectorsEvent();

      // Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.FROM_PLUGIN_TO_CONNECTORS);
    });
  });

  describe('trackHowToGuideLinkClick', () => {
    it(`should call userEventService.sendEvent with ${UserEvents.HOW_TO_GUIDE} event`, () => {
      // Arrange
      // Act
      service.trackHowToGuideLinkClickEvent();

      // Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.HOW_TO_GUIDE);
    });
  });

  describe('trackAddConnectorEvent', () => {
    it(`should call userEventService.sendEvent with ${UserEvents.ADD_CONNECTOR} event`, () => {
      // Arrange
      // Act
      service.trackAddConnectorEvent();

      // Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.ADD_CONNECTOR);
    });
  });

  describe('trackDownloadVMEvent', () => {
    it(`should call userEventService.sendEvent with ${UserEvents.DOWNLOAD_VM} event`, () => {
      // Arrange
      // Act
      service.trackDownloadVMEvent();

      // Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.DOWNLOAD_VM);
    });
  });

  describe('trackConnectorSelectEvent', () => {
    it(`should call userEventService.sendEvent with ${UserEvents.SELECT_CONNECTOR} event`, () => {
      // Arrange
      // Act
      service.trackConnectorSelectEvent(5, ['1', '2'], 'agent');

      // Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.SELECT_CONNECTOR, {
        [OnPremEventDataProperty.ConnectedPluginsAmount]: 5,
        [OnPremEventDataProperty.PluginsNames]: '1, 2',
        [OnPremEventDataProperty.ConnectorId]: 'agent',
      });
    });
  });

  describe('trackRegenerateKeyEvent', () => {
    it(`should call userEventService.sendEvent with ${UserEvents.REGENERATE_KEY} event`, () => {
      // Arrange
      // Act
      service.trackRegenerateKeyEvent('agent');

      // Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.REGENERATE_KEY, {
        [OnPremEventDataProperty.ConnectorId]: 'agent',
      });
    });
  });

  describe('trackPluginNameClickEvent', () => {
    it(`should call userEventService.sendEvent with ${UserEvents.PLUGIN_NAME_CLICK} event`, () => {
      // Arrange
      // Act
      service.trackPluginNameClickEvent({ service_display_name: 'service' });

      // Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.PLUGIN_NAME_CLICK, {
        [OnPremEventDataProperty.PluginName]: 'service',
      });
    });
  });

  describe('trackViewEvidenceClickEvent', () => {
    it(`should call userEventService.sendEvent with ${UserEvents.VIEW_EVIDENCE_CLICK} event`, () => {
      // Arrange
      // Act
      service.trackViewEvidenceClickEvent({ service_display_name: 'service' });

      // Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.VIEW_EVIDENCE_CLICK, {
        [OnPremEventDataProperty.PluginName]: 'service',
      });
    });
  });

  describe('trackTabNavigationEvent', () => {
    it(`should call userEventService.sendEvent with ${UserEvents.TAB_NAVIGATION} event`, () => {
      // Arrange
      // Act
      service.trackTabNavigationEvent('tab');

      // Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.TAB_NAVIGATION, {
        [OnPremEventDataProperty.TabName]: 'tab',
      });
    });
  });

  describe('trackConnectorStatusChangingEvent', () => {
    it(`should call userEventService.sendEvent with ${UserEvents.CONNECTOR_STATUS_CHANGING} event`, () => {
      // Arrange
      // Act
      service.trackConnectorStatusChangingEvent('agent', 'online', 'offline');

      // Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.CONNECTOR_STATUS_CHANGING, {
        [OnPremEventDataProperty.ConnectorId]: 'agent',
        [OnPremEventDataProperty.PreviousConnectorStatus]: 'offline',
        [OnPremEventDataProperty.CurrentConnectorStatus]: 'online',
      });
    });
  });
});
