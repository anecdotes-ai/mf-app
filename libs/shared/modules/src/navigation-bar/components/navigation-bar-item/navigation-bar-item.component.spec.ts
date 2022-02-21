import { VisibleForRoleDirective } from './../../../directives/visible-for-role/visible-for-role.directive';
import { RoleService } from './../../../auth-core/services/role/role.service';
import { NavigationModel } from './../../models';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationBarItemComponent } from './navigation-bar-item.component';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';
import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { NavigationBarEventsTrackingService } from 'core/modules/navigation-bar/services/navigation-bar-events-tracking.service';

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

describe('NavigationBarItemComponent', () => {
  configureTestSuite();

  let location: Location;
  let component: NavigationBarItemComponent;
  let fixture: ComponentFixture<NavigationBarItemComponent>;
  let roleService: RoleService;
  let firstRoute: NavigationModel;
  let secondRoute: NavigationModel;
  let navigationBarEventsService: NavigationBarEventsTrackingService;

  const roleToReturnFromRoleService = 'fake-role1';

  function getLink(): HTMLLinkElement {
    return fixture.debugElement.query(By.css('a.nav-link'))?.nativeElement;
  }

  function getBlock(): HTMLLinkElement {
    return fixture.debugElement.query(By.css('div.nav-link'))?.nativeElement;
  }

  function getSubMenu(): HTMLLinkElement {
    return fixture.debugElement.query(By.css('.sub-menu'))?.nativeElement;
  }

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavigationBarItemComponent, VisibleForRoleDirective],
      providers: [{ provide: RoleService, useValue: {} }, { provide: NavigationBarEventsTrackingService, useValue: {} }],
      imports: [RouterTestingModule.withRoutes(routes), TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationBarItemComponent);
    component = fixture.componentInstance;
    roleService = TestBed.inject(RoleService);
    location = TestBed.inject(Location);
    roleService.getCurrentUserRole = jasmine
      .createSpy('getCurrentUserRole')
      .and.callFake(() => of({ role: roleToReturnFromRoleService }));
    firstRoute = {
      route: 'route-1',
      key: 'route-1',
      icon: 'icon-1',
      visibleFor: [roleToReturnFromRoleService],
    };

    secondRoute = {
      route: 'route-2',
      key: 'route-2',
      icon: 'icon-2',
      visibleFor: ['fake-role2'],
    };

    navigationBarEventsService = TestBed.inject(NavigationBarEventsTrackingService);
    navigationBarEventsService.trackNavigationElementClick = jasmine.createSpy('trackNavigationElementClick');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  describe('routes rendering', () => {
    it('should render role if current user role is defined in visibleFor', async () => {
      // Arrange
      component.item = firstRoute;

      // Act
      await detectChanges();

      // Assert
      const routeLink = getLink();

      expect(routeLink).toBeTruthy();
      expect(routeLink.href).toContain(`/${firstRoute.route}`);
    });

    it('should not render role if current user role is not defined in visibleFor', async () => {
      // Arrange
      component.item = secondRoute;

      // Act
      await detectChanges();

      // Assert
      const routeLink = getLink();

      expect(routeLink).toBeFalsy();
    });
  });

  describe('template logic', () => {
    it('should render block instead of link when no route defined in item', async () => {
      // Arrange
      component.item = {
        key: 'route-1',
        icon: 'icon-1',
        visibleFor: [roleToReturnFromRoleService],
      };

      // Act
      await detectChanges();
      const routeBlock = getBlock();

      // Assert
      expect(routeBlock).toBeTruthy();
    });

    describe('sub menu ', () => {
      it('should display submenu on hover when item have menu action', async () => {
        // Arrange
        component.item = {
          route: 'route-1',
          key: 'route-1',
          icon: 'icon-1',
          visibleFor: [roleToReturnFromRoleService],
          menuActions: [
            {
              translationKey: 'menuActionKey1',
              icon: 'icon1',
            },
            {
              translationKey: 'menuActionKey2',
              icon: 'icon2',
            },
          ],
        };

        // Act
        await detectChanges();
        const routeLink = getLink();
        routeLink.dispatchEvent(new MouseEvent('mouseenter'));
        await detectChanges();

        // Assert
        expect(getSubMenu()).toBeTruthy();
      });
    });
  });

  describe('navigation', () => {
    it('should perform route change on link click', async () => {
      // Arrange
      component.item = firstRoute;

      // Act
      await detectChanges();
      const routeLink = getLink();

      routeLink.click();
      await detectChanges();

      // Assert
      expect(location.path()).toBe('/route-1');
    });
  });

  describe('disabled navigation item', () => {
    it('should add class disabled if isDisabled true', async () => {
      // Arrange
      component.isDisabled = true;

      // Act
      await fixture.detectChanges();

      // Assert
      expect(fixture.debugElement.nativeElement.classList.contains('disabled')).toBeTrue();
    });

    it('should NOT add class disabled if isDisabled false', async () => {
      // Arrange
      component.isDisabled = false;

      // Act
      await fixture.detectChanges();

      // Assert
      expect(fixture.debugElement.nativeElement.classList.contains('disabled')).toBeFalse();
    });
  });

  describe('nav item click', () => {
    it('should call trackNavigationElementClick method', async () => {
      // Arrange
      component.item = { key: 'some-source', menuActions: [{translationKey: 'some-key'}]};
      fixture.detectChanges();

      // Act
      component.onNavigationElementClick(component.item.menuActions[0]);

      // Assert
      expect(navigationBarEventsService.trackNavigationElementClick).toHaveBeenCalledWith({route: 'some-source/some-key'});
    });
  });
});
