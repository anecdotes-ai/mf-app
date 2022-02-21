import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RisksActions } from 'core/modules/risk/store';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { reducers } from 'core/modules/data/store';
import { MessageBusService } from 'core/services';
import { RiskSourceCreatedHandler } from './risk-source-created.handler';

describe('RiskSourceCreatedHandler', () => {
  let serviceUnderTest: RiskSourceCreatedHandler;
  let mockStore: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)],
      providers: [provideMockStore(), RiskSourceCreatedHandler, { provide: MessageBusService, useValue: {} }],
    });
    serviceUnderTest = TestBed.inject(RiskSourceCreatedHandler);

    mockStore = TestBed.inject(MockStore);
    mockStore.dispatch = spyOn(mockStore, 'dispatch');
  });

  it('should be created', () => {
    expect(serviceUnderTest).toBeTruthy();
  });

  describe('#handle', () => {
    it('should dispatch RiskSourceAdded if message_object is defined', () => {
      // Arrange
      const id = 'some-risk-id';
      const message = {
        message_type: PusherMessageType.RiskSourceCreated,
        message_object: { updated: { id } },
      };

      // Act
      serviceUnderTest.handle(message);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(RisksActions.RiskSourceAdded({ risk_source: message.message_object.updated }));
    });
  });
});
