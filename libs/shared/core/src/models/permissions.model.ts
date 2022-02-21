export interface Permissions {
  service_id: string;
  notes: string;
  fields: { [key: string]: string[] };
}
