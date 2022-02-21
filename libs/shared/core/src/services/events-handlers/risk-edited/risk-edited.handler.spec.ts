import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RisksActions } from 'core/modules/risk/store';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { reducers } from 'core/modules/data/store';
import { MessageBusService } from 'core/services';
import { RiskEditedHandler } from './risk-edited.handler';

describe('RiskEditedHandler', () => {
  let serviceUnderTest: RiskEditedHandler;
  let mockStore: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)],
      providers: [provideMockStore(), RiskEditedHandler, { provide: MessageBusService, useValue: {} }],
    });
    serviceUnderTest = TestBed.inject(RiskEditedHandler);

    mockStore = TestBed.inject(MockStore);
    mockStore.dispatch = spyOn(mockStore, 'dispatch');
  });

  it('should be created', () => {
    expect(serviceUnderTest).toBeTruthy();
  });

  describe('#handle', () => {
    it('should dispatch RiskEdited if message_object is defined', () => {
      // Arrange
      const id = 'some-risk-id';
      const message = {
        message_type: PusherMessageType.RiskEdited,
        message_object: { updated: { id } },
      };

      // Act
      serviceUnderTest.handle(message);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(RisksActions.RiskEdited({ risk: message.message_object.updated }));
    });
  });
});
