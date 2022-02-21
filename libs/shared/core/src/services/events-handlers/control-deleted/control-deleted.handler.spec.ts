import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CustomControlRemovedAction } from 'core/modules/data/store/actions';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { reducers } from 'core/modules/data/store';
import { MessageBusService } from 'core/services';
import { ControlDeletedHandler } from './control-deleted.handler';

describe('ControlDeletedHandler', () => {
  let serviceUnderTest: ControlDeletedHandler;
  let mockStore: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)],
      providers: [provideMockStore(),
        ControlDeletedHandler,
        { provide: MessageBusService, useValue: {} },
      ],
    });
    serviceUnderTest = TestBed.inject(ControlDeletedHandler);

    mockStore = TestBed.inject(MockStore);
    mockStore.dispatch = spyOn(mockStore, 'dispatch');
  });

  it('should be created', () => {
    expect(serviceUnderTest).toBeTruthy();
  });

  describe('#handle', () => {
    it('should dispatch CustomControlRemovedAction if message_object is defined', () => {
      // Arrange
      const control_id = 'some-control-id';
      const message = {
        message_type: PusherMessageType.ControlDeleted,
        message_object: { control_id },
      };

      // Act
      serviceUnderTest.handle(message);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        new CustomControlRemovedAction(message.message_object.control_id)
      );
    });
  });
});
