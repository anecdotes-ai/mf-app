import { Injectable } from '@angular/core';
import { EntityState } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import {
  ControlEventDataProperty,
  UserEvents,
  ControlsExportingType,
} from 'core/models/user-events/user-event-data.model';
import { Control, ControlStatus, Framework } from '../../../models/domain';
import { CustomControlFormData } from '../../controls/models/add-customer-control.model';
import { TrackOperations } from '../../operations-tracker/constants/track.operations.list.constant';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { Observable, of } from 'rxjs';
import { filter, map, shareReplay, switchMap, take, withLatestFrom, mergeMap, tap } from 'rxjs/operators';
import { CalculatedControl } from '../../../models';
import {
  AddCustomControlAction,
  ControlAdapterActions,
  ControlApplicabilityBatchChangeAction,
  ControlOwnerUpdatedAction,
  EditCustomControlAction,
  ReloadControlsAction,
  RemoveCustomControlAction,
  UpdateControlOwnerAction,
} from '../../../store/actions/controls.actions';
import { State } from '../../../store/state';
import { ActionDispatcherService } from '../../action-dispatcher/action-dispatcher.service';
import { OperationsTrackerService } from '../../operations-tracker/operations-tracker.service';
import { FrameworksFacadeService } from '../frameworks-facade/frameworks-facade.service';
import { SnapshotsFacadeService } from '../snapshots-facade/snapshots-facade.service';
import { createControlsByRequirementIdsSelector } from '../../../store/selectors';

@Injectable()
export class ControlsFacadeService {
  readonly controlsFrameworksMapping$: Observable<{ [key: string]: string }>;

  private controlsByFrameworkCache$: Observable<{ [framework_id: string]: CalculatedControl[] }>;
  private allControlsCache$: Observable<CalculatedControl[]>;

  constructor(
    private store: Store<State>,
    private actionDispatcher: ActionDispatcherService,
    private userEventService: UserEventService,
    private frameworksFacade: FrameworksFacadeService,
    private operationsTrackerService: OperationsTrackerService,
    private snapshotsFacadeService: SnapshotsFacadeService
  ) {
    // TODO: This probably shouldn't be used. We need to revisit this one day.
    this.controlsFrameworksMapping$ = this.store
      .select((state) => state.controlsState.controlFrameworksMapping)
      .pipe(
        map((controlFrameworksMapping) => {
          const result = {};

          Object.keys(controlFrameworksMapping).forEach((key) => {
            controlFrameworksMapping[key]?.forEach((framework_id) => {
              result[key] = framework_id;
            });
          });

          return result;
        })
      );

    this.setControlsByFrameworkCache();

    this.setAllControlsCache();
  }

  getControlsByRequirementIds(requirementIds: string[]): Observable<Control[]> {
    return this.store.select(createControlsByRequirementIdsSelector(requirementIds) as any);
  }

  reloadControls(): void {
    this.store.dispatch(new ReloadControlsAction());
  }

  async addCustomControl(framework_id: string, payload: CustomControlFormData): Promise<string> {
    const framework = await this.frameworksFacade.getFrameworkById(framework_id).pipe(take(1)).toPromise();
    this.userEventService.sendEvent(UserEvents.CONTROL_CREATE_CONTOL, {
      [ControlEventDataProperty.ControlCategory]: payload.control_framework_category,
      [ControlEventDataProperty.FrameworkName]: framework?.framework_name,
      [ControlEventDataProperty.ControlName]: payload.control_name,
    });
    return await this.actionDispatcher.dispatchActionAsync(
      new AddCustomControlAction(framework_id, payload, framework.framework_name),
      TrackOperations.ADD_CUSTOM_CONTROL
    );
  }

  async batchChangeApplicability(control_ids: string[], applicabilityValue: boolean): Promise<void> {
    const eventType = !applicabilityValue ? UserEvents.CONTROL_MARK_AS_NA : UserEvents.CONTROL_MARK_AS_APPLICABLE;
    const controls = await this.getControlsById(control_ids).pipe(take(1)).toPromise();
    const framework = await this.frameworksFacade
      .getFrameworkById(controls[0].control_framework_id)
      .pipe(take(1))
      .toPromise();

    this.userEventService.sendEvent(eventType, {
      [ControlEventDataProperty.FrameworkName]: framework?.framework_name,
      [ControlEventDataProperty.ControlStatus]: controls.map((c) => c.control_status.status),
      [ControlEventDataProperty.ControlName]: controls.map((c) => c.control_name),
      [ControlEventDataProperty.ControlCategory]: controls.map((c) => c.control_category),
      [ControlEventDataProperty.ControlsCount]: control_ids.length,
    });
    return this.actionDispatcher.dispatchActionAsync(
      new ControlApplicabilityBatchChangeAction(control_ids, applicabilityValue),
      TrackOperations.CHANGE_CONTROLS_APPLICABILITY
    );
  }

  async editCustomControl(frameworkId: string, control_id: string, payload: CustomControlFormData): Promise<void> {
    const framework = await this.frameworksFacade.getFrameworkById(frameworkId).pipe(take(1)).toPromise();
    const control = await this.getControl(control_id).pipe(take(1)).toPromise();

    const isNameChanged = payload.control_name !== control?.control_name;
    const isCategoryChanged = payload.control_framework_category !== control?.control_category;

    this.userEventService.sendEvent(UserEvents.CONTROL_UPDATE_CONTROL, {
      [ControlEventDataProperty.ControlCategory]: payload.control_framework_category,
      [ControlEventDataProperty.FrameworkName]: framework?.framework_name,
      [ControlEventDataProperty.ControlName]: payload.control_name,
      [ControlEventDataProperty.NameChanged]: isNameChanged,
      [ControlEventDataProperty.CategoryChanged]: isCategoryChanged,
    });
    return this.actionDispatcher.dispatchActionAsync(
      new EditCustomControlAction(control_id, payload),
      TrackOperations.UPDATE_CUSTOM_CONTOL
    );
  }

  async updateControlStatus(control_id: string, newStatus: ControlStatus, oldStatus: ControlStatus): Promise<void> {
    return this.actionDispatcher.dispatchActionAsync(
      ControlAdapterActions.updateControlStatus({ controlId: control_id, newStatus, oldStatus }),
      control_id,
      TrackOperations.UPDATE_CUSTOM_CONTROL_STATUS
    );
  }

  async updateControlOwner(control_id: string, owner: string): Promise<void> {
    return this.actionDispatcher.dispatchActionAsync(
      new UpdateControlOwnerAction(control_id, owner),
      TrackOperations.UPDATE_CONTROL_OWNER
    );
  }

  async controlOwnerUpdated(control_id: string, owner: string): Promise<void> {
    await this.actionDispatcher.dispatchActionAsync(
      new ControlOwnerUpdatedAction(control_id, owner),
      TrackOperations.UPDATE_CONTROL_OWNER
    );
  }

  getFrameworkControlsDictionary(): Observable<{ [frameworkId: string]: CalculatedControl[] }> {
    return this.controlsByFrameworkCache$;
  }

  getControl(control_id: string): Observable<CalculatedControl> {
    return this.store.select((state) => state.calculationState.calculatedControls.entities[control_id]);
  }

  getControlsById(controlIds: string[]): Observable<CalculatedControl[]> {
    return this.store.select((state) =>
      controlIds.map((control_id) => state.calculationState.calculatedControls.entities[control_id]).filter((x) => x)
    );
  }

  getControlsByFrameworkId(framework_id: string): Observable<CalculatedControl[]> {
    return this.store
      .select((state) => state.controlsState.controlsByFramework[framework_id])
      .pipe(
        filter((controlIds) => !!controlIds),
        switchMap((controlIds: string[]) =>
          this.store
            .select((state) => state.calculationState.calculatedControls)
            .pipe(
              withLatestFrom(this.store.select((state) => state.controlsState.controls.ids.length)),
              filter(([calculatedControlsState, idsLength]) => calculatedControlsState.ids.length === idsLength),
              map(([calculatedControlsState]) => {
                return controlIds.map((control_id) => calculatedControlsState.entities[control_id]).filter((x) => x);
              })
            )
        ),
        shareReplay()
      );
  }
  
  getFreezeControlsByFrameworkId(frameworkId: string): Observable<CalculatedControl[]> {
    return this.store
      .select((state) => state.controlsState.controlsByFramework[frameworkId])
      .pipe(
        filter((controlIds) => !!controlIds),
        switchMap((controlIds: string[]) =>
          this.store
            .select((state) => state.calculationState.calculatedControls)
            .pipe(
              withLatestFrom(this.store.select((state) => state.controlsState.controls.ids.length)),
              filter(([calculatedControlsState, idsLength]) => calculatedControlsState.ids.length === idsLength),
              mergeMap(async ([calculatedControlsState]) => {
                const snapshotIds = controlIds.filter((control_id) => calculatedControlsState.entities[control_id]?.is_snapshot)
                .map((control_id) => calculatedControlsState.entities[control_id].snapshot_id);
                await this.snapshotsFacadeService.getControlsSnapshot(snapshotIds).pipe(take(1)).toPromise();
                return calculatedControlsState;
              }),
              withLatestFrom(this.store.select((state) => state.snapshotState)),
              map(([calculatedControlsState, snapshotState]) => {
                return controlIds.map((control_id) => {
                  const currControl = calculatedControlsState.entities[control_id];
                  if (currControl.is_snapshot && 
                    snapshotState.calculatedControls.entities[currControl.snapshot_id]) {
                    return snapshotState.calculatedControls.entities[currControl.snapshot_id];
                  }
                  return currControl;
                }).filter((x) => x);
              })
            )
        ),
        shareReplay()
      );
  }

  /** Returns all Calculated controls */
  getAllControls(): Observable<CalculatedControl[]> {
    return this.allControlsCache$;
  }

  /**
   * loadSingle means that we want to load controls of a single framrwork
   * frameworkId of this single framework, if loadSingle===false it is ignored as well
   * becomes handy on case of an audit
   */
  getSingleControl(controlId: string): Observable<CalculatedControl> {
    return this.store
      .select((state) => state.calculationState.calculatedControls.entities[controlId] as CalculatedControl)
      .pipe(filter((control) => !!control));
  }

  // Get Snapshot if exist otherwise get the control
  getSingleControlOrSnapshot(controlId: string): Observable<CalculatedControl> {
    return this.store
      .select((state) => state.calculationState.calculatedControls)
      .pipe(
        filter((calculatedControlsState) => !!calculatedControlsState.ids.length),
        mergeMap((calculatedControlsState) => {
          const currControl = calculatedControlsState.entities[controlId];
          if (currControl?.is_snapshot) {
            return this.snapshotsFacadeService.getControlSnapshot(controlId, currControl.snapshot_id);
          }
          return of(currControl);
        }),
        map(control => control)
      );
  }

  getAreControlsLoaded(): Observable<boolean> {
    return this.store.select((state) => state.controlsState.areAllLoaded);
  }

  removeCustomControl(control_id: string): Promise<void> {
    return this.actionDispatcher.dispatchActionAsync(
      new RemoveCustomControlAction(control_id),
      control_id,
      TrackOperations.CUSTOM_CONTROL_REMOVED
    );
  }

  getControlAddedByUserEvent(): Observable<CalculatedControl> {
    return this.operationsTrackerService.getOperationEvents(TrackOperations.ADD_CUSTOM_CONTROL).pipe(
      switchMap((controlId: string) =>
        this.getSingleControl(controlId).pipe(
          filter((control) => !!control),
          take(1)
        )
      )
    );
  }

  trackControlsExporting(
    controls: CalculatedControl[],
    framework: Framework,
    exportingType: ControlsExportingType,
    filtersApplied?: string[]
  ): void {
    this.userEventService.sendEvent(UserEvents.CONTROL_EXPORT_TO_CSV, {
      [ControlEventDataProperty.FrameworkName]: framework.framework_name,
      [ControlEventDataProperty.ControlsCount]: controls.length,
      [ControlEventDataProperty.FilterApplied]: filtersApplied,
      [ControlEventDataProperty.ControlExportingType]: exportingType,
    });
  }

  private setControlsByFrameworkCache(): void {
    this.controlsByFrameworkCache$ = this.store
      .select((state) => state.controlsState.controlsByFramework)
      .pipe(
        switchMap((controlsByFramework) => {
          return this.store
            .select((state) => state.calculationState.calculatedControls)
            .pipe(
              filter(
                (calculatedControlsState) =>
                  this.anyCalculatedControls(calculatedControlsState) ||
                  this.noApplicableFrameworks(controlsByFramework)
              ),
              map((calculatedControlsState) => {
                const result: { [framework_id: string]: CalculatedControl[] } = {};

                Object.keys(controlsByFramework).forEach((framework_id) => {
                  result[framework_id] = controlsByFramework[framework_id].filterMap(
                    (control_id) => !!calculatedControlsState.entities[control_id],
                    (control_id) => calculatedControlsState.entities[control_id]
                  );
                });
                return result;
              })
            );
        }),
        shareReplay()
      );
  }

  private setAllControlsCache(): void {
    this.allControlsCache$ = this.store
      .select((state) => state.controlsState.areAllLoaded)
      .pipe(
        switchMap(() => {
          return this.store
            .select((state) => state.calculationState.calculatedControls)
            .pipe(
              filter((calculatedControlsState) => !!calculatedControlsState.ids.length),
              map((calculatedControlsState) => Object.values(calculatedControlsState.entities))
            );
        }),
        shareReplay()
      );
  }

  private noApplicableFrameworks(controlsByFramework: { [framework_id: string]: string[] }): boolean {
    return Object.keys(controlsByFramework).length === 1;
  }

  private anyCalculatedControls(calculatedControlsState: EntityState<CalculatedControl>): boolean {
    return calculatedControlsState.ids.length > 0;
  }
}
