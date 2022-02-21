import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, EMPTY, Observable, of } from 'rxjs';
import { catchError, debounceTime, filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { PolicyCalculationService } from '../../../services';
import { PoliciesCalculatedAction } from '../../actions';
import { State } from '../../state';
import { LoggerService } from 'core/services/logger/logger.service';

@Injectable()
export class PolicyCalculationEffects {
  constructor(private store: Store<State>, private policyCalculationService: PolicyCalculationService, private loggerService: LoggerService) {}

  @Effect({ dispatch: false })
  calculatePolicies = of({ streamsDictionary: {}, streams: [] }).pipe(
    switchMap((streamsStore) => {
      return this.store
        .select((x) => x.policyState.policies.ids)
        .pipe(
          filter((policiesIds) => !!policiesIds.length),
          map((policiesIds) => {
            const oldStreamsDictionary = streamsStore.streamsDictionary;
            streamsStore.streamsDictionary = {};

            policiesIds.forEach((policyId) => {
              streamsStore.streamsDictionary[policyId] =
                oldStreamsDictionary[policyId] || this.getPolicyFromStore(policyId);
            });

            return streamsStore;
          }),
          switchMap((s) => combineLatest(Object.values(s.streamsDictionary) as [])),
          debounceTime(100),
          tap((calculatedPolicies) => {
            this.store.dispatch(new PoliciesCalculatedAction(calculatedPolicies));
          })
        );
    }),
    catchError((err) => {
      this.loggerService.error(err);
      return EMPTY;
    })
  );

  private getPolicyFromStore(policyId: string): Observable<any> {
    return this.store
      .select((x) => x.policyState.policies.entities[policyId])
      .pipe(
        filter((policy) => !!policy),
      map((policy) => this.policyCalculationService.calculatePolicy(policy)),
        shareReplay()
      );
  }
}
