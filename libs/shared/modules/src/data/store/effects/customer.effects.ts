import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { CustomerService, OperationsTrackerService, TrackOperations } from '../../services';
import { CustomerActionType, CustomerLoadedAction, CustomerUpdatedAction, OnBoardCustomer } from '../actions';

@Injectable()
export class CustomerEffects {
  constructor(
    private actions$: Actions,
    private customerService: CustomerService,
    private operationsTrackerService: OperationsTrackerService
  ) {}

  @Effect()
  onBoardCustomer$: Observable<Action> = this.actions$.pipe(
    ofType(CustomerActionType.OnBoardCustomer),
    take(1),
    mergeMap((_: OnBoardCustomer) =>
      this.customerService.onBoardCustomer().pipe(
        switchMap(() => this.customerService.getCustomer()),
        map((updatedCustomer) => new CustomerUpdatedAction(updatedCustomer))
      )
    )
  );

  @Effect({ dispatch: false })
  customerUpdated$: Observable<Action> = this.actions$.pipe(
    ofType(CustomerActionType.CustomerUpdated),
    tap(() => this.operationsTrackerService.trackSuccess(TrackOperations.CUSTOMER_UPDATED)),
    catchError(() => {
      this.operationsTrackerService.trackError(TrackOperations.CUSTOMER_UPDATED, new Error());
      return EMPTY;
    })
  );
}