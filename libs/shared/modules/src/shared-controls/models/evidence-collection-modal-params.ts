export interface EvidenceUploadingParams {
  targetResource?: EvidenceTargetResource;
  frameworkId?: string;
  controlId?: string;
}

export interface EvidenceTargetResource {
  resourceId: string;
  resourceType: string;
}

export enum EvidenceCollectionTypeEnum {
  FROM_DEVICE = 'from device',
  SHARED_LINK = 'shared link',
  TICKETING = 'ticketing',
  POLICY = 'policy',
  URL = 'url',
  EVIDENCE_POOL = 'evidence pool',
}

export interface EvidenceCreationModalParams extends EvidenceUploadingParams {
  serviceIds?: string[];
  entityPath: string[];
}
