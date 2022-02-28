import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActionDispatcherService  } from '../../action-dispatcher/action-dispatcher.service';
import { TrackOperations } from '../../operations-tracker/constants/track.operations.list.constant';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AccountFeatureEnum, Customer } from '../../../models/domain';
import { CustomerUpdatedAction, OnBoardCustomer } from '../../../store/actions';
import { CustomerSelectors } from '../../../store/selectors';

@Injectable()
export class CustomerFacadeService {
  private currentCustomerCache: Observable<Customer>;

  constructor(private store: Store, private actionDispatcher: ActionDispatcherService) {
    this.currentCustomerCache = this.store
      .select(CustomerSelectors.SelectCustomerState)
      .pipe(
        filter(customerState => customerState.initialized)
      )
      .pipe(
        map((customerState) => customerState.customer)
      );
  }

  getCurrentCustomer(): Observable<Customer> {
    return this.currentCustomerCache;
  }

  getCurrentCustomerIsOnboarded(): Observable<boolean> {
    return this.getCurrentCustomer().pipe(map((customer) => customer.is_onboarded));
  }

  getCurrentCustomerAccountFeatures(): Observable<AccountFeatureEnum[]> {
    return this.getCurrentCustomer().pipe(map((customer) => customer.account_features));
  }

  markCustomerAsOnboarded(force = false): Promise<void> {
    const action = force ? new CustomerUpdatedAction({ is_onboarded: true }) : new OnBoardCustomer();
    return this.actionDispatcher.dispatchActionAsync(action, TrackOperations.CUSTOMER_UPDATED);
  }
}
