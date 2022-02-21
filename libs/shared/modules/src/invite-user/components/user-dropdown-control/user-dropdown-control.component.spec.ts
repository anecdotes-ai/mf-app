import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { UserDropdownControlComponent, User } from './user-dropdown-control.component';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { InviteUserModalService } from '../../services';

describe('UserDropdownControlComponent', () => {
  configureTestSuite();

  let component: UserDropdownControlComponent;
  let fixture: ComponentFixture<UserDropdownControlComponent>;

  const selectedUserEmail = 'some-user-email1';

  const user1: User = {
    first_name: 'some-user-first-name1',
    last_name: 'some-user-last-name1',
    email: selectedUserEmail,
    photo: 'fake',
  };

  const user2: User = {
    first_name: 'some-user-first-name2',
    last_name: 'some-user-last-name2',
    email: 'fake@gmail.com',
    photo: 'fake',
  };

  const emptyUser: User = {
    first_name: 'empty-user-first-name',
    last_name: '',
    email: '',
    photo: 'fake',
  };

  let users: User[] = [user1, user2];

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserDropdownControlComponent],
      imports: [TranslateModule.forRoot(), OverlayModule],
      providers: [{ provide: InviteUserModalService, useValue: {} }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDropdownControlComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectUser', () => {
    beforeEach(async () => {
      component.users = users;
      await component.selectUser(user1);
    });

    // TODO
  });

  describe('displayUserValueSelector', () => {
    it('should correctly build user selection value with current user', () => {
      // Arrange
      component.buildTranslationKey = jasmine.createSpy('buildTranslationKey').and.returnValue('(me)');
      const extendedUser: User = {
        first_name: 'extended-user-first-name',
        last_name: 'extended-user-last-name',
        email: 'fake@gmail.com',
        photo: 'fake',
      };

      // Act
      // Assert
      expect(component.getDisplayValue(extendedUser)).toBe(`${extendedUser.first_name} ${extendedUser.last_name}`);
    });
  });

  describe('buildTranslationKey', () => {
    it('should correctly build translation key', () => {
      // Arrange
      const relativeKey = 'some-key';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toEqual(`components.sharedControls.owner.${relativeKey}`);
    });
  });

  describe('inviteUser', () => {
    // TODO - Yaniv:
  });
});
