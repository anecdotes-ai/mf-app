import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { RoleService } from 'core/modules/auth-core/services';
import { ModalWindowService } from 'core/modules/modals';
import { RoleEnum, User } from 'core/modules/auth-core/models/domain';
import { configureTestSuite } from 'ng-bullet';
import { UserManagementHeaderComponent } from './user-management-header.component';
import { VisibleForRoleDirective } from 'core/modules/directives';
import { of } from 'rxjs/internal/observable/of';

describe('UserManagementHeaderComponent', () => {
  configureTestSuite();

  let component: UserManagementHeaderComponent;
  let fixture: ComponentFixture<UserManagementHeaderComponent>;
  let roleService: RoleService;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [UserManagementHeaderComponent, VisibleForRoleDirective],
      providers: [
        { provide: ModalWindowService, useValue: {} },
        { provide: RoleService, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementHeaderComponent);
    component = fixture.componentInstance;

    roleService = TestBed.inject(RoleService);
    roleService.getCurrentUserRole = jasmine
      .createSpy('getCurrentUserRole')
      .and.callFake(() => of({ role: RoleEnum.Auditor }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#buildTranslationKey', () => {
    it(`should create expected translation key for this component`, async () => {
      // Arrange
      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      const resultTranslationKey = component.buildTranslationKey('test');

      // Assert
      expect(resultTranslationKey).toEqual('userManagement.header.test');
    });
  });

  describe('#searchData', () => {
    it(`modifiedDataList should emit passed data`, async () => {
      // Arrange
      const testData: User[] = [
        {
          email: 'testOne',
        },
        {
          email: 'testTwo',
        },
      ];

      spyOn(component.modifiedDataList, 'emit');
      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      component.searchData(testData);

      // Assert
      expect(component.modifiedDataList.emit).toHaveBeenCalledWith(testData);
    });
  });

  describe('invite auditors button', () => {
    function getInviteUserBtn(): DebugElement {
      return fixture.debugElement.query(By.css('app-button.invite-user-btn'));
    }

    describe('when user role is Admin', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(UserManagementHeaderComponent);
        component = fixture.componentInstance;
        roleService = TestBed.inject(RoleService);
        roleService.getCurrentUserRole = jasmine
          .createSpy('getCurrentUserRole')
          .and.callFake(() => of({ role: RoleEnum.Admin }));
      });

      it('should be rendered', async () => {
        // Act
        fixture.detectChanges();
        await fixture.whenStable();

        // Assert
        expect(getInviteUserBtn()).toBeTruthy();
      });

      it('should emit inviteAuditors event when click event is dispatched', async () => {
        // Arrange
        spyOn(component.inviteUser, 'emit');

        // Act
        fixture.detectChanges();
        await fixture.whenStable();
        getInviteUserBtn().nativeElement.dispatchEvent(new MouseEvent('click'));

        // Assert
        expect(component.inviteUser.emit).toHaveBeenCalled();
      });
    });

    it('should not be rendered if user is not Admin', async () => {
      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(getInviteUserBtn()).toBeFalsy();
    });
  });
});
