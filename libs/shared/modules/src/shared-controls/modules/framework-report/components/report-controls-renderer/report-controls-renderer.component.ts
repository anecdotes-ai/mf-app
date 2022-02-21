import { Component, Input } from '@angular/core';
import { CalculatedControl } from 'core/modules/data/models';
import { CategoriesFacadeService } from 'core/modules/data/services';

export interface CategoryItem {
  category: string;
  amount: number;
}

@Component({
  selector: 'app-report-controls-renderer',
  templateUrl: './report-controls-renderer.component.html',
  styleUrls: ['./report-controls-renderer.component.scss'],
})
export class ReportControlsRendererComponent {
  @Input()
  framework_id: string;

  @Input()
  controls: CalculatedControl[];

  constructor(private categoriesFacade: CategoriesFacadeService) {}

  isCategory(item: CalculatedControl | CategoryItem): boolean {
    return 'category' in item && 'amount' in item;
  }

  buildRenderingItems(): any[] {
    return this.categoriesFacade.groupControlsByCategory(this.controls, this.framework_id).reduce(
      (prev, curr) => [
        ...prev,
        {
          category: curr.control_category,
          amount: curr.controls.length,
        },
        ...curr.controls,
      ],
      []
    );
  }
}
