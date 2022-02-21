import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, EMPTY, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, mergeMap, shareReplay, switchMap, tap } from 'rxjs/operators';
import { EvidenceCalculatedAction } from '../../actions';
import { State } from '../../state';
import { CalculatedEvidence } from './../../../models/calculated-evidence.model';
import { LoggerService } from 'core/services/logger/logger.service';

@Injectable()
export class EvidenceCalculationEffects {
  constructor(private store: Store<State>, private loggerService: LoggerService) {}

  @Effect({ dispatch: false })
  calculateEvidence = of({ streamsDictionary: {}, streams: [] }).pipe(
    switchMap((streamsStore) => {
      return this.store
        .select((x) => x.evidencesState.areLoaded)
        .pipe(
          filter((areLoaded) => areLoaded),
          switchMap((areLoaded) => this.store.select((x) => x.evidencesState.evidences.ids)),
          debounceTime(300),
          map((evidenceIds) => {
            if (!evidenceIds.length) {
              this.store.dispatch(new EvidenceCalculatedAction([]));
            }
            const oldStreamsDictionary = streamsStore.streamsDictionary;
            streamsStore.streamsDictionary = {};

            evidenceIds?.forEach((evidenceId) => {
              // reuses requirement stream if it already created, else creates a new stream
              streamsStore.streamsDictionary[evidenceId] =
                oldStreamsDictionary[evidenceId] || this.getEvidenceFromStore(evidenceId);
            });

            return streamsStore;
          }),
          mergeMap((s) => combineLatest(Object.values(s.streamsDictionary) as [])),
          debounceTime(100),
          tap((calculatedEvidence) => {
            this.store.dispatch(new EvidenceCalculatedAction(calculatedEvidence));
          })
        );
    }),
    catchError((err) => {
      this.loggerService.error(err);
      return EMPTY;
    })
  );

  private getEvidenceFromStore(evidenceId: string): Observable<CalculatedEvidence> {
    return combineLatest([
      this.store.select((x) => x.calculationState.calculatedControls.entities),
      this.store.select((x) => x.evidencesState.evidences.entities[evidenceId]),
    ]).pipe(
      map(([controlsDict, evidence]) => {
        const evidenceCalculated: CalculatedEvidence = { ...evidence };
        const controls = Object.values(controlsDict);

        if (controls.length) {
          let evidenceRelatedFrameworkNames = {};

          const foundControls = Object.values(controlsDict).filter((c) => {
            const evidenceExists = c.control_collected_all_applicable_evidence_ids.includes(evidenceId);
            if (!evidenceExists) {
              return false;
            }

            Object.keys(c.control_related_frameworks_names).forEach((key) => {
              evidenceRelatedFrameworkNames[key] = c.control_related_frameworks_names[key];
            });
            return true;
          });

          // Instead of find(), we need all controls for evidence_related_framework_names
          const foundControl = foundControls?.length > 0 ? foundControls[0] : undefined;
          if (foundControl) {
            evidenceCalculated.related_control = foundControl;
            evidenceCalculated.related_requirement = foundControl.control_calculated_requirements.find((req) =>
              req.requirement_related_evidences.find(
                (evidenceLike) => evidenceLike.evidence.evidence_id === evidenceCalculated.evidence_id
              )
            );
          }
          evidenceCalculated.related_controls = foundControls;
          evidenceCalculated.evidence_related_framework_names = evidenceRelatedFrameworkNames;
        }

        return evidenceCalculated;
      }),
      distinctUntilChanged((prev, curr) => {
        if (prev !== curr) {
          return false;
        }

        return true;
      }),
      shareReplay()
    );
  }
}
