import { Service } from './../../../data/models/domain';
import { ConnectionFormInstanceStatesEnum, PluginConnectionEntity, RelatedOperationPusherData } from './../models/state-entity.model';
import { createAction, props } from '@ngrx/store';

export const PluginConnectionActionType = {
  ChangeConnectionState: '[Plugin Connection] Change connection state',
  SaveConnectionFormValues: '[Plugin Connection] Save connection form values for plugin',
  ChangeConnectionFormState: '[Plugin Connection] Change connection form state for specific service instance',
  RemoveServiceInstance: '[Plugin Connection] Remove service instance',
  AddServiceInstance: '[Plugin Connection] Add service instance',
  ServiceInstanceToServiceConnection: '[Misc Plugin Connection Mapping]: Service instance to connection form instance',
  SetPusherOperationConnectionData: '[Plugin Connection/Pusher operation data handling] Add pusher operation metadata to store',
  ResetOperationConnectionData: '[Plugin Connection/Pusher operation data handling] Clean all pusher operation metadata from store for particular service',
};

export const PluginConnectionAdapterActions = {
  changeConnectionState: createAction(
    PluginConnectionActionType.ChangeConnectionState,
    props<{ stateToChange: PluginConnectionEntity }>()
  ),
  addServiceInstance: createAction(
    PluginConnectionActionType.AddServiceInstance,
    props<{ service_id: string, instance_id: string, formValues: { [key: string]: any }, instance_state?: ConnectionFormInstanceStatesEnum, selected?: boolean }>()
  ),
  removeServiceInstance: createAction(
    PluginConnectionActionType.RemoveServiceInstance,
    props<{ service_id: string, instance_id: string }>()
  ),
  saveConnectionFormValues: createAction(
    PluginConnectionActionType.SaveConnectionFormValues,
    props<{ service_id: string; formValues: { [key: string]: any }, instance_id?: string, instance_state?: ConnectionFormInstanceStatesEnum, }>()
  ),

  changeConnectionFormState: createAction(
    PluginConnectionActionType.ChangeConnectionFormState,
    props<{ service_id: string; instance_state: ConnectionFormInstanceStatesEnum, instance_id?: string }>()
  ),
  serviceInstanceToServiceConnection: createAction(
    PluginConnectionActionType.ServiceInstanceToServiceConnection,
    props<{ serviceInstance: Service, selected?: boolean }>()
  ),

  // Pusher operations handling related actions
  setPusherOpeartionConnectionData: createAction(
    PluginConnectionActionType.SetPusherOperationConnectionData,
    props<{ service_id: string, evidence_successfully_collected?: number, performedOperationPushersReceivedMetadata?: RelatedOperationPusherData }>()
  ),

  resetConnectionOperationData: createAction(
    PluginConnectionActionType.ResetOperationConnectionData,
    props<{ service_id: string }>()
  ),
};

