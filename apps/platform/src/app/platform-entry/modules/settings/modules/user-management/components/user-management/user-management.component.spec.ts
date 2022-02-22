import { InviteUserModalService } from 'core/modules/invite-user/services/invite-user-modal/invite-user-modal.service';
import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MessageBusService, SearchMessageBusMessages } from 'core';
import { RoleEnum, User } from 'core/modules/auth-core/models/domain';
import { UserFacadeService } from 'core/modules/auth-core/services';
import { reducers } from 'core/modules/data/store';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { UserManagementComponent } from './user-management.component';

const routerMock = {
  navigate: jasmine.createSpy('navigate'),
};

@Component({
  selector: 'app-new-button',
  template: ``
})
class MockButtonComponent {}

describe('UserManagementComponent', () => {
  configureTestSuite();

  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;

  let mockStoreInstance: MockStore;
  let mockStoreDispatchSpy: jasmine.Spy<jasmine.Func>;
  let userFacadeService: UserFacadeService;
  let messageBusService: MessageBusService;
  let fakeUsers: User[];

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserManagementComponent, MockButtonComponent],
      imports: [StoreModule.forRoot(reducers), TranslateModule.forRoot()],
      providers: [
        MessageBusService,
        provideMockStore(),
        { provide: UserFacadeService, useValue: {} },
        { provide: Router, useValue: routerMock },
        InviteUserModalService
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    mockStoreInstance = TestBed.inject(MockStore);
    messageBusService = TestBed.inject(MessageBusService);
    userFacadeService = TestBed.inject(UserFacadeService);
    fakeUsers = [
      {
        email: 'testEmail',
        role: RoleEnum.Admin,
      },
      {
        email: 'testEmail2',
        role: RoleEnum.Auditor,
      },
    ];
    userFacadeService.getUsers = jasmine.createSpy('getUsers').and.callFake(() => of(fakeUsers));
    mockStoreDispatchSpy = spyOn(mockStoreInstance, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#afterViewInit', () => {
    it(`should hide loader`, async () => {
      // Arrange
      spyOn(component.isLoading$, 'next');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(component.isLoading$.next).toHaveBeenCalledWith(false);
    });
  });

  describe('#resetUsersFiltration', () => {
    it(`should send ${SearchMessageBusMessages.CLEAR_SEARCH} message through the message bus service`, async () => {
      // Arrange
      spyOn(messageBusService, 'sendMessage');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      component.resetUsersFiltration();

      // Assert
      expect(messageBusService.sendMessage).toHaveBeenCalledWith(SearchMessageBusMessages.CLEAR_SEARCH, null);
    });
  });

  describe('invite auditors button', () => {
    const inviteUserBtnClass = '.invite-user-button';

    function getInviteUserBtn(): DebugElement {
      return fixture.debugElement.query(By.css(inviteUserBtnClass));
    }

    async function detectChanges(): Promise<void> {
      fixture.detectChanges();
      await fixture.whenStable();
    }

    it('should be rendered', async () => {
      await detectChanges();
      component.isEmptyState$ = of(true);

      // Act
      await detectChanges();

      // Assert
      expect(getInviteUserBtn()).toBeTruthy();
    });

    it('should not be rendered', async () => {
      await detectChanges();
      component.isEmptyState$ = of(false);

      // Act
      await detectChanges();

      // Assert
      expect(getInviteUserBtn()).toBeFalsy();
    });

    it('should emit inviteAuditors event when click event is dispatched', async () => {
      // Arrange
      userFacadeService.getUsers = jasmine.createSpy('getUsers').and.returnValue(of([{ email: 'testMail' }]));
      spyOn(component, 'inviteUser');

      // Act
      await detectChanges();
      getInviteUserBtn().nativeElement.dispatchEvent(new MouseEvent('click'));

      // Assert
      expect(component.inviteUser).toHaveBeenCalled();
    });
  });

  describe('#modifyDataList', () => {
    it(`By the method, the filteredUsers and dataDisplay properties should be setteled`, async () => {
      // Arrange
      const testUsers: User[] = [
        {
          email: 'testOne',
        },
        {
          email: 'testTwo',
        },
      ];

      expect(component.dataDisplay).toBeFalsy();

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      component.modifyDataList(testUsers);

      const dataToDisplayExpected: { [key: string]: boolean } = {};
      testUsers.forEach((x) => (dataToDisplayExpected[x.email] = true));

      // Assert
      expect(component.filteredUsers).toBe(testUsers);
      expect(component.dataDisplay).toEqual(dataToDisplayExpected);
    });

    it(`By the method, if provided users array are null should set filteredUsers to null and dataDisplay property should be deleted`, async () => {
      // Arrange
      const testUsers: User[] = null;

      expect(component.dataDisplay).toBeFalsy();

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      component.modifyDataList(testUsers);

      // Assert
      expect(component.filteredUsers).toBeFalsy();
      expect(component.dataDisplay).toBeFalsy();
    });
  });
});
