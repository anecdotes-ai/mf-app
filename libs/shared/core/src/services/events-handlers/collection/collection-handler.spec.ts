import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PusherMessage, PusherMessageType, UserEvents } from 'core';
import { CollectionResult } from 'core/models/collection-result.model';
import { Service } from 'core/modules/data/models/domain';
import { ControlsFacadeService, PluginFacadeService } from 'core/modules/data/services';
import { reducers } from 'core/modules/data/store';
import { ServicesState } from 'core/modules/data/store/reducers';
import { CollectionHandler } from './collection-handler';
import { PluginConnectionFacadeService } from 'core/modules/plugins-connection/services';
import { PluginsEventService } from 'core/modules/plugins-connection/services/plugins-event-service/plugins-event.service';
import { of } from 'rxjs';

describe('CollectionHandler', () => {
  let serviceUnderTest: CollectionHandler;
  let mockStore: MockStore;
  let pluginFacade: PluginFacadeService;
  let pluginsEventService: PluginsEventService;
  let controlsFacade: ControlsFacadeService;
  let messageObject: CollectionResult = { service_id: 'some-id', service_name: 'some-name', status: true };
  let pusherMsg: PusherMessage<CollectionResult> = {
    message_type: PusherMessageType.EvidenceCollection,
    message_object: messageObject,
  };

  const mockServices: Service[] = [
    {
      service_id: 'first_service_id',
    },
    {
      service_id: 'second_service_id',
    },
  ];

  const servicesState: ServicesState = {
    initialized: true,
    ids: mockServices.map((s) => s.service_id),
    entities: {
      [mockServices[0].service_id]: { serviceLogs: {'aaa': [{ message: 'testOne' }]}, service: mockServices[0] },
      [mockServices[1].service_id]: { serviceLogs: undefined, service: mockServices[1] },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)],
      providers: [
        provideMockStore(),
        CollectionHandler,
        { provide: PluginFacadeService, useValue: {} },
        { provide: PluginConnectionFacadeService, useValue: {} },
        { provide: PluginsEventService, useValue: {} },
        { provide: ControlsFacadeService, useValue: {} },
      ],
    });
    serviceUnderTest = TestBed.inject(CollectionHandler);
  });

  it('should be created', () => {
    expect(serviceUnderTest).toBeTruthy();
  });

  beforeEach(() => {
    pluginsEventService = TestBed.inject(PluginsEventService);
    pluginsEventService.trackEvidenceCollectionResult = jasmine.createSpy('trackEvidenceCollectionResult');
    pluginFacade = TestBed.inject(PluginFacadeService);
    controlsFacade = TestBed.inject(ControlsFacadeService);
    pluginFacade.getServiceById = jasmine.createSpy('getServiceById').and.returnValue(of(mockServices[0]));
    controlsFacade.reloadControls = jasmine.createSpy('reloadControls');

    mockStore = TestBed.inject(MockStore);
    mockStore.setState({
      servicesState,
    });
  });

  describe('Amplitude events sending', () => {
    it(`should call pluginsEventService.trackEvidenceCollectionResult with ${UserEvents.EVIDENCE_COLLECTION_SUCCEEDED} event`, async () => {
      //Arrange
      pusherMsg.message_object.status = true;
      //Act
      await serviceUnderTest.handle(pusherMsg);
      // Assert
      expect(pluginsEventService.trackEvidenceCollectionResult).toHaveBeenCalledWith(
        UserEvents.EVIDENCE_COLLECTION_SUCCEEDED,
        pusherMsg.message_object.service_id
      );
    });

    it(`should call pluginsEventService.trackEvidenceCollectionResult with ${UserEvents.EVIDENCE_COLLECTION_FAILED} event`, async () => {
      //Arrange
      pusherMsg.message_object.status = false;
      //Act
      await serviceUnderTest.handle(pusherMsg);
      // Assert
      expect(pluginsEventService.trackEvidenceCollectionResult).toHaveBeenCalledWith(
        UserEvents.EVIDENCE_COLLECTION_FAILED,
        pusherMsg.message_object.service_id
      );
    });
  });
});
