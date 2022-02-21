import { PluginFacadeService } from 'core/modules/data/services/facades/plugin-facade/plugin-facade.service';
import { AppRoutes } from 'core/constants/routes';
import { pluginIdParam, PluginPageQueryParams } from 'core/models';
import { PluginConnectionFacadeService } from 'core/modules/plugins-connection/services/facades';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PluginConnectionUserEventData,
  PluginEventDataPropertyNames
} from 'core/models/user-events/user-event-data.model';
import { Service, ServiceAvailabilityStatusEnum, ServiceStatusEnum } from 'core/modules/data/models/domain';
import { SubscriptionDetacher } from 'core/utils';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PluginNavigationService } from 'core';

@Component({
  selector: 'app-plugin-details',
  templateUrl: './plugin-details.component.html',
  styleUrls: ['./plugin-details.component.scss'],
})
export class PluginDetailsComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private selectedFamilyTab: string;

  serviceStatusEnum = ServiceStatusEnum;
  service: Service;

  runningOnDemandDisableState$: Observable<boolean>;
  runOnDemandBtnPressedEvent: PluginConnectionUserEventData;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pluginFacade: PluginFacadeService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private pluginNavigationService: PluginNavigationService,
    private pluginConnectionFacade: PluginConnectionFacadeService,
  ) {
    this.selectedFamilyTab = this.router.getCurrentNavigation()?.extras?.state?.[PluginPageQueryParams.family];
  }

  async ngOnInit(): Promise<void> {
    const service_id = this.activatedRoute.snapshot.paramMap.get(pluginIdParam);

    this.pluginFacade
      .loadSpecificPlugin(service_id)
      .pipe(
        tap((s) => (this.service = s)),
        tap((_) => this.setRunOnDemandEventData()),
        this.detacher.takeUntilDetach()
      )
      .subscribe(() => {
        if (this.service.service_availability_status !== ServiceAvailabilityStatusEnum.AVAILABLE) {
          this.router.navigate([`/${AppRoutes.Plugins}`]);
        }
        this.cd.detectChanges();
      });
  }

  doesServiceHaveSomeInstalledInstances(): boolean {
    return this.service?.service_instances_list?.some((s) => s.service_status == ServiceStatusEnum.INSTALLED || s.service_status !== ServiceStatusEnum.INSTALLING);
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `openedPlugin.${relativeKey}`;
  }

  async runOnDemand(): Promise<void> {
    this.pluginConnectionFacade.runOnDemand(this.service);
  }

  navigateToPluginsButtonClick(): void {
    this.pluginNavigationService.navigateToPlugins({ family: this.selectedFamilyTab });
  }

  private setRunOnDemandEventData(): void {
    this.runOnDemandBtnPressedEvent = {
      [PluginEventDataPropertyNames.PluginNumberOfEvidences]: this.service.service_evidence_list?.length,
      [PluginEventDataPropertyNames.PluginName]: this.service.service_display_name,
      [PluginEventDataPropertyNames.PluginCategory]: this.service.service_families
    };
  }
}
