import { fakeAsync, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { PolicyManagerEventService } from './policy-manager-event.service';
import { PolicyAddType, PolicyManagerEventDataProperty, UserEvents } from 'core';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { CalculatedPolicy, ResourceStatusEnum } from 'core/modules/data/models';
import { PolicySettings } from 'core/modules/data/models/domain';

describe('PolicyManagerEventService', () => {
  let service: PolicyManagerEventService;
  let userEventService: UserEventService;

  const policy: CalculatedPolicy = {
    policy_id: 'some-id',
    policy_name: 'some-name',
    policy_type: 'some-type',
    status: ResourceStatusEnum.ON_HOLD,
  };

  beforeEach(() => {
    class StoreMock {
      select = jasmine.createSpy().and.returnValue(of(policy));
    }

    TestBed.configureTestingModule({
      providers: [
        { provide: UserEventService, useValue: {} },
        { provide: Store, useClass: StoreMock },
      ],
    });
    service = TestBed.inject(PolicyManagerEventService);

    userEventService = TestBed.inject(UserEventService);
    userEventService.sendEvent = jasmine.createSpy('sendEvent');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('trackAddPolicyEvent', () => {
    it(`should be call userEventService.sendEvent with ${UserEvents.ADD_POLICY} event and appropriate params`, () => {
      //Arrange
      // Act
      service.trackAddPolicyEvent(policy, PolicyAddType.Created);

      // Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.ADD_POLICY, {
        [PolicyManagerEventDataProperty.PolicyName]: policy.policy_name,
        [PolicyManagerEventDataProperty.PolicyType]: policy.policy_type,
        [PolicyManagerEventDataProperty.PolicyStatus]: policy.status,
        [PolicyManagerEventDataProperty.PolicyAddType]: PolicyAddType.Created,
      });
    });
  });

  describe('trackUpdatePolicyEvent', () => {
    it(`should be call userEventService.sendEvent with ${UserEvents.UPDATE_POLICY} event and appropriate params`, () => {
      //Arrange
      // Act
      service.trackUpdatePolicyEvent(policy);

      // Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.UPDATE_POLICY, {
        [PolicyManagerEventDataProperty.PolicyName]: policy.policy_name,
        [PolicyManagerEventDataProperty.PolicyType]: policy.policy_type,
        [PolicyManagerEventDataProperty.PolicyStatus]: policy.status,
      });
    });
  });

  describe('trackRemovePolicyEvent', () => {
    it(`should be call userEventService.sendEvent with ${UserEvents.REMOVE_POLICY} event and appropriate params`, () => {
      //Arrange
      // Act
      service.trackRemovePolicyEvent(policy);

      // Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.REMOVE_POLICY, {
        [PolicyManagerEventDataProperty.PolicyName]: policy.policy_name,
        [PolicyManagerEventDataProperty.PolicyType]: policy.policy_type,
        [PolicyManagerEventDataProperty.PolicyStatus]: policy.status,
      });
    });
  });

  describe('trackUploadPolicyFileEvent', () => {
    it(`should be call userEventService.sendEvent with ${UserEvents.UPLOAD_FILE} event and appropriate params`, fakeAsync(async () => {
      //Arrange
      const fileName = 'some-file.pdf';

      // Act
      await service.trackUploadPolicyFileEvent(policy.policy_id, fileName);

      // Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.UPLOAD_FILE, {
        [PolicyManagerEventDataProperty.PolicyName]: policy.policy_name,
        [PolicyManagerEventDataProperty.PolicyType]: policy.policy_type,
        [PolicyManagerEventDataProperty.FileType]: 'pdf',
      });
    }));
  });

  describe('trackDownloadPolicyTemplateEvent', () => {
    it(`should be call userEventService.sendEvent with ${UserEvents.DOWNLOAD_TEMPLATE} event and appropriate params`, () => {
      //Arrange
      // Act
      service.trackDownloadPolicyTemplateEvent(policy);

      // Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.DOWNLOAD_TEMPLATE, {
        [PolicyManagerEventDataProperty.PolicyName]: policy.policy_name,
        [PolicyManagerEventDataProperty.PolicyType]: policy.policy_type,
      });
    });
  });

  describe('trackLinkPolicyEvent', () => {
    it(`should be call userEventService.sendEvent with ${UserEvents.LINK_POLICY} event and appropriate params`, fakeAsync(async () => {
      //Arrange
      const plugin = 'some-plugin';

      // Act
      await service.trackLinkPolicyEvent(policy.policy_id, plugin);

      // Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.LINK_POLICY, {
        [PolicyManagerEventDataProperty.PolicyName]: policy.policy_name,
        [PolicyManagerEventDataProperty.PolicyType]: policy.policy_type,
        [PolicyManagerEventDataProperty.PluginUsed]: plugin,
      });
    }));
  });

  describe('trackCancelApprovalEvent', () => {
    it(`should be call userEventService.sendEvent with ${UserEvents.CANCEL_APPROVAL} event and appropriate params`, () => {
      //Arrange
      // Act
      service.trackCancelApprovalEvent(policy);

      // Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.CANCEL_APPROVAL, {
        [PolicyManagerEventDataProperty.PolicyName]: policy.policy_name,
        [PolicyManagerEventDataProperty.PolicyStatus]: policy.status,
        [PolicyManagerEventDataProperty.PolicyType]: policy.policy_type,
      });
    });
  });

  describe('trackApproveOnBehalfEvent', () => {
    it(`should be call userEventService.sendEvent with ${UserEvents.APPROVE_ON_BEHALF} event and appropriate params`, () => {
      //Arrange
      // Act
      service.trackApproveOnBehalfEvent(policy);

      // Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.APPROVE_ON_BEHALF, {
        [PolicyManagerEventDataProperty.PolicyName]: policy.policy_name,
        [PolicyManagerEventDataProperty.PolicyStatus]: policy.status,
        [PolicyManagerEventDataProperty.PolicyType]: policy.policy_type,
      });
    });
  });

  describe('trackSendPolicyForApprovalEvent', () => {
    it(`should be call userEventService.sendEvent with ${UserEvents.SEND_FOR_APPROVAL} event and appropriate params`, () => {
      //Arrange
      // Act
      service.trackSendPolicyForApprovalEvent(policy, true, true);

      // Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.SEND_FOR_APPROVAL, {
        [PolicyManagerEventDataProperty.PolicyName]: policy.policy_name,
        [PolicyManagerEventDataProperty.PolicyStatus]: policy.status,
        [PolicyManagerEventDataProperty.PolicyType]: policy.policy_type,
        [PolicyManagerEventDataProperty.SentLink]: 'custom link',
        [PolicyManagerEventDataProperty.Resent]: true,
      });
    });
  });

  describe('trackSavePolicySettingsEvent', () => {
    it(`should be call userEventService.sendEvent with ${UserEvents.SAVE_POLICY_SETTINGS} event and appropriate params`, () => {
      //Arrange
      const settings: PolicySettings = {
        approvers: [{ approved: false }],
        reviewers: [{ approved: false }],
        scheduling: {
          notify_approvers: 'month',
          approval_frequency: 'quarterly',
          notify_me: 'never',
        },
      };

      // Act
      service.trackSavePolicySettingsEvent(policy, settings);

      // Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.SAVE_POLICY_SETTINGS, {
        [PolicyManagerEventDataProperty.PolicyName]: policy.policy_name,
        [PolicyManagerEventDataProperty.PolicyStatus]: policy.status,
        [PolicyManagerEventDataProperty.PolicyType]: policy.policy_type,
        [PolicyManagerEventDataProperty.AmountOfReviewers]: settings.reviewers.length,
        [PolicyManagerEventDataProperty.AmountOfApprovers]: settings.approvers.length,
        [PolicyManagerEventDataProperty.ApprovalFreq]: settings.scheduling.approval_frequency,
        [PolicyManagerEventDataProperty.NotifyMe]: settings.scheduling.notify_me,
        [PolicyManagerEventDataProperty.NotifyAssignedColleagues]: settings.scheduling.notify_approvers,
      });
    });
  });

  describe('trackLinkedControlClickEvent', () => {
    it(`should be call userEventService.sendEvent with ${UserEvents.POLICY_LINKED} event and appropriate params`, () => {
      //Arrange
      const controlsAmount = 10;
      const frameworkNames = ['1', '2', '3'];

      // Act
      service.trackLinkedControlClickEvent(policy, frameworkNames, controlsAmount);

      // Assert
      expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.POLICY_LINKED, {
        [PolicyManagerEventDataProperty.PolicyName]: policy.policy_name,
        [PolicyManagerEventDataProperty.PolicyStatus]: policy.status,
        [PolicyManagerEventDataProperty.PolicyType]: policy.policy_type,
        [PolicyManagerEventDataProperty.FrameworksLinked]: frameworkNames.join(', '),
        [PolicyManagerEventDataProperty.AmountOfLinkedControls]: controlsAmount,
      });
    });
  });
});
