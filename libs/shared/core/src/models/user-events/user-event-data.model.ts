import { ControlStatusEnum } from 'core/modules/data/models/domain/index';
import { NotificationResourceType, NotificationState } from 'core/modules/notifications/models';
import { AppRoutes } from 'core/constants/routes';
import { RoleEnum } from 'core/modules/auth-core/models/domain';

export enum UserEvents {
  // General
  LOGIN = 'General - login',
  LOGOUT = 'General - logout',
  PAGEVIEW = 'Pageview',
  INVITE_USER = 'General - invite user',
  MENU = 'General - menu',
  COPY_NAME = 'General - copy name',
  ADD_NOTE = 'General - add a note',
  COMMUNITY = 'General - community',

  // Frameworks events
  FRAMEWORK_REMOVE = 'Frameworks - remove',
  FRAMEWORK_ADD = 'Frameworks - add',
  FRAMEWORK_OVERVIEW = 'Frameworks - overview',
  FRAMEWORK_EXPLORE_CONTROLS = 'Frameworks - explore controls',
  FRAMEWORK_SETUP_AUDIT = 'Framework overview - setup audit',
  FRAMEWORK_EDIT_AUDIT = 'Framework overview - edit audit info',
  FRAMEWORK_RESET_AUDIT = 'Framework overview - reset audit info',
  FRAMEWORK_END_AUDIT = 'Framework overview - end audit',
  FRAMEWORK_FREEZE_MODAL = 'Frameworks - data freeze',
  FRAMEWORK_CREATE = 'Frameworks - create framework',
  FRAMEWORK_CREATE_CTU = 'Framework - contact us to enable’',

  // Plugins events
  CONNECT_PLUGIN = 'Connect plugin',
  PLUGIN_CONNECTION_SUCCEEDED = 'Plugin connection succeeded',
  PLUGIN_CONNECTION_FAILED = 'Plugin connection failed',
  EVIDENCE_COLLECTION_SUCCEEDED = 'Evidence collection succeeded',
  EVIDENCE_COLLECTION_FAILED = 'Evidence collection failed',
  PLUGIN_DISCONNECT = 'Plugin disconnect',
  PLUGIN_RUN_ON_DEMAND = 'Plugin run on-demand',
  PLUGIN_CANCEL_EDIT_FORM = 'Plugin - Cancel edit',
  PLUGINS_INNER_TAB_NAVIGATION = 'Plugins - Inner tab navigation',
  PLUGIN_EDIT_FORM = 'Plugin - Edit',
  PLUGIN_RECONNECT = 'Plugin - Recconect',
  PLUGIN_SUGGEST_NEW_PLUGIN = 'Plugins - Suggest new plugin',
  PLUGIN_SELECT_PLUGIN_ON_MARKETPLACE = 'Plugins - Select plugin on marketplace',
  PLUGIN_HOW_TO_CONNECT = 'Plugin - How to connect',
  VIEW_EVIDENCE = 'Plugins - view evidence',
  UPDATE_PERMISSIONS = 'Plugins - update permission',

  // Controls
  CONTROL_MARK_AS_APPLICABLE = 'Controls - mark as applicable',
  CONTROL_MARK_AS_NA = 'Controls - mark as N/A',
  CONTROL_CREATE_CONTOL = 'Controls - create control',
  CONTROL_EXPORT_TO_CSV = 'Controls - export to csv',
  CONTROL_UPDATE_CONTROL = 'Controls - update control',
  CONTROL_UPDATE_CONTROL_STATUS = 'Controls - update controls status',
  CONTROL_GENERATE_REPORT = 'Controls - generate report',
  CONTROL_STATUS_CHANGE = 'Controls - status',
  CONTROL_SELECT_OWNER = 'Controls - select owner',

  // Evidences
  ADD_EVIDENCE_SHARED_LINK = 'Collect evidence - shared link',
  ADD_EVIDENCE_TICKETING = 'Collect evidence - ticketing',
  ADD_EVIDENCE_POLICY = 'Collect evidence - policy',
  ADD_EVIDENCE_URL = 'Collect evidence - url',
  ADD_EVIDENCE_FROM_DEVICE = 'Collect evidence - from device',
  EXPORT_EVIDENCE_TO_CSV = 'Evidence - export to csv',
  VIEW_FULL_DATA = 'Evidence - full data',
  EVIDENCE_REMOVE = 'Evidence - remove',
  EVIDENCE_DOWNLOAD = 'Evidence - download',
  EVIDENCE_FLAG_HOVER = 'Evidence - flag',
  EVIDENCE_MARK_FOR_REVIEW = 'Evidence - mark for review',
  LINK_EVIDENCE = 'Evidence - link evidence',
  EVIDENCE_LINKED = 'Evidence - linked',

  // Requirement events
  ADD_NEW_REQUIREMENT = 'Requirement - add requirement',
  UPDATE_REQUIREMENT = 'Requirement - update requirement',
  REMOVE_REQUIREMENT = 'Requirement - remove',
  SEND_VIA_SLACK_REQUIREMENT = 'Requirement - send via slack',

  // Onboarding Events
  ONBOARDING_RELEVANT_FRAMEWORKS = 'Onboarding - relevant frameworks',
  ONBOARDING_ORGANIZATIONS_POLICIES = 'Onboarding - organizational policies',
  ONBOARDING_CHOOSING_PLUGINS = 'Onboarding - choosing plugins',
  ONBOARDING_CHOOSING_FILES_POLICIES = 'Onboarding - choosing files/policies',
  ONBOARDING_GET_STARTED = 'Onboarding - get started',
  ONBOARDING_FLOW_ENDED = 'Onboarding - flow ended',
  ONBOARDING_NEXT_STEP = 'Onboarding - next step',

  // Commenting
  ResolveAllThreads = 'Comments - resolve all',
  DeleteAllResolved = 'Comments - delete all',
  ResolveThread = 'Comments - resolve and hide',
  EditThread = 'Comments - edit',
  DeleteThread = 'Comments - delete comment',
  DeleteResolvedThread = 'Comments - delete chat',
  ActivateThread = 'Comments - set active',
  CreateThread = 'Comments - add comment',
  CreateReply = 'Comments - reply',
  FilterToActiveThreads = 'Comments - active',
  FilterToResolvedThreads = 'Coments - resolved',
  FocusThread = 'Comments - open chat',

  // Notifications
  NOTIFICATION_CLICK = 'Notification click',
  NOTIFICATION_REMOVE = 'Notification remove',
  NOTIFICATION_REMOVE_ALL = 'Notification remove all',

  // On Prem
  FROM_PLUGIN_TO_CONNECTORS = 'On-Prem - from plugin to connectors',
  HOW_TO_GUIDE = 'On-Prem - how to guide',
  ADD_CONNECTOR = 'On-Prem - add connector',
  DOWNLOAD_VM = 'On-Prem - download vm',
  SELECT_CONNECTOR = 'On-Prem - select connector',
  REGENERATE_KEY = 'On-Prem - regenerate api key',
  PLUGIN_NAME_CLICK = 'On-Prem - click on plugin name',
  VIEW_EVIDENCE_CLICK = 'On-Prem - view evidence',
  TAB_NAVIGATION = 'On-Prem - inner tab navigation',
  CONNECTOR_STATUS_CHANGING = 'On-Prem - status change',

  // Policy Manager
  ADD_POLICY = 'Policy manager - add policy',
  UPDATE_POLICY = 'Policy manager - update policy',
  REMOVE_POLICY = 'Policy manager - remove policy',
  UPLOAD_FILE = 'Policy manager - upload file',
  DOWNLOAD_TEMPLATE = 'Policy manager - download template',
  LINK_POLICY = 'Policy manager - link policy',
  CANCEL_APPROVAL = 'Policy manager - cancel approval',
  APPROVE_ON_BEHALF = 'Policy manager - approve on behalf',
  SEND_FOR_APPROVAL = 'Policy manager - send policy for approval',
  SAVE_POLICY_SETTINGS = 'Policy manager - policy settings',
  POLICY_LINKED = 'Policy manager - linked',

  // Risk Management
  ADD_SUPPORTING_DOCUMENT = 'Risk - add item',
  CREATE_RISK = 'Risk - create risk',
  EDIT_RISK = 'Risk - edit risk',
  DELETE_RISK = 'Risk - delete risk',
  SELECT_OWNER = 'Risk - select owner',
  VIEW_CONTROL = 'Risk - view control',
  DISCONNECT_CONTROL = 'Risk - disconnect control',
  LINK_CONTROL = 'Risk - link control',
  HOW_RISK_LEVEL_IS_CALCULATED = 'Risk - how risk level is calculated',
}

export const enum NotificationEventDataProperty {
  NotificationType = 'notification type',
  Content = 'content',
  Resource = 'resource type',
  State = 'notification state'
}

export const enum NotificationsEventDataProperty {
  Total = 'total amount',
  Unread = 'unread amount',
  Read = 'read amount',
}

export enum OnPremEventDataProperty {
  ConnectedPluginsAmount = 'number of plugins connected to the connector',
  PluginsNames = 'name of the plugins',
  TabName = 'tab name',
  ConnectorId = 'connector id',
  PluginName = 'plugin name',
  PreviousConnectorStatus = 'previous status',
  CurrentConnectorStatus = 'current status',
}

export interface OnPremEventData {
  [OnPremEventDataProperty.ConnectedPluginsAmount]?: number;
  [OnPremEventDataProperty.PluginsNames]?: string;
  [OnPremEventDataProperty.TabName]?: string;
  [OnPremEventDataProperty.ConnectorId]?: string;
  [OnPremEventDataProperty.PluginName]?: string;
  [OnPremEventDataProperty.PreviousConnectorStatus]?: string;
  [OnPremEventDataProperty.CurrentConnectorStatus]?: string;
}

export const enum FrameworkEventDataPropertyNames {
  FrameworkName = 'framework name',
  Source = 'source',
  SelectedFrameworks = 'selected frameworks',
  AuditDate = 'audit date',
  SocType = 'soc type',
  AuditRange = 'audit range',
  OverviewSource = 'overview source'
}

export enum EvidenceEventDataProperty {
  FrameworkName = 'framework name',
  ControlName = 'control name',
  ControlCategory = 'control category',
  RequirementName = 'requirement name',
  RequirementType = 'requirement type',
  Type = 'type',
  SelectedPolicy = 'the policy that they selected',
  AddedUrl = 'added url',
  FileType = 'file type',
  EvidenceType = 'evidence type',
  EvidenceName = 'evidence name',
  Source = 'source',
  Clicked = 'clicked',
  FrameworksLinked = 'frameworks linked',
  AmountOfLinkedControls = '# of controls linked'
}

export enum AddNoteEventDataProperty {
  ControlName = 'control name',
  ControlCategory = 'control category',
  RequirementName = 'requirement name',
  Type = 'type',
  Source = 'source',
  Edited = 'Edited',
  PolicyName = 'policy name',
  PolicyCategory = 'policy category',
}

export enum OnboardingDataProperty {
  Frameworks = 'frameworks that have been chosen',
  Policies = 'organizational policies',
  Plugins = 'plugins that have been chosen',
  FilesOrPolicies = 'managing files/ policies',
  Destination = 'destination',
}

export enum InviteUserDataProperty {
  PluginName = 'plugin name',
  SelectedUserType = 'selected user type',
  SelectedFrameworks = 'selected frameworks',
  Source = 'source',
}

export enum EvidenceSourcesEnum {
  Preview = 'preview',
  FullData = 'full data',
  EvidencePool = 'evidence pool',
  Controls = 'controls',
  CollectEvidence = 'collect evidence',
  PolicyManager = 'policy manager',
}

export enum InviteUserSource {
  OnboardingWizard = 'onboarding wizard',
  UserManagement = 'user management',
  Plugins = 'plugins',
  ControlOwner = 'control owner',
  FrameworkManager = 'framework manager',
}

export enum ExploreControlsSource {
  Dashboard = 'Dashboard',
  FrameworkManager = 'framework manager',
  FrameworkOverview = 'framework overview',
  FrameworksPage = 'frameworks page',
  FrameworkAuditLog = 'framework audit log',
  RiskManagement = 'risk manager'
}

export enum MenuEventDataProperty {
  Source = 'source',
}

export enum MenuEventClickedEnum {
  NotClicked = 'not clicked',
  Dashboard = 'dashboard',
  Frameworks = 'frameworks',
  EvidencePool = 'evidence pool',
  Plugins = 'plugins',
  PolicyManager = 'policy manager',
  Api = 'api',
}

export enum RiskManagerEventDataProperty {
  EvidenceType = 'evidence type',
  PluginName = 'plugin name',
  DocumentName = 'document name',
  RiskName = 'risk name',
  RiskCategory = 'risk category',
  CustomCategory = 'custom category',
  RiskSource = 'risk source',
  CustomSource = 'custom source',
  RiskEffect = 'risk effect',
  RiskStrategy = 'risk strategy',
  EditedField = 'edited field',
  PreviousValue = 'previous value',
  NewValue = 'new value',
  RiskLevel = 'risk level',
  FrameworkName = 'framework name',
  ControlName = 'control name',
  ControlCategory = 'control category',
  ControlStatus = 'control status',
}

export interface RiskManagerEventData {
  [RiskManagerEventDataProperty.EvidenceType]?: string;
  [RiskManagerEventDataProperty.PluginName]?: string;
  [RiskManagerEventDataProperty.DocumentName]?: string;
  [RiskManagerEventDataProperty.RiskName]?: string;
  [RiskManagerEventDataProperty.RiskCategory]?: string;
  [RiskManagerEventDataProperty.CustomCategory]?: boolean;
  [RiskManagerEventDataProperty.RiskSource]?: string;
  [RiskManagerEventDataProperty.CustomSource]?: boolean;
  [RiskManagerEventDataProperty.RiskEffect]?: string;
  [RiskManagerEventDataProperty.RiskStrategy]?: string;
  [RiskManagerEventDataProperty.EditedField]?: string;
  [RiskManagerEventDataProperty.PreviousValue]?: string;
  [RiskManagerEventDataProperty.NewValue]?: string;
  [RiskManagerEventDataProperty.RiskLevel]?: string;
  [RiskManagerEventDataProperty.FrameworkName]?: string;
  [RiskManagerEventDataProperty.ControlName]?: string;
  [RiskManagerEventDataProperty.ControlCategory]?: string;
  [RiskManagerEventDataProperty.ControlStatus]?: ControlStatusEnum;
}

export enum PolicyManagerEventDataProperty {
  PolicyName = 'policy name',
  PolicyType = 'policy type',
  PolicyStatus = 'policy status',
  PolicyAddType = 'add type',
  FileType = 'file type',
  PluginUsed = 'plugin used',
  SentLink = 'sent link',
  Resent = 'resent',
  AmountOfReviewers = '# of reviewers',
  AmountOfApprovers = '# of approvers',
  ApprovalFreq = 'approval freq',
  NotifyMe = 'notify me',
  NotifyAssignedColleagues = 'notify assigned colleagues',
  FrameworksLinked = 'frameworks linked',
  AmountOfLinkedControls = '# of controls linked',
}

export interface PolicyManagerEventData {
  [PolicyManagerEventDataProperty.PolicyName]?: string;
  [PolicyManagerEventDataProperty.PolicyType]?: string;
  [PolicyManagerEventDataProperty.PolicyStatus]?: string;
  [PolicyManagerEventDataProperty.PolicyAddType]?: string;
  [PolicyManagerEventDataProperty.FileType]?: string;
  [PolicyManagerEventDataProperty.PluginUsed]?: string;
  [PolicyManagerEventDataProperty.SentLink]?: string;
  [PolicyManagerEventDataProperty.Resent]?: boolean;
  [PolicyManagerEventDataProperty.AmountOfReviewers]?: number;
  [PolicyManagerEventDataProperty.AmountOfApprovers]?: number;
  [PolicyManagerEventDataProperty.ApprovalFreq]?: string;
  [PolicyManagerEventDataProperty.NotifyMe]?: string;
  [PolicyManagerEventDataProperty.NotifyAssignedColleagues]?: string;
  [PolicyManagerEventDataProperty.FrameworksLinked]?: string;
  [PolicyManagerEventDataProperty.AmountOfLinkedControls]?: number;
}

export enum PolicyAddType {
  Created = 'created',
  SelectedFromExisting = 'selected from existing',
}

export const RouteEventMapping = {
  [AppRoutes.Dashboard]: MenuEventClickedEnum.Dashboard,
  [AppRoutes.Frameworks]: MenuEventClickedEnum.Frameworks,
  [AppRoutes.EvidencePool]: MenuEventClickedEnum.EvidencePool,
  [AppRoutes.Plugins]: MenuEventClickedEnum.Plugins,
  [AppRoutes.PolicyManager]: MenuEventClickedEnum.PolicyManager,
  [AppRoutes.Api]: MenuEventClickedEnum.Api,
};

export interface MenuEventData {
  [MenuEventDataProperty.Source]: string;
}

export interface FrameworkEventData {
  [FrameworkEventDataPropertyNames.FrameworkName]?: string;
  [FrameworkEventDataPropertyNames.Source]?: ExploreControlsSource;
  [FrameworkEventDataPropertyNames.SelectedFrameworks]?: string[];
  [FrameworkEventDataPropertyNames.AuditDate]?: string;
  [FrameworkEventDataPropertyNames.SocType]?: string;
  [FrameworkEventDataPropertyNames.AuditRange]?: string[];
  [FrameworkEventDataPropertyNames.OverviewSource]?: string;
}

export interface NotificationEventData {
  [NotificationEventDataProperty.NotificationType]?: string;
  [NotificationEventDataProperty.Content]?: string;
  [NotificationEventDataProperty.Resource]?: NotificationResourceType;
  [NotificationEventDataProperty.State]?: NotificationState;
}

export interface NotificationsEventData {
  [NotificationsEventDataProperty.Total]?: number;
  [NotificationsEventDataProperty.Read]?: number;
  [NotificationsEventDataProperty.Unread]?: number;
}

export interface EvidenceEventData {
  [EvidenceEventDataProperty.FrameworkName]?: string;
  [EvidenceEventDataProperty.ControlName]?: string;
  [EvidenceEventDataProperty.ControlCategory]?: string;
  [EvidenceEventDataProperty.RequirementName]?: string;
  [EvidenceEventDataProperty.Type]?: string;
  [EvidenceEventDataProperty.SelectedPolicy]?: string;
  [EvidenceEventDataProperty.AddedUrl]?: string;
  [EvidenceEventDataProperty.FileType]?: string;
  [EvidenceEventDataProperty.RequirementType]?: string;
  [EvidenceEventDataProperty.EvidenceType]?: string;
  [EvidenceEventDataProperty.EvidenceName]?: string;
  [EvidenceEventDataProperty.Source]?: string;
  [EvidenceEventDataProperty.Clicked]?: string;
  [EvidenceEventDataProperty.FrameworksLinked]?: string;
  [EvidenceEventDataProperty.AmountOfLinkedControls]?: number;
}

export interface OnboardingEventData {
  [OnboardingDataProperty.Frameworks]?: string[];
  [OnboardingDataProperty.Policies]?: 'yes' | 'no';
  [OnboardingDataProperty.Plugins]?: string[];
  [OnboardingDataProperty.FilesOrPolicies]?: string[];
  [OnboardingDataProperty.Destination]?: string;
}

export interface InviteUserEventData {
  [InviteUserDataProperty.PluginName]?: string;
  [InviteUserDataProperty.SelectedFrameworks]?: string[];
  [InviteUserDataProperty.SelectedUserType]: RoleEnum;
  [InviteUserDataProperty.Source]: InviteUserSource;
}

export interface CopyNameEventData {
  [CopyNameEventDataProperty.Type]?: string;
  [CopyNameEventDataProperty.Source]?: string;
}

export interface AddNoteEventData {
  [AddNoteEventDataProperty.ControlName]?: string;
  [AddNoteEventDataProperty.ControlCategory]?: string;
  [AddNoteEventDataProperty.RequirementName]?: string;
  [AddNoteEventDataProperty.PolicyName]?: string;
  [AddNoteEventDataProperty.PolicyCategory]?: string;
  [AddNoteEventDataProperty.Type]?: string;
  [AddNoteEventDataProperty.Source]?: string;
  [AddNoteEventDataProperty.Edited]?: boolean;
}

export enum RequirementEventDataProperty {
  FrameworkName = 'framework name',
  ControlName = 'control name',
  ControlCategory = 'control category',
  Type = 'type',
  RequirementName = 'requirement name',
  Changes = 'changes',
}

export enum RequirementAddingType {
  SelectedFromExisting = 'Selected from existing',
  CreatedNewReq = 'Created a new requirement',
}

export interface RequirementEventData {
  [RequirementEventDataProperty.FrameworkName]: string;
  [RequirementEventDataProperty.ControlName]: string;
  [RequirementEventDataProperty.ControlCategory]: string;
  [RequirementEventDataProperty.RequirementName]: string;
  [RequirementEventDataProperty.Type]?:
    | RequirementAddingType.CreatedNewReq
    | RequirementAddingType.SelectedFromExisting;
  [RequirementEventDataProperty.Changes]?: RequirementChanges;
}

export interface RequirementChanges {
  name?: string;
  description?: string;
}

export interface PageviewEventData {
  'page name': string;
  'pervious page url': string;
}

// Plugins related event data types

export const enum PluginEventDataPropertyNames {
  PluginName = 'plugin name',
  PluginCategory = 'plugin category',
  PluginNumberOfEvidences = 'plugin number of evidences',
  ChangedField = 'changed field',
  TabName = 'tab name',
  PluginConnected = 'plugin connected',
  PluginType = 'plugin type',
}

export enum PluginTabNames {
  PluginInfo = 'Plugin info',
  Permissions = 'Permissions',
  HowToConnect = 'How to connect',
  Logs = 'Logs',
}

export const TabNames = {
  pluginInfo: PluginTabNames.PluginInfo,
  permissions: PluginTabNames.Permissions,
  logs: PluginTabNames.Logs,
};

export enum ControlEventDataProperty {
  FrameworkName = 'framework name',
  ControlName = 'control name',
  ControlCategory = 'control category',
  ControlStatus = 'control status',
  ControlsCount = 'amount of controls',
  FilterApplied = 'filters applied',
  ControlExportingType = 'controls exporting type',
  NameChanged = 'name changed',
  CategoryChanged = 'category changed',
  PreviousStatus = 'previous status',
  CurrentStatus = 'current status',
}
export enum CopyNameEventDataProperty {
  Type = 'type',
  Source = 'source',
}

export enum CommentingEventDataProperty {
  numberOfOpenChats = '# open chats',
  numberOfChats = '# of chats',
  numberOfComments = '# of comments',
  mentioned = 'mentioned'
}

export enum ControlsExportingType {
  Controls = 'controls',
  Evidences = 'evidences',
  Logs = 'logs',
  TrustServiceCriteria = 'trust service criteria',
}

export const enum FrameworksEventDataPropertyNames {
  SelectedFrameworks = 'selected frameworks',
}

export enum OnBoardingNextDestination {
  Plugins = 'Plugins Market',
  Policy = 'Policy manager',
}

interface PluginNameProperty {
  [PluginEventDataPropertyNames.PluginName]: string;
}

interface PluginCategoriesProperty {
  [PluginEventDataPropertyNames.PluginCategory]: string[];
}

interface PluginNumberOfEvidenceProperty {
  [PluginEventDataPropertyNames.PluginNumberOfEvidences]: number;
}

export interface PluginConnectionUserEventData extends PluginNameProperty, PluginNumberOfEvidenceProperty {
  [PluginEventDataPropertyNames.PluginCategory]: string[];
}

export interface PluginDisconnectUserEventData extends PluginNameProperty, PluginNumberOfEvidenceProperty {
  [PluginEventDataPropertyNames.PluginType]: string;
  [PluginEventDataPropertyNames.PluginCategory]: string[];
}

export interface PluginHowToConnectEventData extends PluginNameProperty, PluginNumberOfEvidenceProperty {
  [PluginEventDataPropertyNames.PluginType]: string;
  [PluginEventDataPropertyNames.PluginConnected]: boolean;
  [PluginEventDataPropertyNames.PluginCategory]: string[];
}

export interface PluginReconnectEventData extends PluginNameProperty, PluginNumberOfEvidenceProperty {
  [PluginEventDataPropertyNames.ChangedField]: string;
  [PluginEventDataPropertyNames.PluginCategory]: string[];
}

export interface PluginInnerTabUserEventData extends PluginCategoriesProperty, PluginNameProperty {
  [PluginEventDataPropertyNames.TabName]: string;
}

export interface PluginViewEvidenceEventData
  extends PluginCategoriesProperty,
    PluginNameProperty,
    PluginNumberOfEvidenceProperty {}

export interface PluginUpdatePermissionEventData
  extends PluginCategoriesProperty,
    PluginNameProperty,
    PluginNumberOfEvidenceProperty {}

export interface PluginSelectOnMarketplaceEventData
  extends PluginCategoriesProperty,
    PluginNameProperty,
    PluginNumberOfEvidenceProperty {
  [PluginEventDataPropertyNames.PluginConnected]: boolean;
}

export interface FrameworksFreezeEventData {
  [FrameworksEventDataPropertyNames.SelectedFrameworks]?: string[];
}

export type ControlEventData = {
  [ControlEventDataProperty.ControlCategory]?: string | string[];
  [ControlEventDataProperty.FrameworkName]?: string;
  [ControlEventDataProperty.ControlStatus]?: string | string[];
  [ControlEventDataProperty.ControlName]?: string | string[];
  [ControlEventDataProperty.ControlsCount]?: number;
  [ControlEventDataProperty.FilterApplied]?: string[];
  [ControlEventDataProperty.ControlExportingType]?: ControlsExportingType;
  [ControlEventDataProperty.NameChanged]?: boolean;
  [ControlEventDataProperty.CategoryChanged]?: boolean;
  [ControlEventDataProperty.PreviousStatus]?: string;
  [ControlEventDataProperty.CurrentStatus]?: string;
};

export type CommentingEventData = {
  [CommentingEventDataProperty.numberOfOpenChats]: number;
  [CommentingEventDataProperty.mentioned]: 'yes' | 'no';
};

export type UserEventDataTypeMapping = {
  [UserEvents.LOGIN]: void;
  [UserEvents.LOGOUT]: void;
  [UserEvents.PAGEVIEW]: PageviewEventData;
  [UserEvents.INVITE_USER]: InviteUserEventData;
  [UserEvents.MENU]: MenuEventData;
  [UserEvents.COPY_NAME]: CopyNameEventData;
  [UserEvents.ADD_NOTE]: AddNoteEventData;
  [UserEvents.COMMUNITY]: void;

  [UserEvents.FRAMEWORK_REMOVE]: FrameworkEventData;
  [UserEvents.FRAMEWORK_ADD]: FrameworkEventData;
  [UserEvents.FRAMEWORK_OVERVIEW]: FrameworkEventData;
  [UserEvents.FRAMEWORK_EXPLORE_CONTROLS]: FrameworkEventData;
  [UserEvents.FRAMEWORK_SETUP_AUDIT]: FrameworkEventData;
  [UserEvents.FRAMEWORK_EDIT_AUDIT]: FrameworkEventData;
  [UserEvents.FRAMEWORK_RESET_AUDIT]: FrameworkEventData;
  [UserEvents.FRAMEWORK_END_AUDIT]: FrameworkEventData;
  [UserEvents.FRAMEWORK_FREEZE_MODAL]: FrameworksFreezeEventData;
  [UserEvents.FRAMEWORK_CREATE]: void;
  [UserEvents.FRAMEWORK_CREATE_CTU]: void;

  [UserEvents.CONNECT_PLUGIN]: PluginConnectionUserEventData;
  [UserEvents.PLUGIN_DISCONNECT]: PluginDisconnectUserEventData | PluginConnectionUserEventData;
  [UserEvents.PLUGIN_CONNECTION_SUCCEEDED]: PluginConnectionUserEventData;
  [UserEvents.PLUGIN_CONNECTION_FAILED]: PluginConnectionUserEventData;
  [UserEvents.PLUGIN_EDIT_FORM]: PluginConnectionUserEventData;
  [UserEvents.PLUGIN_CANCEL_EDIT_FORM]: PluginConnectionUserEventData;
  [UserEvents.PLUGIN_RUN_ON_DEMAND]: PluginConnectionUserEventData;
  [UserEvents.PLUGINS_INNER_TAB_NAVIGATION]: PluginInnerTabUserEventData;
  [UserEvents.PLUGIN_RECONNECT]: PluginReconnectEventData;
  [UserEvents.PLUGIN_SUGGEST_NEW_PLUGIN]: void;
  [UserEvents.PLUGIN_SELECT_PLUGIN_ON_MARKETPLACE]: PluginSelectOnMarketplaceEventData;
  [UserEvents.PLUGIN_HOW_TO_CONNECT]: PluginHowToConnectEventData;
  [UserEvents.VIEW_EVIDENCE]: PluginViewEvidenceEventData;
  [UserEvents.UPDATE_PERMISSIONS]: PluginUpdatePermissionEventData;

  [UserEvents.EVIDENCE_COLLECTION_SUCCEEDED]: PluginNameProperty;
  [UserEvents.EVIDENCE_COLLECTION_FAILED]: PluginNameProperty;

  [UserEvents.CONTROL_MARK_AS_APPLICABLE]: ControlEventData;
  [UserEvents.CONTROL_MARK_AS_NA]: ControlEventData;
  [UserEvents.CONTROL_CREATE_CONTOL]: ControlEventData;
  [UserEvents.CONTROL_UPDATE_CONTROL]: ControlEventData;
  [UserEvents.CONTROL_UPDATE_CONTROL_STATUS]: ControlEventData;
  [UserEvents.CONTROL_GENERATE_REPORT]: ControlEventData;
  [UserEvents.CONTROL_EXPORT_TO_CSV]: ControlEventData;
  [UserEvents.CONTROL_STATUS_CHANGE]: ControlEventData;
  [UserEvents.CONTROL_SELECT_OWNER]: ControlEventData;

  [UserEvents.ADD_EVIDENCE_SHARED_LINK]: EvidenceEventData;
  [UserEvents.ADD_EVIDENCE_TICKETING]: EvidenceEventData;
  [UserEvents.ADD_EVIDENCE_POLICY]: EvidenceEventData;
  [UserEvents.ADD_EVIDENCE_URL]: EvidenceEventData;
  [UserEvents.ADD_EVIDENCE_FROM_DEVICE]: EvidenceEventData;
  [UserEvents.EXPORT_EVIDENCE_TO_CSV]: EvidenceEventData;
  [UserEvents.VIEW_FULL_DATA]: EvidenceEventData;
  [UserEvents.EVIDENCE_REMOVE]: EvidenceEventData;
  [UserEvents.EVIDENCE_DOWNLOAD]: EvidenceEventData;
  [UserEvents.EVIDENCE_FLAG_HOVER]: EvidenceEventData;
  [UserEvents.EVIDENCE_MARK_FOR_REVIEW]: EvidenceEventData;
  [UserEvents.LINK_EVIDENCE]: EvidenceEventData;
  [UserEvents.EVIDENCE_LINKED]: EvidenceEventData;

  [UserEvents.ADD_NEW_REQUIREMENT]: RequirementEventData;
  [UserEvents.UPDATE_REQUIREMENT]: RequirementEventData;
  [UserEvents.REMOVE_REQUIREMENT]: RequirementEventData;
  [UserEvents.SEND_VIA_SLACK_REQUIREMENT]: RequirementEventData;

  [UserEvents.ONBOARDING_RELEVANT_FRAMEWORKS]: OnboardingEventData;
  [UserEvents.ONBOARDING_ORGANIZATIONS_POLICIES]: OnboardingEventData;
  [UserEvents.ONBOARDING_CHOOSING_PLUGINS]: OnboardingEventData;
  [UserEvents.ONBOARDING_CHOOSING_FILES_POLICIES]: OnboardingEventData;
  [UserEvents.ONBOARDING_GET_STARTED]: void;
  [UserEvents.ONBOARDING_FLOW_ENDED]: void;
  [UserEvents.ONBOARDING_NEXT_STEP]: OnboardingEventData;

  [UserEvents.ResolveAllThreads]: ControlEventDataProperty;
  [UserEvents.DeleteAllResolved]: ControlEventDataProperty;
  [UserEvents.ResolveThread]: ControlEventDataProperty;
  [UserEvents.EditThread]: ControlEventDataProperty;
  [UserEvents.DeleteThread]: ControlEventDataProperty;
  [UserEvents.ActivateThread]: ControlEventDataProperty;
  [UserEvents.DeleteResolvedThread]: ControlEventDataProperty;
  [UserEvents.CreateThread]: ControlEventDataProperty;
  [UserEvents.CreateReply]: ControlEventDataProperty;
  [UserEvents.FilterToActiveThreads]: ControlEventDataProperty;
  [UserEvents.FilterToResolvedThreads]: ControlEventDataProperty;
  [UserEvents.FocusThread]: ControlEventDataProperty;

  // Notifications
  [UserEvents.NOTIFICATION_CLICK]: NotificationEventData;
  [UserEvents.NOTIFICATION_REMOVE]: NotificationEventData;
  [UserEvents.NOTIFICATION_REMOVE_ALL]: NotificationsEventData;

  [UserEvents.FROM_PLUGIN_TO_CONNECTORS]: void;
  [UserEvents.HOW_TO_GUIDE]: void;
  [UserEvents.ADD_CONNECTOR]: void;
  [UserEvents.DOWNLOAD_VM]: void;
  [UserEvents.SELECT_CONNECTOR]: OnPremEventData;
  [UserEvents.REGENERATE_KEY]: OnPremEventData;
  [UserEvents.PLUGIN_NAME_CLICK]: OnPremEventData;
  [UserEvents.VIEW_EVIDENCE_CLICK]: OnPremEventData;
  [UserEvents.TAB_NAVIGATION]: OnPremEventData;
  [UserEvents.CONNECTOR_STATUS_CHANGING]: OnPremEventData;


  // Policy Manager
  [UserEvents.ADD_POLICY]: PolicyManagerEventData;
  [UserEvents.UPDATE_POLICY]: PolicyManagerEventData;
  [UserEvents.REMOVE_POLICY]: PolicyManagerEventData;
  [UserEvents.UPLOAD_FILE]: PolicyManagerEventData;
  [UserEvents.DOWNLOAD_TEMPLATE]: PolicyManagerEventData;
  [UserEvents.LINK_POLICY]: PolicyManagerEventData;
  [UserEvents.CANCEL_APPROVAL]: PolicyManagerEventData;
  [UserEvents.APPROVE_ON_BEHALF]: PolicyManagerEventData;
  [UserEvents.SEND_FOR_APPROVAL]: PolicyManagerEventData;
  [UserEvents.SAVE_POLICY_SETTINGS]: PolicyManagerEventData;
  [UserEvents.POLICY_LINKED]: PolicyManagerEventData;

  // Risk Management
  [UserEvents.ADD_SUPPORTING_DOCUMENT]: RiskManagerEventData;
  [UserEvents.CREATE_RISK]: RiskManagerEventData;
  [UserEvents.EDIT_RISK]: RiskManagerEventData;
  [UserEvents.DELETE_RISK]: RiskManagerEventData;
  [UserEvents.SELECT_OWNER]: RiskManagerEventData;
  [UserEvents.VIEW_CONTROL]: RiskManagerEventData;
  [UserEvents.VIEW_CONTROL]: RiskManagerEventData;
  [UserEvents.DISCONNECT_CONTROL]: RiskManagerEventData;
  [UserEvents.LINK_CONTROL]: RiskManagerEventData;
  [UserEvents.HOW_RISK_LEVEL_IS_CALCULATED]: RiskManagerEventData;
};
