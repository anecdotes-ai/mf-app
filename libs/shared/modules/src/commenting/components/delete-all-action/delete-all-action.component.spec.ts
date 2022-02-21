import { ThreadStateEnum } from '@anecdotes/commenting';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs/internal/observable/of';
import { CommentingFacadeService, CommentPanelManagerService, ConfirmationModalService } from '../../services';
import { ThreadViewModel } from './../../models/thread-view.model';
import { DeleteAllActionComponent } from './delete-all-action.component';

describe('DeleteAllActionComponent', () => {
  configureTestSuite();

  let component: DeleteAllActionComponent;
  let fixture: ComponentFixture<DeleteAllActionComponent>;
  let commentPanelManagerService: CommentPanelManagerService;
  let confirmationModalService: ConfirmationModalService;
  let commentingFacadeServiceMock: CommentingFacadeService;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DeleteAllActionComponent],
        imports: [TranslateModule.forRoot()],
        providers: [
          { provide: CommentPanelManagerService, useValue: {} },
          { provide: ConfirmationModalService, useValue: {} },
          { provide: CommentingFacadeService, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAllActionComponent);
    component = fixture.componentInstance;

    commentingFacadeServiceMock = TestBed.inject(CommentingFacadeService);
    commentingFacadeServiceMock.deleteAllResolvedThreads = jasmine
      .createSpy('deleteAllResolvedThreads')
      .and.callFake(() => Promise.resolve());
    confirmationModalService = TestBed.inject(ConfirmationModalService);
    confirmationModalService.openDeleteAllConfirmation = jasmine.createSpy('openDeleteAllConfirmation');

    commentPanelManagerService = TestBed.inject(CommentPanelManagerService);
    commentPanelManagerService.getCommentingResources = jasmine.createSpy('getCommentingResources');

    commentPanelManagerService.getCommentingResources = jasmine
      .createSpy('getCommentingResources')
      .and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    it('should set resolvedCommentsExist to false if there is a resolved thread state', async () => {
      // Arrange
      const threadViewModel: ThreadViewModel[] = [
        {
          threadId: 'id1',
          threadState: ThreadStateEnum.Resolved,
          resourceTypeDisplayName: 'typeDisplayName1',
          resourceType: 'resType1',
          resourceDisplayName: 'resDispName1',
          resourceId: 'resId1',
        },
        {
          threadId: 'id2',
          threadState: ThreadStateEnum.Active,
          resourceTypeDisplayName: 'typeDisplayName2',
          resourceType: 'resType2',
          resourceDisplayName: 'resDispName2',
          resourceId: 'resId2',
        },
      ];
      commentPanelManagerService.getCommentingResources = jasmine
        .createSpy('getCommentingResources')
        .and.returnValue(of(threadViewModel));

      // Act
      await detectChanges();

      // Assert
      expect(component.resolvedCommentsExist).toBeFalse();
    });

    it('should set resolvedCommentsExist to true if there is no resolved thread state', async () => {
      // Arrange
      const threadViewModel: ThreadViewModel[] = [
        {
          threadId: 'id1',
          threadState: ThreadStateEnum.Active,
          resourceTypeDisplayName: 'typeDisplayName1',
          resourceType: 'resType1',
          resourceDisplayName: 'resDispName1',
          resourceId: 'resId1',
        },
        {
          threadId: 'id2',
          threadState: ThreadStateEnum.Active,
          resourceTypeDisplayName: 'typeDisplayName2',
          resourceType: 'resType2',
          resourceDisplayName: 'resDispName2',
          resourceId: 'resId2',
        },
      ];
      commentPanelManagerService.getCommentingResources = jasmine
        .createSpy('getCommentingResources')
        .and.returnValue(of(threadViewModel));

      // Act
      await detectChanges();

      // Assert
      expect(component.resolvedCommentsExist).toBeTrue();
    });
  });

  describe('resolveAll', () => {
    it('should call batchDeleteAsync with resolved threads ids when open/delete all confirmed', async () => {
      // Arrange
      confirmationModalService.openDeleteAllConfirmation = jasmine
        .createSpy('openDeleteAllConfirmation')
        .and.returnValue(of(true).toPromise());

      // Act
      await detectChanges();
      await component.resolveAll();

      // Assert
      expect(commentingFacadeServiceMock.deleteAllResolvedThreads).toHaveBeenCalledWith();
    });

    it('should not call batchDeleteAsync when open/delete all is not confirmed', async () => {
      // Arrange
      confirmationModalService.openDeleteAllConfirmation = jasmine
        .createSpy('openDeleteAllConfirmation')
        .and.returnValue(of(false).toPromise());

      // Act
      await detectChanges();
      await component.resolveAll();

      // Assert
      expect(commentingFacadeServiceMock.deleteAllResolvedThreads).not.toHaveBeenCalled();
    });
  });
});
