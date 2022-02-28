import { EndpointsConfiguration } from 'core';

export const endpoints: EndpointsConfiguration = {
  getAllRisks: '/risk',
  addRisk: '/risk',
  getRiskById: '/risk/{{risk_id}}',
  editRisk: '/risk/{{risk_id}}',
  deleteRisk: '/risk/{{risk_id}}',
  attachEvidenceToRisk: '/risk/{{risk_id}}/evidence',
  getAllRiskCategories: '/risk_category',
  addRiskCategory: '/risk_category',
  getRiskCategoryById: '/risk_category/{{risk_category_id}}',
  deleteRiskCategory: '/risk_category/{{risk_category_id}}',
  getAllRiskSources: '/risk_source',
  addRiskSource: '/risk_source',
  getRiskSourceById: '/risk_source/{{risk_source_id}}',
  deleteRiskSource: '/risk_source/{{risk_source_id}}',
  deleteFrameworkAudit: 'framework/{{framework_id}}/audits',
  getFrameworkAuditHistory: 'framework/{{framework_id}}/audits?only_completed={{only_completed}}',
  changeFrameworkAuditStatus: 'framework/{{framework_id}}/audits',
  setFrameworkAudit: 'framework/{{framework_id}}/audits',
  updateFrameworkAudit: 'framework/{{framework_id}}/audits',
  getControls: '/control',
  getControlsByFramework: '/control?framework_id={{framework_id}}',
  getControl: '/control/{{control_id}}',
  addCustomControl: '/control?control_framework={{control_framework}}',
  updateCustomControl: '/control/{{control_id}}',
  patchControl: '/control/{{control_id}}',
  removeCustomControl: '/control/{{control_id}}',
  getEvidences: '/evidence',
  getEvidencesFullData: '/evidence/{{evidence_instance_id}}/full_data',
  getEvidencePreview: '/evidence/{{evidence_instance_id}}/preview',
  getEvidenceSnapshots: '/evidence/{{evidence_id}}/history',
  getEvidenceRunHistory: '/evidence/{{evidence_id}}/run_history',
  uploadEvidence: '/evidence',
  getEvidenceSnapshotsFromDate: '/evidence/{{evidence_id}}/history?from_date={{date}}',
  getEvidenceRunHistoryFromDate: '/evidence/{{evidence_id}}/run_history?from_date={{date}}',
  downloadEvidence: '/evidence/{{evidence_instance_id}}/raw',
  downloadEvidenceSignedUrl: '/evidence/{{evidence_instance_id}}/download_raw',
  downloadAllEvidences: '/framework/{{framework_id}}/evidences',
  downloadLogs: '/service/logs',
  setEvidenceStatus: '/evidence/{{evidence_id}}',
  addEvidence: '/evidence',
  getAllServices: '/service',
  installService: '/service',
  reconnectService: '/service/{{service_id}}/secrets?service_instance_id={{service_instance_id}}',
  getSpecificService: '/service/{{service_id}}',
  getSpecificServiceInstance: '/service/{{service_id}}?service_instance_id={{service_instance_id}}',
  deleteService: '/service/{{service_id}}',
  deleteServiceInstance: '/service/{{service_id}}?service_instance_ids={{service_instance_ids}}',
  getServiceMetadata: '/service/metadata/{{service_id}}?service_instance_id={{service_instance_id}}',
  getAvailableServices: '/service/{{control_id}}/{{requirement}}',
  getServiceLogs: '/service/{{service_id}}/logs',
  getServiceInstanceLogs: '/service/{{service_id}}/logs?service_instance_ids={{service_instance_ids}}',
  createServiceTask: '/service/{{service_id}}/tasks',
  changeApplicability: '/applicability',
  frameworkChangeApplicability: 'framework/{{framework_id}}/applicability',
  getAllFrameworks: '/framework',
  getSpecificFramework: '/framework/{{framework_id}}',
  patchFramework: '/framework/{{framework_id}}',
  frameworkUpdatePluginsExclusionList: '/framework/{{framework_id}}/plugins',
  getAllUsers: '/user',
  removeSpecificUser: '/user/{{user_email}}',
  userUpdated: '/user/{{user_email}}',
  createNewUser: '/user',
  getRequirements: '/requirement',
  addRequirementEvidence: '/requirement/{{resource_id}}/evidence',
  deleteRequirementEvidence: '/requirement/{{resource_id}}/evidence/{{evidence_id}}',
  updateRequirementEvidence: '/requirement/{{resource_id}}/evidence/{{evidence_id}}',
  removeRequirement: '/requirement/{{requirement_id}}',
  addRequirement: '/requirement',
  patchRequirement: '/requirement/{{requirement_id}}',
  addPolicyToRequirement: '/requirement/{{requirement_id}}/policies/{{policy_id}}',
  deletePolicyFromRequirement: '/requirement/{{requirement_id}}/policies/{{policy_id}}',
  getCustomer: '/customer',
  onBoardCustomer: '/applicability',
  getTenant: '/tenant?tenant_subdomain={{tenant_subdomain}}',
  getPolicies: '/policies',
  getPolicy: '/policies/{{policy_id}}',
  addPolicy: '/policies',
  deletePolicy: '/policies/{{policy_id}}',
  editPolicy: '/policies/{{policy_id}}',
  sharePolicy: '/policies/{{policy_id}}/share',
  deletePolicyEvidence: '/policies/{{resource_id}}/evidence',
  addPolicyEvidence: '/policies/{{resource_id}}/evidence',
  updatePolicyEvidence: '/policies/{{resource_id}}/evidence',
  downalodPolicyTemplate: '/policies/{{policy_id}}/template',
  approvePolicy: '/policies/{{policy_id}}/approvers',
  approveOnBehalf: '/policies/{{policy_id}}/approve-behalf',
  addServiceToFavourites: '/service/{{service_id}}/favorite',
  removeServiceFromFavourites: '/service/{{service_id}}/favorite',
  notes: '/{{resource_type}}/{{resource_id}}/notes',
  editPolicySettings: '/policies/{{policy_id}}/settings',
  getAgents: '/agents',
  removeAgent: '/agents/{{agent_id}}',
  addAgent: '/agents',
  getAgentsOVA: '/agents/ova',
  rotateAgentsApiKey: '/agents/{{agent_id}}/apikey',
  getAgentsLogs: '/agents/{{agent_id}}/logs',
  getEvidenceInstances: '/evidence-instance',
};
