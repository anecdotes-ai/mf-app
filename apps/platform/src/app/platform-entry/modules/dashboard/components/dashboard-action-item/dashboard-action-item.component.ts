import { AnecdotesUnifiedFramework } from 'core/modules/data/constants/anecdotes-unified-framework';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ControlStatusMappingData } from 'core/utils';
import { CalculatedControl } from 'core/modules/data/models';
import { AppRoutes } from 'core/constants/routes';

@Component({
  selector: 'app-dashboard-action-item',
  templateUrl: './dashboard-action-item.component.html',
  styleUrls: ['./dashboard-action-item.component.scss'],
})
export class DashboardActionItemComponent {
  @Input()
  control: CalculatedControl;

  statusMappingConst = ControlStatusMappingData;

  constructor(private router: Router) {}

  exploreControl(): void {
    const queryParams = {
      searchQuery: this.control.control_name
    };

    this.router.navigate([AppRoutes.Controls.replace(':framework', AnecdotesUnifiedFramework.framework_name)], {
      state: {
        expandControlsIds: [this.control.control_id],
      },
      queryParams,
    });
  }

  buildTranslationKey(relativeKey: string): string {
    return `dashboard.action.${relativeKey}`;
  }
}
