export enum StatusType {
  SUCCESS = 'success',
  ERROR = 'error',
}

export const StatusModalWindowInputKeys = {
  statusType: 'statusType',
  translationKey: 'translationKey',
  closeModalOnClick: 'closeModalOnClick',
  customButtons: 'customButtons',
  withDescriptionText: 'withDescriptionText'
};

export interface StatusModalWindowSharedContext {
  translationKey: string;
}

export interface CustomStatusModalButton {
  id: string;
  translationKeyPart: string;
  nextModalId?: string;
}

export interface CustomStatusModalButtons {
  mainButton?: CustomStatusModalButton;
  secondaryButton?: CustomStatusModalButton;
}
