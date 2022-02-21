export enum PolicySettingsModalEnum {
  Owner = 'owner',
  Reviewers = 'reviewers',
  Approvers = 'approvers',
  Scheduling = 'scheduling',
  Success = 'Success-item',
  Error = 'Error-item',
}

export const PolicySettingModalInputKeys = {
  stage: 'stage',
  step: 'currentStep'
};

export enum ApproveOnBehalfEnum {
  approve = 'approve',
  Success = 'Success-item',
  Error = 'Error-item',
}

export enum SendForApproval {
  Share = 'share',
  Shared = 'shared',
  ReShare = 'reshare',
  Error = 'error'
}

