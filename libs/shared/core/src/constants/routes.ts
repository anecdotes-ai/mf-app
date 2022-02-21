import { AnecdotesUnifiedFramework } from 'core/modules/data/constants';

export const AppRoutes = {
  ExecutiveReport: 'executive-report',
  Dashboard: 'dashboard',
  Controls: 'frameworks/:framework/controls',
  MyControls: `frameworks/${AnecdotesUnifiedFramework.framework_name}/controls`,
  EvidencePool: 'evidence-pool',
  Plugins: 'plugins',
  Frameworks: 'frameworks',
  FrameworkManager: ':framework',
  FrameworkOverview: 'overview',
  FrameworkAuditHistory: 'history',
  Api: 'api',
  UserManagement: 'user-management',
  ViewEvidence: 'view-evidence',
  Settings: 'settings',
  Login: 'login',
  LoginCallback: 'login/callback',
  ControlsReport: 'controls-report',
  Auth: 'auth',
  AuthLogin: 'auth/login',
  WelcomePage: 'welcome',
  PolicyManager: 'policy-manager',
  RiskManagement: 'risk-management',
  AuditorsPortal: 'auditors-portal',
  PolicyExternalApproval: 'policy/:policyId/approve',
  ControlsFrameworkSnapshot: 'audit/:snapshot',
  FrameworkReport: 'framework-report'
};

export const AppSettingsRoutesSegments = {
  SetSSO: 'set-sso',
  Connectors: 'connectors',
  DataDelegation: 'data-delegation',
};

export const RouteParams = {
  plugin: {
    tabQueryParamName: 'tab',
    logsQueryParamValue: 'logs',
    logsForServiceId: 'forServiceId'
  },
};
