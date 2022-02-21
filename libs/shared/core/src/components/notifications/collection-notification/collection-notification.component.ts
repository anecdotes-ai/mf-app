import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CollectionNotificationData } from 'core/models/connectivity-notification-data.model';
import { AppRoutes, RouteParams } from 'core/constants';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { ServiceTypeEnum } from 'core/modules/data/models/domain';
import { PluginService } from 'core/modules/data/services';
import { Observable } from 'rxjs';
import { PluginNavigationService } from '../../../services/plugin-navigation-service/plugin-navigation-service.service';

export enum CollectionStatus {
  UNKNOWN,
  SUCCESS,
  FAILED,
}

@Component({
  selector: 'app-collection-notification',
  templateUrl: './collection-notification.component.html',
  styleUrls: ['./collection-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionNotificationComponent implements OnInit {
  @Input()
  notificationData: CollectionNotificationData;

  @Output()
  closing = new EventEmitter<string>();

  @HostBinding('class.loading')
  get isLoading(): boolean {
    return this.notificationData.isInProgress;
  }

  @HostBinding('class.secondary-content')
  get secondaryContent(): boolean {
    return !this.notificationData.displaySecondaryContent;
  }

  serviceIcon$: Observable<string>;


  collectionStatuses = CollectionStatus;
  role = RoleEnum;

  get userflowSuccessClass(): string {
    return `userflow-plugin-success-${this.notificationData.service_id}`;
  }

  constructor(
    public pluginService: PluginService,
    private pluginNavigationService: PluginNavigationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.serviceIcon$ = this.pluginService.getServiceIconLink(this.notificationData.service_id);
  }

  resolveStatusIcon(): string {
    const status = this.getCollectionStatus();
    switch (status) {
      case CollectionStatus.SUCCESS:
        return 'status_complete_bordered';
      case CollectionStatus.FAILED:
        return 'status_not_started_bordered';
      default:
        return '';
    }
  }

  isEvidenceCollectedNotificationMetaType(): boolean {
    // We don't display evidence collected count for collaboration plugin usually
    if (this.notificationData.service_type === ServiceTypeEnum.COLLABORATION) {
      return false;
    }
    // We don't display evidence collected count for FILEMONITOR plugin if there is no evidence was collected
    if (
      this.notificationData.service_type === ServiceTypeEnum.FILEMONITOR &&
      !this.notificationData.collectionMessageData.collected_evidence
    ) {
      return false;
    }

    return true;
  }

  preClosing(): void {
    this.closing.emit(this.notificationData.service_id);
  }

  buildTranslationKey(relativeKey: string): string {
    return `notifications.collection.${relativeKey}`;
  }

  getCollectionStatus(): CollectionStatus {
    switch (this.notificationData.success) {
      case true:
        return CollectionStatus.SUCCESS;
      case false:
        return CollectionStatus.FAILED;
      default:
        return CollectionStatus.UNKNOWN;
    }
  }

  async navigateToEvidencePool(): Promise<void> {

    await this.pluginNavigationService.redirectToEvidencePool({
      service_id: this.notificationData.service_id,
      service_display_name: this.notificationData.service_display_name,
    });
  }

  navigateToPluginLogs(): void {
    const pluginRouterLink = this.pluginService.getPluginRoute(this.notificationData.service_id);
    // In case if navigation proceeded from another plugin-details page,
    // .. we do this trick to re start life circle for plugn-details page
    this.router.navigate([`/${AppRoutes.Plugins}`]).then(() =>
      this.router.navigate([pluginRouterLink], {
        queryParams: { [RouteParams.plugin.tabQueryParamName]: RouteParams.plugin.logsQueryParamValue },
      })
    );
    this.preClosing();
  }
}
