import { Injectable } from '@angular/core';
import { createSortCallback } from 'core/utils';
import { MANUAL } from '../../../constants';
import { CalculatedControl, CalculatedRequirement, EvidenceLike } from '../../../models';
import { Control, EvidenceStatusEnum, EvidenceTypeEnum } from '../../../models/domain';

@Injectable()
export class ControlCalculationService {
  calculateControl(control: Control, controlRelatedRequirements: CalculatedRequirement[]): CalculatedControl {
    const extendedControl = {
      ...control,
      control_calculated_requirements: controlRelatedRequirements,
    } as CalculatedControl;
    return this.extendEvidenceRelatedProperties(extendedControl, controlRelatedRequirements);
  }

  private extendEvidenceRelatedProperties(
    extendedControl: CalculatedControl,
    requirements: CalculatedRequirement[]
  ): CalculatedControl {
    let numberOfRequirementsCollected = 0;
    let collectedApplicableEvidence = [] as EvidenceLike[];

    const controlApplicableRequirements = requirements.filter((requirement) => requirement.requirement_applicability);

    extendedControl.control_requirements_names = '';
    extendedControl.control_evidence_names = '';

    controlApplicableRequirements.forEach((requirement) => {
      // find all applicable evidence in the requiement
      const requirementApplicableEvidence = requirement.requirement_related_evidences.filter(
        (evidence) => evidence.is_applicable
      );

      extendedControl.control_requirements_names = extendedControl.control_requirements_names.concat(
        requirement.requirement_name
      );
      const evidenceNames = requirementApplicableEvidence.map((evidence) => evidence.name)?.join(' ');
      extendedControl.control_evidence_names = extendedControl.control_evidence_names.concat(evidenceNames);
      // if we have at least one applicable evidence here, count this requirement as collected and try updating evidence status of this requirement
      if (requirementApplicableEvidence.length > 0) {
        ++numberOfRequirementsCollected;
        extendedControl.control_any_marked_evidence = this.areAnyMarked(extendedControl, requirementApplicableEvidence);
        extendedControl.control_any_new_evidence = this.areAnyNew(extendedControl, requirementApplicableEvidence);
      }
      collectedApplicableEvidence = collectedApplicableEvidence.concat(requirementApplicableEvidence);
    });
    // removed duplicates
    collectedApplicableEvidence = [
      ...new Map(collectedApplicableEvidence.map((evidence) => [evidence.id, evidence])).values(),
    ];

    // extend control with the calculated properties
    extendedControl.control_number_of_total_evidence_collected = collectedApplicableEvidence.length;
    extendedControl.control_number_of_requirements_collected = numberOfRequirementsCollected;
    extendedControl.automating_services_display_name = [
      ...new Set(collectedApplicableEvidence.map((evidence) => evidence.service_display_name)),
    ].filter((service) => service !== MANUAL);
    // all evidence that are automated and manually created
    extendedControl.control_collected_all_applicable_evidence_ids = collectedApplicableEvidence
      .map((evidence) => evidence.id);
    extendedControl.control_has_all_evidence_collected =
      extendedControl.control_collected_all_applicable_evidence_ids.length > 0;
    // save the ids of evidences that are automated as well
    extendedControl.control_collected_automated_applicable_evidence_ids = collectedApplicableEvidence
      .filter((evidence) => evidence.type !== EvidenceTypeEnum.MANUAL)
      .map((evidence) => evidence.id);
    extendedControl.control_has_automated_evidence_collected =
      extendedControl.control_collected_automated_applicable_evidence_ids.length > 0;

    extendedControl.automating_services_ids = [
      ...new Set(
        collectedApplicableEvidence
          .filter((evidence) => evidence.service_id !== MANUAL)
          .map((evidence) => evidence.service_id)
      ),
    ];

    extendedControl.control_number_of_requirements = controlApplicableRequirements.length;
    extendedControl.control_number_of_missing_evidence =
      extendedControl.control_number_of_requirements - extendedControl.control_number_of_requirements_collected;

    extendedControl.control_calculated_requirements = this.sortRequirements(
      extendedControl.control_calculated_requirements
    );

    extendedControl.control_is_gapped = requirements.some(
      cr => cr.requirement_related_evidences?.some(
        e => e.evidence?.evidence_gap?.length && e.evidence?.evidence_is_applicable
      )
    );

    return extendedControl;
  }

  private sortRequirements(notSortedRequirements: CalculatedRequirement[]): CalculatedRequirement[] {
    return notSortedRequirements.sort(createSortCallback((req) => req.requirement_name?.toLocaleLowerCase()));
  }

  private areAnyNew(extendedControl: CalculatedControl, evidence: EvidenceLike[]): boolean {
    return extendedControl.control_any_new_evidence
      ? extendedControl.control_any_new_evidence
      : evidence.some((e) => e.status === EvidenceStatusEnum.NEW);
  }

  private areAnyMarked(extendedControl: CalculatedControl, evidence: EvidenceLike[]): boolean {
    return extendedControl.control_any_marked_evidence
      ? extendedControl.control_any_marked_evidence
      : evidence.some((e) => e.status === EvidenceStatusEnum.NOTMITIGATED);
  }
}
