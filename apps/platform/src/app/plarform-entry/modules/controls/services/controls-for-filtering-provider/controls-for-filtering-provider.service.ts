import { Injectable } from '@angular/core';
import { Framework } from 'core/modules/data/models/domain';
import { MANUAL } from 'core/modules/data/constants/evidence';
import { CalculatedControl, CalculatedRequirement } from 'core/modules/data/models';
import { ControlsFacadeService, DataAggregationFacadeService } from 'core/modules/data/services';
import { flattenAndDistinctArrays } from 'core/utils';
import { combineLatest, Observable, of } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { ControlFilterObject } from '../../models';

/**
 * The service that maps controls to models that are more suited for filtering.
 */
@Injectable()
export class ControlsForFilteringProvider {
  constructor(
    private controlsFacade: ControlsFacadeService,
    private dataAggregationFacadeService: DataAggregationFacadeService
  ) {}

  getControlsForFiltering(frameworkId: string, freezeFramework = false): Observable<ControlFilterObject[]> {
    const contrlsByFramework = freezeFramework ? this.controlsFacade.getFreezeControlsByFrameworkId(frameworkId) : this.controlsFacade.getControlsByFrameworkId(frameworkId);
    return contrlsByFramework.pipe(
      switchMap((controls) => {
        if (!controls.length) {
          return of([]);
        }

        return combineLatest(
          controls.map((control) => {
            if (!control.control_calculated_requirements.length) {
              return of(control);
            }

            return this.getRequirementsStream(control, frameworkId).pipe(
              map(
                (requirements) => ({ ...control, control_calculated_requirements: requirements } as ControlFilterObject)
              )
            );
          })
        );
      }),
      debounceTime(500),
      map((controls: ControlFilterObject[]) => {
        controls.forEach((control) => {
          this.fillRelevantAutomatingServices(control);
        });

        return controls;
      })
    );
  }

  getControlsForFilteringAudit(contrlsByFramework: Observable<CalculatedControl[]>, framework: Framework): Observable<ControlFilterObject[]> {
    return contrlsByFramework.pipe(
      map((controls: ControlFilterObject[]) => {
        controls.forEach((control) => {
          control.control_calculated_requirements.map((r) =>
            r.requirement_related_evidences = r.requirement_related_evidences.filter((e) => !(e.evidence.evidence_service_id in framework.framework_excluded_plugins))
          );
          this.fillRelevantAutomatingServices(control);
        });

        return controls;
      })
    );
  }

  private getRequirementsStream(control: CalculatedControl, frameworkId: string): Observable<CalculatedRequirement[]> {
    return combineLatest(
      control.control_calculated_requirements.map((req) => {
        const action = control.is_snapshot ? this.dataAggregationFacadeService.filterRelevantEvidenceByFramework(frameworkId, req.requirement_related_evidences) :
        this.dataAggregationFacadeService.getRelevantEvidence(frameworkId, req.requirement_id);
        return action.pipe(
          map(
            (evidences) =>
              ({
                ...req,
                requirement_related_evidences: evidences,
              } as CalculatedRequirement)
          )
        );
      }) 
    );
  }

  private fillRelevantAutomatingServices(control: ControlFilterObject): void {
    const allDisplayNames = control.control_calculated_requirements.map((r) =>
      r.requirement_related_evidences.filter((e) => e.service_id !== MANUAL).map((e) => e.service_display_name)
    );
    control.relevant_automating_service_display_names = flattenAndDistinctArrays(allDisplayNames);
  }
}
