import { Injectable } from '@angular/core';
import { MANUAL } from '../../../constants';
import { createSortCallback, groupBy } from 'core/utils';
import { CalculatedRequirement, convertToEvidenceLike, EvidenceLike, isPolicy } from '../../../models';
import { ControlRequirement, EvidenceInstance, Policy } from '../../../models/domain';

@Injectable()
export class RequirementCalculationService {
  calculateRequirement(
    requirement: ControlRequirement,
    requirementRelatedEvidence: EvidenceInstance[],
    requirementRelatedPolicies: Policy[]
  ): CalculatedRequirement {
    return {
      ...requirement,
      requirement_related_evidences: this.sortEvidence([...requirementRelatedEvidence, ...requirementRelatedPolicies]),
    };
  }

  private sortEvidence(notSortedEvidence: (Policy | EvidenceInstance)[]): EvidenceLike[] {
    if (!notSortedEvidence?.length) {
      return [];
    }

    const notManualEvidence: EvidenceLike[] = [];
    const manualEvidence: EvidenceLike[] = [];

    groupBy(notSortedEvidence, (evidence) => (isPolicy(evidence) ? evidence.evidence : evidence).evidence_service_id)
      .map((group) => ({
        service_id: group.key,
        sortedEvidence: group.values.map(evidence => convertToEvidenceLike(evidence)).sort(createSortCallback((evidence) => evidence.name.toLocaleLowerCase())),
      }))
      .sort(createSortCallback((group) => group.service_id))
      .forEach((group) => {
        if (group.service_id === MANUAL) {
          manualEvidence.push(...group.sortedEvidence);
        } else {
          notManualEvidence.push(...group.sortedEvidence);
        }
      });

    return [...notManualEvidence, ...manualEvidence];
  }
}
