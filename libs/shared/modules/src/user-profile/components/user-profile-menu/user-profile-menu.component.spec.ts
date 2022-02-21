import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { RoleService, AuthService } from 'core/modules/auth-core/services';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { of } from 'rxjs';
import { KeepTooltipOrPopoverOnHoverDirective, VisibleForRoleDirective } from 'core/modules/directives';
import { UserProfileMenuComponent } from './user-profile-menu.component';
import { UserClaims } from 'core/modules/auth-core/models';
import { AppConfigService } from 'core/services/config/app.config.service';
import { WindowHelperService } from 'core';

describe('UserProfileMenuComponent', () => {
  let fixture: ComponentFixture<UserProfileMenuComponent>;
  let component: UserProfileMenuComponent;
  let authService: AuthService;
  let roleService: RoleService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbPopoverModule, TranslateModule.forRoot(), RouterTestingModule],
      providers: [
        {
          provide: AuthService,
          useValue: { getUserAsync: () => Promise.resolve({ email: 'user@example.com' }) },
        },
        WindowHelperService,
        { provide: RoleService, useValue: {} },
        { provide: AppConfigService, useValue: {} },
      ],
      declarations: [UserProfileMenuComponent, KeepTooltipOrPopoverOnHoverDirective, VisibleForRoleDirective],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileMenuComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService);
    authService.signOutAsync = jasmine.createSpy('signOut');
    authService.getUser = jasmine.createSpy('getUser').and.returnValue(of({ email: 'user@example.com', name: 'user' }));

    roleService = TestBed.inject(RoleService);
    roleService.getCurrentUserRole = jasmine
      .createSpy('getCurrentUserRole')
      .and.callFake(() => of({ role: RoleEnum.Admin }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should correctly get current user and show it in popover', async () => {
      // Arrange

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      const user = await component.currentUser$;
      expect(user).toEqual({ email: 'user@example.com' } as UserClaims);
    });
  });

  describe('#logoMouseEnter', () => {
    it('should open popover on logo mouse enter', async () => {
      // Arrange
      const shadowRoot = fixture.debugElement.nativeElement;
      const userLogo = fixture.debugElement.query(By.css('#user-logo'));

      // Act
      userLogo.nativeElement.dispatchEvent(new Event('mouseenter')); // entering logo

      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(shadowRoot.querySelector('.popover')).toBeTruthy();
    });
  });

  describe('#logoMouseLeave', () => {
    it('should keep popover 100ms on logo mouse leave and then close', fakeAsync(() => {
      // Arrange
      const shadowRoot = fixture.debugElement.nativeElement;
      const userLogo = fixture.debugElement.query(By.css('#user-logo'));
      userLogo.nativeElement.dispatchEvent(new Event('mouseenter')); // popover opened

      // Act
      userLogo.nativeElement.dispatchEvent(new Event('mouseleave')); // leaving logo
      tick(50);
      fixture.detectChanges();

      // Assert
      expect(shadowRoot.querySelector('.popover')).toBeTruthy();

      // Act
      tick(50);
      fixture.detectChanges();

      // Assert
      expect(shadowRoot.querySelector('.popover')).toBeFalsy();
    }));
  });

  describe('#popupMouseEnter', () => {
    it('should keep popover opened on popover mouse enter', fakeAsync(() => {
      // Arrange
      const shadowRoot = fixture.debugElement.nativeElement;
      const userLogo = fixture.debugElement.query(By.css('#user-logo'));
      userLogo.nativeElement.dispatchEvent(new Event('mouseenter')); // popover opened

      // Act
      tick(50);
      const popover = shadowRoot.querySelector('.popover-container');
      popover.dispatchEvent(new Event('mouseenter')); // entering popover
      tick(50);
      fixture.detectChanges();

      // Assert
      expect(shadowRoot.querySelector('.popover')).toBeTruthy();
    }));
  });

  describe('#popupMouseLeave', () => {
    it('should keep popover 100ms on popover mouse leave and then close', fakeAsync(() => {
      // Arrange
      const shadowRoot = fixture.debugElement.nativeElement;
      const userLogo = fixture.debugElement.query(By.css('#user-logo'));
      userLogo.nativeElement.dispatchEvent(new Event('mouseenter')); // popover opened

      // Act
      fixture.detectChanges();
      const popover = shadowRoot.querySelector('.popover-container');
      userLogo.nativeElement.dispatchEvent(new Event('mouseleave')); // leaving logo
      popover.dispatchEvent(new Event('mouseenter')); // entering popover
      popover.dispatchEvent(new Event('mouseleave')); // leaving popover

      tick(50);
      fixture.detectChanges();

      // Assert
      expect(shadowRoot.querySelector('.popover')).toBeTruthy();

      // Act
      tick(50);
      fixture.detectChanges();

      // Assert
      expect(shadowRoot.querySelector('.popover')).toBeFalsy();
    }));
  });

  describe('#logout', () => {
    it('should log out on log out menu item click', async () => {
      // Arrange
      const userLogo = fixture.debugElement.query(By.css('#user-logo'));
      userLogo.nativeElement.dispatchEvent(new Event('mouseenter')); // popover opened

      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      const logOutLink = fixture.debugElement.query(By.css('#logOut'));
      logOutLink.nativeElement.click();

      // Assert
      expect(authService.signOutAsync).toHaveBeenCalled();
    });
  });
});
