import { translationRootModuleKey } from './../../../constants/translation-root-module-key.const';
import { IDPTypes } from 'core/modules/auth-core/models/domain';
import { ConfirmationModalWindowSharedContext } from 'core/modules/modals';

export enum SetSSOModalsIds {
  SetSSOLink = 'set-sso-link-modal',
  SuccesscfullySetteledSSO = 'successfully-setteled-sso-modal',
  RemoveLinkConfirmation = 'remove-link-confirmation-modal',
}

export interface SetSSOSharedContext extends ConfirmationModalWindowSharedContext {
  selectedItemToSetSSO?: SelectedItemToSetSSO;
  setCallBack?: () => Promise<void>;
  disconnectCallBack?: () => Promise<void>;
  closeCallback?: () => void;
  successPrimaryTextTranslationKey?: string;
  successSecondaryTextTranslationKey?: string;
}

export interface SelectedItemToSetSSO {
  type: IDPTypes;
  displayName: string;
  articleLink?: string;
  comingSoon?: boolean;
  link?: string;
  idp_id?: string;
}

export const translationRootKey = `${translationRootModuleKey}.setSso`;
