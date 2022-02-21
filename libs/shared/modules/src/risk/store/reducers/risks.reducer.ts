import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Risk, RiskCategory, RiskSource } from '../../models';
import { RisksActions } from '../actions/risks.actions';

export interface RiskState {
  areAllLoaded: boolean;
  risks: EntityState<Risk>;
  riskCategories: EntityState<RiskCategory>;
  riskSources: EntityState<RiskSource>;
}

const risksAdapter: EntityAdapter<Risk> = createEntityAdapter<Risk>({
  selectId: (r: Risk): string => r.id,
});

const riskCategoriesAdapter: EntityAdapter<RiskCategory> = createEntityAdapter<RiskCategory>({
  selectId: (rc: Risk): string => rc.id,
});

const riskSourceAdapter: EntityAdapter<RiskSource> = createEntityAdapter<RiskSource>({
  selectId: (rs: Risk): string => rs.id,
});

const initialState: RiskState = {
  areAllLoaded: false,
  risks: risksAdapter.getInitialState({}),
  riskCategories: riskCategoriesAdapter.getInitialState({}),
  riskSources: riskSourceAdapter.getInitialState({}),
};

export function risksReducer(state = initialState, action: Action): RiskState {
  return adapterReducer(state, action);
}

const adapterReducer = createReducer(
  initialState,
  on(RisksActions.RisksLoaded, (state: RiskState, action) => {
    return {
      ...state,
      areAllLoaded: true,
      risks: risksAdapter.upsertMany(action.risks, state.risks),
    };
  }),
  on(RisksActions.RiskAdded, (state: RiskState, action) => {
    return {
      ...state,
      risks: risksAdapter.addOne(action.risk, state.risks),
    };
  }),
  on(RisksActions.RiskEdited, (state: RiskState, action) => {
      return {
        ...state,
        risks: risksAdapter.updateOne({ id: action.risk.id, changes: action.risk }, state.risks),
      };
  }),
  on(RisksActions.RiskDeleted, (state: RiskState, action) => {
    return {
      ...state,
      risks: risksAdapter.removeOne(action.risk_id, state.risks),
    };
  }),
  on(RisksActions.RiskCategoriesLoaded, (state: RiskState, action) => {
    return {
      ...state,
      riskCategories: riskCategoriesAdapter.upsertMany(action.risk_categories, state.riskCategories),
    };
  }),
  on(RisksActions.RiskCategoryAdded, (state: RiskState, action) => {
    return {
      ...state,
      riskCategories: riskCategoriesAdapter.addOne(action.risk_category, state.riskCategories),
    };
  }),
  on(RisksActions.RiskCategoryDeleted, (state: RiskState, action) => {
    return {
      ...state,
      riskCategories: riskCategoriesAdapter.removeOne(action.risk_category_id, state.riskCategories),
    };
  }),
  on(RisksActions.RiskSourcesLoaded, (state: RiskState, action) => {
    return {
      ...state,
      riskSources: riskSourceAdapter.upsertMany(action.risk_sources, state.riskSources),
    };
  }),
  on(RisksActions.RiskSourceAdded, (state: RiskState, action) => {
    return {
      ...state,
      riskSources: riskSourceAdapter.addOne(action.risk_source, state.riskSources),
    };
  }),
  on(RisksActions.RiskSourceDeleted, (state: RiskState, action) => {
    return {
      ...state,
      riskSources: riskSourceAdapter.removeOne(action.risk_source_id, state.riskSources),
    };
  })
);
