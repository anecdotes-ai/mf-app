import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from 'core/constants/routes';
import { CollectionNotificationData } from 'core/models/connectivity-notification-data.model';
import { NotificationInputNames } from 'core/modules/data/models';
import { Service } from 'core/modules/data/models/domain';
import {
  ActionDispatcherService,
  ControlsFacadeService,
  EvidenceFacadeService,
  PluginNotificationFacadeService,
  PluginService,
} from 'core/modules/data/services';
import { filter, take, timeout } from 'rxjs/operators';
import { PluginPageQueryParams } from 'core/models';
import { LoaderManagerService } from '../loader-manager/loader-manager.service';
import { WindowHelperService } from './../window-helper/window-helper.service';

const REFRESH_TIMEOUT = 60;
@Injectable({
  providedIn: 'root',
})
export class PluginNavigationService {
  private selectedPluginsFamilyFilterTab: string;

  constructor(
    private router: Router,
    private controlsFacade: ControlsFacadeService,
    private notificationFacade: PluginNotificationFacadeService,
    private loaderManager: LoaderManagerService,
    private actionDispatcher: ActionDispatcherService,
    private pluginService: PluginService,
    private windowHelper: WindowHelperService,
    private evidenceFacade: EvidenceFacadeService
  ) {}

  async redirectToEvidencePool(service: Service): Promise<void> {
    try {
      await this.evidenceFacade
        .getAllCalculatedEvidence()
        .pipe(
          filter((e) => !!e?.length),
          timeout(REFRESH_TIMEOUT),
          take(1)
        )
        .toPromise();
    } finally {
      await this.removePluginSuccessfullyConnectedNotification(service);
    }

    const queryParams = {
      plugins: service.service_display_name.replace('_', '.'),
    };

    this.router.navigate([AppRoutes.EvidencePool], {
      queryParams,
    });
  }

  navigateToPluginDetails(service_id: string): void {
    this.selectedPluginsFamilyFilterTab = this.router.routerState.snapshot.root.queryParams[
      PluginPageQueryParams.family
    ];
    this.router.navigate([this.pluginService.getPluginRoute(service_id)], {
      state: { [PluginPageQueryParams.family]: this.selectedPluginsFamilyFilterTab },
    });
  }

  navigateToPluginDetailsInNewTab(service_id: string): void {
    this.windowHelper.openUrlInNewTab(this.pluginService.getPluginRoute(service_id));
  }

  navigateToPlugins(queryParams?: { [PluginPageQueryParams.family]?: string }): void {
    this.router.navigate([AppRoutes.Plugins], {
      queryParams,
    });
  }

  private async removePluginSuccessfullyConnectedNotification(plugin: Service): Promise<void> {
    const pluginRelatedNotification = await this.notificationFacade
      .getNotification(plugin.service_id)
      .pipe(take(1))
      .toPromise();

    if (pluginRelatedNotification) {
      const inputData = pluginRelatedNotification.inputs[
        NotificationInputNames.notificationData
      ] as CollectionNotificationData;
      const isEvidenceCollectedNotification = inputData?.collectionMessageData?.status;

      if (isEvidenceCollectedNotification) {
        this.notificationFacade.removeNotification(plugin.service_id);
      }
    }
  }
}
