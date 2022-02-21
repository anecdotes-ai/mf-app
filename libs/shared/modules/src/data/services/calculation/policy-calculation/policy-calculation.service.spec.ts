import { TestBed } from '@angular/core/testing';
import {
  ApprovalFrequencyEnum,
  NotifyApproversEnum,
  NotifyMeEnum,
  Policy,
  ScheduleSettings,
} from '../../../models/domain';
import { ResourceStatusEnum } from '../../../models';
import { PolicyCalculationService } from './policy-calculation.service';

describe('PolicyCalculationService', () => {
  let service: PolicyCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PolicyCalculationService],
    });
    service = TestBed.inject(PolicyCalculationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Policy status when evidence or settings are missing', () => {
    it('policy status should be undefined if no evidence and no settings', () => {
      // Arrange
      const policy: Policy = { policy_settings: { scheduling: {} } };

      // Act
      const result = service.calculatePolicy(policy);

      // Assert
      expect(result.status).toEqual(ResourceStatusEnum.UNDEFINED);
    });

    it('policy status should be not started if no evidence', () => {
      // Arrange
      const policy: Policy = { policy_settings: { scheduling: {} } };

      // Act
      const result = service.calculatePolicy(policy);

      // Assert
      expect(result.status).toEqual(ResourceStatusEnum.UNDEFINED);
    });

    it('policy status should be not started if no settings', () => {
      // Arrange
      const policy: Policy = { evidence: {} };

      // Act
      const result = service.calculatePolicy(policy);

      // Assert
      expect(result.status).toEqual(ResourceStatusEnum.NOTSTARTED);
    });
  });

  describe('Owner statuses', () => {
    let policy: Policy;
    let schedulingNever: ScheduleSettings;
    let schedualing: ScheduleSettings;
    let testEmail: string;

    beforeEach(() => {
      schedulingNever = { notify_approvers: NotifyMeEnum.Never, notify_me: NotifyMeEnum.Never, start_from: new Date() };
      schedualing = { notify_approvers: NotifyMeEnum.Day, notify_me: NotifyMeEnum.Never, start_from: new Date() };
      policy = {
        policy_settings: { approvers: [], reviewers: [], owner: null, scheduling: { start_from: new Date() } },
        evidence: {},
      };
    });

    describe('Approved status', () => {
      it('owner status should be APPROVED if he has approved (with automation)', () => {
        // Arrange
        testEmail = 'bla@bla.fg';
        policy.policy_settings.owner = { email: testEmail, approved: true };
        policy.policy_settings.scheduling = schedualing;

        // Act
        const result = service.calculatePolicy(policy);

        // Assert
        expect(result.approvers_statuses.find(a => a.email === testEmail).status).toEqual(ResourceStatusEnum.APPROVED);
      });

      it('owner status should be APPROVED if he has approved (automation never)', () => {
        // Arrange
        testEmail = 'bla@bla.fg';
        policy.policy_settings.owner = { email: testEmail, approved: true };
        policy.policy_settings.scheduling = schedulingNever;

        // Act
        const result = service.calculatePolicy(policy);

        // Assert
        expect(result.approvers_statuses.find(a => a.email === testEmail).status).toEqual(ResourceStatusEnum.APPROVED);
      });

      it('owner status should be APPROVED if he has approved (automation undefined)', () => {
        // Arrange
        testEmail = 'bla@bla.fg';
        policy.policy_settings.owner = { email: testEmail, approved: true };

        // Act
        const result = service.calculatePolicy(policy);

        // Assert
        expect(result.approvers_statuses.find(a => a.email === testEmail).status).toEqual(ResourceStatusEnum.APPROVED);
      });
    });

    describe('Pending status', () => {
      it('owner status should be pending if he hasnt approved (with automation)', () => {
        // Arrange
        testEmail = 'bla@bla.fg';
        policy.policy_settings.owner = { email: testEmail, approved: false };
        policy.policy_settings.scheduling = schedualing;

        // Act
        const result = service.calculatePolicy(policy);

        // Assert
        expect(result.approvers_statuses.find(a => a.email === testEmail).status).toEqual(ResourceStatusEnum.PENDING);
      });

      it('owner status should be pending if he hasnt approved (without automation but ent for approval)', () => {
        // Arrange
        testEmail = 'bla@bla.fg';
        policy.policy_settings.owner = { email: testEmail, approved: false, last_notified: 'bla' };
        policy.policy_settings.scheduling = schedulingNever;

        // Act
        const result = service.calculatePolicy(policy);

        // Assert
        expect(result.approvers_statuses.find(a => a.email === testEmail).status).toEqual(ResourceStatusEnum.PENDING);
      });
    });

    describe('On Hold Status', () => {
      it('owner status should be On hold if he hasnt approved (automation never)', () => {
        // Arrange
        testEmail = 'bla@bla.fg';
        policy.policy_settings.owner = { email: testEmail, approved: false };
        policy.policy_settings.scheduling = schedulingNever;

        // Act
        const result = service.calculatePolicy(policy);

        // Assert
        expect(result.approvers_statuses.find(a => a.email === testEmail).status).toEqual(ResourceStatusEnum.ON_HOLD);
      });

      it('owner status should be On hold if he hasnt approved (automation undefined)', () => {
        // Arrange
        testEmail = 'bla@bla.fg';
        policy.policy_settings.owner = { email: testEmail, approved: false };

        // Act
        const result = service.calculatePolicy(policy);

        // Assert
        expect(result.approvers_statuses.find(a => a.email === testEmail).status).toEqual(ResourceStatusEnum.ON_HOLD);
      });
    });
  });

  describe('Policy status when evidence, settings and automation exist', () => {
    let policy: Policy;

    beforeEach(() => {
      policy = {
        policy_settings: {
          approvers: [],
          reviewers: [],
          owner: null,
          scheduling: { start_from: new Date(), notify_me: NotifyMeEnum.Never, notify_approvers: NotifyMeEnum.Day },
        },
        evidence: {},
      };
    });

    describe('Approved status', () => {
      it('policy status should be pending if at least one approver is defined and hasnt approved', () => {
        // Arrange
        policy.policy_settings.approvers = [{ approved: false, email: 'test' }];

        // Act
        const result = service.calculatePolicy(policy);

        // Assert
        expect(result.status).toEqual(ResourceStatusEnum.PENDING);
      });

      it('policy status should be pending if at least one reviewer is defined and hasnt approved', () => {
        // Arrange
        policy.policy_settings.approvers = [{ approved: true, email: 'test1' }];
        policy.policy_settings.reviewers = [{ approved: false, email: 'test2' }];

        // Act
        const result = service.calculatePolicy(policy);

        // Assert
        expect(result.status).toEqual(ResourceStatusEnum.PENDING);
      });

      it('policy status should be pending if at least owner is defined and hasnt approved', () => {
        // Arrange
        policy.policy_settings.approvers = [{ approved: true, email: 'test1' }];
        policy.policy_settings.reviewers = [{ approved: true, email: 'test2' }];
        policy.policy_settings.owner = { approved: false, email: 'test3' };

        // Act
        const result = service.calculatePolicy(policy);

        // Assert
        expect(result.status).toEqual(ResourceStatusEnum.PENDING);
      });
    });

    describe('On Hold status', () => {
      it('policy status should be on hold if there are no stakeholders and automation exists', () => {
        // Arrange

        // Act
        const result = service.calculatePolicy(policy);

        // Assert
        expect(result.status).toEqual(ResourceStatusEnum.ON_HOLD);
      });
    });

    describe('Pending status', () => {
      it('policy status should be approved if all stakeholders approved', () => {
        // Arrange
        policy.policy_settings.approvers = [{ approved: true, email: 'test1' }];
        policy.policy_settings.reviewers = [{ approved: true, email: 'test2' }];
        policy.policy_settings.owner = { approved: true, email: 'test3' };

        // Act
        const result = service.calculatePolicy(policy);

        // Assert
        expect(result.status).toEqual(ResourceStatusEnum.APPROVED);
      });

      it('policy status should be approved if all stakeholders defined approved (null owner)', () => {
        // Arrange
        policy.policy_settings.approvers = [{ approved: true, email: 'test1' }];
        policy.policy_settings.reviewers = [{ approved: true, email: 'test2' }];

        // Act
        const result = service.calculatePolicy(policy);

        // Assert
        expect(result.status).toEqual(ResourceStatusEnum.APPROVED);
      });

      it('policy status should be approved if all stakeholders defined approved (no approvers && null owner)', () => {
        // Arrange
        policy.policy_settings.reviewers = [{ approved: true, email: 'test2' }];

        // Act
        const result = service.calculatePolicy(policy);

        // Assert
        expect(result.status).toEqual(ResourceStatusEnum.APPROVED);
      });
    });
  });

  describe('Policy status when evidence, settings and automation doesnt exist', () => {
    let policy: Policy;
    let schedualingNever: ScheduleSettings;

    beforeEach(() => {
      schedualingNever = { notify_me: NotifyMeEnum.Day, start_from: new Date(), notify_approvers: NotifyMeEnum.Never };
      policy = {
        policy_settings: { approvers: [], reviewers: [], owner: null, scheduling: schedualingNever },
        evidence: {},
      };
    });

    describe('OnHold Status', () => {
      it('policy status should be on hold if there are no stakeholders and notify approvers is never and notifyme is defined', () => {
        // Arrange
        // Act
        const result = service.calculatePolicy(policy);

        // Assert
        expect(result.status).toEqual(ResourceStatusEnum.ON_HOLD);
      });

      it('policy status should be on hold if there are no stakeholders and automation is not defined', () => {
        // Arrange
        policy.policy_settings.scheduling.notify_approvers = undefined;
        policy.policy_settings.scheduling.notify_me = undefined;
        // Act
        const result = service.calculatePolicy(policy);

        // Assert
        expect(result.status).toEqual(ResourceStatusEnum.ON_HOLD);
      });

      it('policy status should be on hold if there are no stakeholders and all automation is never', () => {
        // Arrange
        policy.policy_settings.scheduling.notify_me = NotifyMeEnum.Never;

        // Act
        const result = service.calculatePolicy(policy);

        // Assert
        expect(result.status).toEqual(ResourceStatusEnum.ON_HOLD);
      });

      it('policy status should be on hold if at least one approver is defined and hasnt approved and automation is set to never', () => {
        // Arrange
        policy.policy_settings.approvers = [{ approved: false, email: 'test' }];

        // Act
        const result = service.calculatePolicy(policy);

        // Assert
        expect(result.status).toEqual(ResourceStatusEnum.ON_HOLD);
      });

      it('policy status should be onHold if at least one reviwer is defined and hasnt approved and automation is set to never', () => {
        // Arrange
        policy.policy_settings.approvers = [{ approved: true, email: 'test1' }];
        policy.policy_settings.reviewers = [{ approved: false, email: 'test2' }];

        // Act
        const result = service.calculatePolicy(policy);

        // Assert
        expect(result.status).toEqual(ResourceStatusEnum.ON_HOLD);
      });

      it('policy status should be onHold if at least owner is defined and hasnt approved and automation is never', () => {
        // Arrange
        policy.policy_settings.approvers = [{ approved: true, email: 'test1' }];
        policy.policy_settings.reviewers = [{ approved: true, email: 'test2' }];
        policy.policy_settings.owner = { approved: false, email: 'test3' };

        // Act
        const result = service.calculatePolicy(policy);

        // Assert
        expect(result.status).toEqual(ResourceStatusEnum.ON_HOLD);
      });
    });

    describe('Approved Status', () => {
      it('policy status should be approved if all stakeholders approved and there is no automation', () => {
        // Arrange
        policy.policy_settings.approvers = [{ approved: true, email: 'test1' }];
        policy.policy_settings.reviewers = [{ approved: true, email: 'test2' }];
        policy.policy_settings.owner = { approved: true, email: 'test3' };

        // Act
        const result = service.calculatePolicy(policy);

        // Assert
        expect(result.status).toEqual(ResourceStatusEnum.APPROVED);
      });

      it('policy status should be approved if all stakeholders defined approved (null owner + no automation)', () => {
        // Arrange
        policy.policy_settings.approvers = [{ approved: true, email: 'test1' }];
        policy.policy_settings.reviewers = [{ approved: true, email: 'test2' }];

        // Act
        const result = service.calculatePolicy(policy);

        // Assert
        expect(result.status).toEqual(ResourceStatusEnum.APPROVED);
      });

      it('policy status should be approved if all stakeholders defined approved (no approvers + no automation)', () => {
        // Arrange
        policy.policy_settings.reviewers = [{ approved: true, email: 'test2' }];

        // Act
        const result = service.calculatePolicy(policy);

        // Assert
        expect(result.status).toEqual(ResourceStatusEnum.APPROVED);
      });
    });
  });

  describe('Texting next status date', () => {
    let policy: Policy;

    beforeEach(() => {
      policy = {
        policy_settings: {
          approvers: [],
          reviewers: [],
          owner: null,
          scheduling: {
            start_from: new Date('2020-03-01'),
            notify_me: NotifyApproversEnum.Never,
            notify_approvers: NotifyApproversEnum.Never,
          },
        },
        evidence: {},
      };
    });

    [
      {
        text: 'Check next cycle yearly - current month is bigger then start from month (sep > mar)',
        now: '2021-09-01',
      },
      {
        text: 'Check next cycle yearly - current month is smaller then start from month (Jan < mar)',
        now: '2022-01-01',
      },
    ].forEach((test) =>
      it(test.text, () => {
        // Arrange
        policy.policy_settings.scheduling.approval_frequency = ApprovalFrequencyEnum.Yearly;
        spyOn(global.Date, 'now').and.returnValue(new Date(test.now).getTime());

        // Act
        const result = service.calculatePolicy(policy);

        // Assert
        const date = new Date('2022-03-01');
        expect(result.next_cycle_date.getFullYear()).toEqual(date.getFullYear());
        expect(result.next_cycle_date.getMonth()).toEqual(date.getMonth());
        expect(result.next_cycle_date.getDate()).toEqual(date.getDate());
      })
    );

    it('Check next cycle monthly', () => {
      // Arrange
      policy.policy_settings.scheduling.approval_frequency = ApprovalFrequencyEnum.Monthly;
      spyOn(global.Date, 'now').and.returnValue(new Date('2021-09-02').getTime());

      // Act
      const result = service.calculatePolicy(policy);

      // Assert
      const date = new Date(`2021-10-01`);
      expect(result.next_cycle_date.getFullYear()).toEqual(date.getFullYear());
      expect(result.next_cycle_date.getMonth()).toEqual(date.getMonth());
      expect(result.next_cycle_date.getDate()).toEqual(date.getDate());
    });
    it('Check next cycle quarterly', () => {
      // Arrange
      policy.policy_settings.scheduling.approval_frequency = ApprovalFrequencyEnum.Quarterly;
      spyOn(global.Date, 'now').and.returnValue(new Date('2021-10-01').getTime());

      // Act
      const result = service.calculatePolicy(policy);

      // Assert
      const date = new Date(`2021-11-01`);
      expect(result.next_cycle_date.getFullYear()).toEqual(date.getFullYear());
      expect(result.next_cycle_date.getMonth()).toEqual(date.getMonth());
      expect(result.next_cycle_date.getDate()).toEqual(date.getDate());
    });
  });
});
