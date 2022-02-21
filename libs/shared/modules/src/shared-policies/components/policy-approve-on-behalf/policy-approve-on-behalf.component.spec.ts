import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PolicyApproveOnBehalfComponent } from './policy-approve-on-behalf.component';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { of } from 'rxjs';
import { PoliciesFacadeService } from 'core/modules/data/services';
import { PolicyManagerEventService } from 'core/services/policy-manager-event-service/policy-manager-event.service';
import { configureTestSuite } from 'ng-bullet';
import { CalculatedPolicy, ResourceStatusEnum } from 'core/modules/data/models';
import { PolicySettingsModalEnum } from '../../constants';
import { ApproveOnBehalfContext } from 'core/modules/shared-policies/models/approve-on-behalf-context';
import { ApproverInstance, ApproverTypeEnum, Policy } from 'core/modules/data/models/domain';
import { ApproveOnBehalf } from 'core/modules/data/models/domain/approveOnBehalf';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PolicyApproveOnBehalfComponent', () => {
  configureTestSuite();

  let component: PolicyApproveOnBehalfComponent;
  let fixture: ComponentFixture<PolicyApproveOnBehalfComponent>;
  let policyManagerEventService: PolicyManagerEventService;
  let policiesFacade: PoliciesFacadeService;
  let switcherMock: ComponentSwitcherDirective;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  const relativeKey = 'fake-relative-key';
  const policy_id = 'some-policy-id';
  const approver: ApproverInstance = {
    name: 'some-approver-name',
    email: 'some-approver-email',
    comments: 'some-approver-comments'
  };
  const fakeContext: ApproveOnBehalfContext = {
    policyId: policy_id,
    approverInstance: approver,
    approved: false,
    translationKey: relativeKey,
    approverType: ApproverTypeEnum.Owner
  };
  const policy: Policy = {
    policy_id
  };

  beforeAll(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [PolicyApproveOnBehalfComponent],
      providers: [
        { provide: ComponentSwitcherDirective, useValue: {} },
        { provide: PoliciesFacadeService, useValue: {} },
        { provide: PolicyManagerEventService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyApproveOnBehalfComponent);
    component = fixture.componentInstance;

    policyManagerEventService = TestBed.inject(PolicyManagerEventService);
    policyManagerEventService.trackApproveOnBehalfEvent = jasmine.createSpy('trackApproveOnBehalfEvent');

    policiesFacade = TestBed.inject(PoliciesFacadeService);
    policiesFacade.getPolicy = jasmine.createSpy('getPolicy').and.returnValue(of(policy));
    policiesFacade.approveOnBehalf = jasmine.createSpy('approveOnBehalf');
    switcherMock = TestBed.inject(ComponentSwitcherDirective);
    switcherMock.goById = jasmine.createSpy('goById');
    switcherMock.sharedContext$ = of( fakeContext );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {

    it('should assign correct approverInstance from context', async () => {
      // Arrange
      // Act
      await detectChanges();

      // Assert
      expect(component.approverInstance).toEqual(fakeContext.approverInstance);
    });

    it('should assign correct policy from context', async () => {
      // Arrange
      // Act
      await detectChanges();

      // Assert
      expect(component.policy).toEqual(policy);
    });

    it('should assign correct approveStatus from context', async () => {
      // Arrange
      // Act
      await detectChanges();

      // Assert
      expect(component.approveStatus).toEqual(fakeContext.approved);
    });

    it('should build a new formGroup', async () => {
      // Arrange
      // Act
      await detectChanges();

      // Assert
      expect(component.formGroup).toBeTruthy();
    });
  });

  describe('buildTranslationKey', () => {

    it('should build correct translation key', () => {
      // Arrange
      // Act
      let actualTranslationKey = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actualTranslationKey).toBe(`policyManager.approveOnBehalf.${relativeKey}`);
    });
  });

  describe('approve', () => {

    it(`should call policiesFacade.approveOnBehalf with: ${policy_id}, 
          { ${fakeContext.approved}, null, ${fakeContext.approverInstance.email} }`, async () => {
      // Arrange
      let payload: ApproveOnBehalf = {
        approved: fakeContext.approved,
        comments: null,
        email: fakeContext.approverInstance.email,
        approver_type: fakeContext.approverType
      };

      // Act
      await detectChanges();
      component.approve();

      // Assert
      expect(policiesFacade.approveOnBehalf).toHaveBeenCalledWith(policy_id, payload);
    });

    it('should call goById with Success', async () => {
      // Arrange
      // Act
      await detectChanges();
      await component.approve();

      // Assert
      expect(switcherMock.goById).toHaveBeenCalledWith(PolicySettingsModalEnum.Success);
    });

    it('should call goById with Error', async () => {
      // Arrange
        policiesFacade.approveOnBehalf = jasmine.createSpy('approveOnBehalf').and.throwError(new Error());

        // Act
      await detectChanges();
      await component.approve();

      // Assert
      expect(switcherMock.goById).toHaveBeenCalledWith(PolicySettingsModalEnum.Error);
    });
  });

  it('should call policyManagerEventService.trackApproveOnBehalfEvent with appropriate params', async () => {
    // Arrange
    component.policy = {
      policy_name: 'some-name',
      status: ResourceStatusEnum.ON_HOLD,
    } as CalculatedPolicy;

    // Act
    await detectChanges();
    await component.approve();

    // Assert
    expect(policyManagerEventService.trackApproveOnBehalfEvent).toHaveBeenCalledWith(component.policy);
  });
});
