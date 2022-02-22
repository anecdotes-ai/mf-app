import { Observable } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { Service, ServiceTypeEnum } from 'core/modules/data/models/domain';
import { PluginService } from 'core/modules/data/services';

@Component({
  selector: 'app-plugin-info-tab',
  templateUrl: './plugin-info-tab.component.html',
  styleUrls: ['./plugin-info-tab.component.scss'],
})
export class PluginInfoTabComponent implements OnInit {
  @Input()
  service: Service;
  serviceIcon$: Observable<string>;

  serviceTypes = ServiceTypeEnum;

  get resolveCommentTranslationKey(): string {
    if (this.service.service_type === ServiceTypeEnum.FILEMONITOR) {
      return 'automaticallyMonitor';
    }

    if (this.service.service_type === ServiceTypeEnum.COLLABORATION) {
      return 'allowsYouTo';
    } else {
      return 'anecdotesCanAutomate';
    }
  }

  get resolveDescriptionInfoTranslationKey(): string {
    if (this.service.service_type === ServiceTypeEnum.FILEMONITOR) {
      return 'anyFileYouLinkToEvidence';
    }

    if (this.service.service_type === ServiceTypeEnum.COLLABORATION) {
      return 'collaborateWithYourCollegues';
    } else {
      return 'evidence';
    }
  }

  constructor(public pluginService: PluginService) {}

  ngOnInit(): void {
    this.serviceIcon$ = this.pluginService.getServiceIconLink(this.service.service_id);
  }

  buildTranslationKey(relativeKey: string): string {
    return `openedPlugin.pluginInfoTab.${relativeKey}`;
  }
}
