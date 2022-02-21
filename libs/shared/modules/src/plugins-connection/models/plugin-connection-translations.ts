// Connection states root key
export const PluginConnection_TranslationRootkey = 'pluginConnection';

export const MainButton_DefaultTranslationKey = 'mainButtonText';
export const MainDescription_DefaultTranslationKeyy = 'mainDescription';

export const SecondaryButton_DefaultTranslationKeyy = 'secondaryButtonText';
export const SecondaryDescription_DefaultTranslationKeyy = 'secondaryDescription';

// Static operations state keys
// Specific state keys
export const ConfirmPluginDisconnect_TranslationKey = 'confirmPluginDisconnect';
export const ConfirmServiceAccountRemove_TranslationKey = 'confirmServiceAccountRemove';
export const ConfirmServiceAccountDisconnect_TranslationKey = 'confirmServiceAccountDisconnect';
export const EvidenceCollectionHasStarted_TranslationKey = 'evidenceCollectionHasStarted';
export const ClearFormConfirmation_TranslationKey = 'clearFormConfirmation';
export const FilemonitorConnectionFinished_TranslationKey = 'filemonitorConnectionFinished';
export const ExternalApproval_TranslationKey = 'externalApproval';
export const TestConnection_TranslationKey = 'testConnection';
export const WaitingForTunnel_TranslationKey = 'waitingForTunnel';
export const WaitingForTunnelFailed_TranslationKey = 'waitingForTunnelFailed';
export const TestConnectionAfterTunnelIsUp_TranslationKey = 'testConnectionAfterTunnelIsUp';

// Oauth connection translation keys;
export const OAUTHConnection_TranslationKey = 'oauthConnection';
export const OAUTHSuccessfullyCollected_TranslationKey = 'oauthSuccessfullyCollected';

// Function to resolve translation
export function getMainButtonTranslationKeyBySectionKey(sectionKey: string): string {
  return `${PluginConnection_TranslationRootkey}.${sectionKey}.${MainButton_DefaultTranslationKey}`;
}

export function getMainDescriptionTranslationKeyBySectionKey(sectionKey: string): string {
  return `${PluginConnection_TranslationRootkey}.${sectionKey}.${MainDescription_DefaultTranslationKeyy}`;
}

export function getSecondaryButtonTranslationKeyBySectionKey(sectionKey: string): string {
  return `${PluginConnection_TranslationRootkey}.${sectionKey}.${SecondaryButton_DefaultTranslationKeyy}`;
}

export function getSecondaryDescriptionTranslationKeyBySectionKey(sectionKey: string): string {
  return `${PluginConnection_TranslationRootkey}.${sectionKey}.${SecondaryDescription_DefaultTranslationKeyy}`;
}
