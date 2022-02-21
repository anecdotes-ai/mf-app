import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ActiveThreadComponent } from './active-thread.component';
import { AuthService, RoleService } from 'core/modules/auth-core/services';
import { CommentingFacadeService, CommentPanelManagerService, ConfirmationModalService } from '../../services';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { NEVER, of } from 'rxjs';
import { UserClaims } from 'core/modules/auth-core/models';
import { FocusingService } from 'core/modules/focusing-mechanism';

describe('ActiveThreadComponent', () => {
  let component: ActiveThreadComponent;
  let fixture: ComponentFixture<ActiveThreadComponent>;

  let roleServiceMock: RoleService;
  let authServiceMock: AuthService;
  let commentingFacadeServiceMock: CommentingFacadeService;
  let commentPanelManagerServiceMock: CommentPanelManagerService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ActiveThreadComponent],
        providers: [
          { provide: CommentPanelManagerService, useValue: {} },
          { provide: ConfirmationModalService, useValue: {} },
          { provide: CommentingFacadeService, useValue: {} },
          { provide: FocusingService, useValue: {} },
          { provide: AuthService, useValue: {} },
          { provide: RoleService, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveThreadComponent);
    component = fixture.componentInstance;

    roleServiceMock = TestBed.inject(RoleService);
    authServiceMock = TestBed.inject(AuthService);
    commentingFacadeServiceMock = TestBed.inject(CommentingFacadeService);
    commentPanelManagerServiceMock = TestBed.inject(CommentPanelManagerService);

    commentPanelManagerServiceMock.isResourceFocused = jasmine.createSpy('isResourceFocused').and.callFake(() => NEVER);
    commentingFacadeServiceMock.getThreadById = jasmine.createSpy('getThreadById').and.callFake(() => NEVER);

    commentingFacadeServiceMock.getCommentsByThreadId = jasmine
      .createSpy('getCommentsByThreadId')
      .and.callFake(() => NEVER);
    component.resource = {} as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('shouldMenuBeDisplayed', () => {
    let fakeRole: RoleEnum;
    let fakeUser: UserClaims;

    beforeEach(() => {
      roleServiceMock.getCurrentUserRole = jasmine
        .createSpy('getCurrentUserRole')
        .and.callFake(() => of({ role: fakeRole }));
      authServiceMock.getUser = jasmine.createSpy().and.callFake(() => of(fakeUser));
      fakeUser = {
        user_id: '_',
      };
    });

    it(`should return true when current user role is ${RoleEnum.Admin} regardles owning`, fakeAsync(() => {
      // Arrange
      fakeRole = RoleEnum.Admin;

      // Act
      fixture.detectChanges();
      tick();
      const actualResult = component.shouldMenuBeDisplayed('fake');

      // Assert
      expect(actualResult).toBeTrue();
    }));

    [RoleEnum.Auditor, RoleEnum.Collaborator, RoleEnum.It, RoleEnum.User, RoleEnum.Zone].forEach((roleTestCase) => {
      it(`should return false when current user role is ${roleTestCase} and user is not owner`, fakeAsync(() => {
        // Arrange
        fakeRole = roleTestCase;

        // Act
        fixture.detectChanges();
        tick();
        const actualResult = component.shouldMenuBeDisplayed('fake');

        // Assert
        expect(actualResult).toBeFalse();
      }));

      it(`should return true when current user role is ${roleTestCase} and user is owner`, fakeAsync(() => {
        // Arrange
        fakeRole = roleTestCase;
        fakeUser.user_id = 'fake-user-id';

        // Act
        fixture.detectChanges();
        tick();
        const actualResult = component.shouldMenuBeDisplayed(fakeUser.user_id);

        // Assert
        expect(actualResult).toBeTrue();
      }));
    });
  });
});
