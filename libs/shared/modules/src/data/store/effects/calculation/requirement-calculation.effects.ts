import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { combineLatest, EMPTY, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { ControlRequirement, EvidenceInstance, Policy } from '../../../models/domain';
import { RequirementCalculationService } from '../../../services';
import { RequirementsCalculatedAction } from '../../actions';
import { State } from '../../state';
import { LoggerService } from 'core/services/logger/logger.service';

@Injectable()
export class RequirementCalculationEffects {
  constructor(private store: Store<State>, private requirementCalculationService: RequirementCalculationService, private loggerService: LoggerService) {}

  @Effect({ dispatch: false })
  calculateRequirements = of({ streamsDictionary: {}, streams: [] }).pipe(
    switchMap((streamsStore) => {
      return this.store
        .select((x) => x.requirementState.controlRequirements.ids)
        .pipe(
          filter((requirementIds) => !!requirementIds.length),
          map((requirementIds) => {
            const oldStreamsDictionary = streamsStore.streamsDictionary;
            streamsStore.streamsDictionary = {};

            requirementIds.forEach((requirement_id) => {
              if (requirement_id in oldStreamsDictionary) {
                streamsStore.streamsDictionary[requirement_id] = oldStreamsDictionary[requirement_id]; // reuses requirement stream if it already created
              } else {
                streamsStore.streamsDictionary[requirement_id] = this.getRequirementFromStore(requirement_id); // creates requirement stream and sets to streams dictionary
              }
            });

            return streamsStore;
          }),
          switchMap((s) => combineLatest(Object.values(s.streamsDictionary) as [])),
          debounceTime(100),
          tap((calculatedRequirements) => {
            this.store.dispatch(new RequirementsCalculatedAction(calculatedRequirements));
          })
        );
    }),
    catchError((err) => {
      this.loggerService.error(err);
      return EMPTY;
    })
  );

  private getRequirementFromStore(requirement_id: string): Observable<any> {
    return combineLatest([
      this.store.select((x) => x.requirementState.controlRequirements.entities[requirement_id]),
      this.store.select((x) => x.evidencesState.evidences.entities),
      this.store.select((x) => x.policyState.policies.entities),
    ]).pipe(
      map(([requirement, evidenceEnities, policiesEntities]) => {
        const newEvidenceEntities: Dictionary<EvidenceInstance> = {};
        const newPoliciesEntities: Dictionary<Policy> = {};

        if (requirement.requirement_evidence_ids) {
          requirement.requirement_evidence_ids.forEach((evidence_id) => {
            if (evidence_id in evidenceEnities) {
              newEvidenceEntities[evidence_id] = evidenceEnities[evidence_id];
            }
          });
        }

        if (requirement.requirement_related_policies_ids) {
          requirement.requirement_related_policies_ids.forEach((policy_id) => {
            if (!!policiesEntities[policy_id]?.evidence) {
              newPoliciesEntities[policy_id] = policiesEntities[policy_id];
            }
          });
        }

        return { requirement, evidenceEntities: newEvidenceEntities, policiesEntities: newPoliciesEntities };
      }),
      filter((curr) => !Object.keys(curr.evidenceEntities).some((key) => !curr.evidenceEntities[key])),
      distinctUntilChanged((prev, curr) => {
        if (prev.requirement !== curr.requirement) {
          return false;
        }

        return this.wereChanges(prev, curr);
      }),
      map((x) =>
        this.requirementCalculationService.calculateRequirement(
          x.requirement,
          Object.values(x.evidenceEntities),
          Object.values(x.policiesEntities)
        )
      ),
      shareReplay()
    );
  }

  private wereChanges(
    prev: {
      requirement: ControlRequirement;
      evidenceEntities: Dictionary<EvidenceInstance>;
      policiesEntities: Dictionary<Policy>;
    },
    curr: {
      requirement: ControlRequirement;
      evidenceEntities: Dictionary<EvidenceInstance>;
      policiesEntities: Dictionary<Policy>;
    }
  ): boolean {
    return (
      // evidence
      prev.requirement.requirement_evidence_ids.length !== curr.requirement.requirement_evidence_ids.length ||
      Object.keys(prev.evidenceEntities).some((key) => prev.evidenceEntities[key] !== curr.evidenceEntities[key]) ||
      // policies
      prev.requirement.requirement_related_policies_ids?.length !== curr.requirement.requirement_related_policies_ids?.length ||
      Object.keys(prev.policiesEntities).some((key) => prev.policiesEntities[key] !== curr.policiesEntities[key])
    );
  }
}
