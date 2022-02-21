export type ServiceStatusEnum =
  | 'SERVICE_INSTALLING'
  | 'SERVICE_INSTALLED'
  | 'SERVICE_INSTALLATION_FAILED'
  | 'SERVICE_CONNECTIVITY_FAILED'
  | 'SERVICE_REMOVED'
  | 'SERVICE_FETCHED';
export const ServiceStatusEnum = {
  INSTALLING: 'SERVICE_INSTALLING' as ServiceStatusEnum,
  INSTALLED: 'SERVICE_INSTALLED' as ServiceStatusEnum,
  INSTALLATIONFAILED: 'SERVICE_INSTALLATION_FAILED' as ServiceStatusEnum,
  CONNECTIVITYFAILED: 'SERVICE_CONNECTIVITY_FAILED' as ServiceStatusEnum,
  REMOVED: 'SERVICE_REMOVED' as ServiceStatusEnum,
  FETCHED: 'SERVICE_FETCHED' as ServiceStatusEnum,
};
export type ServiceAuthTypeEnum = 'OAUTH' | 'ACCESSTOKEN' | 'SERVICEACCOUNT';
export const ServiceAuthTypeEnum = {
  OAUTH: 'OAUTH' as ServiceAuthTypeEnum,
  ACCESSTOKEN: 'ACCESSTOKEN' as ServiceAuthTypeEnum,
  SERVICEACCOUNT: 'SERVICEACCOUNT' as ServiceAuthTypeEnum,
};
export type ServiceAvailabilityStatusEnum = 'COMINGSOON' | 'AVAILABLE';
export const ServiceAvailabilityStatusEnum = {
  COMINGSOON: 'COMINGSOON' as ServiceAvailabilityStatusEnum,
  AVAILABLE: 'AVAILABLE' as ServiceAvailabilityStatusEnum,
};
export type ServiceTypeEnum = 'FILEMONITOR' | 'GENERIC' | 'COLLABORATION' | 'TICKETING';
export const ServiceTypeEnum = {
  FILEMONITOR: 'FILEMONITOR' as ServiceTypeEnum,
  GENERIC: 'GENERIC' as ServiceTypeEnum,
  COLLABORATION: 'COLLABORATION' as ServiceTypeEnum,
  TICKETING: 'TICKETING' as ServiceTypeEnum,
};