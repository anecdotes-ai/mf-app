import { TestBed } from '@angular/core/testing';

import { DataAggregationFacadeService } from './data-aggregation-facade.service';
import { provideMockStore } from '@ngrx/store/testing';
import {
  ControlsFacadeService,
  EvidenceFacadeService,
  FrameworksFacadeService,
  PoliciesFacadeService,
  RequirementsFacadeService,
} from 'core/modules/data/services';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { CalculatedControl } from 'core/modules/data/models';
import { ControlRequirement, Framework } from 'core/modules/data/models/domain';

describe('DataAggregationService', () => {
  configureTestSuite();

  let service: DataAggregationFacadeService;
  let requirementFacade: RequirementsFacadeService;
  let controlsFacade: ControlsFacadeService;
  let frameworksFacade: FrameworksFacadeService;

  const policyRelatedRequirements: ControlRequirement[] = [{ requirement_id: 'some-req-1' }, { requirement_id: 'some-req-2' }];

  const controls: CalculatedControl[] = [
    {
      control_id: 'control-id-1',
      control_framework: 'some-framework-1',
      control_name: 'some-control-name-1',
    },
    {
      control_id: 'control-id-2',
      control_framework: 'some-framework-1',
      control_name: 'some-control-name-2',
    },
    {
      control_id: 'control-id-3',
      control_framework: 'some-framework-3',
      control_name: 'some-control-name-3',
    },
    {
      control_id: 'control-id-4',
      control_framework: 'some-framework-4',
      control_name: 'some-control-name-4',
    },
  ];

  const frameworks: Framework[] = [
    { framework_name: 'some-framework-1' },
    { framework_name: 'some-framework-2' },
    { framework_name: 'some-framework-3' },
    { framework_name: 'some-framework-4' },
    { framework_name: 'some-framework-5' },
  ];

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        DataAggregationFacadeService,
        { provide: ControlsFacadeService, useValue: {} },
        { provide: FrameworksFacadeService, useValue: {} },
        { provide: RequirementsFacadeService, useValue: {} },
        { provide: EvidenceFacadeService, useValue: {} },
        { provide: PoliciesFacadeService, useValue: {} }
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(DataAggregationFacadeService);

    requirementFacade = TestBed.inject(RequirementsFacadeService);
    requirementFacade.getControlsByRequirementId = jasmine
      .createSpy('getControlsByRequirementId')
      .and.returnValue(of(controls));

    requirementFacade.getRequirementsByPolicyId = jasmine
      .createSpy('getRequirementsByPolicyId')
      .and.returnValue(of(policyRelatedRequirements));

    controlsFacade = TestBed.inject(ControlsFacadeService);
    controlsFacade.getAllControls = jasmine.createSpy('getAllControls').and.returnValue(of(controls));

    frameworksFacade = TestBed.inject(FrameworksFacadeService);
    frameworksFacade.getApplicableFrameworks = jasmine
      .createSpy('getApplicableFrameworks')
      .and.returnValue(of(frameworks));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('service.getPolicyRelatedRequirementsIds should return policyRelatedRequirements prop', async () => {
    // Arrange
    // Act
    const result = await requirementFacade.getRequirementsByPolicyId('some-policy').toPromise();

    // Assert
    expect(result).toEqual(policyRelatedRequirements);
  });

  it('service.getPolicyRelatedRequirementsIds should return requirementRelatedControls prop', async () => {
    // Arrange
    // Act
    const result = await service.getRequirementsRelatedControls(['some-policy-1']).toPromise();

    // Assert
    expect(result).toEqual(controls);
  });
});
