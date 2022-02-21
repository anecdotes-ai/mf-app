import { ActionDispatcherService } from 'core/modules/data/services';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EvidenceState } from 'core/modules/data/store/reducers';
import { take } from 'rxjs/operators';
import { EvidenceFacadeService } from './evidences-facade.service';
import { RequirementsFacadeService } from 'core/modules/data/services';
import { EvidenceEventData, EvidenceEventDataProperty, UserEvents } from 'core';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { ControlsFacadeService } from 'core/modules/data/services';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { PoliciesFacadeService } from 'core/modules/data/services';
import { PluginFacadeService } from 'core/modules/data/services';
import { CalculatedControl, CalculatedPolicy, CalculatedRequirement } from '../../../models';
import { of } from 'rxjs';
import {
  AddEvidenceFromTicketAction,
  AttachRequirementPolicy,
  CreateEvidenceURLAction,
} from '../../../store';
import { TrackOperations } from 'core/modules/data/services';
import { Service, Framework } from 'core/modules/data/models/domain';

describe('EvidenceFacadeService', () => {
  let service: EvidenceFacadeService;
  let mockStore: MockStore;
  const evidence_id = 'some-evience-id';
  const evidence = { evidence_id };

  let requirementsFacadeMock: RequirementsFacadeService;
  let controlsFacadeMock: ControlsFacadeService;
  let frameworksFacadeMock: FrameworksFacadeService;
  let pluginFacadeMock: PluginFacadeService;
  let policiesFacadeMock: PoliciesFacadeService;
  let userEventServiceMock: UserEventService;
  let actionDispatcherMock: ActionDispatcherService;

  const evidencesState: EvidenceState = {
    evidences: { entities: { [evidence_id]: evidence }, ids: [evidence_id] },
    evidence_history_run: {},
    areLoaded: true,
  };

  const fakeFramework: Framework = {
    framework_id: 'fake-framework-id',
    framework_name: 'fake-framework-name',
  };
  const fakeControl: CalculatedControl = {
    control_id: 'fake-control-id',
    control_name: 'fake-control-name',
    control_category: 'fake-control-category',
  };
  const fakeRequirement: CalculatedRequirement = {
    requirement_id: 'fake-requirement-id',
    requirement_name: 'fake-requirement-name',
  };

  const fakeService: Service = {
    service_display_name: 'fake-service-name',
    service_id: 'fake-service-id',
    service_instances_list: [{ service_instance_id: 'instanceId', service_id: 'fake-service-id', service_status: 'SERVICE_INSTALLED' }]
  };

  const fakePolicy: CalculatedPolicy = {
    policy_name: 'fake-policy-name',
  };

  function createEvent(): EvidenceEventData {
    return {
      [EvidenceEventDataProperty.FrameworkName]: fakeFramework.framework_name,
      [EvidenceEventDataProperty.ControlName]: fakeControl.control_name,
      [EvidenceEventDataProperty.ControlCategory]: fakeControl.control_category,
      [EvidenceEventDataProperty.RequirementName]: fakeRequirement.requirement_name,
    };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        EvidenceFacadeService,
        {
          provide: ActionDispatcherService,
          useValue: {},
        },
        {
          provide: RequirementsFacadeService,
          useValue: {},
        },
        {
          provide: UserEventService,
          useValue: {},
        },
        {
          provide: RequirementsFacadeService,
          useValue: {},
        },
        {
          provide: ControlsFacadeService,
          useValue: {},
        },
        {
          provide: FrameworksFacadeService,
          useValue: {},
        },
        {
          provide: PluginFacadeService,
          useValue: {},
        },
        {
          provide: PoliciesFacadeService,
          useValue: {},
        },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(EvidenceFacadeService);

    mockStore = TestBed.inject(MockStore);

    mockStore.setState({
      evidencesState,
    });

    requirementsFacadeMock = TestBed.inject(RequirementsFacadeService);
    controlsFacadeMock = TestBed.inject(ControlsFacadeService);
    frameworksFacadeMock = TestBed.inject(FrameworksFacadeService);
    pluginFacadeMock = TestBed.inject(PluginFacadeService);
    policiesFacadeMock = TestBed.inject(PoliciesFacadeService);
    userEventServiceMock = TestBed.inject(UserEventService);
    actionDispatcherMock = TestBed.inject(ActionDispatcherService);

    userEventServiceMock.sendEvent = jasmine.createSpy('sendEvent');
    actionDispatcherMock.dispatchActionAsync = jasmine
      .createSpy('dispatchActionAsync')
      .and.callFake(() => Promise.resolve());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEvidence', () => {
    it('should return proper evidence', async () => {
      // Arrange
      // Act
      const res = await service.getEvidence(evidence_id).pipe(take(1)).toPromise();

      // Assert
      expect(res).toEqual(evidence);
    });
  });

  describe('requirement related methods', () => {
    beforeEach(() => {
      frameworksFacadeMock.getFrameworkById = jasmine
        .createSpy('getFrameworkById')
        .and.callFake(() => of(fakeFramework));
      controlsFacadeMock.getControl = jasmine.createSpy('getControl').and.callFake(() => of(fakeControl));
      requirementsFacadeMock.getRequirement = jasmine
        .createSpy('getRequirement')
        .and.callFake(() => of(fakeRequirement));
      pluginFacadeMock.getServiceById = jasmine.createSpy('getServiceById').and.callFake(() => of(fakeService));
      policiesFacadeMock.getPolicy = jasmine.createSpy('getPolicy').and.callFake(() => of(fakePolicy));
    });

    describe('createRequirementUrlEvidenceAsync', () => {
      const evidenceIds = ['fake'];
      const actionResponse = { evidence_id: evidenceIds };
      const fakeUrl = 'google.com';
      const fakeEvidenceName = 'fake-evidence';

      beforeEach(() => {
        actionDispatcherMock.dispatchActionAsync = jasmine
          .createSpy('dispatchActionAsync')
          .and.callFake(() => actionResponse);
      });

      it(`should dispatch CreateEvidenceURLAction action and return data froma action result`, async () => {
        // Arrange
        // Act
        await service.createRequirementUrlEvidenceAsync(
          fakeUrl,
          fakeRequirement.requirement_id,
          fakeEvidenceName,
          fakeControl.control_id,
          fakeFramework.framework_id
        );

        // Assert
        expect(actionDispatcherMock.dispatchActionAsync).toHaveBeenCalledWith(
          new CreateEvidenceURLAction(fakeRequirement.requirement_id, fakeUrl, fakeEvidenceName),
          TrackOperations.CREATE_EVIDENCE_URL
        );
      });

      it(`should send ${UserEvents.ADD_EVIDENCE_URL} with proper data`, async () => {
        // Arrange
        // Act
        await service.createRequirementUrlEvidenceAsync(
          fakeUrl,
          fakeRequirement.requirement_id,
          fakeEvidenceName,
          fakeControl.control_id,
          fakeFramework.framework_id
        );

        // Assert
        expect(userEventServiceMock.sendEvent).toHaveBeenCalledOnceWith(UserEvents.ADD_EVIDENCE_URL, {
          ...createEvent(),
          [EvidenceEventDataProperty.AddedUrl]: fakeUrl,
        });
      });
    });

    describe('addEvidenceFromTicketAsync', () => {
      const evidenceIds = ['fake'];
      const actionResponse = { evidence_id: evidenceIds };

      beforeEach(() => {
        actionDispatcherMock.dispatchActionAsync = jasmine
          .createSpy('dispatchActionAsync')
          .and.callFake(() => actionResponse);
      });

      it(`should dispatch addEvidenceFromTicketAsync action and return data froma action result`, async () => {
        // Arrange
        // Act
        await service.addEvidenceFromTicketAsync(
          fakeRequirement.requirement_id,
          fakeService.service_id,
          fakeService.service_instances_list[0].service_instance_id,
          [],
          fakeFramework.framework_id,
          fakeControl.control_id
        );

        // Assert
        expect(actionDispatcherMock.dispatchActionAsync).toHaveBeenCalledWith(
          new AddEvidenceFromTicketAction(fakeRequirement.requirement_id, fakeService.service_id, fakeService.service_instances_list[0].service_instance_id, []),
          TrackOperations.ADD_EVIDENCE_FROM_TICKET
        );
      });

      it(`should send ${UserEvents.ADD_EVIDENCE_TICKETING} with proper data`, async () => {
        // Arrange
        // Act
        await service.addEvidenceFromTicketAsync(
          fakeRequirement.requirement_id,
          fakeService.service_id,
          fakeService.service_instances_list[0].service_instance_id,
          [],
          fakeFramework.framework_id,
          fakeControl.control_id
        );

        // Assert
        expect(userEventServiceMock.sendEvent).toHaveBeenCalledOnceWith(UserEvents.ADD_EVIDENCE_TICKETING, {
          ...createEvent(),
          [EvidenceEventDataProperty.Type]: fakeService.service_display_name,
        });
      });
    });
  });

  describe('policy related methods', () => {
    beforeEach(() => {
      frameworksFacadeMock.getFrameworkById = jasmine
        .createSpy('getFrameworkById')
        .and.callFake(() => of(fakeFramework));
      controlsFacadeMock.getControl = jasmine.createSpy('getControl').and.callFake(() => of(fakeControl));
      requirementsFacadeMock.getRequirement = jasmine
        .createSpy('getRequirement')
        .and.callFake(() => of(fakeRequirement));
      pluginFacadeMock.getServiceById = jasmine.createSpy('getServiceById').and.callFake(() => of(fakeService));
      policiesFacadeMock.getPolicy = jasmine.createSpy('getPolicy').and.callFake(() => of(fakePolicy));
    });

    describe('attachPolicyToRequirementAsync', () => {
      const evidenceIds = ['fake'];
      const actionResponse = { evidence_id: evidenceIds };
      const policyId = 'fake-policy-id';

      beforeEach(() => {
        actionDispatcherMock.dispatchActionAsync = jasmine
          .createSpy('dispatchActionAsync')
          .and.callFake(() => actionResponse);
      });

      it(`should dispatch AttachRequirementPolicy action and return data froma action result`, async () => {
        // Arrange
        // Act
        await service.attachPolicyToRequirementAsync(
          fakeRequirement,
          policyId,
          fakeControl.control_id,
          fakeFramework.framework_id
        );

        // Assert
        expect(actionDispatcherMock.dispatchActionAsync).toHaveBeenCalledWith(
          new AttachRequirementPolicy(fakeRequirement, policyId),
          TrackOperations.ATTACH_POLICY_TO_REQUIREMENT
        );
      });

      it(`should send ${UserEvents.ADD_EVIDENCE_POLICY} with proper data`, async () => {
        // Arrange
        // Act
        await service.attachPolicyToRequirementAsync(
          fakeRequirement,
          policyId,
          fakeControl.control_id,
          fakeFramework.framework_id
        );

        // Assert
        expect(userEventServiceMock.sendEvent).toHaveBeenCalledOnceWith(UserEvents.ADD_EVIDENCE_POLICY, {
          ...createEvent(),
          [EvidenceEventDataProperty.SelectedPolicy]: fakePolicy.policy_name,
        });
      });
    });
  });
});
