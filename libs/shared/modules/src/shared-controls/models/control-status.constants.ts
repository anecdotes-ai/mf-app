import { ControlStatusEnum } from 'core/modules/data/models/domain';

export const BGClasses = {
  [ControlStatusEnum.NOTSTARTED]: 'bg-navy-60',
  [ControlStatusEnum.INPROGRESS]: 'bg-orange-50',
  [ControlStatusEnum.READY_FOR_AUDIT]: 'bg-blue-50',
  [ControlStatusEnum.GAP]: 'bg-pink-70',
  [ControlStatusEnum.ISSUE]: 'bg-orange-70',
  [ControlStatusEnum.APPROVED_BY_AUDITOR]: 'bg-blue-70',
  [ControlStatusEnum.MONITORING]: 'bg-navy-80',
};

export const statusesStyle = {
  [ControlStatusEnum.NOTSTARTED]: { color: '#a4b5bf', icon: 'controls-filter/status/not_started' },
  [ControlStatusEnum.INPROGRESS]: { color: '#ffa84f', icon: 'controls-filter/status/in_progress' },
  [ControlStatusEnum.READY_FOR_AUDIT]: { color: '#00DCE8', icon: 'controls-filter/status/ready_for_audit' },
  [ControlStatusEnum.GAP]: { color: '#e00070', icon: 'controls-filter/status/gap' },
  [ControlStatusEnum.ISSUE]: { color: '#e67400', icon: 'controls-filter/status/issue' },
  [ControlStatusEnum.APPROVED_BY_AUDITOR]: { color: '#009fb5', icon: 'controls-filter/status/approved_by_auditor' },
  [ControlStatusEnum.MONITORING]: { color: '#2a495b', icon: 'controls-filter/status/monitoring' },
};


export const statusesKeys = {
  [ControlStatusEnum.NOTSTARTED]: 'notStarted',
  [ControlStatusEnum.INPROGRESS]: 'inProgress',
  [ControlStatusEnum.READY_FOR_AUDIT]: 'readyForAudit',
  [ControlStatusEnum.GAP]: 'gap',
  [ControlStatusEnum.ISSUE]: 'issue',
  [ControlStatusEnum.APPROVED_BY_AUDITOR]: 'approvedByAuditor',
  [ControlStatusEnum.MONITORING]: 'monitoring',
};
