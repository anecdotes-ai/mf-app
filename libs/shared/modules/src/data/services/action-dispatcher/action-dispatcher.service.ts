import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { OperationsTrackerService } from '../operations-tracker/operations-tracker.service';

@Injectable()
export class ActionDispatcherService {
  constructor(private store: Store, private operationsTrackerService: OperationsTrackerService) { }

  /**
   * Helper method that dispatches provided action and waits
   * until this action completly done using operation tracker service
   */
  async dispatchActionAsync(action: Action, operationId: string, operationPartition?: string): Promise<any> {
    const delayedResponse = this.operationsTrackerService.getOperationData(operationId, operationPartition).toPromise();

    this.store.dispatch(action);
    return delayedResponse;
  }
}
