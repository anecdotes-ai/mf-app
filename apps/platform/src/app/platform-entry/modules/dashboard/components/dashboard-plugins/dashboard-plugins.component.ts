import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { Service } from 'core/modules/data/models/domain';
import { PluginService } from 'core/modules/data/services';
import { ConnectedPluginsData } from '../../models';

@Component({
  selector: 'app-dashboard-plugin',
  templateUrl: './dashboard-plugins.component.html',
  styleUrls: ['./dashboard-plugins.component.scss'],
})
export class DashboardPluginsComponent {
  @Input() data: ConnectedPluginsData | Service[];
  recentlyConnectedServices: ConnectedPluginsData[];
  newEvidenceAmount: number;
  connectedPlugin: ConnectedPluginsData;

  constructor(public pluginService: PluginService, private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes) {
      this.recentlyConnectedServices = changes['data'].currentValue;
      if (this.recentlyConnectedServices && this.recentlyConnectedServices.length > 0) {
        this.newEvidenceAmount = this.recentlyConnectedServices
          .map((item) => item.service_evidence_list.length)
          .reduce((prev, next) => prev + next);
        this.cd.detectChanges();
      }
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `dashboard.plugins.${relativeKey}`;
  }
}
