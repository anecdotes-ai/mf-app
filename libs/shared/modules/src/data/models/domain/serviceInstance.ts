import { ServiceStatusEnum } from './service-enums';

export interface ServiceInstance {
    service_status: ServiceStatusEnum;
    /* The unique service identifier */
    service_id: string;
    /* The unique service instance identifier */
    service_instance_id: string;
    /* The instance display name */
    service_instance_display_name?: string;
}
