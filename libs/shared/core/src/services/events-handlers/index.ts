import { ConnectivityHandler } from './connectivity/connectivity-handler';
import { CollectionHandler } from './collection/collection-handler';
import { ControlHandler } from './control/control-handler';
import { ControlEditedHandler } from './control-edited/control-edited-handler';
import { ApplicabilityUpdatedHandler } from './applicability-updated/applicability-updated-handler';
import { ControlsHandler } from './controls/controls-handler';
import { ControlRefreshHandler } from './control_refresh/control-refresh-handler';
import { EvidenceHandler } from './evidence/evidence-handler';
import { UserAddedHandler } from './user-added/user-added-handler';
import { UserDeletedHandler } from './user-deleted/user-deleted-handler';
import { ConnectorLogService } from './connector-log/connector-log.service';
import { ServiceMetaUpdatedHandler } from './service-meta-updated/service-meta-updated-handler';
import { EvidenceCollectionHandler } from './evidence-collection/evidence-collection-handler';
import { ApproverUpdatedHandler } from './approver-updated/approver-updated-handler';
import { TunnelConnectivityHandler } from './waiting-for-tunnel/tunnel-connectivity-handler';
import { ControlOwnerChangedHandler } from './control-owner-changed/control-owner-chnaged-handler';
import { FrameworkUpdatedHandler } from './framework-updated/framework-updated-handler';
import { FrameworkAuditEndedHandler } from './framework-audit-ended/framework-audit-ended-handler';
import { NotificationHandler } from './notification/notification-handler';
import { ControlDeletedHandler } from './control-deleted/control-deleted.handler';
import { RiskCreatedHandler } from './risk-created/risk-created.handler';
import { RiskEditedHandler } from './risk-edited/risk-edited.handler';
import { RiskDeletedHandler } from './risk-deleted/risk-deleted.handler';
import { RiskSourceCreatedHandler } from './risk-source-created/risk-source-created.handler';
import { RiskCategoryCreatedHandler } from './risk-category-created/risk-category-created.handler';
import { PolicySettingUpdatedHandler } from './policy-setting-updated/policy-setting-updated-handler';
import { PolicyDeletedHandler } from './policy-deleted/policy-deleted-handler';
import { PolicyEditedHandler } from './policy-edited/policy-edited-handler';
import { PolicyAddedHandler } from './policy-added/policy-added-handler';

export { EventHandler } from './event-handler.interface';
export { eventHandlerToken } from './injection-token';
export const eventHandlers = [
  ControlsHandler,
  ControlHandler,
  EvidenceHandler,
  ControlEditedHandler,
  ConnectivityHandler,
  CollectionHandler,
  ControlRefreshHandler,
  ApplicabilityUpdatedHandler,
  UserAddedHandler,
  UserDeletedHandler,
  ConnectorLogService,
  ServiceMetaUpdatedHandler,
  EvidenceCollectionHandler,
  ApproverUpdatedHandler,
  TunnelConnectivityHandler,
  ControlOwnerChangedHandler,
  FrameworkUpdatedHandler,
  FrameworkAuditEndedHandler,
  NotificationHandler,
  ControlDeletedHandler,
  RiskCreatedHandler,
  RiskEditedHandler,
  RiskDeletedHandler,
  RiskSourceCreatedHandler,
  RiskCategoryCreatedHandler,
  PolicySettingUpdatedHandler,
  PolicyDeletedHandler,
  PolicyEditedHandler,
  PolicyAddedHandler
];
