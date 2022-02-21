export enum PluginConnectionStates {
  Default = 'default',
  TestConnection = 'TestConnection',
  OAUTHConnection = 'OAUTHConnectionState',
  WaitingForTunnel = 'WaitingForTunnelState',
  WaitingForTunnelFailed = 'WaitingForTunnelFailed',
  TestConnectionAfterTunnelIsUp = 'TestConnectionAfterTunnelIsUp',

  // Dynamic form states
  OAUTHWithFormConnection = 'OAUTH_FormConnectionState',
  FormConnection = 'FormConnectionState',
  ClearForm = 'ClearForm',

  // Plugin  successfully connected states
  Generic_PluginSuccessfullyConnected = 'Generic_PluginSuccessfullyConnected',
  FileMonitor_PluginSuccessfullyConnected = 'FileMonitor_PluginSuccessfullyConnected',
  Collaboration_PluginSuccessfullyConnected = 'FileMonitor_PluginSuccessfullyConnected',

  // Evidence successfully collected states
  OAUTH_EvidenceSuccessfullyCollected = 'OAUTH_EvidenceSuccessfullyCollected',

  EvidenceCollectionHasStarted = 'EvidenceCollectionHasStarted',
  ExternalApprovalError = 'ExternalApprovalError',
  DisablePlugin = 'DisablePlugin',
  DisconnectServiceAccount = 'DisconnectServiceAccount',
  RemoveServiceAccount = 'RemoveServiceAccount',
  ErrorConnection = 'ErrorConnection',

  // Multiple accounts states
  AccountsList = 'AccountsList',
  AddNewAccount = 'AddNewAccount'
}
