import { Injectable } from '@angular/core';
import { RiskCategoryFacadeService, RiskFacadeService } from 'core/modules/risk/services';
import { RiskFilterObject } from 'core/modules/risk/models';
import { combineLatest, Observable, of } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';

@Injectable()
export class RiskFilterService {
  constructor(private riskFacade: RiskFacadeService, private riskCategoryFacade: RiskCategoryFacadeService) {}

  getAllRiskFilterObjects(): Observable<RiskFilterObject[]> {
    return this.riskFacade.getAllRisks().pipe(
      map((risks) =>
        risks.map((risk) =>
          this.riskCategoryFacade.getCategoryForRisk(risk.id).pipe(
            map((category) => {
              return { ...risk, category_name: category?.category_name } as RiskFilterObject;
            })
          )
        )
      ),
      switchMap((risks) => (risks.length ? combineLatest(risks) : of([]))),
      debounceTime(100)
    );
  }
}
