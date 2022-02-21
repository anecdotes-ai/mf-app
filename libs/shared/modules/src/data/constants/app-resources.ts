import { ResourceType } from '../models';

export const RESOURCE_PATHS = {
  [ResourceType.Requirement]: {
    add: 'addRequirementEvidence',
    update: 'updateRequirementEvidence',
    delete: 'deleteRequirementEvidence',
  },
  [ResourceType.Policy]: {
    add: 'addPolicyEvidence',
    update: 'updatePolicyEvidence',
    delete: 'deletePolicyEvidence',
  },
};
