import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ResolvedThreadComponent } from './resolved-thread.component';
import { AuthService, RoleService } from 'core/modules/auth-core/services';
import { CommentingFacadeService, ConfirmationModalService } from '../../services';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { NEVER, of } from 'rxjs';
import { UserClaims } from 'core/modules/auth-core/models';

describe('ResolvedThreadComponent', () => {
  let component: ResolvedThreadComponent;
  let fixture: ComponentFixture<ResolvedThreadComponent>;

  let roleServiceMock: RoleService;
  let authServiceMock: AuthService;
  let commentingFacadeServiceMock: CommentingFacadeService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ResolvedThreadComponent],
        providers: [
          { provide: ConfirmationModalService, useValue: {} },
          { provide: AuthService, useValue: {} },
          { provide: RoleService, useValue: {} },
          { provide: CommentingFacadeService, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolvedThreadComponent);
    component = fixture.componentInstance;

    roleServiceMock = TestBed.inject(RoleService);
    authServiceMock = TestBed.inject(AuthService);
    commentingFacadeServiceMock = TestBed.inject(CommentingFacadeService);

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
