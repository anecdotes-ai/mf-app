import { NavigationModel } from './../../models/navigation.model';
import { NavigationBarEventsTrackingService } from './../../services/navigation-bar-events-tracking.service';
import { CustomerFacadeService } from './../../../data/services/facades/customer-facade/customer-facade.service';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { WindowHelperService } from 'core';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { AppConfigService } from 'core/services/config/app.config.service';
import { VisibleForRoleDirective } from 'core/modules/directives';
import { AuthService, RoleService } from 'core/modules/auth-core/services';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { NavigationBarComponent } from './navigation-bar.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-first-route',
  template: '<p>Mock First Route Component</p>',
})
class MockFirstRouteComponent {}
@Component({
  selector: 'app-second-route',
  template: '<p>Mock Second Route Component</p>',
})
class MockSecondRouteComponent {}

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'route-1', component: MockFirstRouteComponent },
  { path: 'route-2', component: MockSecondRouteComponent },
];

describe('NavigationBarComponent', () => {
  configureTestSuite();

  let fixture: ComponentFixture<NavigationBarComponent>;
  let component: NavigationBarComponent;
  let roleService: RoleService;
  let windowHelperService: WindowHelperService;
  let router: Router;
  let authService: AuthService;
  let navigationBarEventsTrackingService: NavigationBarEventsTrackingService;

  let customerService: CustomerFacadeService;

  const roleToReturnFromRoleService = 'fake-role';

  async function detectChanges(): Promise<any> {
    fixture.detectChanges();
    await fixture.whenRenderingDone();
  }

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [NgbPopoverModule, RouterTestingModule.withRoutes(routes), TranslateModule.forRoot()],
      declarations: [NavigationBarComponent, VisibleForRoleDirective],
      providers: [
        { provide: RoleService, useValue: {} },
        { provide: WindowHelperService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: CustomerFacadeService, useValue: {} },
        { provide: UserEventService, useValue: {} },
        { provide: AppConfigService, useValue: {} },
      ],
    });
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    roleService = TestBed.inject(RoleService);
    authService = TestBed.inject(AuthService);
    customerService = TestBed.inject(CustomerFacadeService);
    customerService.getCurrentCustomer = jasmine.createSpy('getCurrentCustomer');
    roleService.getCurrentUserRole = jasmine
      .createSpy('getCurrentUserRole')
      .and.callFake(() => of({ role: roleToReturnFromRoleService }));
    authService.getUserAsync = jasmine.createSpy('getUserAsync').and.returnValue(of());
    authService.getUser = jasmine.createSpy('getUser').and.returnValue(of());
    windowHelperService = TestBed.inject(WindowHelperService);
    windowHelperService.openUrlInNewTab = jasmine.createSpy('openUrlInNewTab');
    fixture = TestBed.createComponent(NavigationBarComponent);
    component = fixture.componentInstance;
    router.initialNavigation();
    component.welcomePageRoute = 'fakeWelcomeRoute';

    navigationBarEventsTrackingService = TestBed.inject(NavigationBarEventsTrackingService);
    navigationBarEventsTrackingService.trackNavigationElementClick = jasmine.createSpy('navigationElementClick');

  });

  it('should be able to create component instance', () => {
    expect(component).toBeDefined();
  });

  describe('ngOnInit', () => {
    it('should call getUserAsync', async () => {
      // Arrange
      // Act
      await detectChanges();

      // Assert
      expect(authService.getUserAsync).toHaveBeenCalled();
    });

    it('should call getUserCache', async () => {
      // Arrange
      // Act
      await detectChanges();

      // Assert
      expect(authService.getUser).toHaveBeenCalled();
    });
  });

  describe('buildTranslationKey()', () => {
    it('should correctly build translation key', () => {
      // Arrange
      const relativeKey = 'some-key';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toEqual(`navigation.${relativeKey}`);
    });
  });

  describe('logo', () => {
    function getLogoWrapper(): DebugElement {
      return fixture.debugElement.query(By.css('.logo-wrapper'));
    }

    it('should be created', async () => {
      // Arrange
      // Act
      await detectChanges();

      // Assert
      expect(getLogoWrapper()).toBeTruthy();
    });

    describe('click on logo link ', () => {
      it('should contain welcome page href in logo link', async () => {
        // Arrange
        component.welcomePageRoute = 'fakeWelcomeRoute';
        const link = fixture.debugElement.query(By.css('a.logo-link')).nativeElement;

        // Act
        await detectChanges();

        // Assert
        expect((link as HTMLLinkElement).href).toContain(`${component.welcomePageRoute}`);
      });
    });
  });

  describe('onNavigationElementClick method', () => {
    it('should call trackNavigationElementClick', async () => {
      // Arrange
      const navigationItem: NavigationModel = {
        route: 'fakeRoute'
      };

      // Act
      component.onNavigationElementClick(navigationItem);

      // Assert
      expect(navigationBarEventsTrackingService.trackNavigationElementClick).toHaveBeenCalledWith(navigationItem);
    });
  });

  describe('initials resolve', () => {
    const testData = [
      {
        user: 'Some fake user',
        result: 'SF'
      },
      {
        user: 'Some user',
        result: 'SU'
      }
    ];

    testData.forEach(testItem => {
      it('should return appropriate initials', async () => {
        // Arrange
        authService.getUser = jasmine.createSpy('getUser').and.returnValue(of({ name: testItem.user }));

        // Act
        await detectChanges();
        const result = await component.userInitials$.pipe(take(1)).toPromise();

        // Assert
        expect(result).toEqual(testItem.result);
      });
    });
  });
});
