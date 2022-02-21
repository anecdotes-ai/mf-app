import { ServiceLogTypeEnum } from 'core/models/service-log-type';
import { PluginsDataService } from 'core/modules/plugins-connection/services/plugins-data-service/plugins.data.service';
import { filter, tap, switchMap, take } from 'rxjs/operators';
import { RouteParams } from 'core/constants/routes';
import { SubscriptionDetacher } from 'core/utils/subscription-detacher.class';
import { ActivatedRoute } from '@angular/router';
import {
  Component,
  Input,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { Service, ServiceLog, ServiceStatusEnum } from 'core/modules/data/models/domain';
import { PluginFacadeService } from 'core/modules/data/services';
import { Observable } from 'rxjs';

interface ServiceLogExtended extends ServiceLog {
  visible?: boolean;
}

interface ServiceInstanceDropdownViewItem {
  service_instance_id: string;
  service_instance_display_name: string;
}

const minimalAmountOfLogsToFetchInPeriod = 30;

@Component({
  selector: 'app-plugin-logs-tab',
  templateUrl: './plugin-logs-tab.component.html',
  styleUrls: ['./plugin-logs-tab.component.scss'],
})
export class PluginLogsTabComponent implements OnDestroy, OnChanges, AfterViewInit {

  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  @Input()
  service: Service;

  get logsDropdownInvisible(): boolean {
    return !this.service.service_multi_account;
  }
  displayFirstValue: boolean;
  displayedServiceLogs$: Observable<ServiceLogExtended[]>;

  selectedServiceInstanceId: string;
  selectedDropdownValue: ServiceInstanceDropdownViewItem;
  serviceInstances: ServiceInstanceDropdownViewItem[];

  isLogsTabInQuerySelected: boolean;

  serviceLogSeverity = ServiceLogTypeEnum;

  constructor(
    private pluginFacade: PluginFacadeService,
    private pluginsDataService: PluginsDataService,
    private activatedRouter: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    this.activatedRouter.queryParams
      .pipe(
        this.detacher.takeUntilDetach(),
        filter((p) => p[RouteParams.plugin.tabQueryParamName] === RouteParams.plugin.logsQueryParamValue),
        tap((query) => {
          this.selectedServiceInstanceId = query[RouteParams.plugin.logsForServiceId];
          this.selectedDropdownValue = this.serviceInstances.find(
            (s) => s.service_instance_id === this.selectedServiceInstanceId
          );
          this.isLogsTabInQuerySelected = query[RouteParams.plugin.tabQueryParamName] === RouteParams.plugin.logsQueryParamValue;
          // By this property we allow selecting first value from dropdown, if user is on logs tab but specific service instance is not specified
          this.displayFirstValue = this.isLogsTabInQuerySelected && !this.selectedServiceInstanceId;
          this.displayedServiceLogs$ = this.pluginFacade.getLogsForParticularPeriod(
            this.service.service_id,
            this.selectedServiceInstanceId,
            minimalAmountOfLogsToFetchInPeriod,
            'dsc'
          );
        }),
        switchMap((_) =>
          this.pluginFacade
            .areLogsLoadedForPlugin(this.service.service_id, this.selectedServiceInstanceId)
            .pipe(take(1))
        )
      )
      .subscribe((isLogsLoaded) => {
        if (!isLogsLoaded && this.selectedServiceInstanceId) {
          this.pluginFacade.loadSpecificServiceLogs(this.service.service_id, this.selectedServiceInstanceId);
        }
        this.cd.detectChanges();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('service' in changes && this.service) {
      this.serviceInstances = this.service.service_instances_list
        .filter((s) => s.service_status !== ServiceStatusEnum.REMOVED)
        .map((si) => ({
          service_instance_id: si.service_instance_id,
          service_instance_display_name: this.service.service_multi_account
            ? si.service_instance_display_name
            : this.service.service_display_name,
        }));
    }
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  selectServiceInstanceLogsToDisplay(serviceInstanceitem: ServiceInstanceDropdownViewItem): void {
    if (
      this.selectedServiceInstanceId !== serviceInstanceitem.service_instance_id &&
      serviceInstanceitem.service_instance_id !==
      this.activatedRouter.root.snapshot.queryParams[RouteParams.plugin.logsForServiceId]
    ) {
      this.pluginsDataService.showServiceInstanceLogs(serviceInstanceitem.service_instance_id);
    }
  }

  serviceInstanceDropdownItemDisplayValue(serviceInstanceitem: ServiceInstanceDropdownViewItem): string {
    return serviceInstanceitem.service_instance_display_name;
  }

  buildTranslationKey(relativeKey: string): string {
    return `openedPlugin.logs.${relativeKey}`;
  }
}
