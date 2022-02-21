import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationEnd, NavigationExtras, Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ServiceTypeEnum } from 'core/modules/data/models/domain';
import { AppRoutes, ButtonComponent, ConnectivityNotificationData, RouteParams } from 'core';
import { NotificationTypes } from 'core/modules/data/models/notification-definition.model';
import { PluginService } from 'core/modules/data/services/plugin/plugin.service';
import { PluginNavigationService } from 'core/services/plugin-navigation-service/plugin-navigation-service.service';
import { configureTestSuite } from 'ng-bullet';
import { of, Subject } from 'rxjs';
import { ConnectivityNotificationComponent, ConnectivityStatus } from './connectivity-notification.component';
import { take } from 'rxjs/operators';

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

describe('ConnectivityNotificationComponent', () => {
  configureTestSuite();

  let component: ConnectivityNotificationComponent;
  let fixture: ComponentFixture<ConnectivityNotificationComponent>;
  let pluginService: PluginService;
  let router: Router;
  let pluginNavigationService: PluginNavigationService;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [ConnectivityNotificationComponent, ButtonComponent],
      providers: [
        { provide: PluginService, useValue: {} },
        { provide: Router, useClass: MockRouter },
        {
          provide: PluginNavigationService,
          useValue: {
            redirectToEvidence: jasmine.createSpy('redirectToEvidence'),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectivityNotificationComponent);
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
    } as ConnectivityNotificationData;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('host bindings', () => {
    beforeEach(() => {
      component.notificationData.notificationType = NotificationTypes.CONNECTIVITY;
      (component.notificationData as ConnectivityNotificationData).connectivityMessageData = {
        status: true,
      };

      spyOn(component, 'getConnectivityStatus').and.returnValue(ConnectivityStatus.UNKNOWN);
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
      spyOn(component, 'getConnectivityStatus').and.returnValue(ConnectivityStatus.UNKNOWN);
      component.notificationData.notificationType = NotificationTypes.CONNECTIVITY;
      (component.notificationData as ConnectivityNotificationData).connectivityMessageData = {
        status: true,
      };

      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      const icon = await component.serviceIcon$.pipe(take(1)).toPromise();

      // Assert
      expect(icon).toEqual('icon-link');
    });
  });

  describe('#resolveStatusIcon', () => {
    let connectivityStatus: ConnectivityStatus;

    beforeEach(() => {
      spyOn(component, 'getConnectivityStatus').and.callFake(() => connectivityStatus);
    });

    it('should return "status_not_started_bordered" if status is FAILED', () => {
      // Arrange
      connectivityStatus = ConnectivityStatus.FAILED;

      // Act
      const result = component.resolveStatusIcon();

      // Assert
      expect(result).toEqual('status_not_started_bordered');
    });

    it('should return empty string if status is anything else', () => {
      // Arrange
      connectivityStatus = ConnectivityStatus.UNKNOWN;

      // Act
      const result = component.resolveStatusIcon();

      // Assert
      expect(result).toEqual('');
    });
  });

  describe('#preClosing', () => {
    it('should emit closing with proper service_id', () => {
      // Arrange
      component.notificationData.notificationType = NotificationTypes.CONNECTIVITY;
      (component.notificationData as ConnectivityNotificationData).connectivityMessageData = {
        status: true,
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
      expect(actual).toEqual(`notifications.connectivity.${relativeKey}`);
    });
  });

  describe('#getConnectivityStatus', () => {
    let notificationData: ConnectivityNotificationData;

    beforeEach(() => {
      notificationData = {
        isInProgress: true,
        service_type: ServiceTypeEnum.GENERIC,
        service_id: 'some-service',
        service_display_name: 'some-service',
        displaySecondaryContent: false,
        notificationType: NotificationTypes.CONNECTIVITY,
        connectivityMessageData: {
          status: null,
        },
      };
    });

    it('should return SUCCESS status if success is true', () => {
      // Arrange
      notificationData.success = true;
      component.notificationData = notificationData;

      // Act
      const result = component.getConnectivityStatus();

      // Assert
      expect(result).toEqual(ConnectivityStatus.SUCCESS);
    });

    it('should return FAILED status if success is false', () => {
      // Arrange
      notificationData.success = false;
      component.notificationData = notificationData;

      // Act
      const result = component.getConnectivityStatus();

      // Assert
      expect(result).toEqual(ConnectivityStatus.FAILED);
    });

    it('should return UNKNOWN status if success is anything else', () => {
      // Arrange
      notificationData.success = null;
      component.notificationData = notificationData;

      // Act
      const result = component.getConnectivityStatus();

      // Assert
      expect(result).toEqual(ConnectivityStatus.UNKNOWN);
    });
  });

  describe('plugin logs notification display state', () => {
    const fakePluginRoute = 'fake-plugins-page-route';
    let expectedPluginRoute;

    beforeEach(() => {
      component.notificationData.notificationType = NotificationTypes.CONNECTIVITY;
      expectedPluginRoute = `${fakePluginRoute}/${component.notificationData.service_id}`;
      spyOn(component.closing, 'emit');
      pluginService.getPluginRoute = jasmine.createSpy('getPluginRoute').and.returnValue(expectedPluginRoute);
      (component.notificationData as ConnectivityNotificationData).connectivityMessageData = {
        status: true,
      };
    });

    describe('router emit NavigationEnd events', () => {
      const routerEventsSubject = new Subject();
      function createNavigationEnd(): NavigationEnd {
        const navigationEnd: any = {};
        navigationEnd.__proto__ = NavigationEnd;
        return navigationEnd;
      }

      describe('when notificationType is Connectivity, current route is plugin logs, isInProgress is false, success is false', () => {
        beforeEach(() => {
          component.notificationData.notificationType = NotificationTypes.CONNECTIVITY;
          component.notificationData.isInProgress = false;
          component.notificationData.success = false;
          (router as any).routerState = {
            events: routerEventsSubject,
            snapshot: {
              url: expectedPluginRoute,
              root: {
                url: expectedPluginRoute,
                queryParams: {
                  [RouteParams.plugin.tabQueryParamName]: RouteParams.plugin.logsQueryParamValue,
                },
              },
            },
          };
          component.ngOnChanges({
            notificationData: new SimpleChange(null, component.notificationData, true),
          });
          fixture.detectChanges();
        });

        it('should emit closing event', () => {
          // Arrange
          // Act
          routerEventsSubject.next(createNavigationEnd());

          // Assert
          expect(component.closing.emit).toHaveBeenCalled();
        });

        it('should set "hidden" class for host element', async () => {
          // Arrange
          // Act
          routerEventsSubject.next(createNavigationEnd());
          fixture.detectChanges();
          await fixture.whenStable();

          // Assert
          expect(fixture.debugElement.classes['hidden']).toBeTruthy();
        });
      });

      it('should emit closing event when notificationType is not Connectivity', () => {
        // Arrange
        component.notificationData.notificationType = 3;

        // Act
        routerEventsSubject.next(createNavigationEnd());

        // Assert
        expect(component.closing.emit).not.toHaveBeenCalled();
      });

      it('should not emit closing event when current route is not plugin logs', () => {
        // Arrange
        (router as any).routerState = {
          snapshot: {
            url: 'some-fake-url',
            root: {
              url: 'some-fake-url',
              queryParams: {},
            },
          },
        };

        // Act
        routerEventsSubject.next(createNavigationEnd());

        // Assert
        expect(component.closing.emit).not.toHaveBeenCalled();
      });

      it('should not emit closing event when isInProgress is true', () => {
        // Arrange
        component.notificationData.isInProgress = true;

        // Act
        routerEventsSubject.next(createNavigationEnd());

        // Assert
        expect(component.closing.emit).not.toHaveBeenCalled();
      });

      it('should emit closing event when success is true', () => {
        // Arrange
        component.notificationData.success = true;

        // Act
        routerEventsSubject.next(createNavigationEnd());

        // Assert
        expect(component.closing.emit).not.toHaveBeenCalled();
      });
    });

    describe('notificationData gets changed', () => {
      describe('when notificationType is Connectivity, current route is plugin logs, isInProgress is false, success is false', () => {
        beforeEach(() => {
          component.notificationData.notificationType = NotificationTypes.CONNECTIVITY;
          component.notificationData.isInProgress = false;
          component.notificationData.success = false;
          (router as any).routerState = {
            snapshot: {
              url: expectedPluginRoute,
              root: {
                url: expectedPluginRoute,
                queryParams: {
                  [RouteParams.plugin.tabQueryParamName]: RouteParams.plugin.logsQueryParamValue,
                },
              },
            },
          };
        });

        it('should emit closing event', () => {
          // Arrange
          // Act
          component.ngOnChanges({
            notificationData: new SimpleChange(null, component.notificationData, true),
          });

          // Assert
          expect(component.closing.emit).toHaveBeenCalled();
        });

        it('should set "hidden" class for host element', async () => {
          // Arrange
          // Act
          component.ngOnChanges({
            notificationData: new SimpleChange(null, component.notificationData, true),
          });
          fixture.detectChanges();
          await fixture.whenStable();

          // Assert
          expect(fixture.debugElement.classes['hidden']).toBeTruthy();
        });
      });

      it('should emit closing event when notificationType is not Connectivity', () => {
        // Arrange
        component.notificationData.notificationType = 3;

        // Act
        component.ngOnChanges({
          notificationData: new SimpleChange(null, component.notificationData, true),
        });

        // Assert
        expect(component.closing.emit).not.toHaveBeenCalled();
      });

      it('should not emit closing event when current route is not plugin logs', () => {
        // Arrange
        (router as any).routerState = {
          snapshot: {
            url: 'some-fake-url',
            root: {
              url: 'some-fake-url',
              queryParams: {},
            },
          },
        };

        // Act
        component.ngOnChanges({
          notificationData: new SimpleChange(null, component.notificationData, true),
        });

        // Assert
        expect(component.closing.emit).not.toHaveBeenCalled();
      });

      it('should not emit closing event when isInProgress is true', () => {
        // Arrange
        component.notificationData.isInProgress = true;

        // Act
        component.ngOnChanges({
          notificationData: new SimpleChange(null, component.notificationData, true),
        });

        // Assert
        expect(component.closing.emit).not.toHaveBeenCalled();
      });

      it('should emit closing event when success is true', () => {
        // Arrange
        component.notificationData.success = true;

        // Act
        component.ngOnChanges({
          notificationData: new SimpleChange(null, component.notificationData, true),
        });

        // Assert
        expect(component.closing.emit).not.toHaveBeenCalled();
      });
    });
  });

  describe('#navigateToPluginLogs button', () => {
    it(`should navigate to /${AppRoutes.Plugins} and then to plugin logs`, async () => {
      // Arrange
      component.notificationData.notificationType = NotificationTypes.CONNECTIVITY;
      (component.notificationData as ConnectivityNotificationData).connectivityMessageData = {
        status: true,
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

    it('should emit "closing" event', () => {
      // Arrange
      spyOn(component.closing, 'emit');

      // Act
      component.navigateToPluginLogs();

      // Assert
      expect(component.closing.emit).toHaveBeenCalled();
    });

    it('should call navigateToPluginLogs when failed phase button is pressed', () => {
      // Arrange
      component.getConnectivityStatus = jasmine
        .createSpy('getConnectivityStatus')
        .and.returnValue(ConnectivityStatus.FAILED);
      component.navigateToPluginLogs = jasmine.createSpy('navigateToPluginLogs');
      component.notificationData.displaySecondaryContent = true;

      // Act
      fixture.detectChanges();
      fixture.debugElement.query(By.css('.secondary-content app-button')).triggerEventHandler('click', {});

      // Assert
      expect(component.navigateToPluginLogs).toHaveBeenCalled();
    });
  });

  describe('HTML elements display', () => {
    beforeEach(() => {
      component.getConnectivityStatus = jasmine.createSpy('getConnectivityStatus').and.returnValue(jasmine.any);
    });

    it('should display secondary-content-wrapper when displaySecondaryContent is true', () => {
      // Arrange
      component.notificationData.displaySecondaryContent = true;

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.debugElement.query(By.css('.secondary-content-wrapper'))).toBeTruthy();
    });

    it('should not display secondary-content-wrapper when displaySecondaryContent is false', () => {
      // Arrange
      component.notificationData.displaySecondaryContent = false;

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.debugElement.query(By.css('.secondary-content-wrapper'))).toBeFalsy();
    });
  });
});
