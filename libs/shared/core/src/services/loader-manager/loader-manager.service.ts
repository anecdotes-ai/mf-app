import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class LoaderManagerService {
  private subject = new BehaviorSubject(false);

  constructor() {
    this.loaderStream$ = this.subject.pipe();
  }

  readonly loaderStream$: Observable<boolean>;

  show(): void {
    this.subject.next(true);
  }

  hide(): void {
    this.subject.next(false);
  }
}
