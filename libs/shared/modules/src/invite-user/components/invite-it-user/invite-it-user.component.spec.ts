import { InviteUserSource } from 'core/models/user-events/user-event-data.model';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { InviteUserModalService } from 'core/modules/invite-user';
import { configureTestSuite } from 'ng-bullet';
import { InviteItUserComponent } from './invite-it-user.component';

describe('InviteItUserComponent', () => {
  configureTestSuite();

  let component: InviteItUserComponent;
  let fixture: ComponentFixture<InviteItUserComponent>;

  let inviteUserModalService: InviteUserModalService;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [InviteItUserComponent],
      providers: [{ provide: InviteUserModalService, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteItUserComponent);
    component = fixture.componentInstance;
    inviteUserModalService = TestBed.inject(InviteUserModalService);
    inviteUserModalService.openInviteUserModal = jasmine.createSpy('openInviteUserModal');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#buildTranslationKey', () => {
    it('should return full key based on relative', () => {
      // Arrange
      const relativeKey = 'someKey';

      // Act
      const actualFullKey = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actualFullKey).toBe(`openedPlugin.inviteItUser.${relativeKey}`);
    });
  });

  describe('#inviteItUser', () => {
    it('should call inviteUserModalService.openInviteUserModal with plugin source, IT role and current plugin', () => {
      //Arrange
      component.plugin = {
        service_id: 'fakePluginid',
      };

      // Act
      component.inviteItUser();

      // Assert
      expect(inviteUserModalService.openInviteUserModal).toHaveBeenCalledWith(
        InviteUserSource.Plugins,
        RoleEnum.It,
        component.plugin
      );
    });
  });
});
