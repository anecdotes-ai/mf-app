import { ChangeDetectionStrategy, Component, HostBinding, HostListener, Input } from '@angular/core';
import { CategoryObject } from 'core/modules/data/models';
import { Framework } from 'core/modules/data/models/domain';
import { ControlsNavigator } from 'core/modules/shared-controls';
import { ExploreControlsSource } from 'core';

@Component({
  selector: 'app-framework-category-item',
  templateUrl: './framework-category-item.component.html',
  styleUrls: ['./framework-category-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameworkCategoryItem {
  @Input()
  category: CategoryObject;
  @Input()
  framework: Framework;

  get controlsCount(): string {
    return this.category?.controls.length > 1
      ? this.buildTranslationKey('many_controls')
      : this.buildTranslationKey('control');
  }

  @HostBinding('class')
  classes = 'group cursor-pointer flex items-center pl-4 pr-8 py-3 border-solid border-navy-40 border rounded-md mb-5 hover:shadow-md hover:border-navy-70';

  @HostListener('click')
  navigateToControlsCategory(): void {
    this.controlsNavigator.navigateToControlsPageAsync(
      this.framework.framework_id,
      { categories: this.category.control_category },
      ExploreControlsSource.FrameworkOverview
    );
  }

  constructor(private controlsNavigator: ControlsNavigator) {}

  buildTranslationKey(key: string): string {
    return `frameworks.frameworkManager.overview.${key}`;
  }
}
