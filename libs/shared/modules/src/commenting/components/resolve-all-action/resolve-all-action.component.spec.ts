import { ThreadStateEnum } from '@anecdotes/commenting';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { CommentingFacadeService, CommentPanelManagerService, ConfirmationModalService } from '../../services';
import { ThreadViewModel } from './../../models/thread-view.model';
import { ResolveAllActionComponent } from './resolve-all-action.component';

describe('ResolveAllActionComponent', () => {
  configureTestSuite();
  
  let component: ResolveAllActionComponent;
  let fixture: ComponentFixture<ResolveAllActionComponent>;
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
        declarations: [ResolveAllActionComponent],
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
    fixture = TestBed.createComponent(ResolveAllActionComponent);
    component = fixture.componentInstance;

    commentingFacadeServiceMock = TestBed.inject(CommentingFacadeService);
    commentingFacadeServiceMock.resolveAllActiveThreads = jasmine
      .createSpy('resolveAllActiveThreads')
      .and.callFake(() => Promise.resolve());
    confirmationModalService = TestBed.inject(ConfirmationModalService);
    confirmationModalService.openResolveAllConfirmation = jasmine.createSpy('openResolveAllConfirmation');

    commentPanelManagerService = TestBed.inject(CommentPanelManagerService);
    commentPanelManagerService.getCommentingResources = jasmine
      .createSpy('getCommentingResources')
      .and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    it('should set activeCommentsExist to false if there is an active thread state', async () => {
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
      expect(component.activeCommentsExist).toBeFalse();
    });

    it('should set resolvedCommentsExist to true if there is no active thread state', async () => {
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
          threadState: ThreadStateEnum.Resolved,
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
      expect(component.activeCommentsExist).toBeTrue();
    });
  });

  describe('resolveAll', () => {
    it('should call batchDeleteAsync with active threads ids when open/resolve all is confirmed', async () => {
      // Arrange
      confirmationModalService.openResolveAllConfirmation = jasmine
        .createSpy('openResolveAllConfirmation')
        .and.callFake(() => Promise.resolve(true));

      // Act
      await detectChanges();
      await component.resolveAll();

      // Assert
      expect(commentingFacadeServiceMock.resolveAllActiveThreads).toHaveBeenCalledWith();
    });

    it('should not call batchDeleteAsync when open/delete all is not confirmed', async () => {
      // Arrange
      confirmationModalService.openResolveAllConfirmation = jasmine
        .createSpy('openResolveAllConfirmation')
        .and.callFake(() => Promise.resolve(false));

      // Act
      await detectChanges();
      await component.resolveAll();

      // Assert
      expect(commentingFacadeServiceMock.resolveAllActiveThreads).not.toHaveBeenCalled();
    });
  });
});
