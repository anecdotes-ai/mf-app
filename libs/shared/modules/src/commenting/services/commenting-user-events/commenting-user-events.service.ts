import { ThreadStateEnum } from '@anecdotes/commenting';
import { Injectable } from '@angular/core';
import { DefaultProjectorFn, MemoizedSelector, Store } from '@ngrx/store';
import { CommentingEventData, CommentingEventDataProperty, UserEvents } from 'core/models';
import { UserEventService } from 'core/services/user-event/user-event.service';

import { take } from 'rxjs/operators';
import { ThreadViewModel } from '../../models';
import { createResourceLogDataSelector, selectCommonLogData, selectDisplayedThreadViewModels, selectThreadViewModels } from '../../store/selectors';

@Injectable()
export class CommentingUserEventsService {
  constructor(private userEventService: UserEventService, private store: Store) {}

  trackResolveAllEventAsync(threadCountToResolve: number): Promise<void> {
    return this.sendEventAsync(UserEvents.ResolveAllThreads, {
      [CommentingEventDataProperty.numberOfOpenChats]: threadCountToResolve,
    });
  }

  async trackDeleteAllResolvedEvent(threadCountToResolve: number): Promise<void> {
    return this.sendEventAsync(UserEvents.DeleteAllResolved, {
      [CommentingEventDataProperty.numberOfChats]: threadCountToResolve,
    });
  }

  async trackResolveThreadEventAsync(threadId: string): Promise<void> {
    const logData = await this.getThreadLogDataAsync(threadId);

    return this.sendEventAsync(UserEvents.ResolveThread, {
      ...logData,
    });
  }

  async trackEditThreadEventAsync(threadId: string, hasMentioning: boolean): Promise<void> {
    const logData = await this.getThreadLogDataAsync(threadId);

    return this.sendEventAsync(UserEvents.EditThread, {
      ...logData,
      [CommentingEventDataProperty.mentioned]: hasMentioning ? 'yes' : 'no',
    });
  }

  async trackDeleteThreadEventAsync(threadId: string): Promise<void> {
    const threadViewModel = await this.getThreadViewModelAsync(threadId);
    const eventType =
      threadViewModel.threadState === ThreadStateEnum.Resolved
        ? UserEvents.DeleteResolvedThread
        : UserEvents.DeleteThread;

    return this.sendEventAsync(eventType, {
      ...threadViewModel.logData,
    });
  }

  async trackActivateThreadEventAsync(threadId: string): Promise<void> {
    const logData = await this.getThreadLogDataAsync(threadId);

    return this.sendEventAsync(UserEvents.ActivateThread, {
      ...logData,
    });
  }

  async trackThreadCreationEventAsync(resourceType: string, resourceId: string, hasMentioning: boolean): Promise<void> {
    const logData = await this.selectAsync(createResourceLogDataSelector(resourceType, resourceId));

    return this.sendEventAsync(UserEvents.CreateThread, {
      ...logData,
      [CommentingEventDataProperty.mentioned]: hasMentioning ? 'yes' : 'no',
    });
  }

  async trackReplyCreationEventAsync(resourceType: string, resourceId: string, hasMentioning: boolean): Promise<void> {
    const logData = await this.selectAsync(createResourceLogDataSelector(resourceType, resourceId));

    return this.sendEventAsync(UserEvents.CreateReply, {
      ...logData,
      [CommentingEventDataProperty.mentioned]: hasMentioning ? 'yes' : 'no',
    });
  }

  async trackFilterToActiveThreadEventAsync(): Promise<void> {
    const displayedThreads = await this.selectAsync(selectDisplayedThreadViewModels);

    return this.sendEventAsync(UserEvents.FilterToActiveThreads, {
      [CommentingEventDataProperty.numberOfChats]: displayedThreads.length,
    });
  }

  async trackFilterToResolvedThreadEventAsync(): Promise<void> {
    const displayedThreads = await this.selectAsync(selectDisplayedThreadViewModels);

    return this.sendEventAsync(UserEvents.FilterToResolvedThreads, {
      [CommentingEventDataProperty.numberOfChats]: displayedThreads.length,
    });
  }

  async trackFocusThreadEventAsync(resourceType: string, resourceId: string, numberOfComments: number): Promise<void> {
    const logData = await this.selectAsync(createResourceLogDataSelector(resourceType, resourceId));
    return this.sendEventAsync(UserEvents.FocusThread, {
      ...logData,
      [CommentingEventDataProperty.numberOfComments]: numberOfComments,
    });
  }

  private async getThreadViewModelAsync(threadId: string): Promise<ThreadViewModel> {
    const threadViewModels = await this.selectAsync(selectThreadViewModels);
    return threadViewModels.find((tvm) => tvm.threadId === threadId);
  }

  private async getThreadLogDataAsync(threadId: string): Promise<any> {
    const threadViewModel = await this.getThreadViewModelAsync(threadId);
    return await this.selectAsync(
      createResourceLogDataSelector(threadViewModel.resourceType, threadViewModel.resourceId)
    );
  }

  private selectAsync<T>(selector: MemoizedSelector<object, T, DefaultProjectorFn<T>>): Promise<T> {
    return this.store.select(selector).pipe(take(1)).toPromise();
  }

  private async sendEventAsync<T = CommentingEventData>(evetType: UserEvents, eventData: T): Promise<void> {
    const commonLogData = await this.selectAsync(selectCommonLogData);
    this.userEventService.sendEvent(evetType, {
      ...commonLogData,
      ...eventData,
    });
  }
}
