import { InstallPluginRequestBody } from './../../services/plugin/models/install-plugin-request-body.model';
import {
  ConnectionFormInstanceStatesEnum,
  PluginConnectionEntity,
} from './../../../plugins-connection/store/models/state-entity.model';
import { pluginConnectionStateSelector } from './../../../plugins-connection/store/state';
import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { EMPTY, NEVER, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, filter, withLatestFrom, take } from 'rxjs/operators';
import { OperationsTrackerService, PluginFacadeService, PluginService, TrackOperations } from '../../services';
import {
  AddToFavouritesAction,
  DisableServiceAction,
  InstallServiceAction,
  LoadSpecificServiceAction,
  LoadSpecificServiceInstanceAction,
  RemoveFromFavouritesAction,
  ServiceActionType,
  ServiceAdapterActions,
  ServiceUpdated,
} from '../actions/services.actions';
import {
  ReconnectServiceAction,
  ServiceCreateTaskAction,
  ServiceTaskCreatedAction,
} from './../actions/services.actions';
import { ServiceSelectors } from '../selectors';

@Injectable()
export class ServicesEffects {
  constructor(
    private actions$: Actions,
    private pluginsHttpService: PluginService,
    private operationsTrackerService: OperationsTrackerService,
    private store: Store,
    private pluginFacade: PluginFacadeService
  ) { }

  @Effect()
  loadSpecificService$: Observable<Action> = of(new Set<string>()).pipe(
    switchMap((requestedResourcesSet) => {
      return this.actions$.pipe(
        ofType(ServiceActionType.LoadSpecificService),
        tap((a: LoadSpecificServiceAction) => {
          requestedResourcesSet.add(a.payload.service_id);
        }),
        mergeMap((action: LoadSpecificServiceAction) =>
          this.pluginsHttpService
            .getSpecificService(action.payload.service_id)
            .pipe(map((response) => ({ response, action })), catchError((e) => {
              requestedResourcesSet.delete(action.payload.service_id);
              this.operationsTrackerService.trackError(
                TrackOperations.LOAD_SPECIFIC_SERVICE,
                new Error(e),
                action.payload.service_id
              );
              return NEVER;
            }))
        ),
        tap((accumulatedData) => {
          const payload = { ...accumulatedData.response, service_id: accumulatedData.action.payload.service_id };
          requestedResourcesSet.delete(accumulatedData.action.payload.service_id);
          this.operationsTrackerService.trackSuccessWithData(TrackOperations.LOAD_SPECIFIC_SERVICE, accumulatedData.response, accumulatedData.action.payload.service_id);
          this.store.dispatch(new ServiceUpdated(payload));
        }),
        map((accumulatedData) => {
          return ServiceAdapterActions.serviceIsFull({
            service_id: accumulatedData.action.payload.service_id,
            isFull: true,
          });
        }),
      );
    }));

  @Effect()
  loadSpecificServiceLogs$: Observable<Action> = this.actions$.pipe(
    ofType(ServiceAdapterActions.loadServiceInstanceLogs),
    mergeMap((action) => {
      const resolvedApiCallToGetServiceLogs = action.service_instance_id ? this.pluginsHttpService.getServiceInstanceLogs(action.service_id, action.service_instance_id) : this.pluginsHttpService.getServiceLogs(action.service_id);
      return resolvedApiCallToGetServiceLogs.pipe(
        map((response) => ({ response, action })),
        catchError((e) => {
          this.operationsTrackerService.trackError(
            TrackOperations.LOAD_SPECIFIC_SERVICE_INSTANCE_LOGS,
            new Error(e),
            action.service_instance_id
          );
          return NEVER;
        })
      );
    }),
    tap((x) => {
      this.operationsTrackerService.trackSuccess(
        TrackOperations.LOAD_SPECIFIC_SERVICE_INSTANCE_LOGS,
        x.action.service_instance_id
      );
    }),
    map((accumulatedData) => {
      return ServiceAdapterActions.serviceLogsAdded({
        service_id: accumulatedData.action.service_id,
        service_instance_id: accumulatedData.action.service_instance_id,
        serviceLogs: accumulatedData.response,
      });
    })
  );

  @Effect()
  loadSpecificServiceInstance$: Observable<Action> = of(new Set<string>()).pipe(
    switchMap((requestedResourcesSet) => {
      return this.actions$.pipe(
        ofType(ServiceActionType.LoadSpecificServiceInstance),
        filter((a: LoadSpecificServiceInstanceAction) => !requestedResourcesSet.has(a.service_instance_id)),
        tap((a: LoadSpecificServiceInstanceAction) => {
          requestedResourcesSet.add(a.service_instance_id);
        }),
        switchMap((action: LoadSpecificServiceInstanceAction) =>
          this.pluginsHttpService.getSpecificServiceInstance(action.service_id, action.service_instance_id).pipe(
            tap((res) => {
              requestedResourcesSet.delete(action.service_instance_id);
              this.operationsTrackerService.trackSuccessWithData(
                TrackOperations.LOAD_SPECIFIC_SERVICE_INSTANCE,
                res,
                action.service_instance_id
              );
            }),
            map((resp) => {
              return ServiceAdapterActions.specificServiceInstanceLoaded({ service: resp });
            }),
            catchError((err) => {
              requestedResourcesSet.delete(action.service_instance_id);

              this.operationsTrackerService.trackError(
                TrackOperations.LOAD_SPECIFIC_SERVICE_INSTANCE,
                new Error(err),
                action.service_instance_id,
              );
              return EMPTY;
            })
          )
        )
      );
    })
  );

  @Effect({ dispatch: false })
  disableService$ = this.actions$.pipe(
    ofType(ServiceActionType.DisableService),
    mergeMap((action: DisableServiceAction) => {
      const resolvedDeleteOperationMethod = action?.selectedInstanceIdToRemove ? this.pluginsHttpService.deleteServiceInstance(action.payload.service_id, action.selectedInstanceIdToRemove) : this.pluginsHttpService.deleteService(action.payload.service_id);
      return resolvedDeleteOperationMethod.pipe(
        tap((res) => this.operationsTrackerService.trackSuccessWithData(res.service_id, res, TrackOperations.DISCONNECT_PLUGIN)),
        catchError((err) => {
          this.operationsTrackerService.trackError(
            action.payload.service_id,
            new Error(err),
            TrackOperations.DISCONNECT_PLUGIN
          );
          // Always rollback to 'service_status' value that was before http request when error occures.
          this.store.dispatch(
            new ServiceUpdated({
              service_id: action.payload.service_id,
              service_instances_list: action.payload.service_instances_list,
            })
          );
          return EMPTY;
        })
      );
    })
  );

  @Effect()
  installService$: Observable<Action> = this.actions$.pipe(
    ofType(ServiceActionType.InstallService),
    withLatestFrom(this.store.select(pluginConnectionStateSelector).pipe(map((v) => v.entities))),
    mergeMap(([action, connectionEntities]: [InstallServiceAction, { [key: string]: PluginConnectionEntity }]) => {
      return this.pluginFacade.getServiceById(action.payload.service_id).pipe(
        take(1),
        switchMap((service) => {
          const connectionStateEntity = connectionEntities[action.payload.service_id];
          const installRequestEntity: InstallPluginRequestBody = {
            service: service,
            pending_connection_instances: Object.values(connectionStateEntity.instances_form_values).filter(
              (s) => s.instance_state === ConnectionFormInstanceStatesEnum.PENDING
            ),
          };
          return this.pluginsHttpService.installService(installRequestEntity).pipe(
            map((resp) => {
              return new ServiceUpdated({
                service_id: resp.service_id,
                service_last_run: resp.service_last_run,
                service_last_update: resp.service_last_run,
                service_instances_list: resp.service_instances_list,
                service_status: resp.service_status
              });
            }),
            tap(() =>
              this.operationsTrackerService.trackSuccess(action.payload.service_id, TrackOperations.INSTALL_PLUGIN)
            ),
            tap(() => this.store.dispatch(new AddToFavouritesAction(action.payload.service_id))),
            catchError((err) => {
              this.operationsTrackerService.trackError(
                action.payload.service_id,
                new Error(err),
                TrackOperations.INSTALL_PLUGIN
              );
              return NEVER;
            })
          );
        })
      );
    })
  );

  serviceConnectivityHandling$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ServiceAdapterActions.serviceConnectivityHandling),
      withLatestFrom(this.store.select(ServiceSelectors.SelectServiceState).pipe(map((v) => v.entities))),
      filter(([action, entities]) => !!entities[action.service_id]),
      map(([action, entities]) => {
        const currentService = entities[action.service_id];
        // When we receive a Connectivity result to handle, we need to refresh the service instance that was already updated on BE side, so we need a fresh data
        if (currentService?.fullServiceInstances && currentService?.fullServiceInstances[action.service_instance_id]) {
          this.pluginFacade.loadServiceInstance(action.service_id, action.service_instance_id);
        }
      })
    );
  }, { dispatch: false})

  @Effect()
  reconnectService$: Observable<Action> = this.actions$.pipe(
    ofType(ServiceActionType.ReconnectService),
    mergeMap((action: ReconnectServiceAction) => {
      return this.pluginsHttpService
        .reconnectService(
          action.payload.service_id,
          action.payload.service_intance_id,
          action.payload.service_secrets_operations
        )
        .pipe(
          map((_) => {
            this.store.dispatch(ServiceAdapterActions.serviceInstanceUpdate({ service_id: action.payload.service_id, service_instance_id: action.payload.service_intance_id, serviceInstance: { service_parameters: action.payload.raw_service_secrets } }));
            // We prevent assigning is_active property value before connectivity pusher message recieved
            return new ServiceUpdated({
              service_id: action.payload.service_id,
              service_parameters: action.payload.raw_service_secrets,
            });
          }),
          tap(() =>
            this.operationsTrackerService.trackSuccess(action.payload.service_id, TrackOperations.RECONNECT_PLUGIN)
          ),
          catchError((err) => {
            this.operationsTrackerService.trackError(
              action.payload.service_id,
              new Error(err),
              TrackOperations.RECONNECT_PLUGIN
            );
            return EMPTY;
          })
        );
    })
  );

  @Effect()
  createTask$: Observable<Action> = this.actions$.pipe(
    ofType(ServiceActionType.CreateTask),
    mergeMap((action: ServiceCreateTaskAction) =>
      this.pluginsHttpService.createTask(action.service_id).pipe(
        tap(() => this.operationsTrackerService.trackSuccess(action.service_id, TrackOperations.RUNNING_ON_DEMAND)),
        catchError(() => {
          this.operationsTrackerService.trackError(action.service_id, new Error(), TrackOperations.RUNNING_ON_DEMAND);
          return NEVER;
        }),
        map(() => action)
      )
    ),
    map((x) => new ServiceTaskCreatedAction(x.service_id))
  );

  @Effect({ dispatch: false })
  addToFavouites$: Observable<Action> = this.actions$.pipe(
    ofType(ServiceActionType.ServiceAddToFavourites),
    // Soft add to favourites
    tap((action: AddToFavouritesAction) => {
      // Force update without waiting for call response
      this.store.dispatch(new ServiceUpdated({ service_id: action.service_id, service_is_favorite: true }));
    }),
    mergeMap((action: AddToFavouritesAction) =>
      this.pluginsHttpService.addPluginToFavourites(action.service_id).pipe(
        catchError((err) => {
          // Since for this effect settled option dispatch: false, do dispatch action manually
          this.store.dispatch(new ServiceUpdated({ service_id: action.service_id, service_is_favorite: false }));
          return EMPTY;
        })
      )
    )
  );

  @Effect({ dispatch: false })
  removeFromFavourites$: Observable<Action> = this.actions$.pipe(
    ofType(ServiceActionType.RemoveFromFavourites),
    // Soft remove from favourites
    tap((action: RemoveFromFavouritesAction) => {
      // Force update without waiting for call response
      this.store.dispatch(new ServiceUpdated({ service_id: action.service_id, service_is_favorite: false }));
    }),
    mergeMap((action: RemoveFromFavouritesAction) =>
      this.pluginsHttpService.removePluginFromfavourites(action.service_id).pipe(
        catchError((err) => {
          // Since for this effect settled option dispatch: false, do dispatch action manually
          this.store.dispatch(new ServiceUpdated({ service_id: action.service_id, service_is_favorite: true }));
          return EMPTY;
        })
      )
    )
  );
}
