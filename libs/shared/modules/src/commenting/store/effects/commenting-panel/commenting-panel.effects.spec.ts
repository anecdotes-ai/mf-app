import { ThreadModel, ThreadService, ThreadStateEnum } from '@anecdotes/commenting';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { CommentingResourceModel, ThreadViewModel } from '../../../models';
import { SetResourceViewModelsAction } from '../../actions';
import { selectIsInitialized, selectResources, selectThreadCreationFor } from '../../selectors';
import { CommentingPanelEffects } from './commenting-panel.effects';

describe('CommentingPanelEffects', () => {
  let serviceUnderTest: CommentingPanelEffects;

  let threadServiceMock: ThreadService;

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

  const threadOne: ThreadModel = {
    id: 'id1',
    state: ThreadStateEnum.Resolved,
    resourceType: resourceOne.resourceType,
    resourceId: resourceOne.resourceId,
  } as ThreadModel;

  const threadTwo: ThreadModel = {
    id: 'id2',
    state: ThreadStateEnum.Active,
    resourceType: 'some unexpected resource 2',
    resourceId: 'some unexpected resource 2',
  } as ThreadModel;

  const threadThree: ThreadModel = {
    id: 'id3',
    state: ThreadStateEnum.Resolved,
    resourceType: 'some unexpected resource 3',
    resourceId: 'some unexpected resource 3',
  } as ThreadModel;

  const threadFour = {
    //for the same resourse as threadOne
    id: 'id4',
    state: ThreadStateEnum.Active,
    resourceType: resourceTwo.resourceType,
    resourceId: resourceTwo.resourceId,
  } as ThreadModel;

  let mockStore: MockStore;
  let fakeThreads: ThreadModel[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommentingPanelEffects, provideMockStore(), { provide: ThreadService, useValue: {} }],
    });
  });

  beforeEach(() => {
    serviceUnderTest = TestBed.inject(CommentingPanelEffects);
    threadServiceMock = TestBed.inject(ThreadService);
    mockStore = TestBed.inject(Store) as MockStore;
    threadServiceMock.getAll = jasmine.createSpy('getAll').and.callFake(() => of(fakeThreads));
    mockStore.dispatch = jasmine.createSpy('dispatch');
  });

  describe('threadViewModels$ effect', () => {
    describe('panel is initialized', () => {
      beforeEach(() => {
        fakeThreads = [threadOne, threadTwo, threadThree, threadFour];
        mockStore.overrideSelector(selectResources, [resourceOne, resourceTwo]);
        mockStore.overrideSelector(selectIsInitialized, true);
      });

      it('should have resource creation object with resourceToCreateThreadFor with proper sequence of items if threadCreationFor setted in state', fakeAsync(() => {
        // Arrange
        mockStore.overrideSelector(selectThreadCreationFor, resourceOne);
        let expectedResult: ThreadViewModel[] = [
          {
            threadId: threadOne.id,
            threadState: threadOne.state,
            resourceTypeDisplayName: resourceOne.resourceTypeDisplayName,
            resourceType: threadOne.resourceType,
            resourceDisplayName: resourceOne.resourceDisplayName,
            resourceId: threadOne.resourceId,
          },
          {
            isCreation: true,
            threadId: undefined,
            resourceTypeDisplayName: resourceOne.resourceTypeDisplayName,
            resourceType: threadOne.resourceType,
            resourceDisplayName: resourceOne.resourceDisplayName,
            resourceId: threadOne.resourceId,
          },
          {
            threadId: threadFour.id,
            threadState: threadFour.state,
            resourceTypeDisplayName: resourceTwo.resourceTypeDisplayName,
            resourceType: threadFour.resourceType,
            resourceDisplayName: resourceTwo.resourceDisplayName,
            resourceId: threadFour.resourceId,
          },
        ];

        // Act
        serviceUnderTest.threadViewModels$.subscribe();
        tick(100);

        // Assert
        expect(mockStore.dispatch).toHaveBeenCalledWith(SetResourceViewModelsAction({ resources: expectedResult }));
      }));

      it('should not have resource creation object if threadCreationFor is not setted in state', fakeAsync(() => {
        // Arrange
        mockStore.overrideSelector(selectThreadCreationFor, null);
        let expectedResult: ThreadViewModel[] = [
          {
            threadId: threadOne.id,
            threadState: threadOne.state,
            resourceTypeDisplayName: resourceOne.resourceTypeDisplayName,
            resourceType: resourceOne.resourceType,
            resourceDisplayName: resourceOne.resourceDisplayName,
            resourceId: resourceOne.resourceId,
          },
          {
            threadId: threadFour.id,
            threadState: threadFour.state,
            resourceTypeDisplayName: resourceTwo.resourceTypeDisplayName,
            resourceType: resourceTwo.resourceType,
            resourceDisplayName: resourceTwo.resourceDisplayName,
            resourceId: resourceTwo.resourceId,
          },
        ];

        // Act
        serviceUnderTest.threadViewModels$.subscribe();
        tick(100);

        // Assert
        expect(mockStore.dispatch).toHaveBeenCalledWith(SetResourceViewModelsAction({ resources: expectedResult }));
      }));
    });
  });
});
