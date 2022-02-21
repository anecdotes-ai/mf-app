import { of } from 'rxjs/internal/observable/of';
import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { PolicyApprovalComponent } from './policy-approval.component';
import { GridViewBuilderService } from 'core/modules/grid';
import { PoliciesFacadeService } from 'core/modules/data/services';
import { PolicyModalService } from 'core/modules/shared-policies/services';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ApproverRoleEnum, BEEpoch } from 'core';
import { ResourceStatusEnum } from 'core/modules/data/models';
import { PolicyManagerEventService } from 'core/services/policy-manager-event-service/policy-manager-event.service';

describe('PolicyApprovalComponent', () => {
  configureTestSuite();

  let component: PolicyApprovalComponent;
  let fixture: ComponentFixture<PolicyApprovalComponent>;
  let regularDate: string;
  let policiesFacade: PoliciesFacadeService;
  let policyManagerEventService: PolicyManagerEventService;
  let policyModal: PolicyModalService;

  const ownerEmail = 'ownerEmail';
  const policy = {
    policy_id: 'blobi',
    has_roles: true,
    approvers_statuses: [{email: ownerEmail, status: ResourceStatusEnum.PENDING, last_notified: undefined, type: ApproverRoleEnum.Owner }],
    policy_settings: {
      approvers: [],
      reviewers: [],
      owner: {
        email: ownerEmail,
        name: 'ownerName',
        role: ApproverRoleEnum.Owner,
        comments: 'dfsdf',
        last_notified: undefined,
        approved: false,
      },
    },
  };

  beforeAll(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [PolicyApprovalComponent],
      providers: [
        { provide: PolicyModalService, useValue: {} },
        { provide: PoliciesFacadeService, useValue: {} },
        { provide: PolicyManagerEventService, useValue: {} },
        GridViewBuilderService,
        TranslateService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyApprovalComponent);
    component = fixture.componentInstance;

    policiesFacade = TestBed.inject(PoliciesFacadeService);
    policiesFacade.approveOnBehalf = jasmine.createSpy('approveOnBehalf');
    policiesFacade.getPolicy = jasmine.createSpy('getPolicy').and.returnValue(of(policy));

    policyManagerEventService = TestBed.inject(PolicyManagerEventService);
    policyManagerEventService.trackCancelApprovalEvent = jasmine.createSpy('trackCancelApprovalEvent');

    policyModal = TestBed.inject(PolicyModalService);
    policyModal.addPolicySettingsModal = jasmine.createSpy('addPolicySettingsModal').and.callFake(() => {});

    regularDate = 'Wed Oct 06 2021 14:05:20 GMT+0300 (Israel Daylight Time)';
    fixture.detectChanges();
  });

  describe('#approverLastNotified', () => {
    it('should return undefined if approver last_notified is undefined', fakeAsync(() => {
      // Act
      const result = component.approverLastNotified(0);

      // Assert
      expect(result).toBeUndefined();
    }));

    it('should return undefined if approver last_notified is epoch time', () => {
      // Arrange
      component.policy.approvers_statuses.find(a => a.email === ownerEmail).last_notified = BEEpoch;

      // Act
      const result = component.approverLastNotified(0);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should return date if approver last_notified is not epoch time', () => {
      // Arrange
      component.policy.approvers_statuses.find(a => a.email === ownerEmail).last_notified = regularDate;

      // Act
      const result = component.approverLastNotified(0);

      // Assert
      expect(result).toBeTruthy();
    });

    afterEach(() => {
      component.policy.approvers_statuses.find(a => a.email === ownerEmail).last_notified = undefined;
    });
  });

  describe('#sendForApprovalTooltipTranslationKey', () => {
    const sendForApproval = 'policyManager.policyPreview.sendForApproval';
    const resend = 'policyManager.policyPreview.resend';

    it('should return sendForApproval relative key if status is not pending', () => {
      // Arrange
      component.policy.approvers_statuses.find(a => a.email === ownerEmail).last_notified = regularDate;

      // Act
      const result = component.sendForApprovalTooltipTranslationKey(ResourceStatusEnum.ON_HOLD, 0);

      // Assert
      expect(result).toEqual(sendForApproval);
    });

    it('should return sendForApproval relative key if last notified is epoch and status is pending', () => {
      // Arrange
      component.policy.approvers_statuses.find(a => a.email === ownerEmail).last_notified = BEEpoch;

      // Act
      const result = component.sendForApprovalTooltipTranslationKey(ResourceStatusEnum.PENDING, 0);

      // Assert
      expect(result).toEqual(sendForApproval);
    });

    it('should return resend relative key if last notified is a regular date and status is pending', () => {
      // Arrange
      component.policy.approvers_statuses.find(a => a.email === ownerEmail).last_notified = regularDate;

      // Act
      const result = component.sendForApprovalTooltipTranslationKey(ResourceStatusEnum.PENDING, 0);

      // Assert
      expect(result).toEqual(resend);
    });

    afterEach(() => {
      component.policy.approvers_statuses.find(a => a.email === ownerEmail).last_notified = undefined;
    });
  });

  it('should call policyManagerEventService.trackCancelApprovalEvent with appropriate params', async () => {
    // Arrange
    component.gridView = {
      rows: [
        {
          simplifiedCellsObject: {
            email: 'ownerEmail',
            name: 'name',
            type: component.buildTranslationKey('owner')
          },
          rowId: undefined,
          cells: undefined,
          cellsObject: undefined
        }
      ],
      header: undefined,
      rawData: undefined,
      searchDefinitions: undefined
    };

    // Act
    await fixture.detectChanges();
    await component.approveOnBehalf(0, ResourceStatusEnum.APPROVED);

    // Assert
    expect(policyManagerEventService.trackCancelApprovalEvent).toHaveBeenCalledWith(policy);
  });

  describe('#openPolicySettings', () => {
    it('should call policyModalService.addPolicySettingsModal with policyId', () => {
      // Arange
      component.policy = policy;

      // Act
      component.openPolicySettings();

      // Assert
      expect(policyModal.addPolicySettingsModal).toHaveBeenCalledWith({ policyId: policy.policy_id });
    });
  });
});
