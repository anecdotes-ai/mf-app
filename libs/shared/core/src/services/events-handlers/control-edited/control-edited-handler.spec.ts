import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { BatchControlsUpdatedAction, reducers } from 'core/modules/data/store';
import { MessageBusService } from 'core/services';
import { ControlEditedHandler } from './control-edited-handler';

describe('ControlEditedHandler', () => {
  let serviceUnderTest: ControlEditedHandler;
  let mockStore: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)],
      providers: [provideMockStore(), ControlEditedHandler, { provide: MessageBusService, useValue: {} }],
    });
    serviceUnderTest = TestBed.inject(ControlEditedHandler);

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
        message_object: { control_id, updated_control: { control_id } },
      };

      // Act
      serviceUnderTest.handle(message);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        new BatchControlsUpdatedAction([message.message_object.updated_control])
      );
    });
  });
});
