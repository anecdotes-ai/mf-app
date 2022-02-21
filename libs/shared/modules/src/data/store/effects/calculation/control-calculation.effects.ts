import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { CalculatedControl, CalculatedRequirement, convertToEvidenceLike, ResourceType } from '../../../models';
import { combineLatest, EMPTY, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { ControlCalculationService } from '../../../services';
import { ControlsCalculatedAction } from '../../actions';
import { State } from '../../state';
import { LoggerService } from 'core/services/logger/logger.service';

@Injectable()
export class ControlCalculationEffects {
  constructor(private store: Store<State>, private controlCalculationService: ControlCalculationService, private loggerService: LoggerService) {}

  @Effect({ dispatch: false })
  calculateControls = of({ streamsDictionary: {}, streams: [] }).pipe(
    switchMap((streamsStore) => {
      return this.store
        .select((state) => state.controlsState.anyLoaded)
        .pipe(
          filter((anyLoaded) => anyLoaded),
          debounceTime(80),
          switchMap(() => this.store.select((state) => state.controlsState.controls.ids)),
          map((controlIds) => {
            if (!controlIds.length) {
              this.store.dispatch(new ControlsCalculatedAction([]));
            }
            const oldStreamsDictionary = streamsStore.streamsDictionary;
            streamsStore.streamsDictionary = {};

            controlIds.forEach((control_id) => {
              if (control_id in oldStreamsDictionary) {
                streamsStore.streamsDictionary[control_id] = oldStreamsDictionary[control_id]; // reuses control stream if it already created
              } else {
                streamsStore.streamsDictionary[control_id] = this.getCalculatedControlFromStore(control_id); // creates control stream and sets to streams dictionary
              }
            });

            return streamsStore;
          }),
          switchMap((s) => combineLatest(Object.values(s.streamsDictionary) as [])),
          debounceTime(100),
          tap((calculatedControls) => {
            this.store.dispatch(new ControlsCalculatedAction(calculatedControls));
          })
        );
    }),
    catchError((err) => {
      this.loggerService.error(err);
      return EMPTY;
    })
  );

  private getCalculatedControlFromStore(control_id: string): Observable<CalculatedControl> {
    return combineLatest([
      this.store.select((state) => state.controlsState.controls.entities[control_id]),
      this.store.select((x) => x.calculationState.calculatedRequirements),
      this.store.select((x) => x.calculationState.calculatedEvidences),
      this.store.select((x) => x.calculationState.calculatedPolicies),
    ]).pipe(
      filter(([control, requirementState, _, policyState]) => !!control && !!requirementState.ids.length),
      map(([control, calculatedRequirementsState, evidenceState, policyState]) => {
        if (!control.control_requirement_ids) {
          return { control, requirementEntities: {} };
        }

        const newRequirementEntities: Dictionary<CalculatedRequirement> = {};
        control.control_requirement_ids.forEach((requirement_id) => {
          if (requirement_id in calculatedRequirementsState.entities) {
            newRequirementEntities[requirement_id] = calculatedRequirementsState.entities[requirement_id];
            if (!!evidenceState.ids.length) {
              newRequirementEntities[requirement_id].requirement_related_evidences?.forEach((evidence, index) => {
                newRequirementEntities[requirement_id].requirement_related_evidences[index] = convertToEvidenceLike(
                  evidence.resourceType === ResourceType.Policy ? policyState.entities[evidence.id] : evidenceState.entities[evidence.evidence.evidence_id]
                );
              });
            }
          }
        });
        return { control, requirementEntities: newRequirementEntities };
      }),
      filter((curr) => !Object.keys(curr.requirementEntities).some((key) => !curr.requirementEntities[key])),
      distinctUntilChanged((prev, curr) => {
        if (prev.control !== curr.control) {
          return false;
        }
        if (
          curr.control.control_requirement_ids.length !== prev.control.control_requirement_ids.length ||
          Object.keys(curr.requirementEntities).some(
            (key) => prev.requirementEntities[key] !== curr.requirementEntities[key]
          )
        ) {
          return false;
        }

        return true;
      }),
      map((x) => this.controlCalculationService.calculateControl(x.control, Object.values(x.requirementEntities))),
      shareReplay()
    );
  }
}
