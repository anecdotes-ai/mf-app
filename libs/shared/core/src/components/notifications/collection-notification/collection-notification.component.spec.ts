import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationExtras, Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AppRoutes, CollectionNotificationData, RouteParams } from 'core';
import { Service, ServiceTypeEnum } from 'core/modules/data/models/domain';
import { NotificationTypes } from 'core/modules/data/models/notification-definition.model';
import { PluginService } from 'core/modules/data/services/plugin/plugin.service';
import { PluginNavigationService } from 'core/services/plugin-navigation-service/plugin-navigation-service.service';
import { configureTestSuite } from 'ng-bullet';
import { of, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { CollectionNotificationComponent, CollectionStatus } from './collection-notification.component';

class MockRouter {
  routerState: {
    root: {
      snapshot: {
        queryParams: Params;
      };
    };
  };

  events = new Subject();

  navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    return Promise.resolve(true);
  }

  constructor() {
    this.routerState = { root: { snapshot: { queryParams: {} } } };
  }
}

describe('CollectionNotificationComponent', () => {
  configureTestSuite();

  let component: CollectionNotificationComponent;
  let fixture: ComponentFixture<CollectionNotificationComponent>;
  let pluginService: PluginService;
  let router: Router;
  let pluginNavigationService: PluginNavigationService;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [CollectionNotificationComponent],
      providers: [
        { provide: PluginService, useValue: {} },
        { provide: Router, useClass: MockRouter },
        {
          provide: PluginNavigationService,
          useValue: {
            redirectToEvidence: jasmine.createSpy('redirectToEvidence'),
            redirectToEvidencePool: jasmine.createSpy('redirectToEvidencePool')
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionNotificationComponent);
    component = fixture.componentInstance;

    pluginService = TestBed.inject(PluginService);
    pluginService.getServiceIconLink = jasmine.createSpy('getServiceIconLink').and.returnValue(of('icon-link'));

    router = TestBed.inject(Router);
    pluginNavigationService = TestBed.inject(PluginNavigationService);
    (router as any).routerState = {
      snapshot: {
        url: '',
        root: {
          url: '',
        },
      },
    };

    component.notificationData = {
      isInProgress: true,
      service_id: 'some-service',
      service_display_name: 'some-service',
      displaySecondaryContent: false,
    } as CollectionNotificationData;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('host bindings', () => {
    beforeEach(() => {
      component.notificationData.notificationType = NotificationTypes.COLLECTION;
      (component.notificationData as CollectionNotificationData).collectionMessageData = {
        status: true,
        total_evidence: 1,
        collected_evidence: 1,
      };

      spyOn(component, 'getCollectionStatus').and.returnValue(CollectionStatus.UNKNOWN);
    });

    it('should set loading class to host if passed notificationData is in progress', () => {
      // Arrange

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.nativeElement.classList.contains('loading')).toBeTrue();
    });

    it('should not set secondary-content class to host if passed notificationData displaySecondaryContent is false', () => {
      // Arrange

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.nativeElement.classList.contains('secondary-content')).toBeTrue();
    });
  });

  describe('#ngOnInit', () => {
    it('should correctly get serviceIcon', async () => {
      // Arrange
      spyOn(component, 'getCollectionStatus').and.returnValue(CollectionStatus.UNKNOWN);
      component.notificationData.notificationType = NotificationTypes.COLLECTION;
      (component.notificationData as CollectionNotificationData).collectionMessageData = {
        status: true,
        total_evidence: 1,
        collected_evidence: 1,
      };

      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      const icon = await component.serviceIcon$.pipe(take(1)).toPromise();

      // Assert
      expect(icon).toEqual('icon-link');
    });
  });

  describe('#getCollectionStatus', () => {
    let notificationData: CollectionNotificationData;

    beforeEach(() => {
      notificationData = {
        isInProgress: true,
        service_id: 'some-service',
        service_display_name: 'some-service',
        service_type: ServiceTypeEnum.GENERIC,
        notificationType: NotificationTypes.CONNECTIVITY,
        collectionMessageData: {
          status: null,
          total_evidence: 1,
          collected_evidence: 1,
        },
        displaySecondaryContent: false,
      };
    });

    it('should return SUCCESS status if success is true', () => {
      // Arrange
      notificationData.success = true;
      component.notificationData = notificationData;

      // Act
      const result = component.getCollectionStatus();

      // Assert
      expect(result).toEqual(CollectionStatus.SUCCESS);
    });

    it('should return FAILED status if success is false', () => {
      // Arrange
      notificationData.success = false;
      component.notificationData = notificationData;

      // Act
      const result = component.getCollectionStatus();

      // Assert
      expect(result).toEqual(CollectionStatus.FAILED);
    });

    it('should return UNKNOWN status if success is anything else', () => {
      // Arrange
      notificationData.success = null;
      component.notificationData = notificationData;

      // Act
      const result = component.getCollectionStatus();

      // Assert
      expect(result).toEqual(CollectionStatus.UNKNOWN);
    });
  });

  describe('#isEvidenceCollectedNotificationMetaType', () => {

    beforeEach(() => {
      component.notificationData = {
        isInProgress: true,
        service_id: 'some-service',
        service_display_name: 'some-service',
        service_type: ServiceTypeEnum.GENERIC,
        notificationType: NotificationTypes.COLLECTION,
        collectionMessageData: {
          status: true,
          total_evidence: 22,
          collected_evidence: 0,
        },
        displaySecondaryContent: false,
      };
    });

    it(`should return false if service_type is ${ServiceTypeEnum.COLLABORATION}`, async () => {
      // Arrange
      component.notificationData.service_type = ServiceTypeEnum.COLLABORATION;

      fixture.detectChanges();
      await fixture.whenStable();

      // Act
      const result = component.isEvidenceCollectedNotificationMetaType();

      // Assert
      expect(result).toBeFalse();
    });

    it(`should return false if service_type is ${ServiceTypeEnum.FILEMONITOR} and no collected_evidence`, async () => {
      // Arrange
      component.notificationData.service_type = ServiceTypeEnum.FILEMONITOR;
      (component.notificationData as CollectionNotificationData).collectionMessageData = {
        status: true,
        total_evidence: 22,
        collected_evidence: 0,
      };

      fixture.detectChanges();
      await fixture.whenStable();

      // Act
      const result = component.isEvidenceCollectedNotificationMetaType();

      // Assert
      expect(result).toBeFalse();
    });
  });

  describe('#resolveStatusIcon', () => {
    let connectivityStatus: CollectionStatus;

    beforeEach(() => {
      spyOn(component, 'getCollectionStatus').and.callFake(() => connectivityStatus);
    });

    it('should return "status_not_started_bordered" if status is FAILED', () => {
      // Arrange
      connectivityStatus = CollectionStatus.FAILED;

      // Act
      const result = component.resolveStatusIcon();

      // Assert
      expect(result).toEqual('status_not_started_bordered');
    });

    it('should return "status_complete_bordered" if status is SUCCESS', () => {
      // Arrange
      connectivityStatus = CollectionStatus.SUCCESS;

      // Act
      const result = component.resolveStatusIcon();

      // Assert
      expect(result).toEqual('status_complete_bordered');
    });

    it('should return empty string if status is anything else', () => {
      // Arrange
      connectivityStatus = CollectionStatus.UNKNOWN;

      // Act
      const result = component.resolveStatusIcon();

      // Assert
      expect(result).toEqual('');
    });
  });

  describe('#preClosing', () => {
    it('should emit closing with proper service_id', () => {
      // Arrange
      component.notificationData.notificationType = NotificationTypes.COLLECTION;
      (component.notificationData as CollectionNotificationData).collectionMessageData = {
        status: true,
        total_evidence: 1,
        collected_evidence: 1,
      };
      spyOn(component.closing, 'emit');

      // Act
      component.preClosing();

      // Assert
      expect(component.closing.emit).toHaveBeenCalledWith('some-service');
    });
  });

  describe('#buildTranslationKey', () => {
    it('should correctly build translation key', () => {
      // Arrange
      const relativeKey = 'some-key';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toEqual(`notifications.collection.${relativeKey}`);
    });
  });

  describe('#navigateToPluginLogs button', () => {
    it(`should navigate to /${AppRoutes.Plugins} and then to plugin logs`, async () => {
      // Arrange
      component.notificationData.notificationType = NotificationTypes.COLLECTION;
      (component.notificationData as CollectionNotificationData).collectionMessageData = {
        status: true,
        total_evidence: 1,
        collected_evidence: 1,
      };
      pluginService.getPluginRoute = jasmine.createSpy('getPluginRoute').and.returnValue('/some-route');
      const routerSpy = spyOn(router, 'navigate').and.callThrough();

      // Act
      component.navigateToPluginLogs();
      await fixture.whenStable();

      // Assert
      expect(routerSpy).toHaveBeenCalledTimes(2);
      expect(routerSpy.calls.allArgs()).toEqual([
        [[`/${AppRoutes.Plugins}`]],
        [
          [`/some-route`],
          { queryParams: { [RouteParams.plugin.tabQueryParamName]: RouteParams.plugin.logsQueryParamValue } },
        ],
      ]);
    });
  });

  describe('#navigateToEvidencePool', () => {
    it(`should call navigate method from pluginNavigationService`, async () => {
      // Arrange
      const collectionNotificationData = component.notificationData as CollectionNotificationData;
      const testPlugin: Service = {
        service_display_name: collectionNotificationData.service_display_name,
        service_id: collectionNotificationData.service_id,
      };

      // Act
      component.navigateToEvidencePool();
      await fixture.whenStable();

      // Assert
      expect(pluginNavigationService.redirectToEvidencePool).toHaveBeenCalledWith(testPlugin);
    });
  });
});
