import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { MessageBusService } from 'core/services';
import { reducers, ReloadControlsAction } from 'core/modules/data/store';
import { ControlRefreshHandler } from './control-refresh-handler';

describe('ControlRefreshHandler', () => {
  let serviceUnderTest: ControlRefreshHandler;
  let mockStore: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)],
      providers: [provideMockStore(), ControlRefreshHandler, { provide: MessageBusService, useValue: {} }],
    });
    serviceUnderTest = TestBed.inject(ControlRefreshHandler);

    mockStore = TestBed.inject(MockStore);
    mockStore.dispatch = spyOn(mockStore, 'dispatch');
  });

  it('should be created', () => {
    expect(serviceUnderTest).toBeTruthy();
  });

  describe('#handle', () => {
    it('should dispatch LoadControlsAction', () => {
      // Arrange
      const message = {
        message_type: PusherMessageType.ControlRefresh,
        message_object: {},
      };

      // Act
      serviceUnderTest.handle(message);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(new ReloadControlsAction());
    });
  });
});
