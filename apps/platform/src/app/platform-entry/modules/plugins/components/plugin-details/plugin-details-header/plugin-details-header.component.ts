import { PluginConnectionFacadeService } from 'core/modules/plugins-connection/services';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Service, ServiceStatusEnum, ServiceTypeEnum } from 'core/modules/data/models/domain';
import { CalculatedEvidence } from 'core/modules/data/models';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { AppConfigService, WindowHelperService, PluginNavigationService } from 'core';
import { PluginService, EvidenceFacadeService } from 'core/modules/data/services';
import { filter, map, take, switchMap, tap, distinctUntilChanged } from 'rxjs/operators';
import { SubscriptionDetacher } from 'core/utils';
import { PluginConnectionStates } from 'core/modules/plugins-connection/models';
import { PluginsEventService } from 'core/modules/plugins-connection/services/plugins-event-service/plugins-event.service';

@Component({
  selector: 'app-plugin-details-header',
  templateUrl: './plugin-details-header.component.html',
  styleUrls: ['./plugin-details-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PluginDetailsHeaderComponent implements OnDestroy, OnChanges {
  private readonly viewEvidenceButtonAlowedPluginTypes = [
    ServiceTypeEnum.FILEMONITOR,
    ServiceTypeEnum.GENERIC,
    ServiceTypeEnum.TICKETING,
  ];
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @Input()
  service: Service;

  serviceIcon$: Observable<string>;
  serviceTypes = ServiceTypeEnum;
  role = RoleEnum;

  isViewEvidenceButtonDisplay$: Observable<boolean>;
  isViewEvidenceButtonDisabled$ = new BehaviorSubject<boolean>(true);
  viewEvidenceButtonLoader$ = new BehaviorSubject<boolean>(false);
  viewEvidenceButtonTooltipDisplay$ = new BehaviorSubject<boolean>(false);

  constructor(
    public pluginService: PluginService,
    private configService: AppConfigService,
    private windowHelper: WindowHelperService,
    private pluginsNavigationService: PluginNavigationService,
    private evidenceFacade: EvidenceFacadeService,
    private pluginConnectionFacade: PluginConnectionFacadeService,
    private pluginsEventService: PluginsEventService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if ('service' in changes) {
      // Resubscribe to this values when new service snapsote incomes.
      // Not that good for now, for example we can create Subject on service income, and combine each observable with it.
      // Or we can also add unsubscribe before the code above, if we keep this solution
      this.serviceIcon$ = this.pluginService.getServiceIconLink(this.service.service_id);
      this.isViewEvidenceButtonDisplayAllowedSetup();
      this.setIsViewEvidenceButtonDisabledSubscriptions();
    }
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  howToConnect(): void {
    this.pluginsEventService.trackHowToConnectClick(this.service);
    this.windowHelper.openUrlInNewTab(
      this.service.service_intercom_article || this.configService.config.redirectUrls.howToConnectPlugins
    );
  }

  redirectToEvidencePool(): void {
    this.pluginsEventService.trackViewEvidenceClick(this.service);
    this.pluginsNavigationService.redirectToEvidencePool(this.service);
  }

  isViewEvidenceButtonDisplayAllowedSetup(): void {
    this.isViewEvidenceButtonDisplay$ = this.pluginConnectionFacade.getPluginConnectionEntity(this.service)
      .pipe(
        filter((e) => !!e),
        distinctUntilChanged((prev, curr) => prev.connection_state === curr.connection_state),
        map((connectionEntity) => connectionEntity.connection_state),
        map((connectionState) => {
          if (connectionState === PluginConnectionStates.EvidenceCollectionHasStarted
            || connectionState === PluginConnectionStates.TestConnection) {
            return false;
          }

          if (
            this.service.service_status === ServiceStatusEnum.INSTALLED &&
            this.viewEvidenceButtonAlowedPluginTypes.includes(this.service.service_type)
          ) {
            return true;
          }

          return false;
        }));
  }

  buildTranslationKey(relativeKey: string): string {
    return `openedPlugin.${relativeKey}`;
  }

  getPluginStatusIcon(status: ServiceStatusEnum): string {
    switch (status) {
      case ServiceStatusEnum.INSTALLED:
        return 'status_complete';
      case ServiceStatusEnum.INSTALLATIONFAILED:
      case ServiceStatusEnum.CONNECTIVITYFAILED:
        return 'status_not_started';
      default:
        return null;
    }
  }

  private setIsViewEvidenceButtonDisabledSubscriptions(): void {
    this.isViewEvidenceButtonDisplay$.pipe(
      filter((isAllowed) => isAllowed),
      tap((_) => this.viewEvidenceButtonLoader$.next(true)),
      switchMap((_) => {
        return this.evidenceFacade
          .getAllCalculatedEvidence()
          .pipe(
            map((evidence: CalculatedEvidence[]) =>
            evidence.some((evidence) => evidence.evidence_service_id == this.service.service_id)
            ),
            map((isAnyCollected) => !isAnyCollected),
            take(1),
            this.detacher.takeUntilDetach()
          );

      }),
      take(1)
    ).subscribe(
      (isDisabled) => {
        this.isViewEvidenceButtonDisabled$.next(isDisabled);
        this.viewEvidenceButtonTooltipDisplay$.next(isDisabled);
      },
      undefined,
      () => {
        // That means we remove loader if we have any response, we display loader in case we are fetching and calculating data.
        this.viewEvidenceButtonLoader$.next(false);
      }
    );

  }
}
