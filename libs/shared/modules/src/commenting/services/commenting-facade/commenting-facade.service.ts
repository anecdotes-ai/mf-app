import {
  CommentInputValue,
  CommentModel,
  CommentService,
  ThreadModel,
  ThreadService,
  ThreadStateEnum,
} from '@anecdotes/commenting';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { RoleService, TenantSubDomainExtractorService } from 'core/modules/auth-core/services';
import { Observable } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import { ThreadViewModel } from '../../models';
import { CommentPanelManagerService } from '../comment-panel-manager/comment-panel-manager.service';
import { CommentingUserEventsService } from '../commenting-user-events/commenting-user-events.service';

@Injectable()
export class CommentingFacadeService {
  constructor(
    private threadService: ThreadService,
    private commentService: CommentService,
    @Inject(DOCUMENT) private document: Document,
    private tenantSubDomainExtractorService: TenantSubDomainExtractorService,
    private commentPanelManagerService: CommentPanelManagerService,
    private roleService: RoleService,
    private commentingUserEventsService: CommentingUserEventsService
  ) {}

  getThreadById(threadId: string): Observable<ThreadModel> {
    return this.threadService.getById(threadId);
  }

  getCommentsByThreadId(threadId: string): Observable<CommentModel[]> {
    return this.commentService.getByThreadId(threadId);
  }

  getAllComments(): Observable<CommentModel[]> {
    return this.commentService.getAll();
  }

  async createThreadAsync(
    resourceType: string,
    resourceId: string,
    commentInputValue: CommentInputValue
  ): Promise<ThreadModel> {
    const relevantResource = await this.commentPanelManagerService
      .getResourceToCreateThreadFor()
      .pipe(take(1))
      .toPromise();
    const extraParamsFromResource = relevantResource.extraParams ? relevantResource.extraParams : {};
    await this.commentingUserEventsService.trackThreadCreationEventAsync(resourceType, resourceId, !!commentInputValue.mentionedUsers.length);

    return this.threadService.createAsync({
      resourceId: resourceId,
      resourceType: resourceType,
      body: commentInputValue.body,
      extraParams: {
        ...extraParamsFromResource,
        url: this.getUrl(),
        resourceName: relevantResource.resourceDisplayName,
      },
      mentionedEmails: commentInputValue.mentionedUsers?.map((u) => u.email),
    });
  }

  async createCommentAsync(threadId: string, commentInputValue: CommentInputValue): Promise<CommentModel> {
    const resources = await this.getThreadViewModelsAsync();
    const relevantResource = resources.find((r) => r.threadId === threadId);
    const extraParamsFromResource = relevantResource.extraParams ? relevantResource.extraParams : {};
    await this.commentingUserEventsService.trackReplyCreationEventAsync(relevantResource.resourceType, relevantResource.resourceId, !!commentInputValue.mentionedUsers.length);

    return this.commentService.createAsync({
      threadId,
      body: commentInputValue.body,
      extraParams: {
        ...extraParamsFromResource,
        url: this.getUrl(),
        resourceName: relevantResource.resourceDisplayName,
      },
      mentionedEmails: commentInputValue.mentionedUsers?.map((u) => u.email),
    });
  }

  async resolveThreadAsync(threadId: string): Promise<void> {
    await this.commentingUserEventsService.trackResolveThreadEventAsync(threadId);

    if (await this.isAdmin()) {
      return this.threadService.batchMarkResolvedAsync([threadId]);
    }

    return this.threadService.markResolvedAsync(threadId);
  }

  async activateThreadAsync(threadId: string): Promise<void> {
    await this.commentingUserEventsService.trackActivateThreadEventAsync(threadId);

    if (await this.isAdmin()) {
      return this.threadService.batchMarkActiveAsync([threadId]);
    }

    return this.threadService.markActiveAsync(threadId);
  }

  async editThreadAsync(threadId: string, commentInputValue: CommentInputValue): Promise<void> {
    const resources = await this.getThreadViewModelsAsync();
    const relevantResource = resources.find((r) => r.threadId === threadId);
    const extraParamsFromResource = relevantResource.extraParams ? relevantResource.extraParams : {};
    this.commentingUserEventsService.trackEditThreadEventAsync(threadId, !!commentInputValue.mentionedUsers.length);
    return await this.threadService.updateBodyWithExtraParams(
      threadId,
      commentInputValue.body,
      commentInputValue.mentionedUsers?.map((u) => u.email),
      {
        ...extraParamsFromResource,
        url: this.getUrl(),
        resourceName: relevantResource.resourceDisplayName,
      }
    );
  }

  async editCommentAsync(commentId: string, commentInputValue: CommentInputValue): Promise<void> {
    const comment = await this.commentService.getById(commentId).pipe(take(1)).toPromise();
    const resources = await this.getThreadViewModelsAsync();
    const relevantResource = resources.find((r) => r.threadId === comment.threadId);
    const extraParamsFromResource = relevantResource.extraParams ? relevantResource.extraParams : {};

    return this.commentService.updateBodyWithExtraParams(
      commentId,
      commentInputValue.body,
      commentInputValue.mentionedUsers?.map((u) => u.email),
      {
        ...extraParamsFromResource,
        url: this.getUrl(),
        resourceName: relevantResource.resourceDisplayName,
      }
    );
  }

  async deleteComment(commentId: string): Promise<void> {
    return this.commentService.deleteAsync(commentId);
  }

  async deleteThread(threadId: string): Promise<void> {
    await this.commentingUserEventsService.trackDeleteThreadEventAsync(threadId);

    if (await this.isAdmin()) {
      return this.threadService.batchDeleteAsync([threadId]);
    }

    return this.threadService.deleteAsync(threadId);
  }

  async resolveAllActiveThreads(): Promise<void> {
    const threadViewModels = await this.getThreadViewModelsAsync();
    const activeThreadIds = threadViewModels
      .filter((t) => t.threadState === ThreadStateEnum.Active)
      .map((t) => t.threadId);
    await this.commentingUserEventsService.trackResolveAllEventAsync(activeThreadIds.length);
    await this.threadService.batchMarkResolvedAsync(activeThreadIds);
  }

  async deleteAllResolvedThreads(): Promise<void> {
    const threadViewModels = await this.getThreadViewModelsAsync();
    const activeThreadIds = threadViewModels
      .filter((t) => t.threadState === ThreadStateEnum.Resolved)
      .map((t) => t.threadId);
    await this.commentingUserEventsService.trackDeleteAllResolvedEvent(activeThreadIds.length);
    await this.threadService.batchDeleteAsync(activeThreadIds);
  }

  private getUrl(): string {
    return this.tenantSubDomainExtractorService.getCurrentTenantUrl() + this.document.location.pathname;
  }

  private async isAdmin(): Promise<boolean> {
    const roleObj = await this.roleService.getCurrentUserRole().pipe(take(1)).toPromise();
    return roleObj.role === RoleEnum.Admin;
  }

  private getThreadViewModelsAsync(): Promise<ThreadViewModel[]> {
    return new Promise((resolve) => {
      const subscription = this.commentPanelManagerService
        .getCommentingResources()
        .pipe(delay(0))
        .subscribe((threadViewModels) => {
          resolve(threadViewModels);
          subscription.unsubscribe();
        });
    });
  }
}
