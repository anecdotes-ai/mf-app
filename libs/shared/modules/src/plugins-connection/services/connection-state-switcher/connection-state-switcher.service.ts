import { PluginAccountsListStateComponent } from './../../components/plugin-connections/plugin-multiple-accounts/plugin-accounts-list-state/plugin-accounts-list-state.component';
import { LoadingAnimationComponent } from './../../../loaders/components/loading-animation/loading-animation.component';
import { PluginOauthWithFormConnectionComponent } from './../../components/plugin-connections/plugin-oauth-with-form-connection/plugin-oauth-with-form-connection.component';
import { PluginOauthConnectionComponent } from './../../components/plugin-connections/plugin-oauth-connection/plugin-oauth-connection.component';
import { SuccessAnimationComponent } from './../../../utils/components/success-animation/success-animation.component';
import { Service } from 'core/modules/data/models/domain';
import { InviteItUserComponent } from 'core/modules/invite-user';
import { OAuthUrlHandlerService } from '../oauth-url-handler/oauth-url-handler.service';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';
import { ComponentToSwitch } from 'core/modules/component-switcher/models/component-to-switch';
import { Injectable } from '@angular/core';
import { MultiAccountsEventService } from 'core/modules/data/services/event-tracking/multi-accounts-event-service/multi-accounts-event.service';
// Local imports
import {
  EvidenceCollectionHasStarted_TranslationKey,
  getMainButtonTranslationKeyBySectionKey,
  getMainDescriptionTranslationKeyBySectionKey,
  getSecondaryDescriptionTranslationKeyBySectionKey,
  OAUTHConnection_TranslationKey,
  PluginConnectionStaticStateSharedContext,
  PluginStaticStateInputsToTypesMapping,
  PluginStaticStateSharedContextInputKeys,
  getSecondaryButtonTranslationKeyBySectionKey,
  OAUTHSuccessfullyCollected_TranslationKey,
  ConfirmPluginDisconnect_TranslationKey,
  ClearFormConfirmation_TranslationKey,
  FilemonitorConnectionFinished_TranslationKey,
  ExternalApproval_TranslationKey,
  TestConnection_TranslationKey,
  WaitingForTunnel_TranslationKey,
  WaitingForTunnelFailed_TranslationKey,
  TestConnectionAfterTunnelIsUp_TranslationKey,
  ConfirmServiceAccountRemove_TranslationKey,
  ConfirmServiceAccountDisconnect_TranslationKey,
  PluginConnectionStates
} from '../../models';
import { PluginStaticStateComponent } from './../../components/plugin-connection-states/plugin-static-state/plugin-static-state.component';
import { ActionButtonsPosition } from './../../components/plugin-connection-states/plugin-static-state/action-buttons-position';
import { PluginConnectionFacadeService } from '../facades';
import { PluginGenericConnectionComponent } from '../../components/plugin-connections';
import { map, take } from 'rxjs/operators';
import { PluginsEventService } from 'core/modules/plugins-connection/services/plugins-event-service/plugins-event.service';
import { UserEvents } from 'core/models/user-events/user-event-data.model';

@Injectable()
export class ConnectionStateSwitcherService {
  private _connectionStatePages: ComponentToSwitch[];

  get pluginConnectionStatePages(): ComponentToSwitch[] {
    return this._connectionStatePages;
  }

  constructor(
    private windowHelper: WindowHelperService,
    private urlHandlerService: OAuthUrlHandlerService,
    private pluginConnectionFacade: PluginConnectionFacadeService,
    private pluginsEventService: PluginsEventService,
    private multiAccountsEventService: MultiAccountsEventService
  ) {
    this._connectionStatePages = this.getDefaultPluginConnectionStates();
  }

  private getDefaultPluginConnectionStates(): ComponentToSwitch[] {
    const connectionStates: ComponentToSwitch[] = [
      // DEFAULT VIEW INSTANCE IS REQUIRED
      {
        id: PluginConnectionStates.Default,
        componentType: PluginStaticStateComponent,
        contextData: this.defaultContext(),
      },
      // Common states
      {
        id: PluginConnectionStates.WaitingForTunnel,
        componentType: PluginStaticStateComponent,
        contextData: this.getWaitForTunnelContext(),
      },
      {
        id: PluginConnectionStates.WaitingForTunnelFailed,
        componentType: PluginStaticStateComponent,
        contextData: this.getWaitForTunnelFailedContext(),
      },
      {
        id: PluginConnectionStates.TestConnectionAfterTunnelIsUp,
        componentType: PluginStaticStateComponent,
        contextData: this.getTestConnectionAfterTunnelIsUpContext(),
      },
      {
        id: PluginConnectionStates.TestConnection,
        componentType: PluginStaticStateComponent,
        contextData: this.getTestConnectionContext(),
      },
      {
        id: PluginConnectionStates.EvidenceCollectionHasStarted,
        componentType: PluginStaticStateComponent,
        contextData: this.getEvidenceCollectionHasStartedContext(),
      },
      // Filemonitor connection success special coinnection screen
      {
        id: PluginConnectionStates.FileMonitor_PluginSuccessfullyConnected,
        componentType: PluginStaticStateComponent,
        contextData: this.getFilemonitorConnectionFinishedContext(),
      },
      {
        id: PluginConnectionStates.DisablePlugin,
        componentType: PluginStaticStateComponent,
        contextData: this.getDisconnectPluginConfirmationStateContext(),
      },
      {
        id: PluginConnectionStates.RemoveServiceAccount,
        componentType: PluginStaticStateComponent,
        contextData: this.getRemoveServiceAccountConfirmationStateContext(),
      },
      {
        id: PluginConnectionStates.DisconnectServiceAccount,
        componentType: PluginStaticStateComponent,
        contextData: this.getDisconnectServiceAccountConfirmationStateContext(),
      },
      // OAUTH flow display states
      {
        id: PluginConnectionStates.OAUTHConnection,
        componentType: PluginOauthConnectionComponent,
        contextData: this.getOauthConnectionContext(),
      },
      {
        id: PluginConnectionStates.OAUTH_EvidenceSuccessfullyCollected,
        componentType: PluginOauthConnectionComponent,
        contextData: this.getOAUTHEvidenceSuccessfullyCollectedContext(),
      },
      {
        id: PluginConnectionStates.ExternalApprovalError,
        componentType: PluginStaticStateComponent,
        contextData: this.getExternalApprovalContext(),
      },
      // Generic connection states (connection with dynamic form flow)
      {
        id: PluginConnectionStates.FormConnection,
        componentType: PluginGenericConnectionComponent,
      },
      {
        id: PluginConnectionStates.ClearForm,
        componentType: PluginStaticStateComponent,
        contextData: this.getClearFormStateContext(),
      },

      // OAUTH + Generic flow (connection with dynamic form flow) connection state
      {
        id: PluginConnectionStates.OAUTHWithFormConnection,
        componentType: PluginOauthWithFormConnectionComponent,
      },

      // Multiple accounts related states
      {
        id: PluginConnectionStates.AccountsList,
        componentType: PluginAccountsListStateComponent,
      },
    ];
    return connectionStates;
  }

  private getWaitForTunnelContext(): PluginStaticStateInputsToTypesMapping {
    return {
      icon: { componentType: LoadingAnimationComponent, inputData: { height: '150px', with: '150px' } },
      mainDescription: getMainDescriptionTranslationKeyBySectionKey(WaitingForTunnel_TranslationKey),
      displayHeader: false,
      displayFooter: false,
      displayServiceTipIfExists: false,
    };
  }

  private getWaitForTunnelFailedContext(): PluginStaticStateInputsToTypesMapping {
    return {
      mainButton: {
        translationKey: getMainButtonTranslationKeyBySectionKey(WaitingForTunnelFailed_TranslationKey),
        action: async (_, sharedContext: PluginConnectionStaticStateSharedContext) => {
          await this.tryConnectPluginAgain(sharedContext[PluginStaticStateSharedContextInputKeys.service]);
        },
      },
      secondaryButton: {
        translationKey: getSecondaryButtonTranslationKeyBySectionKey(WaitingForTunnelFailed_TranslationKey),
        action: (switcher, _) => {
          switcher.goById(PluginConnectionStates.FormConnection);
        },
      },
      icon: 'status_error',
      mainDescription: getMainDescriptionTranslationKeyBySectionKey(WaitingForTunnel_TranslationKey),
      secondaryDescription: getSecondaryDescriptionTranslationKeyBySectionKey(WaitingForTunnelFailed_TranslationKey),
      displayHeader: false,
      displayFooter: true,
      displayServiceTipIfExists: false,
      aboveFooterComponentTypeToRender: InviteItUserComponent,
    };
  }

  private defaultContext(): PluginStaticStateInputsToTypesMapping {
    return {
      icon: { componentType: LoadingAnimationComponent, inputData: { height: '150px', with: '150px' } },
      displayHeader: false,
      displayFooter: false,
      displayServiceTipIfExists: false,
    };
  }

  private getTestConnectionContext(): PluginStaticStateInputsToTypesMapping {
    return {
      icon: { componentType: LoadingAnimationComponent, inputData: { height: '150px', with: '150px' } },
      mainDescription: getMainDescriptionTranslationKeyBySectionKey(TestConnection_TranslationKey),
      displayHeader: false,
      displayFooter: false,
      displayServiceTipIfExists: false,
    };
  }

  private getTestConnectionAfterTunnelIsUpContext(): PluginStaticStateInputsToTypesMapping {
    return {
      icon: { componentType: LoadingAnimationComponent, inputData: { height: '150px', with: '150px' } },
      mainDescription: getMainDescriptionTranslationKeyBySectionKey(TestConnectionAfterTunnelIsUp_TranslationKey),
      displayHeader: false,
      displayFooter: false,
      displayServiceTipIfExists: false,
    };
  }

  private getExternalApprovalContext(): PluginStaticStateInputsToTypesMapping {
    return {
      mainButton: {
        translationKey: getMainButtonTranslationKeyBySectionKey(ExternalApproval_TranslationKey),
        action: (_, sharedContext: PluginConnectionStaticStateSharedContext) =>
          this.redirectToOauthConnectionExternal(sharedContext[PluginStaticStateSharedContextInputKeys.service]),
      },
      secondaryButton: {
        translationKey: getSecondaryButtonTranslationKeyBySectionKey(ExternalApproval_TranslationKey),
        action: (_, sharedContext) =>
          this.pluginConnectionFacade.setInitialState(sharedContext[PluginStaticStateSharedContextInputKeys.service]),
      },
      icon: 'characters/eitan',
      mainDescription: getMainDescriptionTranslationKeyBySectionKey(ExternalApproval_TranslationKey),
      secondaryDescription: getSecondaryDescriptionTranslationKeyBySectionKey(ExternalApproval_TranslationKey),
      displayHeader: false,
      displayFooter: true,
      displayServiceTipIfExists: false,
      aboveFooterComponentTypeToRender: InviteItUserComponent,
    };
  }

  private getFilemonitorConnectionFinishedContext(): PluginStaticStateInputsToTypesMapping {
    return {
      mainButton: {
        translationKey: getMainButtonTranslationKeyBySectionKey(FilemonitorConnectionFinished_TranslationKey),
        action: (_, sharedContext: PluginConnectionStaticStateSharedContext) =>
          this.pluginConnectionFacade.setInitialState(sharedContext[PluginStaticStateSharedContextInputKeys.service]),
      },
      icon: {
        componentType: SuccessAnimationComponent,
        inputData: { height: '70px', with: '70px', activateAnimation: true },
      },
      mainDescription: getMainDescriptionTranslationKeyBySectionKey(FilemonitorConnectionFinished_TranslationKey),
      secondaryDescription: getSecondaryDescriptionTranslationKeyBySectionKey(
        FilemonitorConnectionFinished_TranslationKey
      ),
      displayHeader: false,
      displayFooter: false,
      displayServiceTipIfExists: false,
      buttonsPosition: ActionButtonsPosition.Center,
    };
  }

  private getClearFormStateContext(): PluginStaticStateInputsToTypesMapping {
    return {
      mainButton: {
        translationKey: getMainButtonTranslationKeyBySectionKey(ClearFormConfirmation_TranslationKey),
        action: (_, sharedContext: PluginConnectionStaticStateSharedContext) =>
          this.pluginConnectionFacade.clearConnectionForm(
            sharedContext[PluginStaticStateSharedContextInputKeys.service]
          ),
      },
      secondaryButton: {
        translationKey: getSecondaryButtonTranslationKeyBySectionKey(ClearFormConfirmation_TranslationKey),
        action: (_, sharedContext: PluginConnectionStaticStateSharedContext) => {
          const service = sharedContext[PluginStaticStateSharedContextInputKeys.service];
          // This behavior is an excludsion, we assume that Clear Form button appears only on NON connected plugin, so that's why we use getInitialConnectionState method and not the any another.
          // In the future it would be great to add a logic to go back to previous state, to do it, we have to save a previous state while the change
          this.pluginConnectionFacade.setState(service.service_id, this.pluginConnectionFacade.getInitialConnectionState(service));
        },
      },
      icon: 'status_error',
      mainDescription: getMainDescriptionTranslationKeyBySectionKey(ClearFormConfirmation_TranslationKey),
      secondaryDescription: getSecondaryDescriptionTranslationKeyBySectionKey(ClearFormConfirmation_TranslationKey),
      displayHeader: false,
      displayFooter: true,
      displayServiceTipIfExists: false,
      aboveFooterComponentTypeToRender: InviteItUserComponent,
    };
  }

  private getDisconnectServiceAccountConfirmationStateContext(): PluginStaticStateInputsToTypesMapping {
    return this.getDisableConfirmationStateContext(ConfirmServiceAccountDisconnect_TranslationKey);
  }

  private getDisconnectPluginConfirmationStateContext(): PluginStaticStateInputsToTypesMapping {
    let stateContext = this.getDisableConfirmationStateContext(ConfirmServiceAccountDisconnect_TranslationKey);
    let originalAction = stateContext.mainButton.action;
    stateContext.mainButton.action = (_, sharedContext: PluginConnectionStaticStateSharedContext) => {
       this.multiAccountsEventService.trackMultiAccountWithPluginName(UserEvents.DISCONNECT_ACCOUNT, sharedContext[PluginStaticStateSharedContextInputKeys.service].service_id);
       originalAction(_, sharedContext); 
    };
    return stateContext;
  }

  private getRemoveServiceAccountConfirmationStateContext(): PluginStaticStateInputsToTypesMapping {
    let stateContext = this.getDisableConfirmationStateContext(ConfirmServiceAccountRemove_TranslationKey);
    let originalAction = stateContext.mainButton.action;
    stateContext.mainButton.action = (_, sharedContext: PluginConnectionStaticStateSharedContext) => {
       this.multiAccountsEventService.trackMultiAccountWithPluginName(UserEvents.REMOVE_ACCOUNT, sharedContext[PluginStaticStateSharedContextInputKeys.service].service_id);
       originalAction(_, sharedContext); 
    };
    return stateContext;
 }

  private getDisableConfirmationStateContext(sectionKey: string): PluginStaticStateInputsToTypesMapping {
    return {
      mainButton: {
        translationKey: getMainButtonTranslationKeyBySectionKey(sectionKey),
        action: (_, sharedContext: PluginConnectionStaticStateSharedContext) => {
          this.pluginsEventService.trackDisconnectPluginClick(sharedContext[PluginStaticStateSharedContextInputKeys.service]);
          this.pluginConnectionFacade.disconnectPlugin(sharedContext[PluginStaticStateSharedContextInputKeys.service].service_id);
        }
      },
      secondaryButton: {
        translationKey: getSecondaryButtonTranslationKeyBySectionKey(sectionKey),
        action: (_, sharedContext: PluginConnectionStaticStateSharedContext) =>
          this.pluginConnectionFacade.setInitialState(sharedContext[PluginStaticStateSharedContextInputKeys.service])
      },
      icon: 'status_error',
      mainDescription: getMainDescriptionTranslationKeyBySectionKey(sectionKey),
      secondaryDescription: getSecondaryDescriptionTranslationKeyBySectionKey(sectionKey),
      displayHeader: false,
      displayFooter: true,
      displayServiceTipIfExists: false,
      aboveFooterComponentTypeToRender: InviteItUserComponent,
    };
  }

  private getEvidenceCollectionHasStartedContext(): PluginStaticStateInputsToTypesMapping {
    return {
      icon: {
        componentType: SuccessAnimationComponent,
        inputData: { height: '70px', with: '70px', activateAnimation: true },
      },
      mainDescription: getMainDescriptionTranslationKeyBySectionKey(EvidenceCollectionHasStarted_TranslationKey),
      secondaryDescription: getSecondaryDescriptionTranslationKeyBySectionKey(
        EvidenceCollectionHasStarted_TranslationKey
      ),
      displayHeader: false,
      displayHeaderThreeDotsMenu: false,
      displayFooter: false,
      displayServiceTipIfExists: false,
    };
  }

  private getOauthConnectionContext(): PluginStaticStateInputsToTypesMapping {
    return {
      mainButton: {
        translationKey: getMainButtonTranslationKeyBySectionKey(OAUTHConnection_TranslationKey),
        action: (_: any, sharedContext: PluginConnectionStaticStateSharedContext) => {
          this.pluginsEventService.trackConnectPluginClick(sharedContext[PluginStaticStateSharedContextInputKeys.service]);
          this.redirectToOauthConnectionExternal(sharedContext[PluginStaticStateSharedContextInputKeys.service]);
        }
      },
      icon: 'characters/yair',
      mainDescription: getMainDescriptionTranslationKeyBySectionKey(OAUTHConnection_TranslationKey),
      displayHeader: true,
      displayHeaderThreeDotsMenu: false,
      displayFooter: true,
      displayServiceTipIfExists: true,
      aboveFooterComponentTypeToRender: InviteItUserComponent,
    };
  }

  private redirectToOauthConnectionExternal(service: Service): void {
    this.windowHelper.openUrl(this.urlHandlerService.modifyRedirectUri(service.service_auth_url));
  }

  private getOAUTHEvidenceSuccessfullyCollectedContext(): PluginStaticStateInputsToTypesMapping {
    return {
      secondaryButton: {
        translationKey: getSecondaryButtonTranslationKeyBySectionKey(OAUTHSuccessfullyCollected_TranslationKey),
        action: (_, sharedContext: PluginConnectionStaticStateSharedContext) => {
          this.pluginsEventService.trackUpdatePermissionClick(sharedContext[PluginStaticStateSharedContextInputKeys.service]);
          this.windowHelper.openUrl(
            this.urlHandlerService.modifyRedirectUri(
              sharedContext[PluginStaticStateSharedContextInputKeys.service].service_auth_url
            )
          );
        },
      },
      icon: 'characters/evidence-collected',
      mainDescription: getMainDescriptionTranslationKeyBySectionKey(OAUTHSuccessfullyCollected_TranslationKey),
      secondaryDescription: getSecondaryDescriptionTranslationKeyBySectionKey(
        OAUTHSuccessfullyCollected_TranslationKey
      ),
      displayHeader: true,
      displayHeaderThreeDotsMenu: true,
      displayFooter: true,
      displayServiceTipIfExists: true,
    };
  }

  private async tryConnectPluginAgain(service: Service): Promise<void> {
    const connectionValues = await this.pluginConnectionFacade.getPluginConnectionEntity(service).pipe(
      take(1),
      map(value => value.instances_form_values[value.selected_service_instance_id].connection_form_values)
    ).toPromise();
    this.pluginConnectionFacade.reconnectPlugin(service, connectionValues,);
  }
}
