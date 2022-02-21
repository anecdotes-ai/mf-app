import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { EvidenceInstance } from 'core/modules/data/models/domain';
import { CalculatedControl, EvidenceLike } from 'core/modules/data/models/index';
import { ActionDispatcherService, EvidenceFacadeService, TrackOperations } from 'core/modules/data/services';
import { RiskCategoryFacadeService, RiskSourceFacadeService } from 'core/modules/risk/services';
import { EvidenceCollectionTypeEnum } from 'core/modules/shared-controls/models/evidence-collection-modal-params';
import { RiskManagerEventService } from '../risk-manager-event/risk-manager-event.service';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { DetailedRisk, EffectEnum, Risk, RiskCategory, RiskSource, StrategyEnum } from '../../models';
import { RisksActions } from '../../store/actions/risks.actions';
import { RiskSelectors } from '../../store/selectors';
import { RiskDataState } from '../../store/state';

@Injectable()
export class RiskFacadeService {
  constructor(
    private store: Store<RiskDataState>,
    private actionDispatcher: ActionDispatcherService,
    private evidenceFacade: EvidenceFacadeService,
    private riskManagerEventService: RiskManagerEventService,
    private riskCategoryFacadeService: RiskCategoryFacadeService,
    private riskSourceFacadeService: RiskSourceFacadeService,
  ) {}

  initAsync(): Promise<void> {
    return this.actionDispatcher.dispatchActionAsync(RisksActions.InitRisksState(), RisksActions.InitRisksState.type);
  }

  getAllRisks(): Observable<Risk[]> {
    return this.store.select(RiskSelectors.selectAll);
  }

  getRiskEvidences(riskId: string): Observable<EvidenceInstance[]> {
    return this.getRiskById(riskId).pipe(switchMap((risk) => {
      return this.evidenceFacade.getEvidenceByIds(risk.evidence_ids || []).pipe(map(x => x.map(c => c.evidence)));
    }));
  }

  getRiskById(riskId: string): Observable<Risk> {
    return this.store.select(RiskSelectors.createByIdSelector(riskId));
  }

  async addRisk({ isCustomCategory, isCustomSource, ...risk }: DetailedRisk): Promise<void> {
    await this.actionDispatcher.dispatchActionAsync(RisksActions.AddRisk({ risk }), TrackOperations.ADD_RISK, risk.id);

    const category = await this.riskCategoryFacadeService.getCategoryById(risk.category_id)
      .pipe(take(1)).toPromise();
    let source: RiskSource;

    if (risk.source_id) {
      source = await this.riskSourceFacadeService.getSourceById(risk.source_id)
        .pipe(take(1)).toPromise();
    }

    await this.riskManagerEventService.trackCreatedRiskEvent(
      { ...risk, isCustomCategory, isCustomSource },
      category?.category_name,
      source?.source_name,
    );
  }

  async addSupportingDocumentEvent(evidence: EvidenceLike, evidenceType: EvidenceCollectionTypeEnum, riskId: string): Promise<void> {
    const { name: riskName } = await this.getRiskById(riskId)
      .pipe(take(1)).toPromise();
    const riskCategory = await this.riskCategoryFacadeService.getCategoryForRisk(riskId)
      .pipe(take(1)).toPromise();

    this.riskManagerEventService.trackAddSupportingDocumentEvent(evidence, evidenceType, riskName, riskCategory?.category_name);
  }

  async addOrUpdateCategoryForRiskAsync(riskId: string, riskCategory: RiskCategory): Promise<void> {
    let categoryId = riskCategory.id;

    if (!categoryId) {
      const createdCategory: RiskCategory = await this.actionDispatcher.dispatchActionAsync(
        RisksActions.AddRiskCategory({ risk_category: riskCategory }),
        TrackOperations.ADD_RISK_CATEGORY
      );
      categoryId = createdCategory.id;
    }

    await this.actionDispatcher.dispatchActionAsync(
      RisksActions.EditRisk({ risk: { id: riskId, category_id: categoryId } }),
      TrackOperations.EDIT_RISK
    );
  }

  async addOrUpdateSourceForRiskAsync(riskId: string, source: RiskSource): Promise<void> {
    let sourceId = source.id;

    if (!sourceId) {
      const createdSource: RiskSource = await this.actionDispatcher.dispatchActionAsync(
        RisksActions.AddRiskSource({ risk_source: source }),
        TrackOperations.ADD_RISK_SOURCE
      );
      sourceId = createdSource.id;
    }

    await this.actionDispatcher.dispatchActionAsync(
      RisksActions.EditRisk({ risk: { id: riskId, source_id: sourceId } }),
      TrackOperations.EDIT_RISK
    );
  }

  async removeSourceForRiskAsync(riskId: string): Promise<void> {
    await this.actionDispatcher.dispatchActionAsync(
      RisksActions.EditRisk({ risk: { id: riskId, source_id: null } }),
      TrackOperations.EDIT_RISK
    );
  }

  async editDescriptionsAsync(
    riskId: string,
    descriptionParams: { newDescription?: string; newThreat?: string; newVulnerability?: string }
  ): Promise<void> {
    const newRisk: Risk = { id: riskId };

    if (descriptionParams.newDescription) {
      newRisk.risk_description = descriptionParams.newDescription;
    }

    if (descriptionParams.newThreat) {
      newRisk.threat_description = descriptionParams.newThreat;
    }

    if (descriptionParams.newVulnerability) {
      newRisk.vulnerability_description = descriptionParams.newVulnerability;
    }

    await this.actionDispatcher.dispatchActionAsync(
      RisksActions.EditRisk({ risk: newRisk }),
      TrackOperations.EDIT_RISK
    );
  }

  async editFinancialImpactAsync(
    riskId: string,
    newFinancialImpact: { inherent_risk_level_financial_impact?: string; residual_risk_level_financial_impact?: string }
  ): Promise<void> {
    const newRisk: Risk = { id: riskId };

    if (newFinancialImpact.inherent_risk_level_financial_impact) {
      newRisk.inherent_risk_level_financial_impact = newFinancialImpact.inherent_risk_level_financial_impact;
    }

    if (newFinancialImpact.residual_risk_level_financial_impact) {
      newRisk.residual_risk_level_financial_impact = newFinancialImpact.residual_risk_level_financial_impact;
    }

    await this.actionDispatcher.dispatchActionAsync(
      RisksActions.EditRisk({ risk: newRisk }),
      TrackOperations.EDIT_RISK
    );
  }

  editRiskNameAsync(riskId: string, name: string): Promise<void> {
    return this.actionDispatcher.dispatchActionAsync(
      RisksActions.EditRisk({ risk: { id: riskId, name } }),
      TrackOperations.EDIT_RISK
    );
  }

  updateRiskStrategyAsync(riskId: string, strategy: StrategyEnum): Promise<void> {
    return this.actionDispatcher.dispatchActionAsync(
      RisksActions.EditRisk({ risk: { id: riskId, strategy } }),
      TrackOperations.EDIT_RISK
    );
  }

  updateRiskEffectsAsync(riskId: string, effects: EffectEnum[]): Promise<void> {
    return this.actionDispatcher.dispatchActionAsync(
      RisksActions.EditRisk({ risk: { id: riskId, effect: effects } }),
      TrackOperations.EDIT_RISK
    );
  }

  updateRiskMitigationControls(riskId: string, mitigationControlIds: string[]): Promise<void> {
    return this.actionDispatcher.dispatchActionAsync(
      RisksActions.EditRisk({ risk: { id: riskId, mitigation_control_ids: mitigationControlIds } }),
      TrackOperations.EDIT_RISK,
      riskId
    );
  }

  /**
   * Updates owner.
   * @param riskId
   * @param newOwner email of a new owner needs to be updated for a risk
   * @returns
   */
  async updateRiskOwnerAsync(riskId: string, newOwner: string): Promise<void> {
    await this.actionDispatcher.dispatchActionAsync(
      RisksActions.EditRisk({ risk: { id: riskId, owner: newOwner } }),
      TrackOperations.EDIT_RISK,
      riskId
    );

    const risk = await this.getRiskById(riskId)
      .pipe(take(1)).toPromise();
    const riskCategory = await this.riskCategoryFacadeService.getCategoryForRisk(riskId)
      .pipe(take(1)).toPromise();

    this.riskManagerEventService.trackSelectOwnerEvent(risk.name, riskCategory?.category_name, risk.strategy, risk.level_target);
  }

  async deleteRisk(risk_id: string): Promise<void> {
    const risk = await this.getRiskById(risk_id)
      .pipe(take(1)).toPromise();
    const riskCategory = await this.riskCategoryFacadeService.getCategoryForRisk(risk_id)
      .pipe(take(1)).toPromise();

    await this.actionDispatcher.dispatchActionAsync(
      RisksActions.DeleteRisk({ risk_id }),
      TrackOperations.DELETE_RISK,
      risk_id
    );

    this.riskManagerEventService.trackDeleteRiskEvent(risk.name, riskCategory?.category_name, risk.strategy, risk.level_target);
  }

  async editRisk(risk_id: string, risk: Risk, previousValue: string): Promise<void> {
    await this.actionDispatcher.dispatchActionAsync(
      RisksActions.EditRisk({ risk: { id: risk_id, ...risk } }),
      TrackOperations.EDIT_RISK,
      risk_id
    );

    const { name: riskName } = await this.getRiskById(risk_id)
      .pipe(take(1)).toPromise();
    const [editedField] = Object.keys(risk);

    this.riskManagerEventService.trackEditRiskEvent(riskName, editedField, previousValue, risk[editedField]);
  }

  async openViewControlEvent(risk: Risk, control: CalculatedControl): Promise<void> {
    const riskCategory = await this.riskCategoryFacadeService.getCategoryForRisk(risk.id)
      .pipe(take(1)).toPromise();

    this.riskManagerEventService.trackViewControlEvent(
      control.control_framework,
      control.control_name,
      control.control_category,
      risk.name,
      riskCategory?.category_name,
    );
  }

  async disconnectControlEvent(risk: Risk, control: CalculatedControl): Promise<void> {
    const riskCategory = await this.riskCategoryFacadeService.getCategoryForRisk(risk.id)
      .pipe(take(1)).toPromise();

    this.riskManagerEventService.trackDisconnectControlEvent(
      control.control_framework,
      control.control_name,
      control.control_category,
      risk.name,
      riskCategory?.category_name,
    );
  }

  linkControlEvent(risk: Risk, control: CalculatedControl): void {
    this.riskManagerEventService.trackLinkControlEvent(
      risk.name,
      control.control_name,
      control.control_framework,
      control.control_status.status,
      control.control_category,
    );
  }

  async howRiskLevelIsCalculatedEvent(risk: Risk): Promise<void> {
    const riskCategory = await this.riskCategoryFacadeService.getCategoryForRisk(risk.id)
      .pipe(take(1)).toPromise();

    this.riskManagerEventService.trackHowRiskLevelIsCalculatedEvent(
      risk.name,
      riskCategory?.category_name,
      risk.strategy,
      risk.level_target,
    );
  }

  attachEvidenceToRisk(risk_id: string, evidence_id: string): Promise<void> {
    return this.actionDispatcher.dispatchActionAsync(
      RisksActions.AttachEvidenceToRisk({ risk_id, evidence_id }),
      TrackOperations.ATTACH_EVIDENCE_TO_RISK,
      risk_id
    );
  }

  removeEvidenceFromRisk(riskId: string, evidenceId: string): Promise<void> {
    return this.actionDispatcher.dispatchActionAsync(
      RisksActions.RemoveEvidenceFromRisk({ riskId, evidenceId }),
      TrackOperations.REMOVE_EVIDENCE_FROM_RISK,
      riskId
    );
  }
}
