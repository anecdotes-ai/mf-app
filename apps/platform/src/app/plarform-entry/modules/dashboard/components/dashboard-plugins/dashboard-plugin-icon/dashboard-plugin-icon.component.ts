import { Component, Input, OnInit } from '@angular/core';
import { ConnectedPluginsData } from '../../../models';
import { Observable } from 'rxjs';
import { PluginService } from 'core/modules/data/services';

@Component({
  selector: 'app-dashboard-plugin-icon',
  templateUrl: './dashboard-plugin-icon.component.html',
  styleUrls: ['./dashboard-plugin-icon.component.scss'],
})
export class DashboardPluginIconComponent implements OnInit {
  @Input() connectedPlugin: ConnectedPluginsData;

  serviceIcon$: Observable<string>;
  serviceRoute: string;

  constructor(private pluginService: PluginService) {}

  ngOnInit(): void {
    if (this.connectedPlugin) {
      this.serviceIcon$ = this.pluginService.getServiceIconLink(this.connectedPlugin.service_id);
      this.serviceRoute = this.pluginService.getPluginRoute(this.connectedPlugin.service_id);
    }
  }
}
