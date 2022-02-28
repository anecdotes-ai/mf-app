import { CommentService, ThreadStateEnum } from '@anecdotes/commenting';
import { Injectable } from '@angular/core';
import { createSelector, Store } from '@ngrx/store';
import { User } from 'core/modules/auth-core/models/domain';
import { FocusingService } from 'core/modules/focusing-mechanism';
import { combineLatest, from, Observable, of } from 'rxjs';
import {
  distinctUntilChanged, filter, map, shareReplay, switchMap,
  take,
  tap
} from 'rxjs/operators';
import { CommentEntityNameEnum, CommentingResourceModel, ThreadViewModel } from '../../models';
import {
  CloseAction,
  CloseEditAction,
  CloseReplyToThreadAction,
  CloseThreadCreationAction,
  CreateThreadForResourceAction,
  DestroyAction,
  DisplayActiveThreadsAction,
  DisplayResolvedThreadsAction,
  EditCommentAction,
  EditThreadAction,
  FocusResourceAction, InitializeCommentingPanelAction, OpenAction,
  ReplyToThreadAction
} from '../../store';
import { featureSelector, selectDisplayedThreadViewModels, selectThreadViewModels } from '../../store/selectors';
import { createComposedResourceId } from '../../utils';
import { CommentingUserEventsService } from '../commenting-user-events/commenting-user-events.service';

@Injectable()
export class CommentPanelManagerService {
  private threadViewModels$: Observable<ThreadViewModel[]>;

  constructor(
    private store: Store,
    private commentService: CommentService,
    private focusingService: FocusingService,
    private commentingUserEventsService: CommentingUserEventsService
  ) {
    this.threadViewModels$ = this.getThreadViewModelsStream();
  }

  isOpen(): Observable<boolean> {
    return this.store.select(createSelector(featureSelector, (state) => state.isOpen));
  }

  getCommentingResources(): Observable<ThreadViewModel[]> {
    return this.threadViewModels$;
  }

  getStateThreadsDisplayedBy(): Observable<ThreadStateEnum> {
    return this.store.select(createSelector(featureSelector, (state) => state.stateThreadsDisplayedBy));
  }

  getThreadsAndRepliesCountForResource(resourceType: string, resourceId: string): Observable<number> {
    const resourceRelatedActiveComments = this.getCommentingResources().pipe(
      map((threads) =>
        threads.filter(
          (t) =>
            t.resourceType === resourceType && t.resourceId === resourceId && t.threadState === ThreadStateEnum.Active
        )
      )
    );

    return resourceRelatedActiveComments.pipe(
      switchMap((threads) => {
        if (!threads.length) {
          return of([]);
        }

        return this.commentService.getAll().pipe(
          map((comments) => {
            return threads.map((thread) => ({
              threadId: thread.threadId,
              comments: comments.filter((com) => com.threadId === thread.threadId),
            }));
          })
        );
      }),
      map((threadCommentsMap) => threadCommentsMap.reduce((prev: number, curr) => prev + 1 + curr.comments.length, 0)),
      distinctUntilChanged()
    );
  }

  getDisplayedCommentingResources(): Observable<ThreadViewModel[]> {
    return this.store.select(selectDisplayedThreadViewModels);
  }

  getCommentsCount(): Observable<number> {
    return this.getCommentingResources().pipe(
      map((resources) => resources.filter((res) => res.threadState === ThreadStateEnum.Active).length),
      shareReplay()
    );
  }

  getFocusedResource(): Observable<CommentingResourceModel> {
    return this.focusingService.getFocusingStreamForResource(CommentEntityNameEnum.Resource).pipe(
      tap(() => this.focusingService.finishFocusing(CommentEntityNameEnum.Resource)),
      map(async (focusedComposedResourceId) => {
        const resources = await this.getCommentingResources().pipe(take(1)).toPromise();

        return resources.find(
          (res) => createComposedResourceId(res.resourceType, res.resourceId) === focusedComposedResourceId
        );
      }),
      switchMap((promise) => from(promise))
    );
  }

  isResourceFocused(resourceType: string, resourceId: string): Observable<boolean> {
    return combineLatest([
      this.store.select(createSelector(featureSelector, (state) => state.focusedResource)),
      this.store.select(createSelector(featureSelector, (state) => state.threadCreationFor)),
    ]).pipe(
      map(([focusedResource, threadCreationFor]) => {
        return (
          (focusedResource &&
            focusedResource.resourceType === resourceType &&
            focusedResource.resourceId === resourceId) ||
          (threadCreationFor &&
            threadCreationFor.resourceType === resourceType &&
            threadCreationFor.resourceId === resourceId)
        );
      })
    );
  }

  getResourceToCreateThreadFor(): Observable<CommentingResourceModel> {
    return this.store.select(createSelector(featureSelector, (state) => state.threadCreationFor));
  }

  getEditingThreadId(): Observable<string> {
    return this.store.select(createSelector(featureSelector, (state) => state.editingThreadId));
  }

  getEditingCommentId(): Observable<string> {
    return this.store.select(createSelector(featureSelector, (state) => state.editingCommentId));
  }

  getReplyingThreadId(): Observable<string> {
    return this.store.select(createSelector(featureSelector, (state) => state.replyingThreadId));
  }

  closeCreation(): void {
    this.store.dispatch(CloseThreadCreationAction());
  }

  open(): void {
    this.store.dispatch(OpenAction());
  }

  focusComment(resourceType: string, resourceId: string): void {
    this.store.dispatch(FocusResourceAction({ resourceType, resourceId }));
  }

  createThread(resourceType: string, resourceId: string): void {
    this.store.dispatch(CreateThreadForResourceAction({ resourceType, resourceId }));
  }

  editThread(threadId: string): void {
    this.store.dispatch(EditThreadAction({ threadId }));
  }

  editComment(commentId: string): void {
    this.store.dispatch(EditCommentAction({ commentId }));
  }

  replyToThread(threadId: string): void {
    this.store.dispatch(ReplyToThreadAction({ threadId }));
  }

  displayActiveThreads(): void {
    this.store.dispatch(DisplayActiveThreadsAction());
    this.commentingUserEventsService.trackFilterToActiveThreadEventAsync();
  }

  displayResolvedThreads(): void {
    this.store.dispatch(DisplayResolvedThreadsAction());
    this.commentingUserEventsService.trackFilterToResolvedThreadEventAsync();
  }

  closeReplying(): void {
    this.store.dispatch(CloseReplyToThreadAction());
  }

  closeEditing(): void {
    this.store.dispatch(CloseEditAction());
  }

  close(): void {
    this.store.dispatch(CloseAction());
  }

  init(resources: CommentingResourceModel[], users: User[], commonLogData: any): void {
    this.store.dispatch(InitializeCommentingPanelAction({ resources, users, commonLogData }));
  }

  destroy(): void {
    this.store.dispatch(DestroyAction());
  }

  private getThreadViewModelsStream(): Observable<ThreadViewModel[]> {
    return this.store.select(selectThreadViewModels).pipe(filter(x => !!x));
  }
}
