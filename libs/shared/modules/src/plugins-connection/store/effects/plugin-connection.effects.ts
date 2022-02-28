import { ServiceStatusEnum } from 'core/modules/data/models/domain';
import { ServiceStoreEntity } from 'core/modules/data/store/reducers';
import { pluginConnectionStateSelector } from './../state';
import { InstallServiceAction, ReconnectServiceAction, ServiceActionType, ServiceCreateTaskAction, ServiceIdPropertyActionPayload } from './../../../data/store/actions/services.actions';
import { MultipleAccountsFieldsEnum } from './../../models/multiple-accounts-fields.enum';
import { ConnectionFormInstanceStatesEnum, PerformedOperationData, PluginConnectionEntity, PluginOperations } from './../models/state-entity.model';
import { PluginConnectionAdapterActions } from '../actions';
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { PluginConnectionFacadeService } from '../../services/facades/plugin-connection-facade/plugin-connection-facade.service';
import { from } from 'rxjs';
import { ServiceSelectors } from 'core/modules/data/store';

@Injectable()
export class PluginConnectionEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private pluginConnectionFacade: PluginConnectionFacadeService
  ) { }

  serviceInstanceToConnectionInstance$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PluginConnectionAdapterActions.serviceInstanceToServiceConnection),
      switchMap((action) => {
        const instance = action.serviceInstance.service_instances_list[0];
        return from(this.pluginConnectionFacade.getFilledServiceParameters(action.serviceInstance,{ ...action.serviceInstance.service_parameters, [MultipleAccountsFieldsEnum.AccountName]: instance.service_instance_display_name } ))
        .pipe(map((resolvedParams) => 
          ({
            action: action,
            instance: instance,
            resolvedParams: resolvedParams
          })
        ));
      }),
      map((res) => {
        return PluginConnectionAdapterActions.addServiceInstance({
          service_id: res.instance.service_id,
          instance_id: res.instance.service_instance_id,
          formValues: res.resolvedParams, selected: res.action.selected
        });
      })
    );
  })

  operationUnderServiceHandling$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ServiceActionType.CreateTask, ServiceActionType.InstallService, ServiceActionType.ReconnectService),
      withLatestFrom(this.store.select(pluginConnectionStateSelector).pipe(map((v) => v.entities)), this.store.select(ServiceSelectors.SelectServiceState).pipe(map((v) => v.entities))),
      map(([action, entities, serviceEntities]: [any, Dictionary<PluginConnectionEntity>, Dictionary<ServiceStoreEntity>]) => {
        const serviceIdPaylod = (action as ServiceIdPropertyActionPayload).service_id;
        let connectionEntity = entities[serviceIdPaylod];
        connectionEntity = connectionEntity ? { ...connectionEntity, evidence_successfully_collected: undefined } : { service_id: serviceIdPaylod };

        let performedOperation: PerformedOperationData;
        switch (true) {
          case action instanceof InstallServiceAction:
            performedOperation = { operationOnServiceInstancesAmount: Object.values(connectionEntity.instances_form_values).filter((i) => i.instance_state === ConnectionFormInstanceStatesEnum.PENDING).length, opearation: PluginOperations.CONNECTION };
            break;
          case action instanceof ReconnectServiceAction:
            performedOperation = { operationOnServiceInstancesAmount: 1, opearation: PluginOperations.RECONNECT };
            break;
          case action instanceof ServiceCreateTaskAction:
            performedOperation = { operationOnServiceInstancesAmount: serviceEntities[serviceIdPaylod].service.service_instances_list?.filter((s) => s.service_status !== ServiceStatusEnum.REMOVED && s.service_status).length, opearation: PluginOperations.RUN_ON_DEMAND };
            break;
          default:
            break;
        }

        connectionEntity.performedOperation = performedOperation;
        return PluginConnectionAdapterActions.changeConnectionState({ stateToChange: connectionEntity });
      })
    );
  })
}
