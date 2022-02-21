export interface ServiceMetaUpdated {
  service_id: string;
  customer_id: string;
  message: string;
  message_type: string;
  notification_type: string;
  request_id: number;
  service_instance_id: string;
  severity: string;
  timestamp: number;
  uuid_log: string;
}
