import { FrameworksAdapterActions, FrameworksAdoptedAction, FrameworksBatchUpdatedAction, FrameworksLoadedAction, FrameworkUpdatedAction, SpecificFrameworkLoadedAction } from './../actions/frameworks.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Framework } from '../../models/domain';

export interface FrameworksState extends EntityState<Framework> {
  initialized: boolean;
}

function selectFrameworkId(f: Framework): string {
  return f.framework_id;
}

export const frameworksAdapter: EntityAdapter<Framework> = createEntityAdapter<Framework>({
  selectId: selectFrameworkId,
});

const initialState: FrameworksState = frameworksAdapter.getInitialState({ initialized: false });

const adapterReducer = createReducer(
  initialState,
  on(FrameworksAdapterActions.frameworksLoaded, (state: FrameworksState, action: FrameworksLoadedAction) => {
    return frameworksAdapter.upsertMany(action.extendedFramework || [], { ...state, initialized: true });
  }),
  on(FrameworksAdapterActions.specificFrameworkLoaded, (state: FrameworksState, action: SpecificFrameworkLoadedAction) => {
    return frameworksAdapter.upsertOne(action.extendedFramework, state);
  }),
  on(FrameworksAdapterActions.frameworkUpdated, (state: FrameworksState, action: FrameworkUpdatedAction
    ) =>
    frameworksAdapter.updateOne({ id: action.framework.framework_id, changes: action.framework }, state)
  ),
  on(FrameworksAdapterActions.frameworksBatchUpdated, (state: FrameworksState, action: FrameworksBatchUpdatedAction) =>
    frameworksAdapter.updateMany(
      action.batch.map((framework) => Object.assign({}, { id: framework.framework_id, changes: framework })),
      state
    )
  ),
  on(FrameworksAdapterActions.frameworksAdopted, (state: FrameworksState, action: FrameworksAdoptedAction) =>
    frameworksAdapter.updateMany(
      action.frameworks.map((framework) => ({ id: framework.framework_id, changes: { is_applicable: true } })),
      state
    )
  )
);

export function frameworksReducer(state = initialState, action: Action): FrameworksState {
  return adapterReducer(state, action);
}
