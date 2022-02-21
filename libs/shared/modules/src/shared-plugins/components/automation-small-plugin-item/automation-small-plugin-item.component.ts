import { Component, Input, OnInit } from '@angular/core';
import { PluginService } from 'core/modules/data/services';
import { Service } from 'core/modules/data/models/domain';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-automation-small-plugin-item',
  templateUrl: './automation-small-plugin-item.component.html',
  styleUrls: ['./automation-small-plugin-item.component.scss'],
})
export class AutomationSmallPluginItemComponent implements OnInit {
  @Input()
  pluginData: Service;

  @Input()
  comingSoon: boolean;

  serviceIcon$: Observable<string>;

  constructor(public pluginService: PluginService) {}

  ngOnInit(): void {
    this.serviceIcon$ = this.pluginService.getServiceIconLink(this.pluginData.service_id);
  }
}
