export type ResourceStatusEnum = 'NOT_STARTED' | 'PENDING' | 'ON_HOLD' | 'APPROVED' | 'UNDEFINED';
export const ResourceStatusEnum = {
  UNDEFINED: 'UNDEFINED' as ResourceStatusEnum,
  NOTSTARTED: 'NOT_STARTED' as ResourceStatusEnum,
  PENDING: 'PENDING' as ResourceStatusEnum,
  ON_HOLD: 'ON_HOLD' as ResourceStatusEnum,
  APPROVED: 'APPROVED' as ResourceStatusEnum,
};

export const statusTranslateMapping = {
  [ResourceStatusEnum.NOTSTARTED]: 'notSet',
  [ResourceStatusEnum.ON_HOLD]: 'onHold',
  [ResourceStatusEnum.PENDING]: 'pending',
  [ResourceStatusEnum.APPROVED]: 'approved',
};

export enum StatusOrderEnum {
  UNDEFINED = 0,
  NOT_STARTED,
  ON_HOLD,
  PENDING,
  APPROVED
}
