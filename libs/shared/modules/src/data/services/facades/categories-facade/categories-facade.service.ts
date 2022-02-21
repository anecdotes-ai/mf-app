import { Injectable } from '@angular/core';
import { ControlsFacadeService } from '../controls-facade/controls-facade.service';
import { CategoryObject, CalculatedControl } from '../../../models';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { groupBy } from 'core/utils';

@Injectable()
export class CategoriesFacadeService {
  constructor(private controlsFacade: ControlsFacadeService) {}
  readonly categoriesByFramework$: { [frameworkId: string]: Observable<CategoryObject[]> } = {};

  getFrameworkCategories(frameworkId: string): Observable<CategoryObject[]> {
    if (!(frameworkId in this.categoriesByFramework$)) {
      this.categoriesByFramework$[frameworkId] = this.controlsFacade.getControlsByFrameworkId(frameworkId).pipe(
        filter((controls) => !!controls),
        map((controls) => this.groupControlsByCategory(controls, frameworkId))
      );
    }

    return this.categoriesByFramework$[frameworkId];
  }

  groupControlsByCategory(controls: CalculatedControl[], frameworkId: string): CategoryObject[] {
    return groupBy(controls, (x) => x.control_category).map((x) => {
      return {
        control_category: x.key,
        control_category_id: this.getCategoryIdAndCategorySubId(x.key),
        controls: x.values,
      };
    });
  }

  private getCategoryIdAndCategorySubId(categoryName: string): number {
    const matches = /^(?<categoryId>\d+\.?\d*)/gm.exec(categoryName);

    if (matches) {
      return Number.parseFloat(matches.groups['categoryId']);
    }
  }
}
