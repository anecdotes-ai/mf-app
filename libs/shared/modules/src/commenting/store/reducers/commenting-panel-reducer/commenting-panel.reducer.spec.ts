import { commentingPanelReducer, CommentingPanelState, resourceIdSelector } from './commenting-panel.reducer';
import { Dictionary, EntityState } from '@ngrx/entity';
import { ThreadStateEnum } from '@anecdotes/commenting';
import { CommentingResourceModel } from '../../../models';
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
  FocusResourceAction,
  OpenAction,
  ReplyToThreadAction,
  InitializeCommentingPanelAction,
} from '../..';
import { User } from 'core/modules/auth-core/models/domain';

describe('reducer commentingPanelReducer', () => {
  let stateFilledWithData: CommentingPanelState;
  let initialStateMock: CommentingPanelState;
  let resourceOne: CommentingResourceModel;
  let resourceTwo: CommentingResourceModel;

  beforeEach(() => {
    resourceOne = {
      resourceId: 'id',
      resourceType: 'type',
      resourceTypeDisplayName: 'typeDispName',
      resourceDisplayName: 'dispName',
    };

    resourceTwo = {
      resourceId: 'id2',
      resourceType: 'type2',
      resourceTypeDisplayName: 'typeDispName2',
      resourceDisplayName: 'dispName2',
    };

    const resources = [resourceOne, resourceTwo];
    initialStateMock = {
      isOpen: false,
      isInitialized: false,
      commonLogData: null,
      focusedResource: null,
      threadCreationFor: null,
      users: null,
      resources: {
        entities: {},
        ids: [],
      },
      threadViewModels: null,
      stateThreadsDisplayedBy: ThreadStateEnum.Active,
      editingThreadId: null,
      editingCommentId: null,
      replyingThreadId: null,
    };

    stateFilledWithData = {
      ...initialStateMock,
      resources: getResourcesState(resources),
    };
  });

  function getResourcesState(resources: CommentingResourceModel[]): EntityState<CommentingResourceModel> {
    return {
      entities: resources.reduce(
        (prev, res) => ({
          ...prev,
          [resourceIdSelector(res)]: res,
        }),
        {} as Dictionary<CommentingResourceModel>
      ),
      ids: resources.map((res) => resourceIdSelector(res)),
    };
  }

  describe('OpenAction', () => {
    it('should change isOpen in state to true', () => {
      // Arrange
      const inputState: CommentingPanelState = {
        ...initialStateMock,
        isOpen: false,
      };

      // Act
      const returnedState = commentingPanelReducer(inputState, OpenAction());

      // Assert
      expect({
        ...initialStateMock,
        isOpen: true,
      }).toEqual(returnedState);
    });
  });

  describe('InitializeCommentingPanelAction', () => {
    it('should add provided resources to state and set "initialized" property to true', () => {
      // Arrange
      const fakeUsers: User[] = [{}];
      const inputState: CommentingPanelState = {
        ...initialStateMock,
      };
      const commonLogData = { 'fake': {}};

      // Act
      const returnedState = commentingPanelReducer(
        inputState,
        InitializeCommentingPanelAction({ resources: [resourceOne, resourceTwo], users: fakeUsers, commonLogData })
      );

      // Assert
      expect({
        ...initialStateMock,
        resources: getResourcesState([resourceOne, resourceTwo]),
        users: fakeUsers,
        commonLogData: commonLogData,
        isInitialized: true
      }).toEqual(returnedState);
    });
  });

  describe('DisplayActiveThreadsAction', () => {
    it('should set threadCreationFor to null and stateThreadsDisplayedBy to active', () => {
      // Arrange
      const inputState: CommentingPanelState = {
        ...initialStateMock,
        stateThreadsDisplayedBy: ThreadStateEnum.Active,
        threadCreationFor: {},
      };

      // Act
      const returnedState = commentingPanelReducer(inputState, DisplayActiveThreadsAction());

      // Assert
      expect({
        ...initialStateMock,
        threadCreationFor: null,
        stateThreadsDisplayedBy: ThreadStateEnum.Active,
      }).toEqual(returnedState);
    });
  });

  describe('DisplayResolvedThreadsAction', () => {
    it('should set threadCreationFor and focusedResource properties of state to null and stateThreadsDisplayedBy to resolved', () => {
      // Arrange
      const inputState: CommentingPanelState = {
        ...initialStateMock,
        stateThreadsDisplayedBy: ThreadStateEnum.Active,
        threadCreationFor: {},
        focusedResource: {},
      };

      // Act
      const returnedState = commentingPanelReducer(inputState, DisplayResolvedThreadsAction());

      // Assert
      expect({
        ...initialStateMock,
        threadCreationFor: null,
        focusedResource: null,
        stateThreadsDisplayedBy: ThreadStateEnum.Resolved,
      }).toEqual(returnedState);
    });
  });

  describe('CloseAction', () => {
    it('should set threadCreationFor and focusedResource properties of state to null and isOpen to false ', () => {
      // Arrange
      const inputState: CommentingPanelState = {
        ...initialStateMock,
        isOpen: true,
        threadCreationFor: {},
        focusedResource: {},
      };

      // Act
      const returnedState = commentingPanelReducer(inputState, CloseAction());

      // Assert
      expect({
        ...initialStateMock,
        threadCreationFor: null,
        focusedResource: null,
        isOpen: false,
      }).toEqual(returnedState);
    });
  });

  describe('DestroyAction', () => {
    it('should set state to initial', () => {
      // Arrange
      // Act
      const returnedState = commentingPanelReducer(stateFilledWithData, DestroyAction());

      // Assert
      expect(initialStateMock).toEqual(returnedState);
    });
  });

  describe('FocusResourceAction', () => {
    it('should correctly set state properties and set focusedResource with proper resource', () => {
      // Arrange
      const inputState = {
        ...stateFilledWithData,
        stateThreadsDisplayedBy: ThreadStateEnum.Resolved,
        isOpen: false,
        focusedResource: {},
        threadCreationFor: {},
      };

      // Act
      const returnedState = commentingPanelReducer(
        inputState,
        FocusResourceAction({ resourceType: resourceOne.resourceType, resourceId: resourceOne.resourceId })
      );

      // Assert
      expect({
        ...stateFilledWithData,
        stateThreadsDisplayedBy: ThreadStateEnum.Active,
        isOpen: true,
        threadCreationFor: null,
        focusedResource: resourceOne,
      }).toEqual(returnedState);
    });
  });

  describe('CreateThreadForResourceAction', () => {
    it('should correctly set state properties and set threadCreationFor with proper resource', () => {
      // Arrange
      const inputState = {
        ...stateFilledWithData,
        isOpen: false,
        threadCreationFor: resourceTwo,
        focusedResource: {},
        editingThreadId: 'fake',
        stateThreadsDisplayedBy: ThreadStateEnum.Resolved,
      };

      // Act
      const returnedState = commentingPanelReducer(
        inputState,
        CreateThreadForResourceAction({ resourceType: resourceOne.resourceType, resourceId: resourceOne.resourceId })
      );

      // Assert
      expect({
        ...stateFilledWithData,
        stateThreadsDisplayedBy: ThreadStateEnum.Active,
        isOpen: true,
        threadCreationFor: resourceOne,
        focusedResource: null,
        editingThreadId: null,
      }).toEqual(returnedState);
    });
  });

  describe('CloseThreadCreationAction ', () => {
    it('should set null to focusedResource and threadCreationFor', () => {
      // Arrange
      const inputState = { ...stateFilledWithData, focusedResource: {}, threadCreationFor: {} };

      // Act
      const returnedState = commentingPanelReducer(inputState, CloseThreadCreationAction());

      // Assert
      expect({
        ...stateFilledWithData,
        focusedResource: null,
        threadCreationFor: null,
      }).toEqual(returnedState);
    });
  });

  describe('EditThreadAction ', () => {
    it('should set null to threadCreationFor and set editingThreadId with proper id', () => {
      // Arrange
      const inputState = {
        ...initialStateMock,
        threadCreationFor: {},
        editingThreadId: null,
      };

      // Act
      const returnedState = commentingPanelReducer(inputState, EditThreadAction({ threadId: resourceOne.resourceId }));

      // Assert
      expect({
        ...initialStateMock,
        threadCreationFor: null,
        editingThreadId: resourceOne.resourceId,
      }).toEqual(returnedState);
    });
  });

  describe('EditCommentAction ', () => {
    it('should set null to threadCreationFor and set editingCommentId with proper id', () => {
      // Arrange
      const inputState = {
        ...initialStateMock,
        threadCreationFor: {},
        editingCommentId: null,
      };

      // Act
      const returnedState = commentingPanelReducer(
        inputState,
        EditCommentAction({ commentId: resourceOne.resourceId })
      );

      // Assert
      expect({
        ...initialStateMock,
        threadCreationFor: null,
        editingCommentId: resourceOne.resourceId,
      }).toEqual(returnedState);
    });
  });

  describe('CloseEditAction ', () => {
    it('should set null to threadCreationFor, editingCommentId and editingThreadId', () => {
      // Arrange
      const inputState = {
        ...initialStateMock,
        threadCreationFor: {},
        editingCommentId: 'fake',
        editingThreadId: 'fake',
      };

      // Act
      const returnedState = commentingPanelReducer(inputState, CloseEditAction());

      // Assert
      expect({
        ...initialStateMock,
        threadCreationFor: null,
        editingCommentId: null,
        editingThreadId: null,
      }).toEqual(returnedState);
    });
  });

  describe('ReplyToThreadAction ', () => {
    it('should set proper id to replyingThreadId', () => {
      // Arrange
      const inputState = {
        ...initialStateMock,
        replyingThreadId: null,
      };

      // Act
      const returnedState = commentingPanelReducer(
        inputState,
        ReplyToThreadAction({ threadId: resourceTwo.resourceId })
      );

      // Assert
      expect({
        ...initialStateMock,
        replyingThreadId: resourceTwo.resourceId,
      }).toEqual(returnedState);
    });
  });

  describe('CloseReplyToThreadAction ', () => {
    it('should set null to replyingThreadId', () => {
      // Arrange
      const inputState = {
        ...initialStateMock,
        replyingThreadId: 'fake',
      };

      // Act
      const returnedState = commentingPanelReducer(inputState, CloseReplyToThreadAction());

      // Assert
      expect({
        ...initialStateMock,
        replyingThreadId: null,
      }).toEqual(returnedState);
    });
  });
});
