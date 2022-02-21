import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-connector-tabs-empty-state',
  templateUrl: './connector-tabs-empty-state.component.html',
  styleUrls: ['./connector-tabs-empty-state.component.scss'],
})
export class ConnectorTabsEmptyStateComponent {
  @Input()
  message: string;
}
