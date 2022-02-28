import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, EMPTY } from 'rxjs';
import { map, mergeMap, tap, take, catchError } from 'rxjs/operators';
import { OperationsTrackerService, TrackOperations, SnapshotsService, SnapshotsFacadeService, ControlCalculationService, RequirementCalculationService } from '../../services';
import {
  AddControlSnapshotAction,
  AddControlsSnapshotsAction,
  AddEvidenceSnapshotAction,
  AddFrameworkSnapshotAction,
  AddPoliciesSnapshotAction,
  AddRequirementsSnapshotAction,
  ControlSnapshotAddedAction,
  ControlsSnapshotsAddedAction,
  EvidenceSnapshotAddedAction,
  FrameworkSnapshotAddedAction,
  PoliciesSnapshotAddedAction,
  RequirementsSnapshotAddedAction } from '../actions/snapshots.actions';
import { ControlActionType, ControlsLoadedAction, ControlsReloadedAction } from '../index';

@Injectable()
export class SnapshotEffects {
  constructor(
    private actions$: Actions,
    private snapshotHttpService: SnapshotsService,
    private operationsTrackerService: OperationsTrackerService,
    private snapshotsFacadeService: SnapshotsFacadeService,
    private controlCalculationService: ControlCalculationService,
    private requirementCalculationService: RequirementCalculationService,
    private store: Store,
  ) { }

  @Effect()
  addControlSnapshot$: Observable<Action> = this.actions$.pipe(
    ofType(AddControlSnapshotAction),
    mergeMap((action) => {
      return (
        this.snapshotHttpService.getControlSnapshot(action.control_id, action.snapshot_id).pipe(
          mergeMap(async (control) => {
            if (!control.snapshot_id || control.snapshot_id !== action.snapshot_id) {
              control.snapshot_id = action.snapshot_id;
            }
            const requirements = await this.snapshotsFacadeService.getRequirementsSnapshot(control.control_requirement_ids).pipe(take(1)).toPromise();
            return {
              requirements,
              control
            };
          }),
          map(x => {
            const control = this.controlCalculationService.calculateControl(x.control, x.requirements);
            return ControlSnapshotAddedAction({control});
          }),
          tap(() =>
            this.operationsTrackerService.trackSuccessWithData(
              TrackOperations.ADD_CONTROL_SNAPSHOT,
              action.snapshot_id
            )
          ),
          catchError((error) => {
            this.operationsTrackerService.trackError(TrackOperations.ADD_CONTROL_SNAPSHOT, error);
            return EMPTY;
          })
        )
      );
    })
  );

  @Effect()
  addRequirementSnapshot$: Observable<Action> = this.actions$.pipe(
    ofType(AddRequirementsSnapshotAction),
    mergeMap((action) => {
      return this.snapshotHttpService.getRequirementsSnapshot(action.requirement_ids).pipe(
        mergeMap(async (requirements) => {
          requirements = !Array.isArray(requirements) ? [requirements] : requirements;
          const allEvidenceIds = Array.from(new Set(requirements.flatMap(req => req.requirement_evidence_ids)));
          const allPoliciesIds = Array.from(new Set(requirements.flatMap(req => req.requirement_related_policies_ids)));
          const evidence = allEvidenceIds.length ? await this.snapshotsFacadeService.getEvidenceSnapshot(allEvidenceIds).pipe(take(1)).toPromise() : [];
          const policies = allPoliciesIds.length ? await this.snapshotsFacadeService.getPolicySnapshot(allPoliciesIds).pipe(take(1)).toPromise(): [];        
          return {
            requirements,
            policies,
            evidence
          };
        }),
        map(({requirements, policies, evidence}) => {
          const calcReqs = requirements.map(req => {
            const relevantPolicies = policies.filter(policy => policy.evidence && req.requirement_related_policies_ids.includes(policy.snapshot_id));
            return this.requirementCalculationService.calculateRequirement(req,
              evidence.filter(evid => req.requirement_evidence_ids.includes(evid.snapshot_id)),
              relevantPolicies);
          });
          return RequirementsSnapshotAddedAction({requirements: calcReqs});
        }),
        tap(() =>
          this.operationsTrackerService.trackSuccess(
            TrackOperations.ADD_REQUIREMENT_SNAPSHOT
          )
        ),
        catchError((error) => {
          this.operationsTrackerService.trackError(TrackOperations.ADD_REQUIREMENT_SNAPSHOT, error);
          return EMPTY;
        })
      );
    }
  ));

  @Effect()
  addEvidenceSnapshot$: Observable<Action> = this.actions$.pipe(
    ofType(AddEvidenceSnapshotAction),
    mergeMap((action) => {
      return this.snapshotHttpService
        .getEvidenceInstance(action.evidence_id)
        .pipe(
          map((evidence) => {
            evidence = !Array.isArray(evidence) ? [evidence] : evidence;
            return EvidenceSnapshotAddedAction({evidence});
          }),
          tap(() => this.operationsTrackerService.trackSuccess(
            TrackOperations.ADD_EVIDENCE_SNAPSHOT
          )),
          catchError((error) => {
            this.operationsTrackerService.trackError(TrackOperations.ADD_EVIDENCE_SNAPSHOT, error);
            return EMPTY;
          })
        );
      })
  );
  
  @Effect()
  addPoliciesSnapshot$: Observable<Action> = this.actions$.pipe(
    ofType(AddPoliciesSnapshotAction),
    mergeMap((action) => {
      return this.snapshotHttpService
        .getPoliciesSnapshot(action.policies_ids)
        .pipe(
          mergeMap(async (policies) => {
            policies = !Array.isArray(policies) ? [policies] : policies;
            const allEvidenceIds = Array.from(new Set(policies.filter(pol => pol.policy_related_evidence).flatMap(pol => pol.policy_related_evidence)));
            const evidence = allEvidenceIds.length ? await this.snapshotsFacadeService.getEvidenceSnapshot(allEvidenceIds).pipe(take(1)).toPromise() : [];
            return {
              policies,
              evidence
            };
          }),
          map(({policies, evidence}) => {
            policies.forEach(pol => pol.evidence = evidence.find(evid => pol.policy_related_evidence?.includes(evid.snapshot_id)));
            return PoliciesSnapshotAddedAction({policies});
          }),
          tap(() => this.operationsTrackerService.trackSuccess(
            TrackOperations.ADD_POLICY_SNAPSHOT
          )),
          catchError((error) => {
            this.operationsTrackerService.trackError(TrackOperations.ADD_POLICY_SNAPSHOT, error);
            return EMPTY;
          })
        );
      })
  );

  @Effect()
  addLoadedControlsSnapshots$: Observable<Action> = this.actions$.pipe(
    ofType(ControlActionType.ControlsLoaded),
    mergeMap((action: ControlsLoadedAction) => {
      const snapshotIds = Array.from(new Set(action.payload.filter(control => control.is_snapshot)
          .flatMap(control => control.snapshot_id)));
      return this.loadControls(snapshotIds);
    })
  );
  @Effect()
  reloadLoadedControlsSnapshots$: Observable<Action> = this.actions$.pipe(
    ofType(ControlActionType.ControlsReloaded),
    mergeMap((action: ControlsReloadedAction) => {
      const snapshotIds = Array.from(new Set(action.payload.filter(control => control.is_snapshot)
          .flatMap(control => control.snapshot_id)));
      return this.loadControls(snapshotIds);
    })
  );
  @Effect()
  addControlsSnapshots$: Observable<Action> = this.actions$.pipe(
    ofType(AddControlsSnapshotsAction),
    mergeMap(({control_ids}) => {
      return this.loadControls(control_ids);
    })
  );

  @Effect()
  addFrameworkSnapshots$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AddFrameworkSnapshotAction),
      mergeMap(({ snapshot_id }) => {
        return (
        this.snapshotHttpService.getFrameworkSnapshot(snapshot_id).pipe(
          mergeMap(async (framework) => {
            const controls = await this.snapshotsFacadeService.getControlsSnapshot(framework.related_controls_snapshots).pipe(take(1)).toPromise();
            return {
              framework,
              controls
            };
          }),
          map(x => {
            return FrameworkSnapshotAddedAction({framework: x.framework});
          }),
          tap(() =>
            this.operationsTrackerService.trackSuccessWithData(
              TrackOperations.ADD_FRAMEWORK_SNAPSHOT,
              snapshot_id
            )
          ),
          catchError((error) => {
            this.operationsTrackerService.trackError(TrackOperations.ADD_FRAMEWORK_SNAPSHOT, error);
            return EMPTY;
          })
        )
      );
      })
    );
  });

  private loadControls(snapshotIds: string[]): Observable<Action> {
    return (
      this.snapshotHttpService.getControlsSnapshots(snapshotIds).pipe(
        mergeMap(async (controls) => {
          controls = !Array.isArray(controls) ? [controls] : controls;
          const requirementsIds = Array.from(new Set(controls.flatMap(control => control.control_requirement_ids)));
          const requirements = requirementsIds.length ? await this.snapshotsFacadeService.getRequirementsSnapshot(requirementsIds).pipe(take(1)).toPromise() : [];
          return {
            requirements,
            controls
          };
        }),
        map(({requirements, controls}) => {
          return ControlsSnapshotsAddedAction({controls: controls.map(control => 
            this.controlCalculationService.calculateControl(control,
              requirements.filter(req => control.control_requirement_ids.includes(req.snapshot_id)))
            )});
        }),
        tap(() =>
          this.operationsTrackerService.trackSuccess(
            TrackOperations.ADD_CONTROLS_SNAPSHOTS
          )
        ),
        catchError((error) => {
          this.operationsTrackerService.trackError(TrackOperations.ADD_CONTROLS_SNAPSHOTS, error);
          this.store.dispatch(ControlsSnapshotsAddedAction({controls: []}));
          return EMPTY;
        })
      )
    );
  }
}
