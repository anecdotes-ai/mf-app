import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { SortDefinition } from 'core/modules/data-manipulation/sort';
import { CalculatedControl, CategoryObject } from 'core/modules/data/models';
import { ControlStatusEnum, Framework } from 'core/modules/data/models/domain';
import { CategoriesFacadeService } from 'core/modules/data/services';
import { SubscriptionDetacher, isDateBeforeToday } from 'core/utils';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-framework-categories',
  templateUrl: './framework-categories.component.html',
  styleUrls: ['./framework-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameworkCategories implements OnInit {
  @Input()
  framework: Framework;

  categories$: Observable<CategoryObject[]>;

  constructor(private categoriesFacade: CategoriesFacadeService) {}

  ngOnInit(): void {
    this.categories$ = this.categoriesFacade.getFrameworkCategories(this.framework.framework_id);
  }

  buildTranslationKey(key: string): string {
    return `frameworks.frameworkManager.overview.${key}`;
  }
}
