import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { Dictionary } from '@ngrx/entity';
import { PluginConnectionStates } from './../../models/plugin-connection-states.enum';
export interface PluginConnectionEntity {
  service_id: string;
  selected_service_instance_id?: string;
  connection_state?: PluginConnectionStates;
  instances_form_values?: Dictionary<ConnectionFormValueEntity>;

  // The data related to pusher messages of 'run' processes for service
  evidence_successfully_collected?: number;
  performedOperation?: PerformedOperationData;
  performedOperationPushersReceivedMetadata?: RelatedOperationPusherData[];
}

export interface PerformedOperationData {
  opearation: PluginOperations,
  operationOnServiceInstancesAmount: number
}

export interface RelatedOperationPusherData {
  status: boolean, pusherType: PusherMessageType
}

export enum PluginOperations {
  RUN_ON_DEMAND = 'RUN_ON_DEMAND',
  CONNECTION = 'CONNECTION',
  RECONNECT = 'RECONNECT',
  AUTOMATION_EVIDENCE = 'AUTOMATION_EVIDENCE'
}

export interface ConnectionFormValueEntity {
  instance_id: string;
  instance_state: ConnectionFormInstanceStatesEnum;
  connection_form_values?: { [key: string]: any };
}

export enum ConnectionFormInstanceStatesEnum {
  PENDING = 'pending',
  EXISTING = 'existing',
}
