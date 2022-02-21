// *** GENERIC DICT BUILD HELPER ***

import { Control, EvidenceInstance } from '../models/domain';

export function selectId<T>(entity: T, idProp: string): string {
  return entity ? entity[idProp] : undefined;
}

export function createEntityToEntityMapping<T>(
  mappedEntityId: string, // which entity we want to map to this entities list
  entities: T[],
  entitySelectedIdFunc: () => string,
  result?: { [key: string]: string[] }
): { [key: string]: string[] } {
  if (!result) {
    result = {};
  }

  // every requirement can be mapped to several controls
  entities?.forEach((entity) => {
    const key = entity[entitySelectedIdFunc()];
    if (key in result) {
      // we dont want any dupes here..
      result[key].push(mappedEntityId);
      result[key] = [...new Set(result[key])];
    } else {
      result[key] = [mappedEntityId];
    }
  });

  return result;
}

// ** CONTROLS **

export function selectControlId(c: Control): string {
  return selectId(c, 'control_id');
}

export function createControlFrameworkMapping(framework_id: string, controls: Control[]): { [key: string]: string } {
  const result = {};

  controls?.forEach((c) => {
    result[selectControlId(c)] = framework_id;
  });

  return result;
}

// ** EVIDENCE **

export function selectEvidenceId(evidence: EvidenceInstance): string {
  return selectId(evidence, 'evidence_id');
}

// ** REQUIREMENT **

export function selectRequirementId(entity: any): string {
  return selectId(entity, 'requirement_id');
}
