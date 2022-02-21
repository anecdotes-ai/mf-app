import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { UserClaims } from 'core/modules/auth-core/models';
import { AuthService } from 'core/modules/auth-core/services';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { CommentingFacadeService, CommentPanelManagerService } from '../../services';
import { ReplyComponent } from './reply.component';

@Component({
  selector: 'app-comment-input',
  template: '',
})
export class CommentInputComponent {
  reset = jasmine.createSpy('reset');
}

describe('ReplyComponent', () => {
  configureTestSuite();

  let component: ReplyComponent;
  let fixture: ComponentFixture<ReplyComponent>;
  let commentPanelManagerService: CommentPanelManagerService;
  let authService: AuthService;
  let input: CommentInputComponent;
  let commentingFacadeServiceMock: CommentingFacadeService;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [ReplyComponent, CommentInputComponent],
        providers: [
          { provide: CommentPanelManagerService, useValue: {} },
          { provide: AuthService, useValue: {} },
          { provide: CommentingFacadeService, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplyComponent);
    component = fixture.componentInstance;

    input = fixture.debugElement.query(By.directive(CommentInputComponent)).componentInstance;
    input.reset = jasmine.createSpy('reset');

    commentPanelManagerService = TestBed.inject(CommentPanelManagerService);
    commentPanelManagerService.getReplyingThreadId = jasmine.createSpy('getReplyingThreadId').and.returnValue(of());
    commentPanelManagerService.closeReplying = jasmine.createSpy('closeReplying');
    commentPanelManagerService.replyToThread = jasmine.createSpy('replyToThread');
    commentingFacadeServiceMock = TestBed.inject(CommentingFacadeService);
    commentingFacadeServiceMock.createCommentAsync = jasmine
      .createSpy('createCommentAsync')
      .and.callFake(() => Promise.resolve());
    authService = TestBed.inject(AuthService);
    authService.getUser = jasmine.createSpy('getUser');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    it('should set textControl with required validators', async () => {
      // Arrange
      // Act
      await detectChanges();

      // Assert
      expect(component.textControl).toBeTruthy();
      expect(component.textControl.errors.required).toBeTrue();
    });

    it('should set isFocused stream', async () => {
      // Arrange
      commentPanelManagerService.getReplyingThreadId = jasmine
        .createSpy('getReplyingThreadId')
        .and.returnValue(of('someId'));
      let isFocused = false;
      component.threadId = 'someId';

      // Act
      await detectChanges();
      component.isFocused$.subscribe((result) => (isFocused = result));

      // Assert
      expect(isFocused).toBeTrue();
    });

    it('should set currentUser stream', async () => {
      // Arrange
      authService.getUser = jasmine.createSpy('getUser').and.returnValue(of({ name: 'userName' } as UserClaims));
      let user: UserClaims;

      // Act
      await detectChanges();
      component.currentUser$.subscribe((result) => (user = result));

      // Assert
      expect(user).toEqual({ name: 'userName' } as UserClaims);
    });
  });

  describe('reply() ', () => {
    it('should emit creation value', async () => {
      // Arrange
      spyOn(component.creation$, 'next');

      // Act
      await component.reply();

      // Assert
      expect(component.creation$.next).toHaveBeenCalledWith(true);
      expect(component.creation$.next).toHaveBeenCalledWith(false);
    });

    it('should call createAsync with proper values', async () => {
      // Arrange
      component.textControl = new FormControl('', Validators.required);
      component.threadId = 'someId';

      // Act
      await component.reply();

      // Assert
      expect(commentingFacadeServiceMock.createCommentAsync).toHaveBeenCalledWith(
        component.threadId,
        component.textControl.value
      );
    });

    it('should call reset and closeReplying when comment created succesfully', async () => {
      // Arrange
      component.textControl = new FormControl('', Validators.required);
      component.threadId = 'someId';

      // Act
      await component.reply();

      // Assert
      expect(input.reset).toHaveBeenCalled();
      expect(commentPanelManagerService.closeReplying).toHaveBeenCalled();
    });

    it('should not call reset and closeReplying when comment created with error', async () => {
      // Arrange
      component.textControl = new FormControl('', Validators.required);
      component.threadId = 'someId';
      commentingFacadeServiceMock.createCommentAsync = jasmine
        .createSpy('createAsync')
        .and.returnValue(Promise.reject());

      // Act
      await component.reply();

      // Assert
      expect(input.reset).not.toHaveBeenCalled();
      expect(commentPanelManagerService.closeReplying).not.toHaveBeenCalled();
    });
  });

  describe('cancel ', () => {
    it('should call closeReplying', async () => {
      // Arrange
      // Act
      component.cancel();

      // Assert
      expect(commentPanelManagerService.closeReplying).toHaveBeenCalled();
    });

    it('should call reset on input', async () => {
      // Arrange
      // Act
      component.cancel();

      // Assert
      expect(input.reset).toHaveBeenCalled();
    });
  });

  describe('buildTranslationKey', () => {
    it('should correctly build translation key', () => {
      // Arrange
      const relativeKey = 'some-key';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toEqual(`commenting.${relativeKey}`);
    });
  });

  describe('inputGotFocus', () => {
    it('should call replyToThread with threadId', () => {
      // Arrange
      component.threadId = 'someId';

      // Act
      component.inputGotFocus();

      // Assert
      expect(commentPanelManagerService.replyToThread).toHaveBeenCalledWith(component.threadId);
    });
  });
});
