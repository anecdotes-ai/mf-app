import { ThreadStateEnum } from '@anecdotes/commenting';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { FocusingService } from 'core/modules/focusing-mechanism';
import { configureTestSuite } from 'ng-bullet';
import { NEVER, of, Subject } from 'rxjs';
import { CommentEntityNameEnum } from '../../models';
import { CommentPanelManagerService } from '../../services';
import { CommentingResourceModel } from './../../models/commenting-resource.model';
import { ThreadViewModel } from './../../models/thread-view.model';
import { CommentingPanelComponent } from './commenting-panel.component';

@Component({
  selector: 'app-virtual-scroll-renderer',
  template: '',
})
export class RendererComponentMock {
  scrollToId = jasmine.createSpy('scrollToId');
}

describe('CommentingPanelComponent', () => {
  configureTestSuite();

  let component: CommentingPanelComponent;
  let commentPanelManagerService: CommentPanelManagerService;
  let fixture: ComponentFixture<CommentingPanelComponent>;
  let renderer: RendererComponentMock;

  let focusingServiceMock: FocusingService;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CommentingPanelComponent, RendererComponentMock],
        imports: [TranslateModule.forRoot()],
        providers: [{ provide: CommentPanelManagerService, useValue: {} }, { provide: FocusingService, useValue: {} },],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentingPanelComponent);
    component = fixture.componentInstance;

    renderer = fixture.debugElement.query(By.directive(RendererComponentMock)).componentInstance;

    commentPanelManagerService = TestBed.inject(CommentPanelManagerService);
    focusingServiceMock = TestBed.inject(FocusingService);
    focusingServiceMock.getFocusingStreamForResource = jasmine.createSpy('getFocusingStreamForResource').and.returnValue(NEVER);
    commentPanelManagerService.getStateThreadsDisplayedBy = jasmine
      .createSpy('getStateThreadsDisplayedBy')
      .and.returnValue(of());
    commentPanelManagerService.getCommentingResources = jasmine.createSpy('getCommentingResources').and.returnValue(
      of([
        {
          threadId: 'id1',
          threadState: ThreadStateEnum.Resolved,
          resourceTypeDisplayName: 'typeDisplayName1',
          resourceType: 'resType1',
          resourceDisplayName: 'resDispName1',
          resourceId: 'resId1',
        } as ThreadViewModel,
      ])
    );
    commentPanelManagerService.getDisplayedCommentingResources = jasmine.createSpy('getDisplayedCommentingResources');
    commentPanelManagerService.getCommentsCount = jasmine.createSpy('getCommentsCount');
    commentPanelManagerService.getResourceToCreateThreadFor = jasmine
      .createSpy('getResourceToCreateThreadFor')
      .and.returnValue(of());
    commentPanelManagerService.getFocusedResource = jasmine.createSpy('getFocusedResource').and.returnValue(of());
    commentPanelManagerService.close = jasmine.createSpy('close');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    it('should create areActiveDisplayed stream from getStateThreadsDisplayedBy', async () => {
      // Arrange
      commentPanelManagerService.getStateThreadsDisplayedBy = jasmine
        .createSpy('getStateThreadsDisplayedBy')
        .and.returnValue(of(ThreadStateEnum.Active));
      let areActiveDisplayed = false;

      // Act
      await detectChanges();
      component.areActiveDisplayed$.subscribe((result) => (areActiveDisplayed = result));

      // Assert
      expect(commentPanelManagerService.getStateThreadsDisplayedBy).toHaveBeenCalled();
      expect(areActiveDisplayed).toBeTrue();
    });

    it('should create areResolvedDisplayed stream from getStateThreadsDisplayedBy', async () => {
      // Arrange
      commentPanelManagerService.getStateThreadsDisplayedBy = jasmine
        .createSpy('getStateThreadsDisplayedBy')
        .and.returnValue(of(ThreadStateEnum.Resolved));
      let areResolvedDisplayed = false;

      // Act
      await detectChanges();
      component.areResolvedDisplayed$.subscribe((result) => (areResolvedDisplayed = result));

      // Assert
      expect(commentPanelManagerService.getStateThreadsDisplayedBy).toHaveBeenCalled();
      expect(areResolvedDisplayed).toBeTrue();
    });

    it('should create threads stream from getCommentingResources', async () => {
      // Arrange
      commentPanelManagerService.getCommentingResources = jasmine
        .createSpy('getCommentingResources')
        .and.returnValue(of('smth'));

      // Act
      await detectChanges();

      // Assert
      expect(commentPanelManagerService.getCommentingResources).toHaveBeenCalled();
      expect(component.threads$).toBeTruthy();
    });

    it('should create filter stream from getDisplayedCommentingResources', async () => {
      // Arrange
      commentPanelManagerService.getDisplayedCommentingResources = jasmine
        .createSpy('getDisplayedCommentingResources')
        .and.returnValue(of('smth'));

      // Act
      await detectChanges();

      // Assert
      expect(commentPanelManagerService.getDisplayedCommentingResources).toHaveBeenCalled();
      expect(component.filter$).toBeTruthy();
    });

    it('should create overallCommentsCount stream from getCommentsCount', async () => {
      // Arrange
      commentPanelManagerService.getCommentsCount = jasmine.createSpy('getCommentsCount').and.returnValue(of('smth'));

      // Act
      await detectChanges();

      // Assert
      expect(commentPanelManagerService.getCommentsCount).toHaveBeenCalled();
      expect(component.overallCommentsCount$).toBeTruthy();
    });

    it('should call renderer scrollToId with thread creation id', async () => {
      // Arrange
      const resourceModel: CommentingResourceModel = {
        resourceId: 'resourceId',
        resourceType: 'resourceType',
        resourceDisplayName: 'name',
        resourceTypeDisplayName: 'dName',
      };

      commentPanelManagerService.getResourceToCreateThreadFor = jasmine
        .createSpy('getResourceToCreateThreadFor')
        .and.returnValue(of(resourceModel));

      // Act
      await detectChanges();

      // Assert
      expect(commentPanelManagerService.getResourceToCreateThreadFor).toHaveBeenCalled();
      expect(renderer.scrollToId).toHaveBeenCalledWith(
        `creation_${resourceModel.resourceType}_${resourceModel.resourceId}`
      );
    });
  });

  describe('focusing', () => {
    const focusingSubject = new Subject<string>();

    beforeEach(() => {
      focusingServiceMock.getFocusingStreamForResource = jasmine.createSpy('getFocusingStreamForResource').and.returnValue(focusingSubject);
      focusingServiceMock.finishFocusing = jasmine.createSpy('finishFocusing');
    });

    it('should call getFocusingStreamForResource', () => {
      // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      expect(focusingServiceMock.getFocusingStreamForResource).toHaveBeenCalledWith(CommentEntityNameEnum.Thread);
    });

    it('should scroll to emitted value from getFocusingStreamForResource', fakeAsync(() => {
      // Arrange
      const scrollingId = 'fake-id';
      fixture.detectChanges();

      // Act
      focusingSubject.next(scrollingId);
      tick(600);

      // Assert
      expect(renderer.scrollToId).toHaveBeenCalledWith(scrollingId);
    }));

    it('should finish focusing', fakeAsync(() => {
      // Arrange
      fixture.detectChanges();

      // Act
      focusingSubject.next('fake');
      tick(600);

      // Assert
      expect(focusingServiceMock.finishFocusing).toHaveBeenCalledWith(CommentEntityNameEnum.Thread);
    }));
  });

  describe('closePanel', () => {
    it('should call close of commentPanelManagerService', () => {
      // Arrange
      // Act
      component.closePanel();

      // Assert
      expect(commentPanelManagerService.close).toHaveBeenCalled();
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

  describe('handleCreatedThread', () => {
    it('should call scrollToId', async () => {
      // Arrange
      // Act
      await component.handleCreatedThread('somethread');

      // Assert
      expect(renderer.scrollToId).toHaveBeenCalledWith('somethread');
    });
  });
});
