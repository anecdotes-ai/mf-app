import { ConfirmMultipleAccountsConnectionInputKeys } from './../constants/confirmation-multiple-accounts-connection-modal.const';
import { multipleAccountsTranslationRootKey } from './../../plugin-connections/plugin-multiple-accounts/constants/translation.constants';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-confirm-multiple-accounts-connection-modal',
  templateUrl: './confirm-multiple-accounts-connection-modal.component.html',
  styleUrls: ['./confirm-multiple-accounts-connection-modal.component.scss']
})
export class ConfirmMultipleAccountsConnectionModalComponent {

  @Input(ConfirmMultipleAccountsConnectionInputKeys.accountsToBeConnected)
  accountsToBeConnected: string[];

  @Input(ConfirmMultipleAccountsConnectionInputKeys.connectAccountsHandler)
  connectAccountsHandler: () => any;

  buildTranslationKey(key: string): string {
    return `${multipleAccountsTranslationRootKey}.modals.confirmConnectingMultipleAccounts.${key}`;
  }
}
