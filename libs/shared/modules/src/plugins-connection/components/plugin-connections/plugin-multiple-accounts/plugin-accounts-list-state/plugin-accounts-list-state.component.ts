import { maxNumberOfServiceAccountsAllowed, ServiceStatusEnum, Service, ServiceInstance } from './../../../../../data/models/domain';
import { PluginConnectionStaticStateSharedContext, PluginStaticStateSharedContextInputKeys } from './../../../../models/plugin-static-content.model';
import { SubscriptionDetacher } from 'core/utils';
import { PluginConnectionFacadeService } from 'core/modules/plugins-connection/services';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-plugin-accounts-list-state',
  templateUrl: './plugin-accounts-list-state.component.html',
  styleUrls: ['./plugin-accounts-list-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PluginAccountsListStateComponent implements OnInit {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  service: Service;
  notRemovedInstances: ServiceInstance[]
  loading: boolean;

  get isAddingAccountsLimit(): boolean {
    return this.notRemovedInstances?.length >= maxNumberOfServiceAccountsAllowed;
  }

  constructor(
    private switcher: ComponentSwitcherDirective,
    private pluginConnectionFacadeService: PluginConnectionFacadeService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.switcher.sharedContext$
      .pipe(this.detacher.takeUntilDetach(), shareReplay())
      .subscribe((context: PluginConnectionStaticStateSharedContext) => {
        this.service = context[PluginStaticStateSharedContextInputKeys.service];
        this.notRemovedInstances = this.service.service_instances_list.filter((i) => i.service_status !== ServiceStatusEnum.REMOVED);
        this.cd.detectChanges();
      });
  }

  trackAccountItem(index: number, item: ServiceInstance): string {
    return item.service_instance_id;
  }

  addAnotherAccount(): void {
    this.pluginConnectionFacadeService.addEmptyServiceInstance(this.service);
  }

  buildTranslationKey(relativeKey: string): string {
    return `openedPlugin.${relativeKey}`;
  }
}
