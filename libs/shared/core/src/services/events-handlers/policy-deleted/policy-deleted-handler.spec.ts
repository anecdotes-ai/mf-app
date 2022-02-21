import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { MessageBusService } from 'core/services';
import { reducers, CustomPolicyRemovedAction } from 'core/modules/data/store';
import { PolicyDeletedHandler } from './policy-deleted-handler';
import { configureTestSuite } from 'ng-bullet';

describe('PolicyDeletedHandler', () => {
  configureTestSuite();
  
  let serviceUnderTest: PolicyDeletedHandler;
  let mockStore: MockStore;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)],
      providers: [
        provideMockStore(), 
        PolicyDeletedHandler, 
        { provide: MessageBusService, useValue: {} }
      ],
    });
  });

  beforeEach(() => {
    serviceUnderTest = TestBed.inject(PolicyDeletedHandler);

    mockStore = TestBed.inject(MockStore);
    mockStore.dispatch = spyOn(mockStore, 'dispatch');
  });

  it('should be created', () => {
    expect(serviceUnderTest).toBeTruthy();
  });

  describe('#handle', () => {
    it('should dispatch CustomPolicyRemovedAction if message_object is defined', () => {
      // Arrange
      const policy_id = 'some-policy-id';
      const message = {
        message_type: PusherMessageType.PolicyDeleted,
        message_object: { policy_id },
      };

      // Act
      serviceUnderTest.handle(message);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(new CustomPolicyRemovedAction(policy_id));
    });
  });
});
