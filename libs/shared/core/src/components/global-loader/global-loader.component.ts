import { Component, OnInit } from '@angular/core';
import { LoaderManagerService } from 'core/services';
import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { delay, mapTo } from 'rxjs/operators';

export const LOADING_TIMEOUT = 10000;

@Component({
  selector: 'app-global-loader',
  templateUrl: './global-loader.component.html'
})
export class GlobalLoaderComponent implements OnInit {
  isLoaderDisplayed$: Observable<boolean>;
  isLongLoading$: Observable<boolean>;

  constructor(private loaderManager: LoaderManagerService) {}

  ngOnInit(): void {
    this.isLoaderDisplayed$ = this.loaderManager.loaderStream$;

    this.isLongLoading$ = new Observable((subscriber) => subscriber.next()).pipe(this.delay(), mapTo(true));
  }

  // It's done this way so that we can mock delay operator. It's needed since tests for that component fail in 'karma-parallel' environment.
  delay(): MonoTypeOperatorFunction<boolean> {
    return delay(LOADING_TIMEOUT);
  }

  buildTranslationKey(relativeKey: string): string {
    return `core.globalLoader.${relativeKey}`;
  }
}
