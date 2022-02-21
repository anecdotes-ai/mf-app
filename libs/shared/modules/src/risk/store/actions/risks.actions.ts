import { Risk, RiskCategory, RiskSource } from '../../models';
import { createAction, props } from '@ngrx/store';

export const RiskActionType = {
  InitRisksState: '[Risks] Init state',
  RisksLoaded: '[Risks] Risks loaded',

  AddRisk: '[Add Risk] Add risk',
  RiskAdded: '[Add Risk] Risk added',

  GetRisk: '[Get Risk] Get risk',
  RiskLoaded: '[Get Risk] Risk loaded',

  EditRisk: '[Edit Risk] Edit risk',
  RiskEdited: '[Edit Risk] Risk edited',

  AttachEvidenceToRisk: '[Risk] Attach evidence to risk',
  RemoveEvidenceFromRisk: '[Risk] remove evidence from risk',

  DeleteRisk: '[Risk] Delete risk',
  RiskDeleted: '[Risk] Risk deleted',

  InitRiskCategoriesState: '[Risk Categories] Init state',
  RiskCategoriesLoaded: '[Risk Categories] Risk categories loaded',

  AddRiskCategory: '[Add Risk Category] Add risk category',
  RiskCategoryAdded: '[Add Risk Category] Risk category added',

  GetRiskCategory: '[Get Risk Category] Get risk category',
  RiskCategoryLoaded: '[Get Risk Category] Risk Category loaded',

  DeleteRiskCategory: '[Risk Category] Delete risk category',
  RiskCategoryDeleted: '[Risk Category] Risk category deleted',

  InitRiskSourcesState: '[Risk Sources] Init state',
  RiskSourcesLoaded: '[Risk Sources] Risk sources loaded',

  AddRiskSource: '[Add Risk Source] Add risk source',
  RiskSourceAdded: '[Add Risk Source] Risk source added',

  GetRiskSource: '[Get Risk Source] Get risk source',
  RiskSourceLoaded: '[Get Risk Source] Risk source loaded',

  DeleteRiskSource: '[Risk Source] Delete risk source',
  RiskSourceDeleted: '[Risk Source] Risk source deleted',
};

export const RisksActions = {
  InitRisksState: createAction(RiskActionType.InitRisksState),
  RisksLoaded: createAction(RiskActionType.RisksLoaded, props<{ risks: Risk[] }>()),
  AddRisk: createAction(RiskActionType.AddRisk, props<{ risk: Risk }>()),
  RiskAdded: createAction(RiskActionType.RiskAdded, props<{ risk: Risk }>()),
  GetRisk: createAction(RiskActionType.GetRisk, props<{ risk_id: string }>()),
  RiskLoaded: createAction(RiskActionType.RiskLoaded, props<{ risk: Risk }>()),
  EditRisk: createAction(RiskActionType.EditRisk, props<{ risk: Risk }>()),
  RiskEdited: createAction(RiskActionType.RiskEdited, props<{ risk: Risk }>()),
  AttachEvidenceToRisk: createAction(RiskActionType.AttachEvidenceToRisk, props<{ risk_id: string; evidence_id: string }>()),
  RemoveEvidenceFromRisk: createAction(RiskActionType.RemoveEvidenceFromRisk, props<{ riskId: string, evidenceId: string }>()),
  DeleteRisk: createAction(RiskActionType.DeleteRisk, props<{ risk_id: string }>()),
  RiskDeleted: createAction(RiskActionType.RiskDeleted, props<{ risk_id: string }>()),
  InitRiskCategoriesState: createAction(RiskActionType.InitRiskCategoriesState),
  RiskCategoriesLoaded: createAction(RiskActionType.RiskCategoriesLoaded, props<{ risk_categories: RiskCategory[] }>()),
  AddRiskCategory: createAction(RiskActionType.AddRiskCategory, props<{ risk_category: RiskCategory }>()),
  RiskCategoryAdded: createAction(RiskActionType.RiskCategoryAdded, props<{ risk_category: RiskCategory }>()),
  GetRiskCategory: createAction(RiskActionType.GetRiskCategory, props<{ risk_category_id: string }>()),
  RiskCategoryLoaded: createAction(RiskActionType.RiskCategoryLoaded, props<{ risk_category: RiskCategory }>()),
  DeleteRiskCategory: createAction(RiskActionType.DeleteRiskCategory, props<{ risk_category_id: string }>()),
  RiskCategoryDeleted: createAction(RiskActionType.RiskCategoryDeleted, props<{ risk_category_id: string }>()),
  InitRiskSourcesState: createAction(RiskActionType.InitRiskSourcesState),
  RiskSourcesLoaded: createAction(RiskActionType.RiskSourcesLoaded, props<{ risk_sources: RiskSource[] }>()),
  AddRiskSource: createAction(RiskActionType.AddRiskSource, props<{ risk_source: RiskSource }>()),
  RiskSourceAdded: createAction(RiskActionType.RiskSourceAdded, props<{ risk_source: RiskSource }>()),
  GetRiskSource: createAction(RiskActionType.GetRiskSource, props<{ risk_source_id: string }>()),
  RiskSourceLoaded: createAction(RiskActionType.RiskSourceLoaded, props<{ risk_source: RiskSource }>()),
  DeleteRiskSource: createAction(RiskActionType.DeleteRiskSource, props<{ risk_source_id: string }>()),
  RiskSourceDeleted: createAction(RiskActionType.RiskSourceDeleted, props<{ risk_source_id: string }>()),
};
