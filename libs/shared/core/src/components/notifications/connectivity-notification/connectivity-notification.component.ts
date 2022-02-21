import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppRoutes, RouteParams } from 'core/constants';
import { ConnectivityNotificationData } from 'core/models/connectivity-notification-data.model';
import { NotificationTypes } from 'core/modules/data/models';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { PluginService } from 'core/modules/data/services/plugin/plugin.service';
import { SubscriptionDetacher } from 'core/utils';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export enum ConnectivityStatus {
  UNKNOWN,
  SUCCESS,
  FAILED,
}

@Component({
  selector: 'app-connectivity-notification',
  templateUrl: './connectivity-notification.component.html',
  styleUrls: ['./connectivity-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectivityNotificationComponent implements OnInit, OnDestroy, OnChanges {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @HostBinding('class.hidden')
  private isHidden: boolean;

  @HostBinding('class.loading')
  get isLoading(): boolean {
    return this.notificationData.isInProgress;
  }

  @HostBinding('class.secondary-content')
  get secondaryContent(): boolean {
    return !this.notificationData.displaySecondaryContent;
  }

  @Input()
  notificationData: ConnectivityNotificationData;

  @Output()
  closing = new EventEmitter<string>();

  navigateToControlBtnLoader: boolean;

  serviceIcon$: Observable<string>;

  connectivityStatuses = ConnectivityStatus;
  role = RoleEnum;

  get userflowSuccessClass(): string {
    return `userflow-plugin-success-${this.notificationData.service_id}`;
  }

  constructor(public pluginService: PluginService, private router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map(() => this.router.routerState.snapshot),
        this.detacher.takeUntilDetach()
      )
      .subscribe(() => {
        this.resolveDisplayStateOnLogsPage();
        this.cd.detectChanges();
      });

    this.serviceIcon$ = this.pluginService.getServiceIconLink(this.notificationData.service_id);
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('notificationData' in changes) {
      this.resolveDisplayStateOnLogsPage();
    }
  }

  resolveStatusIcon(): string {
    const status = this.getConnectivityStatus();
    if (status === ConnectivityStatus.FAILED) {
      return 'status_not_started_bordered';
    } else {
      return '';
    }
  }

  preClosing(): void {
    this.closing.emit(this.notificationData.service_id);
  }

  buildTranslationKey(relativeKey: string): string {
    return `notifications.connectivity.${relativeKey}`;
  }

  getConnectivityStatus(): ConnectivityStatus {
    switch (this.notificationData.success) {
      case true:
        return ConnectivityStatus.SUCCESS;
      case false:
        return ConnectivityStatus.FAILED;
      default:
        return ConnectivityStatus.UNKNOWN;
    }
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

  private resolveDisplayStateOnLogsPage(): void {
    const isOnLogsPage =
      this.router.routerState.snapshot.url.startsWith(
        this.pluginService.getPluginRoute(this.notificationData.service_id)
      ) &&
      this.router.routerState.snapshot.root.queryParams[RouteParams.plugin.tabQueryParamName] ===
        RouteParams.plugin.logsQueryParamValue;

    if (
      this.notificationData.notificationType === NotificationTypes.CONNECTIVITY &&
      isOnLogsPage &&
      !this.notificationData.isInProgress &&
      !this.notificationData.success
    ) {
      this.isHidden = true;
      this.preClosing();
    }
  }
}
