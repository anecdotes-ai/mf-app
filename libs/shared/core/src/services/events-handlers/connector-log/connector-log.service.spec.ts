import { ServicesState } from 'core/modules/data/store/reducers';
import { ConnectorLog, PusherMessage, PusherMessageType } from 'core/models';
import { ServiceLog } from 'core/modules/data/models/domain';
import { TestBed } from '@angular/core/testing';
import { ConnectorLogService } from './connector-log.service';
import { PluginFacadeService } from 'core/modules/data/services';
import { Observable, of } from 'rxjs';

class MockPluginFacadeService {
  addPluginLogs(service_id: string, service_instance_id: string, serviceLogs: ServiceLog[]): void { }
  areLogsLoadedForPlugin(service_id: string, service_instance_id: string): Observable<boolean> {
    return of(true);
  }
}

describe('Service: ConnectorLog', () => {
  let pluginsFacade: MockPluginFacadeService;

  let service: ConnectorLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConnectorLogService, { provide: PluginFacadeService, useClass: MockPluginFacadeService }],
    });

    service = TestBed.inject(ConnectorLogService);
    pluginsFacade = TestBed.inject(PluginFacadeService);
  });

  it('should ...', () => {
    expect(service).toBeTruthy();
  });

  describe('handle', () => {
    let mockMessage: PusherMessage<ConnectorLog>;
    let servicesState: ServicesState;
    beforeEach(() => {
      mockMessage = {
        message_type: PusherMessageType.ConnectorLog,
        message_object: {
          customer_id: 'test_customer_id_',
          connector_id: 'test__connector_id__',
          service_instance_id: 'testServiceInstanceId',
          run_id: 'mock_runId',
          request_id: 'mock_request_id',
          timestamp: 0,
          severity: 'mockSeverity',
          message: 'mockMessage',
        },
      };

      servicesState = {
        initialized: true,
        ids: [mockMessage.message_object.connector_id],
        entities: { [mockMessage.message_object.connector_id]: { serviceLogs: {}, service: null } },
      };

      pluginsFacade.addPluginLogs = jasmine.createSpy('addPluginLogs');
    });

    it('should call addPluginLogs of pluginsFacade with expected values', async () => {
      // Arrange
      const expectedMethodArguments: ServiceLog[] = [
        {
          run_id: mockMessage.message_object.run_id,
          message: mockMessage.message_object.message,
          severity: mockMessage.message_object.severity,
          timestamp: mockMessage.message_object.timestamp,
        },
      ];

      pluginsFacade.areLogsLoadedForPlugin = jasmine.createSpy('areLogsLoadedForPlugin').and.returnValue(of(true));

      // Act
      await service.handle(mockMessage);

      // Assert
      expect(pluginsFacade.addPluginLogs).toHaveBeenCalledWith(
        mockMessage.message_object.connector_id,
        mockMessage.message_object.service_instance_id,
        expectedMethodArguments
      );
    });

    it('should not call addPluginLogs of pluginsFacade if serviceLogs array is not set', async () => {
      // Arrange
      servicesState.entities = {
        [mockMessage.message_object.connector_id]: { serviceLogs: undefined, service: null },
      };

      pluginsFacade.areLogsLoadedForPlugin = jasmine.createSpy('areLogsLoadedForPlugin').and.returnValue(of(false));

      // Act
      await service.handle(mockMessage);

      // Assert
      expect(pluginsFacade.addPluginLogs).not.toHaveBeenCalled();
    });
  });
});
