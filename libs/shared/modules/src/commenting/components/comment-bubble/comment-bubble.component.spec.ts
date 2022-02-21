import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommentEntityNameEnum, ThreadViewModel } from '../../models';
import { FocusingService } from 'core/modules/focusing-mechanism';
import { NEVER, of } from 'rxjs';
import { CommentingUserEventsService, CommentPanelManagerService } from '../../services';
import { CommentBubbleComponent } from './comment-bubble.component';
import { configureTestSuite } from 'ng-bullet';

@Component({
  selector: 'app-host',
  template: `<div id="bubble-parent">
    <app-comment-bubble [resourceId]="resourceId" [resourceType]="resourceType"></app-comment-bubble>
  </div>`,
})
class HostComponent {
  @Input()
  resourceId: string;

  @Input()
  resourceType: string;
}

describe('CommentBubbleComponent', () => {
  configureTestSuite();

  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let componentUnderTest: CommentBubbleComponent;
  let commentPanelManagerServiceMock: CommentPanelManagerService;
  let focusingServiceMock: FocusingService;
  let commentingUserEventsServiceMocK: CommentingUserEventsService;

  let fakeThreadViewModels: ThreadViewModel[];
  let fakeThreadId = 'fake-thread-id';

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }

  function getParentElement(): DebugElement {
    return fixture.debugElement.query(By.css('#bubble-parent'));
  }

  function getComponentElement(): DebugElement {
    return fixture.debugElement.query(By.directive(CommentBubbleComponent));
  }

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CommentBubbleComponent, HostComponent],
        providers: [
          { provide: CommentPanelManagerService, useValue: {} },
          { provide: FocusingService, useValue: {} },
          { provide: CommentingUserEventsService, useValue: {} }
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;

    componentUnderTest = fixture.debugElement.query(By.directive(CommentBubbleComponent))?.componentInstance;
    commentingUserEventsServiceMocK = TestBed.inject(CommentingUserEventsService);
    commentingUserEventsServiceMocK.trackFocusThreadEventAsync = jasmine.createSpy('trackFocusThreadEventAsync').and.callFake(() => Promise.resolve());
    commentPanelManagerServiceMock = TestBed.inject(CommentPanelManagerService);
    commentPanelManagerServiceMock.getThreadsAndRepliesCountForResource = jasmine
      .createSpy('getThreadsAndRepliesCountForResource')
      .and.returnValue(of(3));
    commentPanelManagerServiceMock.isResourceFocused = jasmine
      .createSpy('isResourceFocused')
      .and.returnValue(of(false));
    commentPanelManagerServiceMock.focusComment = jasmine.createSpy('focusComment');
    commentPanelManagerServiceMock.createThread = jasmine.createSpy('createThread');
    commentPanelManagerServiceMock.getCommentingResources = jasmine
      .createSpy('getCommentingResources')
      .and.callFake(() => of(fakeThreadViewModels));
      commentPanelManagerServiceMock.getThreadsAndRepliesCountForResource = jasmine
      .createSpy('getThreadsAndRepliesCountForResource')
      .and.returnValue(of(1));
    focusingServiceMock = TestBed.inject(FocusingService);
    focusingServiceMock.focusSingleResource = jasmine.createSpy('focusSingleResource');

    hostComponent.resourceType = 'someResourceType';
    hostComponent.resourceId = 'someId';
    fakeThreadViewModels = [
      { resourceId: hostComponent.resourceId, resourceType: hostComponent.resourceType, threadId: fakeThreadId },
    ];
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('onInit', () => {
    it('should add panel-trigger-parent class to parent element classList', async () => {
      // Arrange
      // Act
      await detectChanges();

      // Assert
      expect(getParentElement().classes).toEqual(jasmine.objectContaining({ 'panel-trigger-parent': true }));
    });

    it('should call getThreadsAndRepliesCountForResource ', async () => {
      // Arrange
      hostComponent.resourceType = 'someResourceType';
      hostComponent.resourceId = 'someId';

      // Act
      await detectChanges();

      // Assert
      expect(commentPanelManagerServiceMock.getThreadsAndRepliesCountForResource).toHaveBeenCalledWith(
        hostComponent.resourceType,
        hostComponent.resourceId
      );
    });

    it('should call isResourceFocused ', async () => {
      // Arrange
      // Act
      await detectChanges();

      // Assert
      expect(commentPanelManagerServiceMock.isResourceFocused).toHaveBeenCalledWith(
        hostComponent.resourceType,
        hostComponent.resourceId
      );
    });

    it('should apply count from getThreadsAndRepliesCountForResource', async () => {
      // Arrange
      hostComponent.resourceType = 'someResourceType';
      hostComponent.resourceId = 'someId';

      // Act
      await detectChanges();

      // Assert
      expect(commentPanelManagerServiceMock.isResourceFocused).toHaveBeenCalledWith(
        hostComponent.resourceType,
        hostComponent.resourceId
      );
    });
  });

  describe('hidden state', () => {
    it('should have "hidden" class until ThreadsAndRepliesCountForResource provided', async () => {
      // Arrange
      commentPanelManagerServiceMock.getThreadsAndRepliesCountForResource = jasmine
      .createSpy('getThreadsAndRepliesCountForResource')
      .and.returnValue(NEVER);

      // Act
      await detectChanges();

      // Assert
      expect(getComponentElement().classes).toEqual(jasmine.objectContaining({ 'hidden': true }));
    });

    it('should not have "hidden" class when ThreadsAndRepliesCountForResource provided', async () => {
      // Arrange
      commentPanelManagerServiceMock.getThreadsAndRepliesCountForResource = jasmine
      .createSpy('getThreadsAndRepliesCountForResource')
      .and.returnValue(of(2000));

      // Act
      await detectChanges();

      // Assert
      expect(getComponentElement().classes).not.toEqual(jasmine.objectContaining({ 'hidden': true }));
    });
  });

  describe('click on host', () => {
    describe('comments and replies exist', () => {
      it('should activate thread', async () => {
        // Arrange
        // Act
        await detectChanges();
        getComponentElement().triggerEventHandler('click', new MouseEvent('click'));

        // Assert
        expect(commentPanelManagerServiceMock.focusComment).toHaveBeenCalledWith(
          hostComponent.resourceType,
          hostComponent.resourceId
        );
      });

      it('should focus thread', async () => {
        // Arrange
        // Act
        await detectChanges();
        getComponentElement().triggerEventHandler('click', new MouseEvent('click'));

        // Assert
        expect(focusingServiceMock.focusSingleResource).toHaveBeenCalledWith(
          CommentEntityNameEnum.Thread,
          fakeThreadId
        );
      });

      it('should track focusing user event', async () => {
        // Arrange
        // Act
        await detectChanges();
        getComponentElement().triggerEventHandler('click', new MouseEvent('click'));

        // Assert
        expect(commentingUserEventsServiceMocK.trackFocusThreadEventAsync).toHaveBeenCalledWith(
          hostComponent.resourceType,
          hostComponent.resourceId,
          1
        );
      });
    });

    describe('comments and replies dont exist', () => {
      beforeEach(() => {
        commentPanelManagerServiceMock.getThreadsAndRepliesCountForResource = jasmine
          .createSpy('getThreadsAndRepliesCountForResource')
          .and.returnValue(of(0));
      });

      it('should trigger createThread of commentPanelManagerService', async () => {
        // Arrange
        // Act
        await detectChanges();
        getComponentElement().triggerEventHandler('click', new MouseEvent('click'));

        // Assert
        expect(commentPanelManagerServiceMock.createThread).toHaveBeenCalledWith(
          hostComponent.resourceType,
          hostComponent.resourceId
        );
      });
    });
  });

  describe('Host bindings', () => {
    describe('class focused', () => {
      it('should be applied when isFocused true', async () => {
        // Arrange
        commentPanelManagerServiceMock.isResourceFocused = jasmine
          .createSpy('isResourceFocused')
          .and.returnValue(of(true));

        // Act
        await detectChanges();

        // Assert
        expect(getComponentElement().classes).toEqual(jasmine.objectContaining({ focused: true }));
      });

      it('should not be applied when isFocused false', async () => {
        // Arrange
        commentPanelManagerServiceMock.isResourceFocused = jasmine
          .createSpy('isResourceFocused')
          .and.returnValue(of(false));

        // Act
        await detectChanges();

        // Assert
        expect(getComponentElement().classes).not.toEqual(jasmine.objectContaining({ focused: true }));
      });
    });

    describe('class threads-exist', () => {
      it('should be applied when comments and replies  exist', async () => {
        // Arrange
        commentPanelManagerServiceMock.getThreadsAndRepliesCountForResource = jasmine
          .createSpy('getThreadsAndRepliesCountForResource')
          .and.returnValue(of(1));

        // Act
        await detectChanges();

        // Assert
        expect(getComponentElement().classes).toEqual(jasmine.objectContaining({ 'threads-exist': true }));
      });

      it('should not be applied when comments and repplies dont exists', async () => {
        // Arrange
        commentPanelManagerServiceMock.getThreadsAndRepliesCountForResource = jasmine
          .createSpy('getThreadsAndRepliesCountForResource')
          .and.returnValue(of(0));

        // Act
        await detectChanges();

        // Assert
        expect(getComponentElement().classes).not.toEqual(jasmine.objectContaining({ 'threads-exist': true }));
      });
    });
  });
});
