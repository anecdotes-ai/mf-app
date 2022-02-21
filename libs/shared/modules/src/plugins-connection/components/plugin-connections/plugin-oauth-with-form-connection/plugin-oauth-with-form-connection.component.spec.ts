import { Service } from 'core/modules/data/models/domain';
import { PluginConnectionStaticStateSharedContext } from './../../../models/plugin-static-content.model';
import { PluginConnectionFacadeService } from 'core/modules/plugins-connection/services/facades/plugin-connection-facade/plugin-connection-facade.service';
import { OAuthUrlHandlerService } from '../../../services';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';
import { RouterExtensionService } from 'core/services/router-extension/router-extension.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';

import {
  PluginOauthWithFormConnectionComponent,
  SessionStorageKeys,
} from './plugin-oauth-with-form-connection.component';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { Subject } from 'rxjs';
import { Directive } from '@angular/core';
import { PluginConnectionStates } from '../../../models';
import { PluginFacadeService } from 'core/modules/data/services/facades';

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

describe('PluginOauthWithFormConnectionComponent', () => {
  let component: PluginOauthWithFormConnectionComponent;
  let fixture: ComponentFixture<PluginOauthWithFormConnectionComponent>;
  let switcher: MockSwitcherDir;
  let testService: Service;
  let activatedRoute: ActivatedRoute;
  let windowHelper: WindowHelperService;
  let urlHandlerService: OAuthUrlHandlerService;
  let pluginConnectionFacade: PluginConnectionFacadeService;

  let params: Subject<Params>;

  beforeEach(async () => {
    params = new Subject<Params>();
    await TestBed.configureTestingModule({
      declarations: [PluginOauthWithFormConnectionComponent],
      providers: [
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: {}, queryParams: {} },
            queryParams: params,
          },
        },
        { provide: PluginFacadeService, useValue: {} },
        { provide: RouterExtensionService, useValue: {} },
        { provide: ComponentSwitcherDirective, useClass: MockSwitcherDir },
        WindowHelperService,
        {
          provide: OAuthUrlHandlerService,
          useValue: {},
        },
        {
          provide: PluginConnectionFacadeService,
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginOauthWithFormConnectionComponent);
    switcher = TestBed.inject(ComponentSwitcherDirective) as any;
    activatedRoute = TestBed.inject(ActivatedRoute);
    windowHelper = TestBed.inject(WindowHelperService);
    urlHandlerService = TestBed.inject(OAuthUrlHandlerService);
    pluginConnectionFacade = TestBed.inject(PluginConnectionFacadeService);

    testService = {
      service_id: 'testService',
      service_auth_url: 'testURL',
    };

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should create', async () => {
    // Act
    await detectChanges();

    // Assert
    expect(component).toBeTruthy();
  });

  // Has to be fixed
  // describe('Life cicle hooks', () => {
  //   describe('OnInit', () => {
  //     beforeEach(() => {
  //       pluginConnectionFacade.setState = jasmine.createSpy('setState');
  //     });

  //     it('should save Service data from switcher context', async () => {
  //       // Arrange
  //       switcher.sharedContext$.next({ service: testService });

  //       // Act
  //       await detectChanges();

  //       // Assert
  //       expect(component.service).toBe(testService);
  //     });

  //     it('should not handle error param if exist', async () => {
  //       // Arrange
  //       activatedRoute.snapshot = { queryParams: { anyOther: 'adsasdas' } } as any;
  //       switcher.sharedContext$.next({ service: testService });

  //       // Act
  //       await detectChanges();

  //       // Assert
  //       expect(pluginConnectionFacade.setState).not.toHaveBeenCalledWith(
  //         testService.service_id,
  //         PluginConnectionStates.ExternalApprovalError
  //       );
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
  // });

  // describe('installationHandler', () => {
  //   beforeEach(() => {
  //     switcher.sharedContext$.next({ service: testService });

  //     window.sessionStorage.setItem = jasmine.createSpy('setItem');
  //     windowHelper.getWindow = jasmine.createSpy('getWindow').and.returnValue(window);

  //     urlHandlerService.modifyRedirectUri = jasmine.createSpy('modifyRedirectUri');
  //   });

  //   it('should set form data to storage', async () => {
  //     // Arrange
  //     await detectChanges();
  //     const allValues = { first: 'a', second: 'b' };
  //     const dirtyValues = { first: 'a' };

  //     // Act
  //     component.installationHandler({ allValues, dirtyValues });

  //     // Assert
  //     expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
  //       SessionStorageKeys.AllFormValues,
  //       JSON.stringify(allValues)
  //     );

  //     expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
  //       SessionStorageKeys.DirtyFormValues,
  //       JSON.stringify(dirtyValues)
  //     );
  //   });

  //   it('should interpolate auth url correctly and call modifyRedirectUri with interpolated url', async () => {
  //     // Arrange
  //     const valueToSetKey = 'valueToSet';
  //     const expectValueToSet = 'someValueToBeSet';
  //     testService.service_auth_url = `testURL-{${valueToSetKey}}`;

  //     switcher.sharedContext$.next({ service: testService });

  //     await detectChanges();
  //     const allValues = { [valueToSetKey]: expectValueToSet, second: 'b' };
  //     const dirtyValues = { first: 'a' };

  //     // Act
  //     component.installationHandler({ allValues, dirtyValues });

  //     // Assert
  //     expect(urlHandlerService.modifyRedirectUri).toHaveBeenCalledWith(`testURL-${expectValueToSet}`);
  //   });
  // });

  // describe('Listener for routes param', () => {
  //   beforeEach(() => {
  //     pluginConnectionFacade.reconnectPlugin = jasmine.createSpy('reconnectPlugin').and.returnValue(window);
  //     pluginConnectionFacade.connectPlugin = jasmine.createSpy('connectPlugin').and.returnValue(window);
  //   });

  //   it('should call connect method from pluginConnectionFacade if is install plugin redirection and service is uninstalled', async () => {
  //     // Arrange
  //     switcher.sharedContext$.next({ service: testService });
  //     params.next({ code: 'asdasdadas' });

  //     // Act
  //     await detectChanges();

  //     // Assert
  //     expect(component.service).toBe(testService);
  //   });

  //   it('should call connect method from pluginConnectionFacade if is install plugin redirection and service is uninstalled', async () => {
  //     // Arrange
  //     const removedService: Service = { ...testService, service_status: 'SERVICE_REMOVED' };
  //     const testFormValues = { first: 'aaaa' };
  //     const paramsIncome = { code: 'asdasdadas' };

  //     window.sessionStorage.getItem = jasmine.createSpy('getItems').and.returnValue(JSON.stringify(testFormValues));
  //     switcher.sharedContext$.next({ service: removedService });
  //     params.next(paramsIncome);

  //     // Act
  //     await detectChanges();

  //     // Assert
  //     const expectedSecrets = { ...testFormValues, ...paramsIncome };
  //     expect(pluginConnectionFacade.connectPlugin).toHaveBeenCalledWith(removedService, expectedSecrets);
  //   });

  //   it('should call reconnect method from pluginConnectionFacade if is install plugin redirection and service is uninstalled', async () => {
  //     // Arrange
  //     const removedService: Service = { ...testService, service_status: 'SERVICE_INSTALLED' };
  //     const testFormValues = { first: 'aaaa' };
  //     const paramsIncome = { code: 'asdasdadas' };

  //     window.sessionStorage.getItem = jasmine.createSpy('getItems').and.returnValue(JSON.stringify(testFormValues));
  //     switcher.sharedContext$.next({ service: removedService });
  //     params.next(paramsIncome);

  //     // Act
  //     await detectChanges();

  //     // Assert
  //     const expectedSecrets = { ...testFormValues, ...paramsIncome };
  //     expect(pluginConnectionFacade.reconnectPlugin).toHaveBeenCalledWith(removedService, expectedSecrets);
  //   });

  //   it('should remove form data from storage', async () => {
  //     // Arrange

  //     window.sessionStorage.removeItem = jasmine.createSpy('removeItemsFromStorage');
  //     windowHelper.getWindow = jasmine.createSpy('getWindow').and.returnValue(window);
  //     switcher.sharedContext$.next({ service: testService });
  //     params.next({ code: 'asdasdadas' });

  //     // Act
  //     await detectChanges();

  //     // Assert
  //     expect(window.sessionStorage.removeItem).toHaveBeenCalledWith(SessionStorageKeys.AllFormValues);
  //     expect(window.sessionStorage.removeItem).toHaveBeenCalledWith(SessionStorageKeys.DirtyFormValues);
  //   });
  // });
});
