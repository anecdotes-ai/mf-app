import { Service } from 'core/modules/data/models/domain';

export interface ConnectedPluginsData extends Service {
  service_id: string;
  service_number_of_evidence: number;
  service_icon?: string;
  service_route?: string;
}
