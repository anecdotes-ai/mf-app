import { ConnectionFormValueEntity, PluginConnectionEntity } from './../models/state-entity.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { PluginConnectionAdapterActions } from '../actions';

export type PluginsConnectionFeatureState = EntityState<PluginConnectionEntity>;

function selectPluginId(pluginConnectionEntity: PluginConnectionEntity): any {
  return pluginConnectionEntity.service_id;
}

export const pluginsConnectionAdapter: EntityAdapter<PluginConnectionEntity> = createEntityAdapter<PluginConnectionEntity>(
  {
    selectId: selectPluginId,
  }
);

const initialState: PluginsConnectionFeatureState = pluginsConnectionAdapter.getInitialState();

const adapterReducer = createReducer(
  initialState,
  on(
    PluginConnectionAdapterActions.changeConnectionState,
    (state: PluginsConnectionFeatureState, { stateToChange }) => {
      return pluginsConnectionAdapter.upsertOne(stateToChange, state);
    }
  ),
  on(PluginConnectionAdapterActions.changeConnectionFormState, (state, action) => {
    const entity = state.entities[action.service_id];
    const foundFormEntity = entity.instances_form_values[action.instance_id];
    if (foundFormEntity) {
      const updatedInstanceFormState: ConnectionFormValueEntity = {
        ...foundFormEntity,
        instance_state: action.instance_state,
      };
      entity.instances_form_values[action.instance_id] = updatedInstanceFormState;

      return pluginsConnectionAdapter.updateOne({ id: action.service_id, changes: entity }, state);
    }
    return state;
  }),
  on(PluginConnectionAdapterActions.addServiceInstance, (state, action) => {
    if (state.entities[action.service_id]) {
      const entity = { ...state.entities[action.service_id] };
      const newInstance: ConnectionFormValueEntity = {
        instance_id: action.instance_id,
        instance_state: action.instance_state,
        connection_form_values: action.formValues,
      };
      entity.instances_form_values[action.instance_id] = newInstance;
      if (action.selected) {
        entity.selected_service_instance_id = action.instance_id;
      }

      return pluginsConnectionAdapter.updateOne({ id: action.service_id, changes: entity }, state);
    }
    return state;
  }),
  on(PluginConnectionAdapterActions.removeServiceInstance, (state: PluginsConnectionFeatureState, action) => {
    const entity = state.entities[action.service_id];

    if (entity) {
      delete entity.instances_form_values[action.instance_id];
      if (action.instance_id === entity.selected_service_instance_id) {
        entity.selected_service_instance_id = null;
      }
      return pluginsConnectionAdapter.updateOne({ id: action.service_id, changes: entity }, state);
    } else {
      return state;
    }
  }),

  on(PluginConnectionAdapterActions.saveConnectionFormValues, (state: PluginsConnectionFeatureState, action) => {
    const entity = state.entities[action.service_id];

    if (entity) {
      entity.instances_form_values[action.instance_id] = {
        ...entity.instances_form_values[action.instance_id],
        connection_form_values: action.formValues,
        instance_state: action.instance_state ?? entity.instances_form_values[action.instance_id].instance_state,
      };

      return pluginsConnectionAdapter.upsertOne(entity, state);
    } else {
      return state;
    }
  }),
  on(PluginConnectionAdapterActions.setPusherOpeartionConnectionData, (state, action) => {
    const entity = state.entities[action.service_id];

    if (entity) {
      if (action.evidence_successfully_collected >= 0) {
        if (!entity.evidence_successfully_collected) {
          entity.evidence_successfully_collected = 0;
        }
        entity.evidence_successfully_collected += action.evidence_successfully_collected;
      }
      if (action.performedOperationPushersReceivedMetadata) {
        entity.performedOperationPushersReceivedMetadata = entity.performedOperationPushersReceivedMetadata
          ? [...entity.performedOperationPushersReceivedMetadata, action.performedOperationPushersReceivedMetadata]
          : [action.performedOperationPushersReceivedMetadata];
      }
      return pluginsConnectionAdapter.updateOne({ id: action.service_id, changes: entity }, state);
    } else {
      return state;
    }
  }),
  on(PluginConnectionAdapterActions.resetConnectionOperationData, (state, action) => {
    const entity = state.entities[action.service_id];

    if (entity) {
      entity.performedOperation = undefined;
      entity.performedOperationPushersReceivedMetadata = undefined;
      return pluginsConnectionAdapter.updateOne({ id: action.service_id, changes: entity }, state);
    } else {
      return state;
    }
  })
);

export function pluginsConnectionReducer(state = initialState, action: Action): PluginsConnectionFeatureState {
  return adapterReducer(state, action);
}
