import { PluginStaticStateComponent } from './../../plugin-connection-states/plugin-static-state/plugin-static-state.component';
import { ServiceStatusEnum } from 'core/modules/data/models/domain';
import { configureTestSuite } from 'ng-bullet';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterExtensionService, WindowHelperService } from 'core/services';
import { UserEventDirective } from 'core/modules/directives';
import { PluginOauthConnectionComponent } from './plugin-oauth-connection.component';
import { OAuthUrlHandlerService, PluginConnectionFacadeService } from '../../../services';
import { Subject } from 'rxjs';
import { PluginConnectionStates, PluginConnectionStaticStateSharedContext } from '../../../models';
import { Directive } from '@angular/core';
import { PluginStaticStateBaseComponent } from '../../plugin-connection-states/plugin-static-state-base/plugin-static-state-base.component';

@Directive({
  selector: '[componentsToSwitch]',
  exportAs: 'switcher',
})
class MockSwitcherDir {
  public sharedContext$ = new Subject<PluginConnectionStaticStateSharedContext>();

  goById = jasmine.createSpy('goById');
}

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

describe('PluginOauthConnectionComponent', () => {
  configureTestSuite();

  let componentUnderTest: PluginOauthConnectionComponent;
  let fixture: ComponentFixture<PluginOauthConnectionComponent>;
  let switcher: MockSwitcherDir;
  let activatedRoute: ActivatedRoute;
  let pluginConnectionFacade: PluginConnectionFacadeService;

  let params: Subject<Params>;

  let testService = {
    service_id: 'testService',
    service_auth_url: 'testURL',
  };

  beforeAll(async () => {
    params = new Subject<Params>();
    await TestBed.configureTestingModule({
      declarations: [
        PluginOauthConnectionComponent,
        UserEventDirective,
        PluginStaticStateBaseComponent,
        PluginStaticStateComponent,
      ],
      providers: [
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: {}, queryParams: {} },
            queryParams: params,
          },
        },
        { provide: RouterExtensionService, useValue: {} },
        { provide: ComponentSwitcherDirective, useClass: MockSwitcherDir },
        { provide: WindowHelperService, useValue: {} },
        { provide: OAuthUrlHandlerService, useValue: {} },
        { provide: PluginConnectionFacadeService, useValue: {} },
      ],
      imports: [TranslateModule.forRoot(), RouterTestingModule],
    }).compileComponents();
  });

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginOauthConnectionComponent);
    componentUnderTest = fixture.componentInstance;

    switcher = TestBed.inject(ComponentSwitcherDirective) as any;
    activatedRoute = TestBed.inject(ActivatedRoute);
    pluginConnectionFacade = TestBed.inject(PluginConnectionFacadeService);
    pluginConnectionFacade.connectPlugin = jasmine.createSpy('connectPlugin');
    pluginConnectionFacade.reconnectPlugin = jasmine.createSpy('reconnectPlugin');
    pluginConnectionFacade.setState = jasmine.createSpy('setState');

    fixture.detectChanges();
  });

  it('should create', async () => {
    // Act
    await detectChanges();

    // Assert
    expect(componentUnderTest).toBeTruthy();
  });
  
  // Has to be fixed

  // describe('Life circle hooks', () => {
  //   const testParams = { anyParam: 'asdasd' };

  //   describe('NgOnInit', () => {
  //     it('should set service to the property', async () => {
  //       // Arrange
  //       switcher.sharedContext$.next({ service: testService });

  //       // Act
  //       await detectChanges();

  //       // Assert
  //       expect(componentUnderTest.service).toBe(testService);
  //     });

  //     it('should not handle error param if exist', async () => {
  //       // Arrange
  //       activatedRoute.snapshot = { queryParams: { anyOther: 'adsasdas' } } as any;
  //       switcher.sharedContext$.next({ service: testService });

  //       // Act
  //       await detectChanges();

  //       // Assert
  //       expect(pluginConnectionFacade.setState).not.toHaveBeenCalled();
  //     });

  //     it('should handle url error param if exist', async () => {
  //       // Arrange
  //       activatedRoute.snapshot = { queryParams: { error: 'adsasdas' } } as any;
  //       switcher.sharedContext$.next({ service: testService });

  //       // Act
  //       await detectChanges();

  //       // Assert
  //       expect(pluginConnectionFacade.setState).toHaveBeenCalledWith(
  //         testService.service_id,
  //         PluginConnectionStates.ExternalApprovalError
  //       );
  //     });
  //   });

  //   describe('NgAfterViewInit', () => {
  //     it(`should handle plugin connection regarding to current query parameters if service ${ServiceStatusEnum.REMOVED}`, async () => {
  //       // Arrange
  //       switcher.sharedContext$.next({ service: { ...testService, service_status: ServiceStatusEnum.REMOVED } });
  //       params.next(testParams);

  //       // Act
  //       await detectChanges();

  //       // Assert
  //       expect(pluginConnectionFacade.connectPlugin).toHaveBeenCalledWith(componentUnderTest.service, testParams);
  //     });

  //     it(`should handle plugin reconnect regarding to current query parameters if service is not in ${ServiceStatusEnum.REMOVED} status`, async () => {
  //       // Arrange
  //       switcher.sharedContext$.next({
  //         service: { ...testService, service_status: ServiceStatusEnum.INSTALLATIONFAILED },
  //       });
  //       params.next(testParams);

  //       // Act
  //       await detectChanges();

  //       // Assert
  //       expect(pluginConnectionFacade.reconnectPlugin).toHaveBeenCalledWith(componentUnderTest.service, testParams);
  //     });

  //     it(`should handle plugin connect regarding to current query parameters if service status is undefined`, async () => {
  //       // Arrange
  //       switcher.sharedContext$.next({ service: { ...testService, service_status: undefined } });
  //       params.next(testParams);

  //       // Act
  //       await detectChanges();

  //       // Assert
  //       expect(pluginConnectionFacade.connectPlugin).toHaveBeenCalledWith(componentUnderTest.service, testParams);
  //     });
  //   });
  // });
});
