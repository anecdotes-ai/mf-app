import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ActionDispatcherService } from 'core/modules/data/services';
import { PoliciesFacadeService } from './policies-facade.service';
import { Action } from '@ngrx/store';
import { of } from 'rxjs';
import { PolicyService } from '../../policy/policy.service';
import { map, take } from 'rxjs/operators';
import { CalculationState } from 'core/modules/data/store/reducers';
import { CustomItemModel } from '../../../../customization/models';
import { TrackOperations } from 'core/modules/data/services/operations-tracker/constants/track.operations.list.constant';
import { ResourceType } from '../../../models';
import { PolicyManagerEventService } from 'core/services/policy-manager-event-service/policy-manager-event.service';
import { CalculatedPolicy, ResourceStatusEnum } from 'core/modules/data/models';
import { PolicySettings } from 'core/modules/data/models/domain';
import { configureTestSuite } from 'ng-bullet';
import { PolicyTypesEnum } from 'core/modules/data/models';
import {
  AddCustomPolicyAction,
  AddEvidencePayload,
  AddEvidenceToResourceAction,
  CalculationSelectors,
  EditCustomPolicyAction,
  UpdateEvidenceOfResourceAction,
} from '../../../store';

describe('PoliciesFacadeService', () => {
  configureTestSuite();

  let service: PoliciesFacadeService;
  let actionDispatcherMock: ActionDispatcherService;
  let mockStore: MockStore;
  let policyManagerEventService: PolicyManagerEventService;

  const policy_id = 'some-id';
  const inapplicable_policy_id = 'inapplicable-policy-id';
  const started_policy_id = 'started-policy-id';
  const not_started_policy_id = 'some-policy-id';
  const evidence_id = 'some_evidence_id';

  const policy_not_started = {
    policy_id: not_started_policy_id,
    policy_is_applicable: true,
    status: ResourceStatusEnum.NOTSTARTED
  } as CalculatedPolicy;

  const started_policy = {
    policy_id: started_policy_id,
    evidence: { evidence_id },
    policy_is_applicable: true,
    status: ResourceStatusEnum.APPROVED
  } as CalculatedPolicy;

  const inapplicable_policy = {
    policy_id: inapplicable_policy_id,
    policy_is_applicable: false
  } as CalculatedPolicy;

  const settings: PolicySettings = {
    approvers: [{ approved: false }],
    reviewers: [{ approved: false }],
    scheduling: {
      notify_approvers: 'month',
      approval_frequency: 'quarterly',
      notify_me: 'never',
    },
  };

  const policy: CalculatedPolicy = {
    policy_id: 'some-id',
    policy_name: 'some-name',
    policy_type: 'some-type',
    status: ResourceStatusEnum.ON_HOLD,
  };

  const calculationState: CalculationState = {
    calculatedPolicies: {
      entities: {
        [ policy_id ]: policy_not_started,
        [ started_policy_id ]: started_policy,
        [ inapplicable_policy_id ]: inapplicable_policy,
      },
      ids: [ policy_id, started_policy_id, inapplicable_policy_id ]
    },
    calculatedControls: undefined,
    calculatedRequirements: undefined,
    arePoliciesCalculated: true,
    areControlsCalculated: false
  };

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        PoliciesFacadeService,
        { provide: PolicyService, useValue: {} },
        { provide: PolicyManagerEventService, useValue: {} },
        { provide: ActionDispatcherService, useValue: {
          dispatchActionAsync: (action: Action, operationId: string, operationPartition?: string): Promise<any> => {
            return of({}).toPromise();
          }
        }
      }],
    }).compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(PoliciesFacadeService);
    service.getPolicy = jasmine.createSpy('getPolicy').and.returnValue(of(policy));
    actionDispatcherMock = TestBed.inject(ActionDispatcherService);
    policyManagerEventService = TestBed.inject(PolicyManagerEventService);
    policyManagerEventService.trackRemovePolicyEvent = jasmine.createSpy('trackRemovePolicyEvent');
    policyManagerEventService.trackSendPolicyForApprovalEvent = jasmine.createSpy('trackSendPolicyForApprovalEvent');
    policyManagerEventService.trackSavePolicySettingsEvent = jasmine.createSpy('trackSavePolicySettingsEvent');

    mockStore = TestBed.inject(MockStore);
    mockStore.overrideSelector(CalculationSelectors.SelectCalculationState, calculationState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Getters', () => {

    it('should return proper policy', async () => {
      // Arrange
      service.getPolicy = jasmine.createSpy('getPolicy').and.returnValue(of(policy_not_started));

      // Act
      const res = await service.getPolicy(not_started_policy_id).pipe(take(1)).toPromise();

      // Assert
      expect(res).toEqual(policy_not_started);
    });

    it('should return all started policies', async () => {
      // Arrange
      // Act
      const res = await service.getAllStartedPolicies().pipe(
        take(1),
        map((policies) => policies.map((some_policy) => some_policy.policy_id))
      ).toPromise();

      // Assert
      expect(res).toContain(started_policy_id);
    });

    it('should return all inapplicable policies', async () => {
      // Arrange
      // Act
      const res = await service.getAllNotApplicablePolicies().pipe(
        take(1),
        map((policies) => policies.map((some_policy) => some_policy.policy_id))
      ).toPromise();

      // Assert
      expect(res).toContain(inapplicable_policy_id);
    });

    it('should return all applicable policies sorted', async () => {
      // Arrange
      // Act
      const res = await service.getAllApplicableWithCategoriesOrderAndSort().pipe(
        take(1),
        map((policies) => policies.map((some_policy) => some_policy.policy_id))
      ).toPromise();

      // Assert
      expect(res[0]).toEqual(started_policy_id);
    });

    it('should return all existing policies types', async () => {
      // Arrange
      service.getAllApplicableWithCategoriesOrderAndSort =
        jasmine.createSpy('getAllApplicableWithCategoriesOrderAndSort').and.returnValue(of([policy]));

      // Act
      const res = await service.getPolicyTypesSorted().pipe(take(1)).toPromise();

      // Assert
      expect(res).toEqual([policy.policy_type, PolicyTypesEnum.Other]);
    });
  });

  describe('Policy Customization', () => {

    const policy_name = 'some-item-name';
    const payload = { name: policy_name, type: 'some-item-type' } as CustomItemModel;

    beforeEach(() => {
      const actionResponse = { policy_name };
      actionDispatcherMock.dispatchActionAsync = jasmine
        .createSpy('dispatchActionAsync')
        .and.callFake(() => actionResponse);
    });

    describe('addCustomPolicy', () => {

      it(`should dispatch AddCustomPolicyAction and return data from action result`, async () => {
        // Arrange
        const addedItem = { policy_name: policy_name, policy_type: 'some-item-type', policy_description: '' };

        // Act
        await service.addCustomPolicy(payload);

        // Assert
        expect(actionDispatcherMock.dispatchActionAsync).toHaveBeenCalledWith(
          new AddCustomPolicyAction(addedItem),
          TrackOperations.ADD_CUSTOM_POLICY
        );
      });
    });

    describe('editCustomPolicy', () => {

      it(`should dispatch EditCustomPolicyAction and return data from action result`, async () => {
        // Arrange
        const editedItem = { policy_name: policy_name, policy_type: 'some-item-type', policy_description: '' };
        const createFromExisting = false;

        // Act
        await service.editCustomPolicy(not_started_policy_id, payload, createFromExisting);

        // Assert
        expect(actionDispatcherMock.dispatchActionAsync).toHaveBeenCalledWith(
          new EditCustomPolicyAction(not_started_policy_id, editedItem),
          not_started_policy_id,
          TrackOperations.UPDATE_CUSTOM_POLICY
        );
      });
    });
  });

  describe('Evidence Actions', () => {

    const service_id = 'some-policy-id';
    const service_instance_id = 'some-policy-id';
    const resourceType = ResourceType.Policy;
    const evidence_id = 'some-evidence-id';
    const evidence = { } as File;

    const payload = {
      resourceType,
      resource_id: not_started_policy_id,
      service_id,
      service_instance_id,
      evidence: undefined,
      link: undefined
    } as AddEvidencePayload;

    beforeEach(() => {
      const actionResponse = {
        resource_id: not_started_policy_id,
        service_id,
        service_instance_id
       };
      actionDispatcherMock.dispatchActionAsync = jasmine
        .createSpy('dispatchActionAsync')
        .and.callFake(() => actionResponse);
    });

    describe('addEvidenceToPolicy', () => {

      it(`should dispatch addEvidenceToPolicy and return data from action result`, async () => {
        // Arrange
        // Act
        await service.addEvidenceToPolicy(not_started_policy_id, service_id, service_instance_id);

        // Assert
        expect(actionDispatcherMock.dispatchActionAsync).toHaveBeenCalledWith(
          new AddEvidenceToResourceAction(payload),
          TrackOperations.ADD_EVIDENCE_POLICY
        );
      });
    });

    describe('updateEvidencePolicy', () => {

      it(`should dispatch updateEvidencePolicy and return data from action result`, async () => {
        // Arrange
        payload.evidence = evidence;
        payload.evidence_id = evidence_id;

        // Act
        await service.updateEvidencePolicy(not_started_policy_id, service_id, service_instance_id, evidence_id, evidence);

        // Assert
        expect(actionDispatcherMock.dispatchActionAsync).toHaveBeenCalledWith(
          new UpdateEvidenceOfResourceAction(payload),
          TrackOperations.UPDATE_EVIDENCE_POLICY
        );
      });
    });

    it('should call policyManagerEventService.trackRemovePolicyEvent', () => {
      // Arrange
      // Act
      service.removePolicy({});

      // Assert
      expect(policyManagerEventService.trackRemovePolicyEvent).toHaveBeenCalledWith({});
    });

    it('should call policyManagerEventService.trackSendPolicyForApprovalEvent', async () => {
      // Arrange
      // Act
      await service.sharePolicy(policy.policy_id, {}, true, true);

      // Assert
      expect(policyManagerEventService.trackSendPolicyForApprovalEvent).toHaveBeenCalledWith(policy, true, true);
    });

    it('should call policyManagerEventService.trackSavePolicySettingsEvent', async () => {
      // Arrange
      // Act
      await service.editPolicySettings(policy, settings);

      // Assert
      expect(policyManagerEventService.trackSavePolicySettingsEvent).toHaveBeenCalledWith(policy, settings);
    });
  });
});
