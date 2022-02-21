import { MonoTypeOperatorFunction, pipe, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class SubscriptionDetacher {
  private detach$: Subject<boolean> = new Subject<boolean>();

  takeUntilDetach<T>(): MonoTypeOperatorFunction<T> {
    return pipe(takeUntil(this.detach$));
  }

  detach(complete = true): void {
    this.detach$.next(true);
    if (complete) {
      this.detach$.complete();
    }
  }
}
