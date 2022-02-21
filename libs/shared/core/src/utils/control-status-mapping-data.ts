import { ControlStatusEnum } from 'core/modules/data/models/domain';

export const ControlStatusMappingData = {
  [ControlStatusEnum.INPROGRESS]: {
    icon: 'status_in_progress',
    ngClass: 'orange-text',
    translationKey: 'controls.status.inProgress',
  },
  [ControlStatusEnum.NOTSTARTED]: {
    icon: 'status_not_started',
    ngClass: 'pink-text',
    translationKey: 'controls.status.notStarted',
  },
  [ControlStatusEnum.COMPLIANT]: {
    icon: 'status_complete',
    ngClass: 'blue-text',
    translationKey: 'controls.status.compliant',
  },
};
