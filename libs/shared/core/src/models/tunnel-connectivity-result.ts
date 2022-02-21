import { ServiceTypeEnum } from 'core/modules/data/models/domain';

export interface TunnelConnectivityResult {
  service_id: string;
  service_display_name: string;
  status?: boolean;
  service_type: ServiceTypeEnum;
}
