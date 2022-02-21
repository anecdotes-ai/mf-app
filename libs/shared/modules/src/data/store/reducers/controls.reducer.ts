import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Control } from '../../models/domain';
import { groupBy } from 'core/utils';
import {
  BatchControlsUpdatedAction,
  ControlAdapterActions,
  ControlApplicabilityChangedAction,
  ControlsByFrameworkLoadedAction,
  ControlsLoadedAction,
  ControlsReloadedAction,
  CustomControlAddedAction,
  CustomControlRemovedAction,
} from '../actions/controls.actions';

// Temporary until we get controls as dictionary { [framework_id]: Control[] } from the API
interface ControlStateEntity {
  control: Control;
  relatedFrameworkIds: string[];
}

export interface ControlsState {
  areAllLoaded: boolean;
  anyLoaded: boolean;
  /** key is control_id and value is respective framework ids */
  controlFrameworksMapping: { [control_id: string]: string[] };
  /** key is framework_id and value is array of control_id */
  controlsByFramework: {
    [framework_id: string]: string[];
  };
  controls: EntityState<Control>;
}

function selectControlId(c: Control): string {
  return c.control_id;
}

export const controlAdapter: EntityAdapter<Control> = createEntityAdapter<Control>({
  selectId: selectControlId,
});

const initialState: ControlsState = {
  areAllLoaded: false,
  anyLoaded: false,
  controlFrameworksMapping: {},
  controlsByFramework: {},
  controls: controlAdapter.getInitialState({}),
};

const adapterReducer = createReducer(
  initialState,
  on(
    ControlAdapterActions.controlsByFrameworkLoaded,
    (state: ControlsState, action: ControlsByFrameworkLoadedAction) => {
      const controlsByFramework = { ...state.controlsByFramework };
      const controlFrameworksMapping = { ...state.controlFrameworksMapping };

      const frameworkControls = controlsByFramework[action.framework_id] || [];
      controlsByFramework[action.framework_id] = Array.from(
        new Set(frameworkControls.concat(action.controls.map((control) => selectControlId(control))))
      );

      action.controls.forEach((control) => {
        const controlMapping = controlFrameworksMapping[selectControlId(control)] || [];
        controlFrameworksMapping[selectControlId(control)] = Array.from(
          new Set([...controlMapping, action.framework_id])
        );
      });

      return {
        ...state,
        anyLoaded: true,
        controlsByFramework: controlsByFramework,
        controlFrameworksMapping: controlFrameworksMapping,
        controls: controlAdapter.upsertMany(action.controls, state.controls),
      };
    }
  ),
  on(ControlAdapterActions.controlsLoaded, (state: ControlsState, action: ControlsLoadedAction) => {
    return constructControlsState(state, action.payload, true, true);
  }),
  on(ControlAdapterActions.controlsReloaded, (state: ControlsState, action: ControlsReloadedAction) => {
    return constructControlsState(state, action.payload);
  }),
  on(ControlAdapterActions.batchControlsUpdated, (state: ControlsState, action: BatchControlsUpdatedAction) => {
    return {
      ...state,
      controls: controlAdapter.updateMany(
        action.batch.map((x) => ({ id: selectControlId(x), changes: x })),
        state.controls
      ),
    };
  }),
  on(ControlAdapterActions.applicabilityChanged, (state: ControlsState, action: ControlApplicabilityChangedAction) => {
    return {
      ...state,
      controls: controlAdapter.updateOne(
        { id: action.control_id, changes: { control_is_applicable: action.is_applicable } },
        state.controls
      ),
    };
  }),
  on(ControlAdapterActions.customControlAdded, (state: ControlsState, action: CustomControlAddedAction) => {
    const controlsByFramework = state.controlsByFramework;
    const controlFrameworksMapping = state.controlFrameworksMapping;

    action.relatedFrameworkIds.forEach((framework_id) => {
      controlsByFramework[framework_id] = [...controlsByFramework[framework_id], selectControlId(action.control)];
    });

    controlFrameworksMapping[selectControlId(action.control)] = action.relatedFrameworkIds;

    return {
      ...state,
      controls: controlAdapter.addOne(action.control, state.controls),
      controlFrameworksMapping: { ...controlFrameworksMapping },
      controlsByFramework: { ...controlsByFramework },
    };
  }),
  on(ControlAdapterActions.customControlRemoved, (state: ControlsState, action: CustomControlRemovedAction) => {
    if (state.controlFrameworksMapping[action.control_id]) {
      const controlsByFramework = { ...state.controlsByFramework };
      const controlFrameworksMapping = { ...state.controlFrameworksMapping };
      controlFrameworksMapping[action.control_id].forEach((framework_id) => {
        controlsByFramework[framework_id] = controlsByFramework[framework_id].filter(
          (control_id) => control_id !== action.control_id
        );
      });
      delete controlFrameworksMapping[action.control_id];

      return {
        ...state,
        controls: controlAdapter.removeOne(action.control_id, state.controls),
        controlFrameworksMapping,
        controlsByFramework: controlsByFramework,
      };
    } else {
      return state;
    }
  })
);

export function controlsReducer(state = initialState, action: Action): ControlsState {
  return adapterReducer(state, action);
}

function reconstructControls(
  statecontrols: EntityState<Control>,
  controlStateEntities: ControlStateEntity[]
): EntityState<Control> {
  // cache invalidation
  const clearedCache = controlAdapter.removeAll(statecontrols);
  return constructControls(clearedCache, controlStateEntities);
}

function constructControls(
  statecontrols: EntityState<Control>,
  controlStateEntities: ControlStateEntity[]
): EntityState<Control> {
  return controlAdapter.addMany(
    controlStateEntities.map((x) => x.control),
    statecontrols
  );
}

function constructControlsState(
  state: ControlsState,
  controls: Control[],
  updateAreLoaded = false,
  areLoaded = false
): ControlsState {
  const controlFrameworksMapping = {};
  const controlsByFramework = {};
  const controlStateEntities: ControlStateEntity[] = [];

  groupBy(controls, (control) => control.control_framework_id).forEach((group) => {
    controlsByFramework[group.key] = group.values.map((control) => selectControlId(control));

    group.values.forEach((control) => {
      const controlId = selectControlId(control);
      controlFrameworksMapping[controlId] = [group.key];
      controlStateEntities.push({ control: control, relatedFrameworkIds: controlFrameworksMapping[controlId] });
    });
  });

  const constructedState = {
    ...state,
    controls: state.areAllLoaded
      ? reconstructControls(state.controls, controlStateEntities)
      : constructControls(state.controls, controlStateEntities),
    controlFrameworksMapping,
    controlsByFramework,
  };

  return updateAreLoaded ? { ...constructedState, areAllLoaded: areLoaded, anyLoaded: true } : constructedState;
}
