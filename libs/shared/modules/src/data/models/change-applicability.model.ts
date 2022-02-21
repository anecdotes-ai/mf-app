export interface ChangeApplicability {
  applicability_id: string;
  applicability_type: ApplicabilityTypes;
  is_applicable: boolean;
}

export enum ApplicabilityTypes {
  CONTROL = 'CONTROL',
  EVIDENCE = 'EVIDENCE',
  REQUIREMENT = 'REQUIREMENT',
  FRAMEWORK = 'FRAMEWORK',
  ONBOARDING = 'ONBOARDING'
}
