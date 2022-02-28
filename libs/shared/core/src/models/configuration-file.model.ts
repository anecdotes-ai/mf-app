export interface AuthConfiguration {
  tenantSubDomainFormat?: string;
  tenantRedirectUrlFormat?: string;
  tenantSignInUrlFormat?: string;
  domain?: string;
}

export interface InternationalizationConfiguration {
  defaultLanguage: string;
}

export interface LogRocketConfiguration {
  projectId: string;
}

export interface RedirectUrls {
  anecdotes?: string;
  inactiveUser?: string;
  browserNotSupported?: string;
  privacyPage?: string;
  termsPage?: string;
  howToConnectPlugins?: string;
  howToConfigureAgent?: string;
  complienceProgressArticle?: string;
  intercomJiraCustomizationHelp?: string;
  intercomZendeskCustomizationHelp?: string;
  intercomJiraServerCustomizationHelp?: string;
  multiAccountsPage?: string;
  auditorsPortal?: string;
}

export interface EndpointsConfiguration {
  getAllRisks: string,
  addRisk: string,
  getRiskById: string,
  editRisk: string,
  deleteRisk: string,
  attachEvidenceToRisk: string, 
  getAllRiskCategories: string,
  addRiskCategory: string,
  getRiskCategoryById: string,
  deleteRiskCategory: string,
  getAllRiskSources: string,
  addRiskSource: string,
  getRiskSourceById: string,
  deleteRiskSource: string,
  deleteFrameworkAudit: string,
  getFrameworkAuditHistory: string,
  changeFrameworkAuditStatus: string,
  setFrameworkAudit: string,
  updateFrameworkAudit: string,
  getControls: string;
  getControlsByFramework: string;
  getControl: string;
  addCustomControl: string;
  updateCustomControl: string;
  patchControl: string;
  removeCustomControl: string;
  getEvidences: string;
  getEvidencesFullData: string;
  getEvidencePreview: string;
  getEvidenceSnapshots: string;
  getEvidenceRunHistory: string;
  getEvidenceSnapshotsFromDate: string;
  getEvidenceRunHistoryFromDate: string;
  downloadEvidence: string;
  downloadEvidenceSignedUrl: string;
  downloadAllEvidences: string;
  downloadLogs: string;
  uploadEvidence: string;
  setEvidenceStatus: string;
  addEvidence: string;
  getAvailableServices: string;
  getAllServices: string;
  getAllFrameworks: string;
  getSpecificFramework: string;
  patchFramework: string;
  getSpecificService: string;
  getSpecificServiceInstance: string;
  deleteService: string;
  deleteServiceInstance: string;
  getServiceMetadata: string;
  installService: string;
  reconnectService: string;
  getServiceLogs: string;
  getServiceInstanceLogs: string;
  createServiceTask: string;
  changeApplicability: string;
  frameworkChangeApplicability: string;
  frameworkUpdatePluginsExclusionList: string;
  getAllUsers: string;
  removeSpecificUser: string;
  userUpdated: string;
  createNewUser: string;
  getRequirements: string;
  addRequirementEvidence: string;
  deleteRequirementEvidence: string;
  updateRequirementEvidence: string;
  removeRequirement: string;
  addRequirement: string;
  patchRequirement: string;
  addPolicyToRequirement: string;
  deletePolicyFromRequirement: string;
  getCustomer: string;
  onBoardCustomer: string;
  getPolicies: string;
  getPolicy: string;
  addPolicy: string;
  deletePolicy: string;
  editPolicy: string;
  sharePolicy: string;
  deletePolicyEvidence: string;
  addPolicyEvidence: string;
  updatePolicyEvidence: string;
  editPolicySettings: string;
  downalodPolicyTemplate: string;
  approvePolicy: string;
  approveOnBehalf: string;
  getTenant: string;
  addServiceToFavourites: string;
  removeServiceFromFavourites: string;
  notes: string;
  getAgents: string;
  removeAgent: string;
  addAgent: string;
  getAgentsOVA: string;
  rotateAgentsApiKey: string;
  getAgentsLogs: string;
  getEvidenceInstances: string;
}

export interface IdentityEndpoints {
  getTenant: string;
  getUser: string;
  addUser: string;
  deleteUser: string;
  updateUser: string;
  exchange: string;
  sendSignInEmail: string;
  sendSSOLink: string;
  deleteSSOLink: string;
  getSAMLIds: string;
  forgotAccount: string;
  linkCredential: string;
  auditorTenants: string;
  auditorTenantExchange: string;
}

export interface ApiConfiguration {
  baseUrl: string;
  useAuth: boolean;
  endpoints: EndpointsConfiguration;
}

export interface IdentityApi {
  baseUrl: string;
  endpoints: IdentityEndpoints;
}

export interface IAmplitudeConfig {
  apiKey: string;
}

export interface PusherConfiguration {
  applicationId: string;
  cluster: string;
  authEndpoint: string;
}

export interface SlackEndpoints {
  channels: string;
  users: string;
  dissmissSlackPendingState: string;
  sendSlackMessage: string;
}

export interface SlackApiConfiguration {
  baseUrl: string;
  endpoints: SlackEndpoints;
}

export interface CommentsApiConfiguration {
  baseUrl: string;
}

export interface NotificationsEndpoints {
  getNotifications: string;
  deleteNotification: string;
  deleteAllNotifications: string;
  patchNotification: string;
}

export interface NotificationsApiConfiguration {
  baseUrl: string;
  endpoints: NotificationsEndpoints;
}

export interface Gainsight {
  productKey: string;
}

export interface UserFlow {
  token: string;
}

export interface Intercom {
  appId: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
}

export interface PDFTronConfiguration {
  licenseKey: string;
}

export interface ApmConfiguration {
  baseUrl: string;
  serviceName: string;
  env: string;
}

export interface SnapshotApi {
  baseUrl: string;
  endpoints: SnapshotEndpoints;
}

export interface SnapshotEndpoints {
  getEntitySnapshot: string;
  getMultipleSnapshot: string;
}

export interface ConfigurationFile {
  auth: AuthConfiguration;
  firebase?: FirebaseConfig;
  api: ApiConfiguration;
  notificationsApi?: NotificationsApiConfiguration;
  commentsApi?: CommentsApiConfiguration;
  apm: ApmConfiguration;
  identityApi: IdentityApi;
  amplitude: IAmplitudeConfig;
  slackApi: SlackApiConfiguration;
  internationalization: InternationalizationConfiguration;
  pusher: PusherConfiguration;
  logRocket: LogRocketConfiguration;
  gainsight?: Gainsight;
  userflow?: UserFlow;
  intercom?: Intercom;
  redirectUrls: RedirectUrls;
  pdfTron: PDFTronConfiguration;
  snapshotApi: SnapshotApi;
}
