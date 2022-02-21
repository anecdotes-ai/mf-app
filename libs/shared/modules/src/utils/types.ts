export interface StatusBarDefinition {
  count: number;
  cssClass: string;
}

export const ProgressCoverage = {
  basic: { minValue: 0, maxValue: 50 },
  advanced: { minValue: 51, maxValue: 80 },
  superstar: { minValue: 81, maxValue: 100 },
};

export interface LinkedEntity {
  id: string;
  title: string;
}

export interface LinkedEntitiesGroup {
  title: string,
  entities: LinkedEntity[]
}
