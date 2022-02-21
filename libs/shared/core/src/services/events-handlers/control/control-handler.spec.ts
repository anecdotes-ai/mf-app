import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { MessageBusService } from 'core/services';
import { reducers, UpdateControlAction } from 'core/modules/data/store';
import { ControlHandler } from './control-handler';

describe('ControlHandler', () => {
  let serviceUnderTest: ControlHandler;
  let mockStore: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)],
      providers: [provideMockStore(), ControlHandler, { provide: MessageBusService, useValue: {} }],
    });
    serviceUnderTest = TestBed.inject(ControlHandler);

    mockStore = TestBed.inject(MockStore);
    mockStore.dispatch = spyOn(mockStore, 'dispatch');
  });

  it('should be created', () => {
    expect(serviceUnderTest).toBeTruthy();
  });

  describe('#handle', () => {
    it('should dispatch UpdateControlAction if message_object is defined', () => {
      // Arrange
      const control_id = 'some-control-id';
      const message = {
        message_type: PusherMessageType.CommentAdded,
        message_object: { control_id },
      };

      // Act
      serviceUnderTest.handle(message);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(new UpdateControlAction(control_id));
    });
  });
});
