import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { MessageBusService } from 'core/services';
import { reducers, PolicyUpdatedAction } from 'core/modules/data/store';
import { PolicyEditedHandler } from './policy-edited-handler';
import { configureTestSuite } from 'ng-bullet';

describe('PolicyEditedHandler', () => {
  configureTestSuite();
  
  let serviceUnderTest: PolicyEditedHandler;
  let mockStore: MockStore;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)],
      providers: [
        provideMockStore(), 
        PolicyEditedHandler, 
        { provide: MessageBusService, useValue: {} }
      ],
    });
  });

  beforeEach(() => {
    serviceUnderTest = TestBed.inject(PolicyEditedHandler);

    mockStore = TestBed.inject(MockStore);
    mockStore.dispatch = spyOn(mockStore, 'dispatch');
  });

  it('should be created', () => {
    expect(serviceUnderTest).toBeTruthy();
  });

  describe('#handle', () => {
    it('should dispatch PolicyEditedHandler if message_object is defined', () => {
      // Arrange
      const policy_id = 'some-policy-id';
      const message = {
        message_type: PusherMessageType.PolicyEdited,
        message_object: { 
          policy_id,
          updated_policy: { policy_id }
         },
      };

      // Act
      serviceUnderTest.handle(message);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        new PolicyUpdatedAction(message.message_object.updated_policy.policy_id, message.message_object.updated_policy));
    });
  });
});
