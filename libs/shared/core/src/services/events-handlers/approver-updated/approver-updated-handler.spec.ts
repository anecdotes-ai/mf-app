import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ApproverData, ApproverRoleEnum, Epoch } from 'core';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { PolicyUpdatedAction, reducers } from 'core/modules/data/store';
import { PolicyState } from 'core/modules/data/store/reducers';
import { MessageBusService } from 'core/services';
import { ApproverUpdatedHandler } from './approver-updated-handler';

describe('ApproverUpdatedHandler', () => {
  let serviceUnderTest: ApproverUpdatedHandler;
  let mockStore: MockStore;
  let policyId: string;
  let approverId1: string;
  let approverId2: string;
  let approverNotExist: string;
  let mockServicesState: PolicyState;

  let owner;
  let approver;
  let policy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)],
      providers: [provideMockStore(), ApproverUpdatedHandler, { provide: MessageBusService, useValue: {} }],
    });

    policyId = 'someId';
    approverId1 = 'sad,sdfdsfds@dfds.sds';
    approverId2 = 'sad,s@dfds.sds';
    approverNotExist = 'not@exist.s';

    owner = { email: approverId1, role: ApproverRoleEnum.Owner, last_notified: undefined };
    approver = { email: approverId2, role: ApproverRoleEnum.Owner, last_notified: undefined };
    policy = { policy_id: policyId, policy_settings: { approvers: [approver], owner: owner } };

    serviceUnderTest = TestBed.inject(ApproverUpdatedHandler);

    mockStore = TestBed.inject(MockStore);
    mockStore.dispatch = spyOn(mockStore, 'dispatch');

    // define store
    mockServicesState = {
      areAllLoaded: false,
      policies: {
        ids: [policyId],
        entities: { [policyId]: policy },
      },
    };
    mockStore.setState({ policyState: mockServicesState });
  });

  it('should be created', () => {
    expect(serviceUnderTest).toBeTruthy();
  });

  describe('#handle', () => {
    let message: any;
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const getMessage = (messageObject: ApproverData) => ({
      message_type: PusherMessageType.ApproverUpdated,
      message_object: messageObject,
    });

    beforeEach(() => {
      message = getMessage({
        policy_id: policyId,
        approver: {
          email: approverId1,
          last_notified: Epoch,
        },
      });
    });

    it('should dispatch PolicyUpdated action if owner last notified was updated', async () => {
      // Arrange
      message.message_object.approver_type = ApproverRoleEnum.Owner;
      const updatedPolicy = { policy_id: policyId, policy_settings: policy.policy_settings };
      updatedPolicy.policy_settings.owner.last_notified = Epoch;
      const policyAction = new PolicyUpdatedAction(updatedPolicy.policy_id, updatedPolicy);

      // Act
      await serviceUnderTest.handle(message);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(policyAction);
    });

    it('should dispatch PolicyUpdated action if approver last notified was updated', async () => {
      // Arrange
      message.message_object.approver_type = ApproverRoleEnum.Approver;
      message.message_object.approver.email = approverId2;
      const updatedPolicy = { policy_id: policyId, policy_settings: policy.policy_settings };
      updatedPolicy.policy_settings.approvers[0].last_notified = Epoch;
      const policyAction = new PolicyUpdatedAction(updatedPolicy.policy_id, updatedPolicy);

      // Act
      await serviceUnderTest.handle(message);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(policyAction);
    });

    it('shouldnt dispatch PolicyUpdated action if approver doesnt exist in policy settings', async () => {
      // Arrange
      message.message_object.approver_type = ApproverRoleEnum.Approver;
      message.message_object.approver.email = approverNotExist;

      // Act
      await serviceUnderTest.handle(message);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledTimes(0);
    });

    it('shouldnt dispatch PolicyUpdated action if owner doesnt exist in policy settings', async () => {
      // Arrange
      message.message_object.approver_type = ApproverRoleEnum.Owner;
      message.message_object.approver.email = approverNotExist;

      // Act
      await serviceUnderTest.handle(message);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledTimes(0);
    });
  });
});
