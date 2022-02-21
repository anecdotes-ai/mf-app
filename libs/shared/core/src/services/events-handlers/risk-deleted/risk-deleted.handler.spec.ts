import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RisksActions } from 'core/modules/risk/store';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { reducers } from 'core/modules/data/store';
import { MessageBusService } from 'core/services';
import { RiskDeletedHandler } from './risk-deleted.handler';

describe('RiskDeletedHandler', () => {
  let serviceUnderTest: RiskDeletedHandler;
  let mockStore: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)],
      providers: [provideMockStore(), RiskDeletedHandler, { provide: MessageBusService, useValue: {} }],
    });
    serviceUnderTest = TestBed.inject(RiskDeletedHandler);

    mockStore = TestBed.inject(MockStore);
    mockStore.dispatch = spyOn(mockStore, 'dispatch');
  });

  it('should be created', () => {
    expect(serviceUnderTest).toBeTruthy();
  });

  describe('#handle', () => {
    it('should dispatch RiskDeleted if message_object is defined', () => {
      // Arrange
      const id = 'some-risk-id';
      const message = {
        message_type: PusherMessageType.RiskDeleted,
        message_object: { updated: { risk_id: id } },
      };

      // Act
      serviceUnderTest.handle(message);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(RisksActions.RiskDeleted({ risk_id: message.message_object.updated.risk_id }));
    });
  });
});
