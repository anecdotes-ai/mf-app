import { Service } from '../../../models/domain';
import { ConnectionFormValueEntity } from './../../../../plugins-connection/store/models/state-entity.model';
export interface InstallPluginRequestBody {
  service: Service;
  /**
   * The object that contains all secrets as fields.
   */
   pending_connection_instances: ConnectionFormValueEntity[];
}

export interface ServiceInstanceRequestEntity {
  service_instance_display_name?: string;
  service_instance_id?: string;
  service_secrets?: { [key: string]: any }
  tunnel_params?: ServiceTunnelParamsRequestEntity;
  service_files_details?: ServiceFilesDetailsRequestEntity[];
}

export interface ServiceFilesDetailsRequestEntity {
  file_id: string;
  file_field_name: string;
}

export interface ServiceTunnelParamsRequestEntity {
  service_agent_id: string;
  service_host: string;
  service_port: string
}
