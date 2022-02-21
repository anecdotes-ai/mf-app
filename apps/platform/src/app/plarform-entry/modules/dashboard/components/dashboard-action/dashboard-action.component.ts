import { Component, Input, HostBinding } from '@angular/core';
import { CalculatedControl } from 'core/modules/data/models';

@Component({
  selector: 'app-dashboard-action',
  templateUrl: './dashboard-action.component.html',
  styleUrls: ['./dashboard-action.component.scss'],
})
export class DashboardActionComponent {
  @Input()
  data: CalculatedControl[];

  @HostBinding('class.actions-exists')
  private get actionsExists(): boolean {
    return !!this.data && !!this.data.length;
  }

  buildTranslationKey(relativeKey: string): string {
    return `dashboard.action.${relativeKey}`;
  }
}
