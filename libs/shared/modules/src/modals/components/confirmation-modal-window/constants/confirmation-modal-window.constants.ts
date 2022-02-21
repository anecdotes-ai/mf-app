import { TemplateRef } from '@angular/core';
import { StatusModalWindowSharedContext } from 'core/modules/modals';

// Make sure the ConfirmationModalWindowSharedContextInputKeys are filled with the same data as this constant
export const ConfirmationModalWindowInputKeys = {
  confirmTranslationKey: 'confirmTranslationKey',
  dismissTranslationKey: 'dismissTranslationKey',
  questionTranslationKey: 'questionTranslationKey',
  questionTranslationParams: 'questionTranslationParams',
  aftermathTranslationKey: 'aftermathTranslationKey',
  aftermathTemplate: 'aftermathTemplate',
  aftermathTranslationParams: 'aftermathTranslationParams',
  icon: 'icon',
  confirmationHandlerFunction: 'confirmationHandlerFunction',
  dismissHandlerFunction: 'dismissHandlerFunction',
  successWindowSwitcherId: 'successWindowSwitcherId',
  errorWindowSwitcherId: 'errorWindowSwitcherId',
  primaryButtonFirst: 'primaryButtonFirst',
  closeModalAfterDismissing: 'closeModalAfterDismissing',
  localStorageKey: 'localStorageKey',
  dontShowTranslationKey: 'dontShowTranslationKey'
};

export interface ConfirmationModalWindowSharedContext extends StatusModalWindowSharedContext {
  [ConfirmationModalWindowSharedContextInputKeys.confirmTranslationKey]?: string;
  [ConfirmationModalWindowSharedContextInputKeys.dismissTranslationKey]?: string;
  [ConfirmationModalWindowSharedContextInputKeys.questionTranslationKey]?: string;
  [ConfirmationModalWindowSharedContextInputKeys.questionTranslationParams]?: any;
  [ConfirmationModalWindowSharedContextInputKeys.aftermathTranslationKey]?: string;
  [ConfirmationModalWindowSharedContextInputKeys.aftermathTranslationParams]?: string;
  [ConfirmationModalWindowSharedContextInputKeys.aftermathTemplate]?: TemplateRef<any>;
  [ConfirmationModalWindowSharedContextInputKeys.icon]?: string;
  [ConfirmationModalWindowSharedContextInputKeys.confirmationHandlerFunction]?: () => void;
  [ConfirmationModalWindowSharedContextInputKeys.dismissHandlerFunction]?: () => void;
  [ConfirmationModalWindowSharedContextInputKeys.successWindowSwitcherId]?: string;
  [ConfirmationModalWindowSharedContextInputKeys.errorWindowSwitcherId]?: string;
  [ConfirmationModalWindowSharedContextInputKeys.closeModalAfterDismissing]?: boolean;
  [ConfirmationModalWindowSharedContextInputKeys.localStorageKey]?: string;
  [ConfirmationModalWindowSharedContextInputKeys.dontShowTranslationKey]?: string;
}

// This enum should duplicate ConfirmationModalWindowInputKeys
export enum ConfirmationModalWindowSharedContextInputKeys {
  confirmTranslationKey = 'confirmation-modal-confirmTranslationKey',
  dismissTranslationKey = 'confirmation-modal-dismissTranslationKey',
  questionTranslationKey = 'confirmation-modal-questionTranslationKey',
  questionTranslationParams = 'confirmation-modal-questionTranslationParams',
  aftermathTranslationKey = 'confirmation-modal-aftermathTranslationKey',
  aftermathTemplate = 'confirmation-modal-aftermathTemplate',
  aftermathTranslationParams = 'confirmation-modal-aftermathTranslationParams',
  icon = 'confirmation-modal-icon',
  confirmationHandlerFunction = 'confirmation-modal-confirmationHandlerFunction',
  dismissHandlerFunction = 'confirmation-modal-dismissHandlerFunction',
  successWindowSwitcherId = 'confirmation-modal-successWindowSwitcherId',
  errorWindowSwitcherId = 'confirmation-modal-errorWindowSwitcherId',
  closeModalAfterDismissing = 'confirmation-modalcloseModalAfterDismissing',
  localStorageKey = 'confirmation-modal-localStorageKey',
  dontShowTranslationKey = 'confirmation-modal-dontShowTranslationKey'
}
