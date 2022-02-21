export interface CommentingResourceModel {
  resourceType?: string;
  resourceId?: string;
  resourceTypeDisplayName?: string;
  resourceDisplayName?: string;
  extraParams?: { [key: string]: string | string[] };
  logData?: any;
}
