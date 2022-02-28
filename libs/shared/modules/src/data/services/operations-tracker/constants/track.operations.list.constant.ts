export const enum TrackOperations {
  SEND_SLACK_TASK = 'send-slack-task',
  TOGGLE_REQ_APPLICABILITY = 'toggle-req-applicability',
  CHANGE_REQ_APPROVAL = 'change-req-approval',
  REQ_REMOVED = 'req-removed',

  EVIDENCE_IGNORENCE = 'evidence-ignorence',
  EVIDENCE_REMOVE_LINK = 'evidence-remove-link',

  CREATE_USER = 'create-user',
  REMOVE_USER = 'remove-user',
  UPDATE_USER = 'update-user',

  ADD_CUSTOM_CONTROL = 'add-custom-control',
  UPDATE_CUSTOM_CONTOL = 'update-custom-control',
  UPDATE_CUSTOM_CONTROL_STATUS = 'update-custom-control-status',
  UPDATE_CONTROL_OWNER = 'update-control-owner',

  CHANGE_CONTROLS_APPLICABILITY = 'change-controls-applicability',

  STARTED_WITH_ANECDOTES_ESSENTIALS = 'started-with-anecdotes-essentials',
  STARTED_WITH_FRAMEWORKS_ADOPTION = 'started-with-frameworks-adoption',

  // Risk
  ADD_RISK = 'add-risk',
  EDIT_RISK = 'edit-risk',
  ATTACH_EVIDENCE_TO_RISK = 'attach-evidence-risk',
  REMOVE_EVIDENCE_FROM_RISK = 'remove-evidence-from-risk',
  DELETE_RISK = 'delete-risk',
  ADD_RISK_CATEGORY = 'add-risk-category',
  EDIT_RISK_CATEGORY = 'edit-risk-category',
  DELETE_RISK_CATEGORY = 'delete-risk-category',
  ADD_RISK_SOURCE = 'add-risk-source',
  EDIT_RISK_SOURCE = 'edit-risk-source',
  DELETE_RISK_SOURCE = 'delete-risk-source',
  
  // Audit
  DELETE_FRAMEWORK_AUDIT ='delete-framework-audit',
  UPDATE_FRAMEWORK_AUDIT_STATUS ='update-framework-audit-status',
  SET_FRAMEWORK_AUDIT ='set-framework-audit',
  UPDATE_FRAMEWORK_AUDIT ='update-framework-audit',
  LOAD_AUDIT_HISTORY = 'load_audit_history',
  FRAMEWORK_AUDIT_ENDED = 'framework-audit-ended',

  LOAD_CONTROLS = 'load_controls',
  RELOAD_CONTROLS = 'reload-controls',
  CUSTOM_CONTROL_REMOVED = 'custom-control-removed',
  UPDATE_CONTROLS = 'update-controls',
  ADD_REQUIREMENT = 'add-requirement',

  PATCH_REQUIREMENT = 'patch-requirement',

  // Requirement Notes
  ADD_REQUIREMENT_NOTE = 'add-requirement-note',
  LOAD_REQUIREMENT_NOTE = 'load-requirement-note',
  UPDATE_REQUIREMENT_NOTE = 'update-requirement-note',
  DELETE_REQUIREMENT_NOTE = 'delete-requirement-note',

  // Policy
  ADD_CUSTOM_POLICY = 'add-custom-policy',
  UPDATE_CUSTOM_POLICY = 'update-custom-policy',
  DELETE_CUSTOM_POLICY = 'delete-custom-policy',

  // Policy Evidence
  ADD_EVIDENCE_POLICY = 'add-evidence-policy',
  UPDATE_EVIDENCE_POLICY = 'update-evidence-policy',
  DELETE_EVIDENCE_POLICY = 'delete-evidence-policy',

  // Requirements Policy Attach
  ATTACH_POLICY_TO_REQUIREMENT = 'attach-policy-to-requiremnet',
  DELETE_POLICY_FROM_REQUIREMENT = 'delete-policy-from-requiremnet',

  // Policy settings
  EDIT_POLICY_SETTINGS = 'edit-policy-settings',
  UPDATE_POLICY_SETTINGS = 'update-policy-settings',

  // Approve on behalf
  APPROVE_ON_BEHALF_UPDATED = 'approve-on-behalf-updated',

  // Customer
  CUSTOMER_UPDATED = 'onboard-customer',

  // Plugin connection
  INSTALL_PLUGIN = 'INSTALL_PLUGIN',
  RECONNECT_PLUGIN = 'RECONNECT_PLUGIN',
  CHANGE_PLUGIN_CONNECTION_STATE = 'CHANGE_PLUGIN_CONNECTION_STATE',
  RUNNING_ON_DEMAND = 'RUNNING_ON_DEMAND',
  DISCONNECT_PLUGIN = 'DISCONNECT_PLUGIN',
  LOAD_SPECIFIC_SERVICE = 'LOAD_SPECIFIC_SERVICE',
  LOAD_SPECIFIC_SERVICE_INSTANCE = 'LOAD_SPECIFIC_SERVICE_INSTANCE',
  LOAD_SPECIFIC_SERVICE_INSTANCE_LOGS = 'LOAD_SPECIFIC_SERVICE_INSTANCE_LOGS',

  // Policy Share
  SHARE_POLICY = 'share-policy',

  // 'Collect evidence' events
  CREATE_EVIDENCE_URL = 'add-evidence-url',
  ADD_EVIDENCE_SHARED_LINK = 'add-evidence-shared-link',
  ADD_EVIDENCE_FROM_TICKET = 'add-evidence-from-ticket',
  ADD_EVIDENCE_FROM_DEVICE = 'add-evidence-from-device',

  // Agent
  ADD_AGENT = 'add-agent',
  REMOVE_AGENT = 'remove-agent',
  ROTATE_AGENT_APIKEY = 'rotate-agent-apikey',
  GET_AGENT_OVA = 'get-agent-ova',
  GET_AGENT_LOGS = 'get-agent-logs',

  // Snapshots
  ADD_CONTROL_SNAPSHOT = 'add-control-snapshot',
  ADD_CONTROLS_SNAPSHOTS = 'add-controls-snapshots',
  ADD_REQUIREMENT_SNAPSHOT = 'add-requirements-snapshots',
  ADD_EVIDENCE_SNAPSHOT = 'add-evidence-snapshots',
  ADD_POLICY_SNAPSHOT = 'add-policies-snapshots',
  ADD_FRAMEWORK_SNAPSHOT = 'add-framework-snapshot',

  // Evidence
  LOAD_EVIDENCE_HISTORY_RUN = 'load-evidence-history-run',
  // Frameworks
  UPDATE_FRAMEWORKS_PLUGINS_EXCLUSION_LIST = 'update-frameworks-plugins-exclusion-list',
  FRAMEWORKS_BATCH_UPDATE = 'frameworks-batch-update',
}
