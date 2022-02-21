import { Injectable } from '@angular/core';
import {
  CalculatedControl,
  CalculatedRequirement,
  EvidenceLike,
  FrameworkReference
} from '../../../models';
import { Control, EvidenceInstance, Framework } from '../../../models/domain';
import { ControlsFacadeService } from '../controls-facade/controls-facade.service';
import { FrameworksFacadeService } from '../frameworks-facade/frameworks-facade.service';
import { RequirementsFacadeService } from '../requirements-facade/requirements-facade.service';
import { groupBy, toDictionary } from 'core/utils';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { EvidenceFacadeService } from '../evidences-facade/evidences-facade.service';
import { PoliciesFacadeService } from '../policies-facade/policies-facade.service';

@Injectable()
export class DataAggregationFacadeService {
  constructor(
    private requirementFacade: RequirementsFacadeService,
    private controlsFacade: ControlsFacadeService,
    private frameworksFacade: FrameworksFacadeService,
    private evidenceFacade: EvidenceFacadeService,
    private policyFacade: PoliciesFacadeService
  ) {}

  getPluginRelatedFrameworks(serviceId: string): Observable<Framework[]> {
    return this.frameworksFacade
      .getApplicableFrameworks()
      .pipe(
        map((frameworks) => frameworks.filter((framework) => !(serviceId in framework.framework_excluded_plugins)))
      );
  }

  getEvidenceRelevantForFramework(frameworkId: string): Observable<EvidenceInstance[]> {
    return this.frameworksFacade.getFrameworkById(frameworkId).pipe(
      switchMap((framework) => {
        return this.evidenceFacade
          .getAllCalculatedEvidence()
          .pipe(map((evidences) => this.filterNotRelevantEvidence(framework, evidences)));
      })
    );
  }

  /**
   * Returns evidence that are relevant for the provided framework.
   * Filters out evidence whose services are ignored for the framework.
   * @param framework_id
   * @param requirement_id
   * @returns
   */
  getRelevantEvidence(framework_id: string, requirement_id: string): Observable<EvidenceLike[]> {
    return this.frameworksFacade.getFrameworkById(framework_id).pipe(
      switchMap((framework) => {
        return this.requirementFacade.getRequirement(requirement_id).pipe(
          switchMap((requirement) => {
            if (!requirement) {
              return of([]);
            }
            const idsSet = new Set([
              ...requirement.requirement_evidence_ids,
              ...requirement.requirement_related_policies_ids,
            ]);
            return this.evidenceFacade
              .getEvidenceByIds(Array.from(idsSet))
              .pipe(map((evidences) => this.filterNotRelevantEvidenceLike(framework, evidences)));
          })
        );
      })
    );
  }

  filterRelevantEvidenceByFramework(framework_id: string, evidence: EvidenceLike[]): Observable<EvidenceLike[]> {
    return this.frameworksFacade.getFrameworkById(framework_id).pipe(
      switchMap((framework) => {
        return of(this.filterNotRelevantEvidenceLike(framework, evidence));
      })
    );
  }

  getEvidenceRelatedControls(evidenceId: string): Observable<Control[]> {
    return this.requirementFacade.getRequirementsByEvidenceId(evidenceId).pipe(
      switchMap((requirements) => {
        return this.controlsFacade.getControlsByRequirementIds(
          Array.from(new Set(requirements.map((req) => req.requirement_id)))
        );
      })
    );
  }

  getEvidenceReferences(evidenceId: string): Observable<FrameworkReference[]> {
    return this.evidenceFacade.getEvidence(evidenceId).pipe(
      switchMap((evidence) => {
        return this.requirementFacade.getRequirementsByEvidenceId(evidenceId).pipe(
          switchMap((requirements) => {
            return this.controlsFacade
              .getControlsByRequirementIds(Array.from(new Set(requirements.map((req) => req.requirement_id))))
              .pipe(
                switchMap((controls) => {
                  return this.frameworksFacade
                    .getFrameworksByIds(Array.from(new Set(controls.map((control) => control.control_framework_id))))
                    .pipe(
                      map((frameworks) => {
                        const filteredFrameworks = frameworks.filter(
                          (framework) => this.filterNotRelevantEvidence(framework, [evidence]).length
                        );

                        return this.createControlFrameworks(controls, filteredFrameworks);
                      })
                    );
                })
              );
          })
        );
      })
    );
  }

  getRequirementRelatedFrameworks(requirementId: string): Observable<FrameworkReference[]> {
    return this.requirementFacade.getRequirement(requirementId).pipe(
      switchMap((requirement) => {
        return this.requirementFacade.getControlsByRequirementId(requirement.requirement_id).pipe(
          switchMap((controls) => {
            return this.frameworksFacade
              .getFrameworksByIds(Array.from(new Set(controls.map((control) => control.control_framework_id))))
              .pipe(map((frameworks) => this.createControlFrameworks(controls, frameworks)));
          })
        );
      })
    );
  }

  getRequirementsRelatedControls(relatedRequirementsIds: string[]): Observable<CalculatedControl[]> {
    const reqsRelatedControlsIds: Observable<CalculatedControl[]>[] = relatedRequirementsIds.map((reqId) =>
      this.requirementFacade.getControlsByRequirementId(reqId)
    );
    return combineLatest(reqsRelatedControlsIds).pipe(
      map((controlIdsArrays: CalculatedControl[][]) => this.getControlsIds(controlIdsArrays))
    );
  }

  getPolicyReferences(policyId: string): Observable<FrameworkReference[]> {
    return this.policyFacade.getPolicy(policyId).pipe(
      switchMap((policy) => {
        return this.requirementFacade.getRequirementsByPolicyId(policyId).pipe(
          switchMap((requirements) => {
            return this.controlsFacade
              .getControlsByRequirementIds(Array.from(new Set(requirements.map((req) => req.requirement_id))))
              .pipe(
                switchMap((controls) => {
                  return this.frameworksFacade
                    .getFrameworksByIds(Array.from(new Set(controls.map((control) => control.control_framework_id))))
                    .pipe(
                      map((frameworks) => {
                        const filteredFrameworks = frameworks.filter(
                          (framework) => this.filterNotRelevantEvidence(framework, [policy?.evidence]).length
                        );

                        return this.createControlFrameworks(controls, filteredFrameworks);
                      })
                    );
                })
              );
          })
        );
      })
    );
  }

  getPolicyRelatedControls(policyId: string): Observable<CalculatedControl[]> {
    return this.getPolicyReferences(policyId).pipe(
      map((refs) => {
        return refs.reduce((result, ref) => [...result, ...ref.controls], []);
      })
    );
  }

  private createControlFrameworks(controls: CalculatedControl[], frameworks: Framework[]): FrameworkReference[] {
    const indexed = toDictionary(
      groupBy(controls, (control) => control.control_framework_id),
      (group) => group.key,
      (group) => group.values
    );

    return frameworks.map((framework) => {
      return {
        framework: framework,
        controls: indexed[framework.framework_id],
      } as FrameworkReference;
    });
  }

  private getControlsIds(controls: CalculatedControl[][]): CalculatedControl[] {
    let resultControls: CalculatedControl[] = [];
    controls.forEach((controlIdsArray) => {
      resultControls = [...resultControls, ...controlIdsArray];
    });
    return resultControls;
  }

  private filterNotRelevantEvidence(framework: Framework, evidences: EvidenceInstance[]): EvidenceInstance[] {
    const frameworksExcludedPluginsSet = new Set(Object.keys(framework.framework_excluded_plugins));

    return evidences.filter((e) => e && !frameworksExcludedPluginsSet.has(e.evidence_service_id));
  }

  private filterNotRelevantEvidenceLike(framework: Framework, evidences: EvidenceLike[]): EvidenceLike[] {
    const frameworksExcludedPluginsSet = new Set(Object.keys(framework.framework_excluded_plugins));

    return evidences.filter((e) => !frameworksExcludedPluginsSet.has(e.evidence.evidence_service_id));
  }
}
