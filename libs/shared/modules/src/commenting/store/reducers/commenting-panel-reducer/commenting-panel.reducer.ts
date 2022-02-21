import { ThreadStateEnum } from '@anecdotes/commenting';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { CommentingResourceModel, ThreadViewModel } from '../../../models';
import {
  CloseAction,
  CloseThreadCreationAction,
  CreateThreadForResourceAction,
  DestroyAction,
  EditThreadAction,
  CloseEditAction,
  FocusResourceAction,
  OpenAction,
  ReplyToThreadAction,
  CloseReplyToThreadAction,
  EditCommentAction,
  DisplayActiveThreadsAction,
  DisplayResolvedThreadsAction,
  InitializeCommentingPanelAction,
  SetResourceViewModelsAction
} from '../../actions';
import { createComposedResourceId } from '../../../utils';
import { User } from 'core/modules/auth-core/models/domain';

export interface CommentingPanelState {
  isOpen: boolean;
  isInitialized: boolean;
  focusedResource: CommentingResourceModel;
  threadCreationFor: CommentingResourceModel;
  editingThreadId: string;
  editingCommentId: string;
  replyingThreadId: string;
  stateThreadsDisplayedBy: ThreadStateEnum;
  threadViewModels: ThreadViewModel[];
  resources: EntityState<CommentingResourceModel>;
  users: User[];
  commonLogData: any;
}

const stateThreadsDisplayedBy = ThreadStateEnum.Active;

export function resourceIdSelector(r: CommentingResourceModel): string {
  return createComposedResourceId(r.resourceType, r.resourceId);
}

const adapter = createEntityAdapter({
  selectId: resourceIdSelector,
});

const initialState: CommentingPanelState = {
  isOpen: false,
  isInitialized: false,
  focusedResource: null,
  threadCreationFor: null,
  resources: adapter.getInitialState(),
  threadViewModels: null,
  users: null,
  stateThreadsDisplayedBy: stateThreadsDisplayedBy,
  editingThreadId: null,
  editingCommentId: null,
  replyingThreadId: null,
  commonLogData: null
};

const reducer = createReducer(
  initialState,
  on(OpenAction, (state) => {
    return { ...state, isOpen: true };
  }),
  on(InitializeCommentingPanelAction, (state, action) => {
    const resources = adapter.addMany(action.resources, adapter.removeAll(state.resources));
    return {
      ...state,
      isInitialized: true,
      commonLogData: action.commonLogData,
      users: action.users,
      resources
    };
  }),
  on(SetResourceViewModelsAction, (state, action) => {
    return {
      ...state,
      threadViewModels: action.resources 
    };
  }),
  on(DisplayActiveThreadsAction, (state) => {
    return {
      ...state,
      threadCreationFor: null,
      stateThreadsDisplayedBy: ThreadStateEnum.Active,
    };
  }),
  on(DisplayResolvedThreadsAction, (state) => {
    return {
      ...state,
      threadCreationFor: null,
      focusedResource: null,
      stateThreadsDisplayedBy: ThreadStateEnum.Resolved,
    };
  }),
  on(CloseAction, (state) => {
    return { ...state, focusedResource: null, threadCreationFor: null, isOpen: false };
  }),
  on(DestroyAction, () => {
    return { ...initialState };
  }),
  on(FocusResourceAction, (state, action) => {
    return {
      ...state,
      stateThreadsDisplayedBy: stateThreadsDisplayedBy,
      isOpen: true,
      threadCreationFor: null,
      focusedResource: state.resources.entities[createComposedResourceId(action.resourceType, action.resourceId)],
    };
  }),
  on(CreateThreadForResourceAction, (state, action) => {
    return {
      ...state,
      focusedResource: null,
      stateThreadsDisplayedBy: stateThreadsDisplayedBy,
      isOpen: true,
      editingThreadId: null,
      threadCreationFor: state.resources.entities[createComposedResourceId(action.resourceType, action.resourceId)],
    };
  }),
  on(CloseThreadCreationAction, (state) => {
    return { ...state, focusedResource: null, threadCreationFor: null };
  }),
  on(EditThreadAction, (state, action) => {
    return { ...state, threadCreationFor: null, editingThreadId: action.threadId };
  }),
  on(EditCommentAction, (state, action) => {
    return { ...state, threadCreationFor: null, editingCommentId: action.commentId };
  }),
  on(CloseEditAction, (state) => {
    return { ...state, threadCreationFor: null, editingCommentId: null, editingThreadId: null };
  }),
  on(ReplyToThreadAction, (state, action) => {
    return { ...state, replyingThreadId: action.threadId };
  }),
  on(CloseReplyToThreadAction, (state) => {
    return { ...state, replyingThreadId: null };
  })
);

export function commentingPanelReducer(state = initialState, action: Action): CommentingPanelState {
  return reducer(state, action);
}
