import { StatusModalWindowSharedContext } from 'core/modules/modals';

export const GlobalLoaderModalWindowInputKeys = {
  loadingHandlerFunction: 'loadingHandlerFunction',
  successWindowSwitcherId: 'successWindowSwitcherId',
  errorWindowSwitcherId: 'errorWindowSwitcherId',
  description: 'description'
};

export interface GlobalLoaderModalWindowSharedContext {
  [GlobalLoaderModalWindowSharedContextInputKeys.loadingHandlerFunction]?: () => void;
  [GlobalLoaderModalWindowSharedContextInputKeys.successWindowSwitcherId]?: string;
  [GlobalLoaderModalWindowSharedContextInputKeys.errorWindowSwitcherId]?: string;
  [GlobalLoaderModalWindowSharedContextInputKeys.description]?: string;
}

export enum GlobalLoaderModalWindowSharedContextInputKeys {
  loadingHandlerFunction = 'global-modal-loadingHandlerFunction',
  successWindowSwitcherId = 'global-modal-successWindowSwitcherId',
  errorWindowSwitcherId = 'global-modal-errorWindowSwitcherId',
  description = 'global-modal-descriptionTranslationKey'
}
