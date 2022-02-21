import { ThreadStateEnum } from '@anecdotes/commenting';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Effect } from '@ngrx/effects';
import { FocusingService } from 'core/modules/focusing-mechanism';
import { Observable } from 'rxjs';
import { filter, map, mergeMap, skipWhile, take, tap, withLatestFrom } from 'rxjs/operators';
import { CommentEntityNameEnum, ThreadViewModel } from '../../models';
import { CommentingFacadeService, CommentPanelManagerService } from '../../services';
import { createComposedResourceId } from '../../utils';

export const focusedThreadIdQueryParam = 'focusedThreadId';
export const focusedReplyIdQueryParam = 'focusedReplyId';

@Injectable()
export class FocusingEffects {
  constructor(
    private router: Router,
    private commentPanelManager: CommentPanelManagerService,
    private commentFacade: CommentingFacadeService,
    private focusingService: FocusingService
  ) {}

  @Effect({ dispatch: false })
  handleThreadQueryParam$ = this.getQueryParamStream(focusedThreadIdQueryParam).pipe(
    mergeMap(async (focusedReplyId) => {
      return { focusedReplyId, resources: await this.getCommentingResources() };
    }),
    map((aggregated) => aggregated.resources.find((x) => x.threadId === aggregated.focusedReplyId)),
    skipWhile((focusedResource) => !focusedResource),
    tap((focusedResource) => this.handleFocusedResource(focusedResource)),
    tap((focusedResource) =>
      this.focusingService.focusResources({
        [CommentEntityNameEnum.Thread]: focusedResource.threadId,
        [CommentEntityNameEnum.Resource]: createComposedResourceId(
          focusedResource.resourceType,
          focusedResource.resourceId
        ),
      })
    ),
    tap(() => this.clearQueryParam(focusedThreadIdQueryParam))
  );

  @Effect({ dispatch: false })
  handleReplyQueryParam$ = this.getQueryParamStream(focusedReplyIdQueryParam).pipe(
    mergeMap(async (focusedReplyId) => {
      return { focusedReplyId, resources: await this.getCommentingResources() };
    }),
    withLatestFrom(this.commentFacade.getAllComments()),
    map(([aggregated, comments]) => {
      const focusedComment = comments.find((comment) => comment.id === aggregated.focusedReplyId);
      return {
        resources: aggregated.resources,
        focusedReplyId: focusedComment.id,
        focusedThreadId: focusedComment.threadId,
      };
    }),
    map((aggregated) => ({
      focusedReplyId: aggregated.focusedReplyId,
      focusedResource: aggregated.resources.find((x) => x.threadId === aggregated.focusedThreadId),
    })),
    skipWhile((aggregated) => !aggregated.focusedResource),
    tap((aggregated) => this.handleFocusedResource(aggregated.focusedResource)),
    tap((aggregated) => {
      this.focusingService.focusResources({
        [CommentEntityNameEnum.Thread]: aggregated.focusedResource.threadId,
        [CommentEntityNameEnum.Resource]: createComposedResourceId(
          aggregated.focusedResource.resourceType,
          aggregated.focusedResource.resourceId
        ),
        [CommentEntityNameEnum.Comment]: aggregated.focusedReplyId,
      });
    }),
    tap(() => this.clearQueryParam(focusedReplyIdQueryParam))
  );

  private getQueryParamStream(queryParamName: string): Observable<string> {
    return this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.routerState.snapshot.root.queryParams[queryParamName]),
      filter((queryParamValue) => !!queryParamValue)
    );
  }

  private getCommentingResources(): Promise<ThreadViewModel[]> {
    return this.commentPanelManager
      .getCommentingResources()
      .pipe(
        skipWhile((resources) => !resources.length),
        take(1)
      )
      .toPromise();
  }

  private clearQueryParam(queryParamName: string): void {
    const queryParams = { ...this.router.routerState.snapshot.root.queryParams };
    delete queryParams[queryParamName];
    this.router.navigate([], { queryParams, replaceUrl: true });
  }

  private handleFocusedResource(threadViewModel: ThreadViewModel): void {
    this.commentPanelManager.focusComment(threadViewModel.resourceType, threadViewModel.resourceId);

    if (threadViewModel.threadState === ThreadStateEnum.Active) {
      this.commentPanelManager.displayActiveThreads();
    } else {
      this.commentPanelManager.displayResolvedThreads();
    }
  }
}
