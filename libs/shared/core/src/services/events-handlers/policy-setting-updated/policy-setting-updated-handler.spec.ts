import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { MessageBusService } from 'core/services';
import { reducers, UpdatePolicyAction } from 'core/modules/data/store';
import { PolicySettingUpdatedHandler } from './policy-setting-updated-handler';
import { configureTestSuite } from 'ng-bullet';

describe('PolicySettingUpdatedHandler', () => {
  configureTestSuite();
  
  let serviceUnderTest: PolicySettingUpdatedHandler;
  let mockStore: MockStore;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)],
      providers: [
        provideMockStore(), 
        PolicySettingUpdatedHandler, 
        { provide: MessageBusService, useValue: {} }
      ],
    });
  });

  beforeEach(() => {
    serviceUnderTest = TestBed.inject(PolicySettingUpdatedHandler);

    mockStore = TestBed.inject(MockStore);
    mockStore.dispatch = spyOn(mockStore, 'dispatch');
  });

  it('should be created', () => {
    expect(serviceUnderTest).toBeTruthy();
  });

  describe('#handle', () => {
    it('should dispatch UpdatePolicyAction if message_object is defined', () => {
      // Arrange
      const policy_id = 'some-policy-id';
      const message = {
        message_type: PusherMessageType.PolicySettingUpdated,
        message_object: { policy_id },
      };

      // Act
      serviceUnderTest.handle(message);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(new UpdatePolicyAction(policy_id));
    });
  });
});
