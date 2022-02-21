import { Injectable } from '@angular/core';
import { OperationError } from './operation-error';
import { MessageBusService } from 'core/services/message-bus/message-bus.service';
import { Observable } from 'rxjs';
import { shareReplay, take, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class OperationsTrackerService {
  constructor(private messageHub: MessageBusService) {}

  trackError(operationId: any, error: Error, partition = ''): void {
    this.messageHub.sendMessage(this.buildKey(operationId, partition), error);
  }

  trackSuccess(operationId: any, partition = ''): void {
    this.messageHub.sendMessage(this.buildKey(operationId, partition), null);
  }

  trackSuccessWithData(operationId: any, data: any, partition = ''): void {
    this.messageHub.sendMessage(this.buildKey(operationId, partition), data);
  }

  getOperationStatus(operationId: any, partition = ''): Observable<Error | any> {
    return this.messageHub
      .getObservable(this.buildKey(operationId, partition))
      .pipe(shareReplay(), take(1)) as Observable<Error | null>;
  }

  getOperationData<TData>(operationId: any, partition = ''): Observable<TData> {
    return this.getOperationEvents<TData>(operationId, partition).pipe(take(1), shareReplay());
  }

  getOperationEvents<TData>(operationId: any, partition = ''): Observable<TData> {
    return this.messageHub.getObservable(this.buildKey(operationId, partition)).pipe(
      tap((data) => {
        if (data instanceof HttpErrorResponse) {
          throw new OperationError(operationId, data.error, data.status);
        } else if (data instanceof Error) {
          throw new OperationError(operationId, null, 500);
        }
      }),
      shareReplay()
    ) as Observable<TData>;
  }

  private buildKey(operationId: any, partition: string): string {
    if (partition) {
      return `${partition}-${operationId}`;
    }

    return operationId;
  }
}
