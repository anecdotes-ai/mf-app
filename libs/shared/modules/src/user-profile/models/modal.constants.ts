import { ConfirmationModalWindowSharedContext } from 'core/modules/modals';
import { IDPTypes, SAMLEntity } from './../../auth-core/models/domain';
import { Observable } from 'rxjs';
export enum SetSSOModalsIds {
  ChooseSSOModal = 'choose-sso-modal',
  SetSSOLink = 'set-sso-link-modal',
  ErrorOnSettingSSO = 'error-on-setting-sso-modal',
  ErrorOnLinkRemoval = 'error-on-link-removal',
  SuccessOnLinkRemoval = 'success-on-link-removal',
  SuccesscfullySetteledSSO = 'successfully-setteled-sso-modal',
  RemoveLinkConfirmation = 'remove-link-confirmation-modal',
}

export interface SetSSOSharedContext extends ConfirmationModalWindowSharedContext {
  isEditMode?: boolean;
  samlIDs$: Observable<SAMLEntity[]>;
  selectedItemToSetSSO?: SelectedItemToSetSSO;
}

export interface SelectedItemToSetSSO {
  type: IDPTypes;
  displayName: string;
  articleLink?: string;
  link: string;
  idp_id: string;
}

export const translationRootKey = 'setSSO';
