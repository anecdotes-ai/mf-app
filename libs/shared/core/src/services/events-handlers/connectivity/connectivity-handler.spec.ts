import { ServiceAdapterActions } from 'core/modules/data/store/actions/services.actions';
import { PluginConnectionFacadeService } from 'core/modules/plugins-connection/services/facades/plugin-connection-facade/plugin-connection-facade.service';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  ConnectivityResult,
  MessageBusService,
  PusherMessage,
  PusherMessageType,
  UserEvents,
} from 'core';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { Service, ServiceStatusEnum, ServiceTypeEnum } from 'core/modules/data/models/domain';
import { LoadSpecificServiceAction, reducers, ServiceUpdated } from 'core/modules/data/store';
import { ServicesState } from 'core/modules/data/store/reducers';
import { ConnectivityHandler } from './connectivity-handler';
import { PluginsEventService } from 'core/modules/plugins-connection/services/plugins-event-service/plugins-event.service';

describe('ConnectivityHandler', () => {
  let serviceUnderTest: ConnectivityHandler;
  let userEventHub: UserEventService;
  let mockStore: MockStore;
  let mockServicesState: ServicesState;
  let pluginsEventService: PluginsEventService;

  const service: Service = { service_display_name: 'some-name', service_evidence_list: [{}] };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)],
      providers: [
        {
          provide: PluginConnectionFacadeService, useValue: {
            handlePluginConnectivityResult: (connectivityResultObject: ConnectivityResult) => { }
          }
        },
        provideMockStore(),
        ConnectivityHandler,
        { provide: MessageBusService, useValue: {} },
        { provide: UserEventService, useValue: {} },
        { provide: PluginsEventService, useValue: {} },

      ],
    });
    serviceUnderTest = TestBed.inject(ConnectivityHandler);

    userEventHub = TestBed.inject(UserEventService);
    userEventHub.sendEvent = jasmine.createSpy('sendEvent');

    mockStore = TestBed.inject(MockStore);
    mockStore.dispatch = spyOn(mockStore, 'dispatch');
    mockServicesState = { initialized: false, ids: [], entities: {} };
    mockStore.setState({ servicesState: mockServicesState });
    pluginsEventService = TestBed.inject(PluginsEventService);
    pluginsEventService.trackPluginConnectionResult = jasmine.createSpy('trackPluginConnectionResult');
  });

  it('should be created', () => {
    expect(serviceUnderTest).toBeTruthy();
  });

  describe('#handle', () => {
    let messageObject: ConnectivityResult;
    let message: PusherMessage<ConnectivityResult>;

    beforeEach(() => {
      messageObject = {
        status: false,
        service_id: 'some-service-id',
        service_display_name: 'some-service-name',
        service_type: ServiceTypeEnum.GENERIC,
      };

      message = {
        message_type: PusherMessageType.Connectivity,
        message_object: messageObject,
      };
    });

    it('should send user event with PLUGIN_CONNECTION_SUCCEEDED and proper data if connection status === true', fakeAsync(() => {
      // Arrange
      mockServicesState = {
        ...mockServicesState,
        initialized: true,
        ids: ['some-service-id'],
        entities: {
          ['some-service-id']: { service: service },
        },
      };
      messageObject.status = true;

      // Act
      mockStore.setState({ servicesState: mockServicesState });
      mockStore.refreshState();
      serviceUnderTest.handle(message);
      tick();

      // Assert
      expect(pluginsEventService.trackPluginConnectionResult).toHaveBeenCalledWith(UserEvents.PLUGIN_CONNECTION_SUCCEEDED, service);
    })
    );

    it('should send user event with PLUGIN_CONNECTION_FAILED and proper data if connection status === false', fakeAsync(() => {
      // Arrange
      mockServicesState = {
        ...mockServicesState,
        initialized: true,
        ids: ['some-service-id'],
        entities: {
          ['some-service-id']: { service: service },
        },
      };
      messageObject.status = false;

      // Act
      mockStore.setState({ servicesState: mockServicesState });
      mockStore.refreshState();
      serviceUnderTest.handle(message);
      tick();

      // Assert
      expect(pluginsEventService.trackPluginConnectionResult).toHaveBeenCalledWith(UserEvents.PLUGIN_CONNECTION_FAILED, service);
    }));

    it('should dispatch LoadSpecificServiceAction if service is not in store', fakeAsync(() => {
      // Act
      serviceUnderTest.handle(message);
      tick();

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        new LoadSpecificServiceAction({
          service_id: 'some-service-id',
        })
      );
    }));

    // it(`should dispatch ServiceUpdated action with proper parameters including ${ServiceStatusEnum.INSTALLED} as service_status`, () => {
    //   // Arrange
    //   messageObject.status = true;

    //   // Act
    //   serviceUnderTest.handle(message);

    //   // Assert
    //   expect(mockStore.dispatch).toHaveBeenCalledWith(
    //     ServiceAdapterActions.serviceConnectivityHandling({
    //       service_id:'some-service-id',
    //       message_status: message.message_object.status,
    //       service_instance_id: message.message_object.service_instance_id,
    //       service_instance_status: ServiceStatusEnum.INSTALLED
    //     })
    //   );
    // });

    // it(`should dispatch ServiceUpdated action with proper parameters including ${ServiceStatusEnum.CONNECTIVITYFAILED} as service_status`, () => {
    //   // Arrange
    //   messageObject.status = false;

    //   // Act
    //   serviceUnderTest.handle(message);

    //   // Assert
    //   expect(mockStore.dispatch).toHaveBeenCalledWith(
    //     ServiceAdapterActions.serviceConnectivityHandling({
    //       service_id:'some-service-id',
    //       message_status: message.message_object.status,
    //       service_instance_id: message.message_object.service_instance_id,
    //       service_instance_status: ServiceStatusEnum.CONNECTIVITYFAILED
    //     })
    //   );
    // });
  });
});
