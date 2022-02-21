import { UserClaims } from './../../../auth-core/models/user-claims';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { CommentPanelManagerService } from '../../services';
import { CommentViewComponent } from './comment-view.component';
import { AuthService } from 'core/modules/auth-core/services';
import { NEVER, of, Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';
import { FocusingService } from 'core/modules/focusing-mechanism';
import { configureTestSuite } from 'ng-bullet';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CommentInputValue } from '@anecdotes/commenting';
import { CommentEntityNameEnum } from '../../models';
import { delayedPromise } from 'core/utils';

@Component({
  selector: 'app-comment-input',
  template: '',
})
class CommentInputMockComponent {
  focus = jasmine.createSpy('focus');
}

describe('CommentViewComponent', () => {
  configureTestSuite();

  let component: CommentViewComponent;
  let fixture: ComponentFixture<CommentViewComponent>;
  let commentPanelManagerService: CommentPanelManagerService;
  let authService: AuthService;
  let focusingServiceMock: FocusingService;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function getCommentInputMockComponentInstance(): CommentInputMockComponent {
    return fixture.debugElement.query(By.directive(CommentInputMockComponent)).componentInstance;
  }

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [CommentViewComponent, CommentInputMockComponent],
        providers: [
          { provide: CommentPanelManagerService, useValue: {} },
          { provide: AuthService, useValue: {} },
          { provide: FocusingService, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentViewComponent);
    component = fixture.componentInstance;

    commentPanelManagerService = TestBed.inject(CommentPanelManagerService);
    commentPanelManagerService.getEditingThreadId = jasmine.createSpy('getEditingThreadId').and.returnValue(NEVER);
    commentPanelManagerService.getEditingCommentId = jasmine.createSpy('getEditingCommentId').and.returnValue(NEVER);
    commentPanelManagerService.closeEditing = jasmine.createSpy('closeEditing');
    commentPanelManagerService.editComment = jasmine.createSpy('editComment');
    commentPanelManagerService.editThread = jasmine.createSpy('editThread');
    focusingServiceMock = TestBed.inject(FocusingService);
    focusingServiceMock.getFocusingStreamByResourceId = jasmine
      .createSpy('getFocusingStreamByResourceId')
      .and.returnValue(NEVER);
    authService = TestBed.inject(AuthService);
    authService.getUserAsync = jasmine
      .createSpy('getUserAsync')
      .and.returnValue(of({ user_id: 'usrId' } as UserClaims).toPromise());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    ['thread', 'comment'].forEach((commentTypeTestCase) => {
      let emittedId: string;
      describe(`when commentType is '${commentTypeTestCase}'`, () => {
        beforeEach(() => {
          component.commentType = commentTypeTestCase as any;

          if (commentTypeTestCase === 'thread') {
            commentPanelManagerService.getEditingThreadId = jasmine
              .createSpy('getEditingThreadId')
              .and.callFake(() => of(emittedId));
          } else {
            commentPanelManagerService.getEditingCommentId = jasmine
              .createSpy('getEditingCommentId')
              .and.callFake(() => of(emittedId));
          }
        });

        it('should call appropriate method ', async () => {
          // Arrange
          // Act
          await detectChanges();

          // Assert
          if (commentTypeTestCase === 'thread') {
            expect(commentPanelManagerService.getEditingThreadId).toHaveBeenCalled();
          } else {
            expect(commentPanelManagerService.getEditingCommentId).toHaveBeenCalled();
          }
        });

        describe('when emitted id is equal to commentId', () => {
          beforeEach(() => {
            emittedId = 'fake-1';
            component.commentId = emittedId;
          });

          it('should set isEditable to true', fakeAsync(() => {
            // Arrange
            // Act
            fixture.detectChanges();
            tick(100);

            // Assert
            expect(component.isEditable).toBeTrue();
          }));

          it('should focus input', async () => {
            // Arrange

            // Act
            fixture.detectChanges();
            await delayedPromise(200);

            // Assert
            expect(getCommentInputMockComponentInstance().focus).toHaveBeenCalled();
          });
        });

        describe('when emitted id is not equal to commentId', () => {
          beforeEach(() => {
            emittedId = 'fake-2';
            component.commentId = 'fake-123';
          });

          it('should set isEditable to false', fakeAsync(() => {
            // Arrange
            // Act
            fixture.detectChanges();
            tick(100);

            // Assert
            expect(component.isEditable).toBeFalse();
          }));

          it('should set isInputFocused to false', fakeAsync(() => {
            // Arrange
            component.isInputFocused = true;

            // Act
            fixture.detectChanges();
            tick(100);

            // Assert
            expect(component.isInputFocused).toBeFalse();
          }));

          it('should set value to text control with body input', fakeAsync(() => {
            // Arrange
            spyOn(component.textControl, 'setValue');
            component.body = 'some text';

            // Act
            fixture.detectChanges();
            tick(100);

            // Assert
            expect(component.textControl.setValue).toHaveBeenCalledWith({ body: component.body } as CommentInputValue);
          }));
        });
      });
    });

    describe(`when commentType is 'comment'`, () => {
      let focusingSubject: Subject<string>;

      beforeEach(() => {
        component.commentId = 'fake-id';
        component.commentType = 'comment';
        focusingSubject = new Subject<string>();
        focusingServiceMock.getFocusingStreamByResourceId = jasmine.createSpy('getFocusingStreamByResourceId').and.returnValue(focusingSubject);
        (fixture.debugElement.nativeElement as HTMLElement).scrollIntoView = jasmine.createSpy('scrollIntoView');
      });

      it('should call getFocusingStreamByResourceId with params', () => {
        // Arrange
        // Act
        fixture.detectChanges();

        // Assert
        expect(focusingServiceMock.getFocusingStreamByResourceId).toHaveBeenCalledWith(CommentEntityNameEnum.Comment, component.commentId);
      });

      it('should scroll to host element when focusing service emits current id', fakeAsync(() => {
        // Arrange
        // Act
        fixture.detectChanges();
        tick(50);
        focusingSubject.next(component.commentId);
        tick(600);

        // Assert
        expect((fixture.debugElement.nativeElement as HTMLElement).scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
      }));
    });
  });

  describe('confirmEdit', () => {
    it('should emit edit ', async () => {
      // Arrange
      component.textControl = new FormControl();
      spyOn(component.edit, 'emit');

      // Act
      component.confirmEdit();

      // Assert
      expect(component.edit.emit).toHaveBeenCalledWith(component.textControl.value);
    });

    it('should call closeEditing ', async () => {
      // Arrange
      component.textControl = new FormControl();

      // Act
      component.confirmEdit();

      // Assert
      expect(commentPanelManagerService.closeEditing).toHaveBeenCalled();
    });
  });

  describe('cancelEdit', () => {
    it('should call closeEditing', async () => {
      // Arrange
      // Act
      component.cancelEdit();

      // Assert
      expect(commentPanelManagerService.closeEditing).toHaveBeenCalled();
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
});
