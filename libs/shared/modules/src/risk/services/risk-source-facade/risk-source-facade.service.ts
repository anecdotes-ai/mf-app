import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActionDispatcherService, TrackOperations } from 'core/modules/data/services';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RiskSource } from '../../models';
import { RisksActions } from '../../store/actions/risks.actions';
import { RiskSelectors, RiskSourceSelectors } from '../../store/selectors';
import { RiskDataState } from '../../store/state';

@Injectable()
export class RiskSourceFacadeService {
  constructor(private store: Store<RiskDataState>, private actionDispatcher: ActionDispatcherService) {}

  getAllRiskSources(): Observable<RiskSource[]> {
    return this.store.select(RiskSourceSelectors.selectAll);
  }

  getSourceById(sourceId: string): Observable<RiskSource> {
    return this.store.select(RiskSourceSelectors.createByIdSelector(sourceId));
  }

  getSourceForRisk(riskId: string): Observable<RiskSource> {
    return this.store.select(RiskSelectors.createByIdSelector(riskId))
      .pipe(switchMap(risk => this.store.select(RiskSourceSelectors.createByIdSelector(risk.source_id))));
  }

  addRiskSource(risk_source: RiskSource): Promise<RiskSource> {
    return this.actionDispatcher.dispatchActionAsync(
      RisksActions.AddRiskSource({ risk_source }),
      TrackOperations.ADD_RISK_SOURCE,
      risk_source.id
    );
  }

  deleteRiskSource(risk_source_id: string): Promise<void> {
    return this.actionDispatcher.dispatchActionAsync(
      RisksActions.DeleteRiskSource({ risk_source_id }),
      TrackOperations.DELETE_RISK_SOURCE,
      risk_source_id
    );
  }
}
