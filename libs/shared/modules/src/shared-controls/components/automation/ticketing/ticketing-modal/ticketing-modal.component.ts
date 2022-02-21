import { ModalsBuilderService } from '../services';
import { Component, Input, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CalculatedControl, CalculatedRequirement } from 'core/modules/data/models';
import { Service, ServiceStatusEnum, Framework } from 'core/modules/data/models/domain';
import { PluginFacadeService } from 'core/modules/data/services';
import { SubscriptionDetacher } from 'core/utils';
import { shareReplay } from 'rxjs/operators';
import { AutomationState } from '../../models/automation-state';

@Component({
  selector: 'app-ticketing-modal',
  templateUrl: './ticketing-modal.component.html',
  styleUrls: ['./ticketing-modal.component.scss'],
})
export class TicketingModalComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  private readonly baseModalConfig = {
    titleKey: this.buildTranslationKey('plugins.title'),
    descriptionKey: this.buildTranslationKey('plugins.description'),
  };

  @Input()
  controlRequirement: CalculatedRequirement;

  @Input()
  controlInstance: CalculatedControl;

  @Input()
  framework: Framework;

  automationStates = AutomationState;

  installedPlugins: Service[];
  plugins: Service[];
  automationState: AutomationState;

  constructor(private pluginsFacade: PluginFacadeService, private modalBuilder: ModalsBuilderService, private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.pluginsFacade
      .getTicketingServices(this.controlRequirement?.services_that_automates)
      .pipe(shareReplay(), this.detacher.takeUntilDetach())
      .subscribe((plugins) => {
        this.plugins = plugins;
        this.installedPlugins = this.filterInstalledPlugins(plugins);
      });

    this.automationState = this.getAutomationState(this.plugins);
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `automationModals.ticketing.${relativeKey}`;
  }

  private filterInstalledPlugins(plugins: Service[]): Service[] {
    return plugins.filter((p) => p.service_status === ServiceStatusEnum.INSTALLED);
  }

  openAllTicketingPlugins(): void {
    this.modalBuilder.openAllTicketingPlugins(this.plugins, this.controlInstance, this.controlRequirement, this.baseModalConfig);
  }

  pluginClickHandler(plugin: Service): void {
    this.modalBuilder.openTicketingModalForPlugin(plugin, this.controlInstance, this.controlRequirement, this.framework);
  }

  private getAutomationState(plugins: Service[]): AutomationState {
    const installedCount = this.installedPlugins.length;
    if (!installedCount) {
      return AutomationState.NOT_CONNECTED;
    }

    return installedCount === plugins.length ? AutomationState.ALL_CONNECTED : AutomationState.ANY_CONNECTED;
  }
}
