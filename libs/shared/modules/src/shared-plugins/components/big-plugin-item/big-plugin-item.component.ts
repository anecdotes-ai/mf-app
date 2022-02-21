import { PluginNavigationService } from 'core/services/plugin-navigation-service/plugin-navigation-service.service';
import { Component, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { isAnecdotesPluginActive } from 'core/utils/userflow';
import { PluginService } from 'core/modules/data/services';
import {
  Service,
  ServiceAvailabilityStatusEnum,
  ServiceStatusEnum,
  ServiceTypeEnum,
} from 'core/modules/data/models/domain';
import { PluginLabelTypeEnum } from 'core/modules/shared-plugins/components/plugin-label/plugin-label.component';
import { PluginsEventService } from 'core/modules/plugins-connection/services';

@Component({
  selector: 'app-big-plugin-item',
  templateUrl: './big-plugin-item.component.html',
  styleUrls: ['./big-plugin-item.component.scss'],
})
export class BigPluginItemComponent implements OnInit {
  @HostBinding('class.clickable')
  private get isClickable(): boolean {
    return this.pluginData.service_availability_status === this.serviceAvailabilityStatusEnum.AVAILABLE;
  }

  @HostBinding('class.userflow-plugin-anecdotes-not-connected')
  private get isAnecdotesNotConnected(): boolean {
    return !isAnecdotesPluginActive(
      this.pluginData.service_id,
      this.pluginData.service_status === ServiceStatusEnum.INSTALLED
    );
  }

  @HostBinding('attr.id')
  private get id(): string {
    return this.pluginData?.service_id;
  }

  @Input()
  pluginData: Service;

  serviceIcon: string;

  serviceStatusEnum = ServiceStatusEnum;
  serviceAvailabilityStatusEnum = ServiceAvailabilityStatusEnum;
  serviceTypeEnum = ServiceTypeEnum;
  pluginLabelTypeEnum = PluginLabelTypeEnum;

  constructor(
    private pluginService: PluginService,
    private pluginNavigationService: PluginNavigationService,
    private pluginEventService: PluginsEventService
  ) {}

  ngOnInit(): void {
    this.serviceIcon = this.pluginService.getServiceIconLinkSync(this.pluginData.service_id);
  }

  buildTranslationKey(relativeKey: string): string {
    return `plugins.pluginItem.${relativeKey}`;
  }

  @HostListener('mousedown', ['$event'])
  private mouseDown(event: MouseEvent): void {
    if (this.isClickable) {
      this.pluginEventService.trackPluginClick(this.pluginData);
      if (event.button === 1) {
        // wheel click
        this.pluginNavigationService.navigateToPluginDetailsInNewTab(this.pluginData.service_id);
      } else if (event.button === 0) {
        // left button click
        this.pluginNavigationService.navigateToPluginDetails(this.pluginData.service_id);
      }
    }
  }
}
