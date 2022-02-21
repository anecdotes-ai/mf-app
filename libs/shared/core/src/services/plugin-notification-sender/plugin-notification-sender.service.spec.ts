import { PluginFacadeService } from 'core/modules/data/services';
import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Service, ServiceTypeEnum } from 'core/modules/data/models/domain';
import { CollectionNotificationComponent, ConnectivityNotificationComponent } from 'core/components/notifications';
import { NotificationTypes, NotificationInputNames } from 'core/modules/data/models';
import { reducers, UpsertNotificationAction } from 'core/modules/data/store';
import { PluginNotificationSenderService } from './plugin-notification-sender.service';
import { Observable, of } from 'rxjs';

describe('PluginNotificationSenderService', () => {
  let service: PluginNotificationSenderService;
  let mockStore: MockStore;
  let pluginFacade: PluginFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)],
      providers: [
        provideMockStore(),
        {
          provide: PluginFacadeService,
          useValue: {
            getServiceById: (serviceId: string): Observable<Service> => {
              return of();
            },
          },
        },
      ],
    });
    service = TestBed.inject(PluginNotificationSenderService);
    pluginFacade = TestBed.inject(PluginFacadeService);
    pluginFacade.getServiceById = jasmine
      .createSpy('getServiceById')
      .and.returnValue(of({ service_id: 'test_id', service_type: ServiceTypeEnum.GENERIC }));

    mockStore = TestBed.inject(MockStore);
    mockStore.dispatch = spyOn(mockStore, 'dispatch');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#sendConnectionStartedNotification', () => {
    it('should dispatch UpsertNotificationAction with proper notification definition', () => {
      // Arrange
      const data = {
        service_id: 'some-service-id',
        service_display_name: 'some-service-display-name',
        status: null,
        service_type: ServiceTypeEnum.GENERIC,
      };
      const notificationDef = {
        id: 'some-service-id',
        componentType: ConnectivityNotificationComponent,
        notificationType: NotificationTypes.CONNECTIVITY,
        success: null,
        displayed: true,
        inputs: {
          [NotificationInputNames.notificationData]: {
            service_id: 'some-service-id',
            service_display_name: 'some-service-display-name',
            service_type: ServiceTypeEnum.GENERIC,
            isInProgress: true,
            success: null,
            displaySecondaryContent: false,
            notificationType: NotificationTypes.CONNECTIVITY,
            connectivityMessageData: {
              status: null,
            },
          },
        },
      };

      // Act
      service.sendConnectionStartedNotification(data);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(new UpsertNotificationAction(notificationDef));
    });
  });

  describe('#sendConnectionFailedNotification', () => {
    it('should dispatch UpsertNotificationAction with proper notification definition', () => {
      // Arrange
      const data = {
        service_id: 'some-service-id',
        service_display_name: 'some-service-display-name',
        status: false,
        service_type: ServiceTypeEnum.GENERIC,
      };
      const notificationDef = {
        id: 'some-service-id',
        componentType: ConnectivityNotificationComponent,
        notificationType: NotificationTypes.CONNECTIVITY,
        success: false,
        displayed: true,
        inputs: {
          [NotificationInputNames.notificationData]: {
            service_id: 'some-service-id',
            service_display_name: 'some-service-display-name',
            service_type: ServiceTypeEnum.GENERIC,
            isInProgress: false,
            success: false,
            displaySecondaryContent: true,
            notificationType: NotificationTypes.CONNECTIVITY,
            connectivityMessageData: {
              status: false,
            },
          },
        },
      };

      // Act
      service.sendConnectionFailedNotification(data);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(new UpsertNotificationAction(notificationDef));
    });
  });

  describe('#sendConnectionStatusUnknownNotification', () => {
    it('should dispatch UpsertNotificationAction with proper notification definition', () => {
      // Arrange
      const data = {
        service_id: 'some-service-id',
        service_display_name: 'some-service-display-name',
        status: null,
        service_type: ServiceTypeEnum.GENERIC,
      };
      const notificationDef = {
        id: 'some-service-id',
        componentType: ConnectivityNotificationComponent,
        notificationType: NotificationTypes.CONNECTIVITY,
        success: null,
        displayed: true,
        inputs: {
          [NotificationInputNames.notificationData]: {
            service_id: 'some-service-id',
            service_display_name: 'some-service-display-name',
            service_type: ServiceTypeEnum.GENERIC,
            isInProgress: false,
            success: null,
            displaySecondaryContent: true,
            notificationType: NotificationTypes.CONNECTIVITY,
            connectivityMessageData: {
              status: null,
            },
          },
        },
      };

      // Act
      service.sendConnectionStatusUnknownNotification(data);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(new UpsertNotificationAction(notificationDef));
    });
  });

  describe('#sendCollectionStartedNotification', () => {
    it('should dispatch UpsertNotificationAction with proper notification definition', async () => {
      // Arrange
      const data = {
        service_id: 'some-service-id',
        service_name: 'some-service-display-name',
        service_type: ServiceTypeEnum.GENERIC,
        status: null,
      };
      const notificationDef = {
        id: 'some-service-id',
        componentType: CollectionNotificationComponent,
        notificationType: NotificationTypes.COLLECTION,
        success: null,
        displayed: true,
        inputs: {
          [NotificationInputNames.notificationData]: {
            service_id: 'some-service-id',
            service_display_name: 'some-service-display-name',
            service_type: ServiceTypeEnum.GENERIC,
            isInProgress: true,
            success: null,
            displaySecondaryContent: false,
            notificationType: NotificationTypes.COLLECTION,
            collectionMessageData: {
              status: null,
              total_evidence: undefined,
              collected_evidence: undefined,
            },
          },
        },
      };

      // Act
      await service.sendCollectionStartedNotification(data);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(new UpsertNotificationAction(notificationDef));
    });
  });

  describe('#sendCollectionFailedNotification', () => {
    it('should dispatch UpsertNotificationAction with proper notification definition', async () => {
      // Arrange
      const data = {
        service_id: 'some-service-id',
        service_name: 'some-service-display-name',
        service_type: ServiceTypeEnum.GENERIC,
        status: false,
      };
      const notificationDef = {
        id: 'some-service-id',
        componentType: CollectionNotificationComponent,
        notificationType: NotificationTypes.COLLECTION,
        success: false,
        displayed: true,
        inputs: {
          [NotificationInputNames.notificationData]: {
            service_id: 'some-service-id',
            service_display_name: 'some-service-display-name',
            service_type: ServiceTypeEnum.GENERIC,
            isInProgress: false,
            success: false,
            displaySecondaryContent: true,
            notificationType: NotificationTypes.COLLECTION,
            collectionMessageData: {
              status: false,
              total_evidence: undefined,
              collected_evidence: undefined,
            },
          },
        },
      };

      // Act
      await service.sendCollectionFailedNotification(data);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(new UpsertNotificationAction(notificationDef));
    });
  });

  describe('#sendCollectionSuccessNotification', () => {
    it('should dispatch UpsertNotificationAction with proper notification definition', async () => {
      // Arrange
      const data = {
        service_id: 'some-service-id',
        service_name: 'some-service-display-name',
        service_type: ServiceTypeEnum.GENERIC,
        status: true,
      };
      const notificationDef = {
        id: 'some-service-id',
        componentType: CollectionNotificationComponent,
        notificationType: NotificationTypes.COLLECTION,
        success: true,
        displayed: true,
        inputs: {
          [NotificationInputNames.notificationData]: {
            service_id: 'some-service-id',
            service_display_name: 'some-service-display-name',
            service_type: ServiceTypeEnum.GENERIC,
            isInProgress: false,
            success: true,
            displaySecondaryContent: true,
            notificationType: NotificationTypes.COLLECTION,
            collectionMessageData: {
              status: true,
              total_evidence: undefined,
              collected_evidence: undefined,
            },
          },
        },
      };

      // Act
      await service.sendCollectionSuccessNotification(data);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(new UpsertNotificationAction(notificationDef));
    });
  });
});
