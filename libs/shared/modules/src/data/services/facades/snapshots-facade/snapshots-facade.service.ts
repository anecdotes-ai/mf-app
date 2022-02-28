import { Injectable } from '@angular/core';
import { ActionDispatcherService } from '../../../services/action-dispatcher/action-dispatcher.service';
import {
  CalculatedControl,
  CalculatedPolicy,
  CalculatedRequirement,
} from 'core/modules/data/models';
import { Store } from '@ngrx/store';
import { debounceTime, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  AddControlSnapshotAction,
  AddControlsSnapshotsAction,
  AddEvidenceSnapshotAction,
  AddFrameworkSnapshotAction,
  AddPoliciesSnapshotAction,
  AddRequirementsSnapshotAction,
} from 'core/modules/data/store';
import { TrackOperations } from '../../operations-tracker/constants/track.operations.list.constant';
import { SnapshotSelectors } from '../../../store/selectors';
import { EvidenceInstance, Framework } from '../../../models/domain';

@Injectable()
export class SnapshotsFacadeService {
  constructor(private store: Store, private actionDispatcher: ActionDispatcherService) {}

  getControlSnapshot(control_id: string, snapshot_id: string): Observable<CalculatedControl> {
    return this.store
      .select(SnapshotSelectors.SelectSnapshotState)
      .pipe(
        map((snapshotState) => snapshotState.calculatedControls),
        mergeMap(async (calculatedControls) => {
          if (!calculatedControls.ids.length || !calculatedControls.entities[snapshot_id]) {
            await this.actionDispatcher.dispatchActionAsync(
              AddControlSnapshotAction({ control_id, snapshot_id }),
              TrackOperations.ADD_CONTROL_SNAPSHOT
            );
          }
          return calculatedControls.entities[snapshot_id];
        }),
        map((control) => control)
      );
  }

  getRequirementsSnapshot(snapshot_ids: string[]): Observable<CalculatedRequirement[]> {
    return this.store
      .select(SnapshotSelectors.SelectSnapshotState)
      .pipe(
        map((snapshotState) => snapshotState.calculatedRequirements),
        mergeMap(async (calculatedRequirements) => {
          let newSnaps = [];
          snapshot_ids.forEach((id) => {
            if (
              !calculatedRequirements.ids.length ||
              !calculatedRequirements.entities[id]
            ) {
              newSnaps.push(id);
            }
          });
          if (newSnaps.length) {
            await this.actionDispatcher.dispatchActionAsync(
              AddRequirementsSnapshotAction({ requirement_ids: newSnaps }),
              TrackOperations.ADD_REQUIREMENT_SNAPSHOT
            );
          }
          return snapshot_ids.map((id) => calculatedRequirements.entities[id]);
        }),
        map((reqs) => reqs)
      );
  }

  getEvidenceSnapshot(snapshot_ids: string[]): Observable<EvidenceInstance[]> {
    return this.store
      .select(SnapshotSelectors.SelectSnapshotEvidenceState)
      .pipe(
        mergeMap(async (evidences) => {
          let newSnaps = [];
          snapshot_ids.forEach((id) => {
            if (!evidences.ids.length || !evidences.entities[id]) {
              newSnaps.push(id);
            }
          });
          if (newSnaps.length) {
            await this.actionDispatcher.dispatchActionAsync(
              AddEvidenceSnapshotAction({ evidence_id: newSnaps }),
              TrackOperations.ADD_EVIDENCE_SNAPSHOT
            );
          }
          return snapshot_ids.map((id) => evidences.entities[id]);
        }),
        map((evidence) => evidence)
      );
  }
  getPolicySnapshot(snapshot_ids: string[]): Observable<CalculatedPolicy[]> {
    return this.store
      .select(SnapshotSelectors.SelectSnapshotState)
      .pipe(
        map((snapshotState) => snapshotState.calculatedPolicies),
        mergeMap(async (calculatedPolicies) => {
          let newSnaps = [];
          snapshot_ids.forEach((id) => {
            if (!calculatedPolicies.ids.length || !calculatedPolicies.entities[id]) {
              newSnaps.push(id);
            }
          });
          if (newSnaps.length) {
            await this.actionDispatcher.dispatchActionAsync(
              AddPoliciesSnapshotAction({ policies_ids: newSnaps }),
              TrackOperations.ADD_POLICY_SNAPSHOT
            );
          }
          return snapshot_ids.map((id) => calculatedPolicies.entities[id]);
        }),
        map((policies) => policies)
      );
  }

  getControlsSnapshot(control_ids: string[]): Observable<CalculatedControl[]> {
    return this.store
      .select(SnapshotSelectors.SelectSnapshotState)
      .pipe(
        map((snapshotState) => snapshotState.firstLoad),
        filter((firstLoad) => firstLoad),
        debounceTime(80),
        switchMap(() => this.store.select(SnapshotSelectors.SelectSnapshotState).pipe(map((snapshotState) => snapshotState.calculatedControls))),
        mergeMap(async (calculatedControls) => {
          let newSnaps = [];
          control_ids.forEach((id) => {
            if (
              !calculatedControls.ids.length ||
              !calculatedControls.entities[id]
            ) {
              newSnaps.push(id);
            }
          });
          if (newSnaps.length) {
            await this.actionDispatcher.dispatchActionAsync(
              AddControlsSnapshotsAction({ control_ids: newSnaps }),
              TrackOperations.ADD_CONTROLS_SNAPSHOTS
            );
          }
          return control_ids.map((id) => calculatedControls.entities[id]);
        }),
        map((control) => control)
      );
  }

  getFramewrokSnapshot(snapshot_id: string): Observable<Framework> {
    return this.store
      .select(SnapshotSelectors.SelectSnapshotState)
      .pipe(
        map((snapshotState) => snapshotState.calculatedFrameworks),
        mergeMap(async (calculatedFrameworks) => {
          if (!calculatedFrameworks.ids.length || !calculatedFrameworks.entities[snapshot_id]) {
            await this.actionDispatcher.dispatchActionAsync(
              AddFrameworkSnapshotAction({ snapshot_id }),
              TrackOperations.ADD_FRAMEWORK_SNAPSHOT
            );
          }
          return calculatedFrameworks.entities[snapshot_id];
        }),
        map((framework) => framework)
      );
  }

  getSingleControlSnapshot(snapshotId: string): Observable<CalculatedControl> {
    return this.store.select(SnapshotSelectors.SelectSnapshotState).pipe(map( (snapshotState) => snapshotState.calculatedControls.entities[snapshotId]));
  }
  getSingleRequirementSnapshot(snapshotId: string): Observable<CalculatedRequirement> {
    return this.store.select(SnapshotSelectors.SelectSnapshotState).pipe(map((snapshotState) => snapshotState.calculatedRequirements.entities[snapshotId]));
  }

  getSingleEvidenceSnapshot(snapshotId: string): Observable<EvidenceInstance> {
    return this.store.select(SnapshotSelectors.SelectSnapshotEvidenceState).pipe(map((evidenceEntityState) => evidenceEntityState.entities[snapshotId]));
  }
}
