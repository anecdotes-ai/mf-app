import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActionDispatcherService, TrackOperations } from 'core/modules/data/services';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RiskCategory } from '../../models';
import { RisksActions } from '../../store/actions/risks.actions';
import { RiskCategorySelectors, RiskSelectors } from '../../store/selectors';

@Injectable()
export class RiskCategoryFacadeService {
  constructor(private store: Store, private actionDispatcher: ActionDispatcherService) {}

  getAllRiskCategories(): Observable<RiskCategory[]> {
    return this.store.select(RiskCategorySelectors.selectAll);
  }

  getCategoryById(categoryId: string): Observable<RiskCategory> {
    return this.store.select(RiskCategorySelectors.createByIdSelector(categoryId));
  }

  getCategoryForRisk(riskId: string): Observable<RiskCategory> {
    return this.store.select(RiskSelectors.createByIdSelector(riskId))
      .pipe(switchMap(risk => this.store.select(RiskCategorySelectors.createByIdSelector(risk.category_id))));
  }

  addRiskCategory(risk_category: RiskCategory): Promise<RiskCategory> {
    return this.actionDispatcher.dispatchActionAsync(
      RisksActions.AddRiskCategory({ risk_category }),
      TrackOperations.ADD_RISK_CATEGORY,
      risk_category.id
    );
  }

  deleteRiskCategory(risk_category_id: string): Promise<void> {
    return this.actionDispatcher.dispatchActionAsync(
      RisksActions.DeleteRiskCategory({ risk_category_id }),
      TrackOperations.DELETE_RISK_CATEGORY,
      risk_category_id
    );
  }
}
