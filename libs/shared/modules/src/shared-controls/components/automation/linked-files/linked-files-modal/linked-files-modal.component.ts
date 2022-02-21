import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CalculatedControl } from 'core/modules/data/models';
import { Service, ServiceStatusEnum, Framework } from 'core/modules/data/models/domain';
import { PluginFacadeService } from 'core/modules/data/services';
import { SubscriptionDetacher } from 'core/utils';
import { shareReplay } from 'rxjs/operators';
import { EvidenceCreationModalParams, RequirementLike } from '../../../../models';
import { AutomationState } from '../../models/automation-state';
import {
  PluginsAutomationModalInputFields,
  PluginsAutomationModalWindowComponent,
} from '../../plugins-automation-modal-window/plugins-automation-modal-window.component';
import {
  AttachLinkModalComponentInputFields,
  AttachLinkModalWindowComponent,
} from '../attach-link-modal-window/attach-link-modal-window.component';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';

@Component({
  selector: 'app-linked-files-modal',
  templateUrl: './linked-files-modal.component.html',
  styleUrls: ['./linked-files-modal.component.scss'],
})
export class LinkedFilesModalComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @Input()
  requirementLike: RequirementLike;

  @Input()
  framework: Framework;

  @Input()
  control: CalculatedControl;

  automationStates = AutomationState;

  plugins: Service[];
  installedPlugins: Service[];
  automationState: AutomationState;
  context: EvidenceCreationModalParams;

  constructor(private pluginsFacade: PluginFacadeService, private switcher: ComponentSwitcherDirective) { }

  ngOnInit(): void {
    this.switcher.sharedContext$.pipe(this.detacher.takeUntilDetach()).subscribe((context: EvidenceCreationModalParams) => {
      this.pluginsFacade
      .getFileMonitorServices(context.serviceIds)
      .pipe(shareReplay(), this.detacher.takeUntilDetach())
      .subscribe((plugins) => {
        this.plugins = plugins;
        this.installedPlugins = this.filterInstalledPlugins(plugins);
        this.automationState = this.getAutomationState(this.plugins);
      });

      this.context = context;
    });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `automationModals.fileMonitoring.${relativeKey}`;
  }

  openAllFileCollectionPlugins(): void {
    this.switcher.upsertAndSwitch({
      id: 'filemonitor-plugins-modal',
      componentType: PluginsAutomationModalWindowComponent,
      contextData: {
        [PluginsAutomationModalInputFields.relatedPlugins]: this.plugins,
        [PluginsAutomationModalInputFields.baseModalConfigData]: {
          titleKey: this.buildTranslationKey('plugins.title'),
          descriptionKey: this.buildTranslationKey('plugins.description'),
        },
      },
    });
  }

  pluginClickHandler(plugin: Service): void {
    this.switcher.upsertAndSwitch({
      id: `${plugin.service_id}-attachFile`,
      componentType: AttachLinkModalWindowComponent,
      contextData: {
        [AttachLinkModalComponentInputFields.pluginData]: plugin,
        [AttachLinkModalComponentInputFields.requirementLike]: this.requirementLike,
        [AttachLinkModalComponentInputFields.framework]: this.framework || { framework_id: this.context.frameworkId },
        [AttachLinkModalComponentInputFields.control]: this.control || { control_id: this.context.controlId },
      },
    });
  }

  private getAutomationState(plugins: Service[]): AutomationState {
    const installedCount = this.installedPlugins?.length;
    if (!installedCount) {
      return AutomationState.NOT_CONNECTED;
    }

    return installedCount === plugins.length ? AutomationState.ALL_CONNECTED : AutomationState.ANY_CONNECTED;
  }

  private filterInstalledPlugins(plugins: Service[]): Service[] {
    return plugins.filter((p) => p.service_status === ServiceStatusEnum.INSTALLED);
  }
}
