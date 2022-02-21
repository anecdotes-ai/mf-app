export interface SpecificInformationContent {
  icon: string;
  // Current value
  value: number;
  // Maximum value, have to be provided when 'valueTypeToRepresent' is PERCENTAGE or DIVIDE
  maxValue?: number;
  valueTypeToRepresent: SpecificInformationContentValueTypes;
  descriptionTranslateKey: string;
  oneLineContent?: boolean;
  hideIconWrapper?: boolean;
}

export enum SpecificInformationContentValueTypes {
  PERCENTAGE = 'PERCENTAGE',
  DIVIDE = 'DIVIDE',
  NUMBER = 'NUMBER',
  DOLLAR = 'DOLLAR',
}
