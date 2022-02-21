import { ConfirmationModalWindowContext, ConfirmMultipleAccountsConnectionInputKeys } from './../../../components/modals/constants/confirmation-multiple-accounts-connection-modal.const';
import { ConfirmMultipleAccountsConnectionModalComponent } from './../../../components/modals/confirm-multiple-accounts-connection-modal/confirm-multiple-accounts-connection-modal.component';
import { ConnectionFormInstanceStatesEnum } from './../../../store/models/state-entity.model';
import { Service } from 'core/modules/data/models/domain';
import { ModalWindowService } from './../../../../modals/services/modal-window/modal-window.service';
import { PluginConnectionFacadeService } from 'core/modules/plugins-connection/services';
import { Injectable } from '@angular/core';
import {
  ConfirmationModalWindowComponent,
  ConfirmationModalWindowInputKeys,
} from 'core/modules/modals/components';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MultipleAccountsConnectionHelperService {
  constructor(private pluginConnectionFacade: PluginConnectionFacadeService, private modalWindowService: ModalWindowService) { }

  openAddAnotherAccountSuggestModal(connectPluginHandler: () => void, addAnotherAccountHandler: () => void): void {
    this.modalWindowService.openInSwitcher({
      componentsToSwitch: [
        {
          id: 'suggest-add-another-account',
          componentType: ConfirmationModalWindowComponent,
          contextData: {
            [ConfirmationModalWindowInputKeys.confirmTranslationKey]: this.buildTranslationKey(
              'suggestAddAccount.confirmation'
            ),
            [ConfirmationModalWindowInputKeys.confirmationHandlerFunction]: addAnotherAccountHandler,
            [ConfirmationModalWindowInputKeys.dismissTranslationKey]: this.buildTranslationKey(
              'suggestAddAccount.dismiss'
            ),
            [ConfirmationModalWindowInputKeys.dismissHandlerFunction]: connectPluginHandler,
            [ConfirmationModalWindowInputKeys.icon]: 'automation',
            [ConfirmationModalWindowInputKeys.questionTranslationKey]: this.buildTranslationKey(
              'suggestAddAccount.question'
            ),
            [ConfirmationModalWindowInputKeys.aftermathTranslationKey]: this.buildTranslationKey(
              'suggestAddAccount.aftermath'
            ),
            [ConfirmationModalWindowInputKeys.closeModalAfterDismissing]: true,
            [ConfirmationModalWindowInputKeys.primaryButtonFirst]: false
          },
        }
      ],
    });
  }

  openConnectAccountsConfirmationModal(pendingAccountNames: string[], connectPluginHandler: () => void): void {
    const contextObject: ConfirmationModalWindowContext = {
      accountsToBeConnected: pendingAccountNames,
      connectAccountsHandler: connectPluginHandler
    };

    this.modalWindowService.openInSwitcher({
      componentsToSwitch: [
        {
          id: 'confirm-connection-of-multiple-accounts',
          componentType: ConfirmMultipleAccountsConnectionModalComponent,
          contextData: contextObject
        }
      ],
    });
  }

  async closeSelectedAccount(service: Service, showConfirmationModal: boolean): Promise<void> {
    if (showConfirmationModal) {
      this.сlosePendingAccountConfirmationModals(service);
    } else {
      this.backToPreviousPendingAccount(service);
    }
  }

  private async backToPreviousPendingAccount(service: Service): Promise<void> {
    const currentServiceSelectedInstance = await this.pluginConnectionFacade.getCurrentSelectedInstance(service).pipe(take(1)).toPromise();
    const currentServiceConnectionEntity = await this.pluginConnectionFacade.getPluginConnectionEntity(service).pipe(take(1)).toPromise();
    const pendingInstances = Object.values(currentServiceConnectionEntity.instances_form_values).filter((i) => i.instance_state === ConnectionFormInstanceStatesEnum.PENDING);
    if (currentServiceSelectedInstance.instance_state === ConnectionFormInstanceStatesEnum.PENDING && pendingInstances?.length > 1) {
      this.pluginConnectionFacade.removeServiceInstance(service.service_id, currentServiceSelectedInstance.instance_id);
      const breviousPendingState = Object.values(currentServiceConnectionEntity.instances_form_values).filter((v) => v.instance_id !== currentServiceSelectedInstance.instance_id).filter((v) => v.instance_state === ConnectionFormInstanceStatesEnum.PENDING);
      const lastPendingInstance = breviousPendingState[breviousPendingState.length - 1];
      this.pluginConnectionFacade.selectServiceInstance(service.service_id, lastPendingInstance.instance_id);
    } else {
      this.pluginConnectionFacade.setInitialState(service);
    }
  }

  private сlosePendingAccountConfirmationModals(service: Service): void {
    this.modalWindowService.openInSwitcher({
      componentsToSwitch: [
        {
          id: 'confirm-account-close-modal',
          componentType: ConfirmationModalWindowComponent,
          contextData: {
            [ConfirmationModalWindowInputKeys.confirmTranslationKey]: this.buildTranslationKey(
              'closeAccount.confirmation'
            ),
            [ConfirmationModalWindowInputKeys.confirmationHandlerFunction]: () => this.backToPreviousPendingAccount(service),
            [ConfirmationModalWindowInputKeys.dismissTranslationKey]: this.buildTranslationKey(
              'closeAccount.dismiss'
            ),
            [ConfirmationModalWindowInputKeys.icon]: 'status_not_started',
            [ConfirmationModalWindowInputKeys.questionTranslationKey]: this.buildTranslationKey(
              'closeAccount.question'
            ),
            [ConfirmationModalWindowInputKeys.closeModalAfterDismissing]: true,
          },
        }
      ],
    });
  }

  private buildTranslationKey(key: string): string {
    return `openedPlugin.multipleAccounts.modals.${key}`;
  }
}
