import { PluginConnectionAdapterActions } from './../../../store/actions/plugin-connection.actions';
import { configureTestSuite } from 'ng-bullet';
import { PluginNotificationSenderService } from 'core/services/plugin-notification-sender/plugin-notification-sender.service';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { PluginsDataService } from './../../plugins-data-service/plugins.data.service';
import { ActionDispatcherService } from 'core/modules/data/services/action-dispatcher/action-dispatcher.service';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PluginConnectionFacadeService } from './plugin-connection-facade.service';
import { PluginFacadeService } from 'core/modules/data/services';
import { PluginsEventService } from 'core/modules/plugins-connection/services/plugins-event-service/plugins-event.service';
import { Service, ServiceTypeEnum } from 'core/modules/data/models/domain';
import { PluginConnectionStates } from 'core/modules/plugins-connection/models';
import { of } from 'rxjs';
import { OnPremFieldsEnum } from 'core/modules/plugins-connection/models/on-prem-fields.enum';

describe('Service: PluginConnectionFacadeService', () => {
  configureTestSuite();
  let service: PluginConnectionFacadeService;
  let pluginsEventService: PluginsEventService;
  let store: MockStore;
  let pluginNotificationService: PluginNotificationSenderService;
  let pluginFacade: PluginFacadeService;

  const formValues = {
    some_value: 'some-value',
    [OnPremFieldsEnum.AgentID]: '',
    [OnPremFieldsEnum.Hostname]: '',
    [OnPremFieldsEnum.Port]: '',
  };

  let plugin: Service = {
    service_display_name: 'some-name',
    service_evidence_list: [{}, {}],
    service_id: 'some-id',
    service_fields: [{ field_name: 'some_value' }],
  };
  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [
        PluginConnectionFacadeService,
        provideMockStore(),
        { provide: ActionDispatcherService, useValue: {} },
        { provide: PluginsDataService, useValue: {} },
        { provide: PluginFacadeService, useValue: {} },
        { provide: UserEventService, useValue: {} },
        { provide: PluginNotificationSenderService, useValue: {} },
        { provide: PluginsEventService, useValue: {} },
      ],
    });
    service = TestBed.inject(PluginConnectionFacadeService);
    pluginsEventService = TestBed.inject(PluginsEventService);
    pluginFacade = TestBed.inject(PluginFacadeService);
    pluginsEventService.trackRunOnDemandClick = jasmine.createSpy('trackRunOnDemandClick');
    store = TestBed.inject(MockStore);
    store.dispatch = jasmine.createSpy('dispatch');
    pluginNotificationService = TestBed.inject(PluginNotificationSenderService);
    pluginNotificationService.sendTunnelFailedNotification = jasmine.createSpy('sendTunnelFailedNotification');
    pluginFacade = TestBed.inject(PluginFacadeService);
    pluginFacade.loadSpecificPlugin = jasmine.createSpy('loadSpecificPlugin').and.returnValue(of({ service_id: 'randomServiceId' } as Service));
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  // describe('Amplitude events sending', () => {
  //   it('should call pluginsEventService.trackRunOnDemandClick  when runOnDemand() is called', () => {
  //     // Arrange

  //     // Act
  //     service.runOnDemand(plugin);

  //     // Assert
  //     expect(pluginsEventService.trackRunOnDemandClick).toHaveBeenCalledWith(plugin);
  //   });
  // });

  describe('On-Prem flow', () => {
    // it(`should set connection state to ${PluginConnectionStates.WaitingForTunnel} if service is on-prem`, async () => {
    //   // Arrange
    //   plugin.service_is_onprem = true;

    //   // Act
    //   await service.connectPlugin(plugin, {});
    //   // Assert

    //   expect(store.dispatch).toHaveBeenCalledWith(
    //     PluginConnectionAdapterActions.changeConnectionState({ stateToChange: { service_id: plugin.service_id, connection_state: PluginConnectionStates.WaitingForTunnel } })
    //   );
    // });

    // it(`should set connection state to ${PluginConnectionStates.TestConnection} if service is on-prem`, async () => {
    //   // Arrange
    //   plugin.service_is_onprem = false;

    //   // Act
    //   await service.connectPlugin(plugin, {});

    //   // Assert
    //   expect(store.dispatch).toHaveBeenCalledWith(
    //     PluginConnectionAdapterActions.changeConnectionState({ stateToChange: { service_id: plugin.service_id, connection_state: PluginConnectionStates.TestConnection } })

    //   );
    // });

    it(`should set connection state to ${PluginConnectionStates.TestConnectionAfterTunnelIsUp} if service is on-prem`, fakeAsync(() => {
      // Arrange
      // Act
      service.handleTunnelConnectivityResult({
        status: true,
        service_id: plugin.service_id,
        service_type: ServiceTypeEnum.GENERIC,
        service_display_name: 'some-name',
      });
      tick(100);

      // Assert
      expect(store.dispatch).toHaveBeenCalledWith(
        PluginConnectionAdapterActions.changeConnectionState({ stateToChange: { service_id: plugin.service_id, connection_state: PluginConnectionStates.TestConnectionAfterTunnelIsUp } })

      );
    }));

    it(`should set connection state to ${PluginConnectionStates.WaitingForTunnelFailed} if service is on-prem`, fakeAsync(() => {
      // Arrange
      // Act
      service.handleTunnelConnectivityResult({
        status: false,
        service_id: plugin.service_id,
        service_type: ServiceTypeEnum.GENERIC,
        service_display_name: 'some-name',
      });
      tick(100);

      // Assert
      expect(store.dispatch).toHaveBeenCalledWith(
        PluginConnectionAdapterActions.changeConnectionState({ stateToChange: { service_id: plugin.service_id, connection_state: PluginConnectionStates.WaitingForTunnelFailed } })

      );
    }));

    // it(`should save form values without on-prem fields`, () => {
    //   // Arrange
    //   // Act
    //   service.saveConnectionFormValuesIfPossible(plugin, formValues);

    //   // Assert
    //   expect(store.dispatch).toHaveBeenCalledWith(
    //     new SaveConnectionFormValuesStateAction(plugin.service_id, { some_value: 'some-value' })
    //   );
    // });

    // it(`should save form values with on-prem fields`, () => {
    //   // Arrange
    //   plugin.service_is_onprem = true;

    //   // Act
    //   service.saveConnectionFormValuesIfPossible(plugin, formValues);

    //   // Assert
    //   expect(store.dispatch).toHaveBeenCalledWith(
    //     new SaveConnectionFormValuesStateAction(plugin.service_id, formValues)
    //   );
    // });

  });

  describe('getFilledServiceParameters', () => {
    const testData = [
      {
        form_values: undefined,
        message: 'form-values prop is undefined'
      },
      {
        form_values: {},
        message: 'form-values prop is empty object'
      },
      {
        form_values: {
          key1: undefined,
          Key2: undefined
        },
        message: 'all of form-values values are undefined'
      },
    ];

    testData.forEach(testCase => {
      it(`should return empty object if ${testCase.message}`, async () => {
        // Arrange
        // Act
        const result = await service.getFilledServiceParameters({}, testCase.form_values);

        // Assert
        expect(result).toEqual({});
      });
    });
  });
});
