import {
  CommentingPanelState,
} from './../../store/reducers/commenting-panel-reducer/commenting-panel.reducer';
import { reducers } from 'core/modules/commenting/store';
import { configureTestSuite } from 'ng-bullet';
import { CommentingResourceModel } from 'core/modules/commenting';
import { ThreadViewModel } from './../../models/thread-view.model';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CommentPanelManagerService } from './comment-panel-manager.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CommentingUserEventsService } from '../../services';
import { CommentService, ThreadStateEnum, CommentModel } from '@anecdotes/commenting';
import { of } from 'rxjs';
import { StoreModule } from '@ngrx/store';

interface FakeResource {
  resourceType: string;
  resourceId: string;
}

import { FocusingService } from 'core/modules/focusing-mechanism';

describe('Service: CommentPanelManager', () => {
  configureTestSuite();
  let serviceUnderTest: CommentPanelManagerService;
  let commentService: CommentService;
  let threadOne: ThreadViewModel;
  let threadTwo: ThreadViewModel;
  let threadThree: ThreadViewModel;
  let threadFour: ThreadViewModel;
  let threadsArray: ThreadViewModel[];
  let mockStore: MockStore;

  const resourcesArray: FakeResource[] = [
    {
      resourceId: 'id1',
      resourceType: 'type1',
    },
    {
      resourceId: 'id2',
      resourceType: 'type2',
    },
    {
      resourceId: 'id3',
      resourceType: 'type3',
    },
  ];

  const resourceOne: CommentingResourceModel = {
    resourceId: 'id',
    resourceType: 'type',
    resourceTypeDisplayName: 'typeDispName',
    resourceDisplayName: 'dispName',
  };

  const resourceTwo: CommentingResourceModel = {
    resourceId: 'id2',
    resourceType: 'type2',
    resourceTypeDisplayName: 'typeDispName2',
    resourceDisplayName: 'dispName2',
  };

  const commentingPanelStateMock: CommentingPanelState = {
    isOpen: false,
    isInitialized: false,
    focusedResource: resourceOne,
    threadCreationFor: resourceTwo,
    users: null,
    resources: null,
    threadViewModels: null,
    stateThreadsDisplayedBy: ThreadStateEnum.Active,
    editingThreadId: null,
    editingCommentId: null,
    replyingThreadId: null,
    commonLogData: null
  };

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)],
      providers: [
        provideMockStore({}),
        CommentPanelManagerService,
        { provide: CommentService, useValue: {} },
        { provide: CommentingUserEventsService, useValue: {} },
        { provide: FocusingService, useValue: {} },
      ],
    });
  });

  beforeEach(() => {
    serviceUnderTest = TestBed.inject(CommentPanelManagerService);
    commentService = TestBed.inject(CommentService);

    mockStore = TestBed.inject(MockStore);

    mockStore.setState({
      ['commenting-panel']: {
        commentingPanelState: commentingPanelStateMock,
      },
    });

    threadOne = {
      threadId: 'id1',
      threadState: ThreadStateEnum.Resolved,
      resourceTypeDisplayName: 'typeDisplayName1',
      resourceType: resourcesArray[0].resourceType,
      resourceDisplayName: 'resDispName1',
      resourceId: resourcesArray[0].resourceId,
    };

    threadTwo = {
      threadId: 'id2',
      threadState: ThreadStateEnum.Active,
      resourceTypeDisplayName: 'typeDisplayName2',
      resourceType: resourcesArray[1].resourceType,
      resourceDisplayName: 'resDispName2',
      resourceId: resourcesArray[1].resourceId,
    };

    threadThree = {
      threadId: 'id3',
      threadState: ThreadStateEnum.Resolved,
      resourceTypeDisplayName: 'typeDisplayName3',
      resourceType: resourcesArray[2].resourceType,
      resourceDisplayName: 'resDispName3',
      resourceId: resourcesArray[1].resourceId,
    };

    threadFour = {
      //for the same resourse as threadOne
      threadId: 'id4',
      threadState: ThreadStateEnum.Active,
      resourceTypeDisplayName: 'typeDisplayName4',
      resourceType: resourcesArray[0].resourceType,
      resourceDisplayName: 'resDispName4',
      resourceId: resourcesArray[0].resourceId,
    };

    threadsArray = [threadOne, threadTwo, threadThree, threadFour];
  });

  it('should be created', () => {
    expect(serviceUnderTest).toBeTruthy();
  });

  describe('getThreadsAndRepliesCountForResource', () => {
    beforeEach(() => {
      serviceUnderTest.getCommentingResources = jasmine
        .createSpy('getCommentingResources')
        .and.returnValue(of(threadsArray));
    });

    resourcesArray.forEach((resource) => {
      it('should return proper number of threads and replies count for resource', async () => {
        // Arrange
        let resultNumber;
        const comments: CommentModel[] = [];

        const activeThreadsForResource = threadsArray.filter(
          (t) =>
            t.resourceType === resource.resourceType &&
            t.resourceId === resource.resourceId &&
            t.threadState === ThreadStateEnum.Active
        );

        if (activeThreadsForResource) {
          activeThreadsForResource.forEach((thread) => {
            comments.push({
              id: 'bla',
              threadId: thread.threadId,
              commenterId: 'bla',
              commenterName: 'bla',
              createdAt: 'bla',
              updatedAt: 'bla',
              body: 'bla',
            });

            comments.push({
              id: 'bla2',
              threadId: thread.threadId,
              commenterId: 'bla',
              commenterName: 'bla',
              createdAt: 'bla',
              updatedAt: 'bla',
              body: 'bla',
            });
          });
        }

        commentService.getAll = jasmine.createSpy('getAll').and.returnValue(of(comments));

        const expectedNumber = activeThreadsForResource.length + comments.length;

        // Act
        serviceUnderTest
          .getThreadsAndRepliesCountForResource(resource.resourceType, resource.resourceId)
          .subscribe((count) => (resultNumber = count));

        // Assert
        expect(resultNumber).toEqual(expectedNumber);
      });
    });
  });

  describe('isResourceFocused', () => {
    it('should return true if in state exist focusedResource that matches provided resource', fakeAsync(() => {
      // Arrange
      let isResourceFocused = false;

      // Act
      serviceUnderTest
        .isResourceFocused(resourceOne.resourceType, resourceOne.resourceId)
        .subscribe((result) => (isResourceFocused = result));
      tick();

      // Assert
      expect(isResourceFocused).toBeTrue();
    }));

    it('should return true if in state exist threadCreationFor that matches provided resource', fakeAsync(() => {
      // Arrange
      let isResourceFocused = false;

      // Act
      serviceUnderTest
        .isResourceFocused(resourceTwo.resourceType, resourceTwo.resourceId)
        .subscribe((result) => (isResourceFocused = result));
      tick();

      // Assert
      expect(isResourceFocused).toBeTrue();
    }));

    it('should return false if in state exist threadCreationFor that matches provided resource', fakeAsync(() => {
      // Arrange
      let isResourceFocused = false;

      // Act
      serviceUnderTest.isResourceFocused('fakeType', 'fakeId').subscribe((result) => (isResourceFocused = result));
      tick();

      // Assert
      expect(isResourceFocused).toBeFalse();
    }));
  });
});
