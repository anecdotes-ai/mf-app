import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { combineLatest, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { ControlActionType, ControlAdapterActions } from './../actions/controls.actions';
import {
  DashboardStateInitializedAction,
  DashboardTimeUpdatedAction
} from './../actions/dashboard.actions';
import {
  FrameworkActionType,
  FrameworksAdapterActions
} from './../actions/frameworks.actions';
import { ServiceActionType, ServiceAdapterActions } from './../actions/services.actions';

@Injectable()
export class DashboardEffects {
  private static dashboardTimeUpdateActions: any[] = [
    ControlActionType.BatchControlsUpdate,
    ControlActionType.ControlsLoaded,

    ServiceActionType.DisableService,
    ServiceActionType.InstallService,
    ServiceActionType.ServiceUpdated,
    ServiceActionType.ServicesLoaded,

    FrameworkActionType.FrameworksLoaded,
    FrameworkActionType.SpecificFrameworkLoaded,
  ];

  constructor(private actions$: Actions) {}

  @Effect()
  updateDashboardTime$ = merge(
    ...DashboardEffects.dashboardTimeUpdateActions.map((actionType) => this.actions$.pipe(ofType(actionType)))
  ).pipe(map(() => new DashboardTimeUpdatedAction(new Date())));

  @Effect()
  loadedDashboardData$ = combineLatest([
    this.actions$.pipe(ofType(ControlAdapterActions.controlsLoaded)),
    this.actions$.pipe(ofType(ServiceAdapterActions.servicesLoaded)),
    this.actions$.pipe(ofType(FrameworksAdapterActions.frameworksLoaded)),
  ]).pipe(map(() => new DashboardStateInitializedAction()));
}
