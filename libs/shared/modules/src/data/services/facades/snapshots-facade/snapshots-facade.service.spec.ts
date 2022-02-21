import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Action , StoreModule } from '@ngrx/store';
import { ActionDispatcherService } from 'core/modules/data/services';
import { of } from 'rxjs';
import { SnapshotsFacadeService } from './snapshots-facade.service';
import { reducers } from 'core/modules/data/store/state';
import { SnapshotState } from 'core/modules/data/store/reducers';
import { CalculatedControl, CalculatedEvidence, CalculatedPolicy, CalculatedRequirement } from 'core/modules/data/models';
import { take } from 'rxjs/operators';

describe('SnapshotsFacadeService', () => {
  let service: SnapshotsFacadeService;
  let mockStore: MockStore;

  const mockControls: CalculatedControl[] = [
    {
      control_id: 'first_control_id',
      snapshot_id: 'first_snap_control_id',
    },
    {
      control_id: 'second_control_id',
      snapshot_id: 'second_snap_control_id',
    },
  ];
  const mockRequirements: CalculatedRequirement[] = [
    {
      requirement_id: 'first_requirement_id',
      snapshot_id: 'first_snap_requirement_id',
    },
    {
      requirement_id: 'second_requirement_id',
      snapshot_id: 'second_snap_requirement_id',
    },
  ];
  const mockEvidence: CalculatedEvidence[] = [
    {
      evidence_id: 'first_evidence_id',
      evidence_instance_id: 'first_snap_evidence_id',
    },
    {
      evidence_id: 'second_evidence_id',
      evidence_instance_id: 'second_snap_evidence_id',
    },
  ];
  const mockPolicies: CalculatedPolicy[] = [
    {
      policy_id: 'first_policy_id',
      snapshot_id: 'first_snap_policy_id',
    },
    {
      policy_id: 'second_policy_id',
      snapshot_id: 'second_snap_policy_id',
    },
  ];

  const snapshotState: SnapshotState = {
    firstLoad: true,
    calculatedControls: {
      ids: mockControls.map((c) => c.snapshot_id),
      entities: 
      {
        [mockControls[0].snapshot_id]: mockControls[0],
        [mockControls[1].snapshot_id]: mockControls[1],
      },
    },
    calculatedRequirements: {
      ids: mockRequirements.map((c) => c.snapshot_id),
      entities: 
      {
        [mockRequirements[0].snapshot_id]: mockRequirements[0],
        [mockRequirements[1].snapshot_id]: mockRequirements[1],
      },
    },
    calculatedFrameworks: undefined,
    calculatedEvidences: {
      ids: mockEvidence.map((c) => c.evidence_instance_id),
      entities: 
      {
        [mockEvidence[0].evidence_instance_id]: mockEvidence[0],
        [mockEvidence[1].evidence_instance_id]: mockEvidence[1],
      },
    },
    calculatedPolicies: {
      ids: mockPolicies.map((c) => c.snapshot_id),
      entities: 
      {
        [mockPolicies[0].snapshot_id]: mockPolicies[0],
        [mockPolicies[1].snapshot_id]: mockPolicies[1],
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)],
      providers: [
        provideMockStore(),
        SnapshotsFacadeService,
        {
          provide: ActionDispatcherService,
          useValue: {
            dispatchActionAsync: (action: Action, operationId: string, operationPartition?: string): Promise<any> => {
              return of({}).toPromise();
            },
          },
        }
      ],
    });
    service = TestBed.inject(SnapshotsFacadeService);
    mockStore = TestBed.inject(MockStore);

    mockStore.setState({
      snapshotState,
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getControlSnapshot', () => {
    it('should return control by id', async () => {
      // Arrange
      // Act
      const res = await service.getControlSnapshot(mockControls[0].control_id, mockControls[0].snapshot_id).pipe(take(1)).toPromise();

      // Assert
      expect(res).toEqual(mockControls[0]);
    });
  });

  describe('getRequirementsSnapshot', () => {
    it('should return requiremnts by id', async () => {
      // Arrange
      // Act
      const res = await service.getRequirementsSnapshot([mockRequirements[0].snapshot_id]).pipe(take(1)).toPromise();

      // Assert
      expect(res).toEqual([mockRequirements[0]]);
    });
  });

  describe('getPolicySnapshot', () => {
    it('should return requiremnts by id', async () => {
      // Arrange
      // Act
      const res = await service.getPolicySnapshot([mockPolicies[0].snapshot_id]).pipe(take(1)).toPromise();

      // Assert
      expect(res).toEqual([mockPolicies[0]]);
    });
  });

  describe('getEvidenceSnapshot', () => {
    it('should return requiremnts by id', async () => {
      // Arrange
      // Act
      const res = await service.getEvidenceSnapshot([mockEvidence[0].evidence_instance_id]).pipe(take(1)).toPromise();

      // Assert
      expect(res).toEqual([mockEvidence[0]]);
    });
  });
});
