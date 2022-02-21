import { createAction, props } from '@ngrx/store';
import { CommentingResourceModel, ThreadViewModel } from '../../models';
import { User } from 'core/modules/auth-core/models/domain';

export const OpenAction = createAction('[CommentingPanel] open');
export const CloseAction = createAction('[CommentingPanel] close');
export const DestroyAction = createAction('[CommentingPanel] destroy');
export const InitializeCommentingPanelAction = createAction(
  '[CommentingPanel] initialize commenting panel',
  props<{ resources: CommentingResourceModel[], users: User[], commonLogData: any }>()
);
export const SetResourceViewModelsAction = createAction(
  '[CommentingPanel] set resource view models',
  props<{ resources: ThreadViewModel[] }>()
);
export const FocusResourceAction = createAction(
  '[CommentingPanel] focus resource',
  props<{ resourceType: string; resourceId: string }>()
);
export const EditThreadAction = createAction('[CommentingPanel] edit thread', props<{ threadId: string }>());
export const EditCommentAction = createAction('[CommentingPanel] edit comment', props<{ commentId: string }>());
export const CloseEditAction = createAction('[CommentingPanel] finish edit');
export const ReplyToThreadAction = createAction('[CommentingPanel] reply to thread', props<{ threadId: string }>());
export const CloseReplyToThreadAction = createAction('[CommentingPanel] close reply to thread');
export const CreateThreadForResourceAction = createAction(
  '[CommentingPanel] create thread for resource',
  props<{ resourceType: string; resourceId: string }>()
);
export const CloseThreadCreationAction = createAction('[CommentingPanel] close thread creation');
export const DisplayActiveThreadsAction = createAction('[CommentingPanel] display resolved threads');
export const DisplayResolvedThreadsAction = createAction('[CommentingPanel] display active threads');
export const SetDisplayedThreads = createAction('[CommentingPanel] displayed threads set');
