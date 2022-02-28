import { ComponentToSwitch } from 'core/modules/component-switcher/models';
import { Service, Framework } from 'core/modules/data/models/domain';
import { TicketingModalsCommonTranslationRootKey } from './../constants/constants';
import { ModalWindowWithSwitcher } from 'core/models';
import { Injectable } from '@angular/core';
import { ModalWindowService } from 'core/modules/modals';
import { JiraAutomationModalWindowComponent, JiraAutomationModalWindowComponentInputFields } from '../jira-automation-modal-window/jira-automation-modal-window.component';
import { ZendeskAutomationModalWindowComponent, ZendeskAutomationModalWindowComponentInputFields } from '../zendesk-automation-modal-window/zendesk-automation-modal-window.component';
import { CalculatedControl, CalculatedRequirement } from 'core/modules/data/models';
import {
  PluginsAutomationModalInputFields,
  PluginsAutomationModalWindowComponent,
} from '../../plugins-automation-modal-window/plugins-automation-modal-window.component';
import { AppConfigService } from 'core/services';

export enum TicketingModalEnum {
  AddNewTicketingEvidence = 'TicketingModalEnum - AddNewTicketingEvidence',
}

@Injectable()
export class ModalsBuilderService {

  constructor(private modalWindowService: ModalWindowService, private appConfig: AppConfigService) { }

  openTicketingModalForPlugin(plugin: Service, control: CalculatedControl, requirement: CalculatedRequirement, framework: Framework): void {
    switch (plugin.service_id) {
      case 'jira':
        this.openJiraTicketingModal(plugin, control, requirement, framework, 'jiraAutomationModal', this.appConfig.config.redirectUrls.intercomJiraCustomizationHelp);
        break;
      case 'zendesk':
        this.openZendeskTicketingModal(plugin, control, requirement, framework);
        break;
      case 'jira_server':
        this.openJiraTicketingModal(plugin, control, requirement, framework, 'jiraServerAutomationModal', this.appConfig.config.redirectUrls.intercomJiraServerCustomizationHelp);
        break;
    }
  }

  openAllTicketingPlugins(
    plugins: Service[],
    control: CalculatedControl,
    requirement: CalculatedRequirement,
    baseModalConfigData: {
      titleKey: string;
      descriptionKey: string;
    }): void {
    this.openTicketingModal({
      id: PluginsAutomationModalWindowComponent.name,
      componentType: PluginsAutomationModalWindowComponent,
      contextData: {
        // [PluginsAutomationModalInputFields.controlRequirement]: requirement,
        // [PluginsAutomationModalInputFields.controlInstance]: control,
        [PluginsAutomationModalInputFields.relatedPlugins]: plugins,
        [PluginsAutomationModalInputFields.baseModalConfigData]: baseModalConfigData,
      },
    });
  }

  private openJiraTicketingModal(plugin: Service, control: CalculatedControl, requirement: CalculatedRequirement, framework: Framework, translationKey: string, articleUrl: string): void {
    const componentToSwitch = {
      id: TicketingModalEnum.AddNewTicketingEvidence,
      componentType: JiraAutomationModalWindowComponent,
      contextData: {
        [JiraAutomationModalWindowComponentInputFields.pluginData]: plugin,
        [JiraAutomationModalWindowComponentInputFields.controlRequirement]: requirement,
        [JiraAutomationModalWindowComponentInputFields.controlInstance]: control,
        [JiraAutomationModalWindowComponentInputFields.framework]: framework,
        [JiraAutomationModalWindowComponentInputFields.translationKey]: translationKey,
        [JiraAutomationModalWindowComponentInputFields.articleUrl]: articleUrl
      },
    };
    this.openTicketingModal(componentToSwitch);
  }

  private openZendeskTicketingModal(plugin: Service, control: CalculatedControl, requirement: CalculatedRequirement, framework: Framework): void {
    const componentToSwitch = {
      id: TicketingModalEnum.AddNewTicketingEvidence,
      componentType: ZendeskAutomationModalWindowComponent,
      contextData: {
        [ZendeskAutomationModalWindowComponentInputFields.pluginData]: plugin,
        [ZendeskAutomationModalWindowComponentInputFields.controlRequirement]: requirement,
        [ZendeskAutomationModalWindowComponentInputFields.controlInstance]: control,
        [ZendeskAutomationModalWindowComponentInputFields.framework]: framework,
      },
    };

    this.openTicketingModal(componentToSwitch);
  }

  private openTicketingModal(componentToSwitch: ComponentToSwitch): void {
    const modalWindowSwitcher: ModalWindowWithSwitcher<any> = {
      componentsToSwitch: [
        componentToSwitch,
      ],
      context: { translationKey: TicketingModalsCommonTranslationRootKey },
      options: { closeOnBackgroundClick: false },
    };

    this.modalWindowService.openInSwitcher(modalWindowSwitcher);
  }
}
