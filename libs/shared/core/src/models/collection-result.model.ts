export interface CollectionResult {
  service_id: string;
  service_instance_id?: string;
  service_name: string;
  status?: boolean;
  total_evidence?: number;
  collected_evidence?: number;
  collected_evidence_ids?: string[];
  policies_ids?: Array<string>;
}
