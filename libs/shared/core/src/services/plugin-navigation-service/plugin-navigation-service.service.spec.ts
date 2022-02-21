import { AppRoutes } from './../../constants/routes';
import { CollectionNotificationData } from './../../models/connectivity-notification-data.model';
import {
  NotificationDefinition,
  NotificationInputNames,
} from 'core/modules/data/models/notification-definition.model';
import { AnecdotesUnifiedFramework } from 'core/modules/data/constants/anecdotes-unified-framework';
import { reducers, ReloadControlsAction } from 'core/modules/data/store';
import { PluginPageQueryParams } from 'core/models';
import { TestBed } from '@angular/core/testing';
import { NavigationExtras, Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Action, StoreModule } from '@ngrx/store';

import { PluginNavigationService } from './plugin-navigation-service.service';
import { Service } from 'core/modules/data/models/domain';
import { LoaderManagerService } from 'core/services';
import {
  ActionDispatcherService,
  OperationsTrackerService,
  ControlsFacadeService,
  PluginNotificationFacadeService,
  TrackOperations,
  PluginService,
  EvidenceFacadeService,
} from 'core/modules/data/services';
import { Observable, of } from 'rxjs';
import { WindowHelperService } from 'core/services';

class MockControlsFacadeService {
  public getAreControlsLoaded(): Observable<boolean> {
    return of(true);
  }
}

class MockNotificationFacadeService {
  getNotification(notification_id: string): Observable<NotificationDefinition> {
    return of(null);
  }

  removeNotification(notification_id: string): void { }
}

const windowMock = {
  openUrlInNewTab: jasmine.createSpy('openUrlInNewTab'),
};

class MockRouter {
  routerState: {
    snapshot: {
      root: {
        queryParams: Params;
      };
    };
  };

  navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    return Promise.resolve(true);
  }

  constructor() {
    this.routerState = { snapshot: { root: { queryParams: {} } } };
  }
}

class MockPluginService {
  getPluginRoute(serviceId: string): string {
    return '';
  }
}

describe('PluginNavigationService', () => {
  let service: PluginNavigationService;
  let router: MockRouter;
  let loaderManager: LoaderManagerService;
  let operationTrackerService: OperationsTrackerService;
  let controlsFacade: MockControlsFacadeService;
  let notificationfacade: MockNotificationFacadeService;
  let actionDispatcher: ActionDispatcherService;
  let windowHelper: WindowHelperService;
  let pluginService: MockPluginService;
  let evidenceFacadeService: EvidenceFacadeService;

  const testPlugin: Service = {
    service_display_name: 'test display name',
    service_id: 'serviceId',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, StoreModule.forRoot(reducers)],
      providers: [
        { provide: PluginService, useClass: MockPluginService },
        { provide: WindowHelperService, useValue: windowMock },
        { provide: EvidenceFacadeService, useValue: EvidenceFacadeService },
        {
          provide: ActionDispatcherService,
          useValue: {
            async dispatchActionAsync(
              action: Action,
              operationId: string,
              operationPartition?: string
            ): Promise<void> { },
          },
        },
        {
          provide: PluginNotificationFacadeService,
          useValue: MockNotificationFacadeService,
        },
        {
          provide: ControlsFacadeService,
          useValue: MockControlsFacadeService,
        },
        {
          provide: LoaderManagerService,
          useValue: {
            hide: () => { },
            show: () => { },
          },
        },
        {
          provide: Router,
          useClass: MockRouter,
        },
        {
          provide: OperationsTrackerService,
          useValue: {
            getOperationStatus: jasmine.createSpy('getOperationStatus'),
          },
        },
      ],
    });
    service = TestBed.inject(PluginNavigationService);
    router = TestBed.inject(Router);
    notificationfacade = TestBed.inject(PluginNotificationFacadeService);
    windowHelper = TestBed.inject(WindowHelperService);
    pluginService = TestBed.inject(PluginService);
    loaderManager = TestBed.inject(LoaderManagerService);
    operationTrackerService = TestBed.inject(OperationsTrackerService);
    controlsFacade = TestBed.inject(ControlsFacadeService);
    actionDispatcher = TestBed.inject(ActionDispatcherService);
    evidenceFacadeService = TestBed.inject(EvidenceFacadeService);
    notificationfacade.getNotification = jasmine.createSpy('getNotification').and.callFake(() => of());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('redirectToEvidencePool', () => {
    let plugin: Service;
    let getEvidenceSpy: jasmine.Spy<jasmine.Func>;

    beforeEach(() => {
      plugin = { service_id: 'test-id', service_display_name: 'service_display_name' };
      getEvidenceSpy = jasmine.createSpy('getAllCalculatedEvidence');
      router.navigate = jasmine.createSpy('navigate');
    });

    it('should navigate to evidence pool page with expected query params', async () => {
      // Arrange
      evidenceFacadeService.getAllCalculatedEvidence = getEvidenceSpy.and.returnValue(of(false));

      const expectedQueryParams = {
        plugins: plugin.service_display_name.replace('_', '.'),
      };

      // Act
      await service.redirectToEvidencePool(plugin);

      // Assert
      expect(router.navigate).toHaveBeenCalledWith([AppRoutes.EvidencePool], {
        queryParams: expectedQueryParams,
      });
    });
  });

  describe('Marketplace <-> Specific plugin navigation', () => {
    const testServiceId = 'test_id';
    const testFamilyValue = 'TestFamilyValue';

    describe('navigateToPluginDetails', () => {
      beforeEach(() => {
        router.navigate = jasmine.createSpy('navigate');
        windowHelper.openUrlInNewTab = jasmine.createSpy('openUrlInNewTab');
      });

      it(`should call router navigate method, and queryParams are optionally applicable`, async () => {
        // Arrange
        pluginService.getPluginRoute = jasmine.createSpy('getPluginRoute').and.returnValue('SomePluginRoute');
        router.routerState.snapshot.root.queryParams[PluginPageQueryParams.family] = testFamilyValue;

        // Act
        service.navigateToPluginDetails(testServiceId);

        // Assert
        expect(router.navigate).toHaveBeenCalledWith([pluginService.getPluginRoute(testServiceId)], {
          state: { family: testFamilyValue },
        });
      });
    });

    describe('navigateToPluginDetailsInNewTab', () => {
      beforeEach(() => {
        router.navigate = jasmine.createSpy('navigate').and.returnValue(of(true).toPromise());
      });

      it(`should call penUrlInNewTab method of window helper service`, async () => {
        // Arrange
        // Act
        service.navigateToPluginDetailsInNewTab(testServiceId);

        // Assert
        expect(windowHelper.openUrlInNewTab).toHaveBeenCalled();
      });
    });

    describe('navigateToPlugins', () => {
      beforeEach(() => {
        router.navigate = jasmine.createSpy('navigate').and.returnValue(of(true).toPromise());
      });

      it(`should call router navigate method to ${AppRoutes.Plugins} and pass ${PluginPageQueryParams.family} query parameter if exists`, async () => {
        // Arrange
        pluginService.getPluginRoute = jasmine.createSpy('getPluginRoute').and.returnValue('SomePluginRoute');
        router.routerState.snapshot.root.queryParams[PluginPageQueryParams.family] = testFamilyValue;
        const queryParams = { family: testFamilyValue };

        // Act
        service.navigateToPlugins(queryParams);

        // Assert
        expect(router.navigate).toHaveBeenCalledWith([AppRoutes.Plugins], {
          queryParams,
        });
      });
    });
  });
});
