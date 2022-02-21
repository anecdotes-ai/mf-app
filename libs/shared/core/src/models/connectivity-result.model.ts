import { ServiceStatusEnum, ServiceTypeEnum } from 'core/modules/data/models/domain';

export interface ConnectivityResult {
  service_id: string;
  service_instance_id?: string;
  service_display_name: string;
  status?: boolean;
  service_type: ServiceTypeEnum;
  service_status?: ServiceStatusEnum
}
