import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Applicability, ApplicabilityTypeEnum } from 'core/modules/data/models/domain';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { MessageBusService } from 'core/services';
import { ControlApplicabilityChangedAction, ControlRequirementApplicabilityChangedAction, reducers } from 'core/modules/data/store';
import { ApplicabilityUpdatedHandler } from './applicability-updated-handler';

describe('ApplicabilityUpdatedHandler', () => {
  let serviceUnderTest: ApplicabilityUpdatedHandler;
  let mockStore: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)],
      providers: [provideMockStore(), ApplicabilityUpdatedHandler, { provide: MessageBusService, useValue: {} }],
    });
    serviceUnderTest = TestBed.inject(ApplicabilityUpdatedHandler);

    mockStore = TestBed.inject(MockStore);
    mockStore.dispatch = spyOn(mockStore, 'dispatch');
  });

  it('should be created', () => {
    expect(serviceUnderTest).toBeTruthy();
  });

  describe('#handle', () => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const getMessage = (messageObject: Applicability) => ({
      message_type: PusherMessageType.ApplicabilityUpdated,
      message_object: messageObject,
    });

    it('should dispatch ControlRequirementApplicabilityChangedAction if applicability type is ApplicabilityTypeEnum.REQUIREMENT', () => {
      // Arrange
      const message = getMessage({
        is_applicable: true,
        applicability_id: 'some-id',
        applicability_type: ApplicabilityTypeEnum.REQUIREMENT,
      });

      // Act
      serviceUnderTest.handle(message);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        new ControlRequirementApplicabilityChangedAction('some-id', true)
      );
    });
  });
});
