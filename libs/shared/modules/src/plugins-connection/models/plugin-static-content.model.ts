import { PluginConnectionEntity } from 'core/modules/plugins-connection/store/models';
import { ActionButtonsPosition } from './../components/plugin-connection-states/plugin-static-state/action-buttons-position';
import { Service } from 'core/modules/data/models/domain';
import { Type } from '@angular/core';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
export interface PluginStaticContent {
  translationKey: string;
  translationPramsObject?: object;
}

export interface RenderComponentObject {
  componentType: Type<any>;
  inputData?: any;
}

export const mailData = {
  address: 'support@anecdotes.ai',
  subject: '',
};

// Base component models
export enum PluginStaticBaseStateInputKeysEnum {
  service = 'service',
  displayHeader = 'displayHeader',
  displayHeaderThreeDotsMenu = 'displayHeaderThreeDotsMenu',
  displayCloseButton = 'displayCloseButton',
  displayServiceTipIfExists = 'displayServiceTipIfExists',
  displayFooter = 'displayFooter',
}

export const PluginStaticBaseStateInputKeys = {
  service: 'service',
  displayHeader: 'displayHeader',
  displayHeaderThreeDotsMenu: 'displayHeaderThreeDotsMenu',
  displayCloseButton: 'displayCloseButton',
  displayServiceTipIfExists: 'displayServiceTipIfExists',
  displayFooter: 'displayFooter',
  aboveFooterComponentTypeToRender: 'aboveFooterComponentTypeToRender',
};

// This enum should be equal to next const object!!!
export enum PluginStaticStateInputKeysEnum {
  mainButton = 'mainButton',
  secondaryButton = 'secondaryButton',
  buttonsPosition = 'buttonsPosition',
  mainDescription = 'mainDescription',
  mainDescriptionParams = 'mainDescriptionParams',
  secondaryDescription = 'secondaryDescription',
  secondaryDescriptionParams = 'secondaryDescriptionParams',
  icon = 'icon',
  aboveFooterComponentTypeToRender = 'aboveFooterComponentTypeToRender',
}

export const PluginStaticStateInputKeys = {
  mainButton: 'mainButton',
  secondaryButton: 'secondaryButton',
  buttonsPosition: 'buttonsPosition',
  mainDescription: 'mainDescription',
  mainDescriptionParams: 'mainDescriptionParams',
  secondaryDescription: 'secondaryDescription',
  secondaryDescriptionParams: 'secondaryDescriptionParams',
  icon: 'icon',
  aboveFooterComponentTypeToRender: 'aboveFooterComponentTypeToRender',
};

export interface ButtonAction<T = any> {
  translationKey?: string;
  action?: (switcher: ComponentSwitcherDirective, ctx?: T) => Promise<any> | any;
  disabled?: boolean;
  icon?: string;
}

export type PluginStaticStateInputsToTypesMapping = {
  // Base component inputs
  [PluginStaticBaseStateInputKeysEnum.service]?: Service;
  [PluginStaticBaseStateInputKeysEnum.displayHeader]?: boolean;
  [PluginStaticBaseStateInputKeysEnum.displayHeaderThreeDotsMenu]?: boolean;
  [PluginStaticBaseStateInputKeysEnum.displayCloseButton]?: boolean;
  [PluginStaticBaseStateInputKeysEnum.displayFooter]?: boolean;
  [PluginStaticBaseStateInputKeysEnum.displayServiceTipIfExists]?: boolean;

  [PluginStaticStateInputKeysEnum.mainButton]?: ButtonAction;
  [PluginStaticStateInputKeysEnum.secondaryButton]?: ButtonAction;
  [PluginStaticStateInputKeysEnum.buttonsPosition]?: ActionButtonsPosition;

  [PluginStaticStateInputKeysEnum.mainDescription]?: string;
  [PluginStaticStateInputKeysEnum.secondaryDescription]?: string;
  [PluginStaticStateInputKeysEnum.icon]?: string | RenderComponentObject;
  [PluginStaticStateInputKeysEnum.aboveFooterComponentTypeToRender]?: Type<any>;
};

// This enum should duplicate PluginStaticStateInputKeys
export enum PluginStaticStateSharedContextInputKeys {
  service = 'service',
  serviceConnectionEntity = 'serviceConnectionEntity',
  selectedServiceInstanceViewData = 'selectedServiceInstanceViewData'
}

export interface PluginConnectionStaticStateSharedContext {
  [PluginStaticStateSharedContextInputKeys.service]?: Service;
  [PluginStaticStateSharedContextInputKeys.serviceConnectionEntity]?: PluginConnectionEntity;
  [PluginStaticStateSharedContextInputKeys.selectedServiceInstanceViewData]?: {instance_display_name: string, collected_evidence_count: number};
}
