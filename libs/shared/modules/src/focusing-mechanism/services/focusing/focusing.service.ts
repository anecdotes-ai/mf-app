import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { FinishFocusingAction, FocusResourcesAction } from '../../store/actions';
import { featureSelector } from '../../store/state';
import { FocusingResourcesMap } from '../../types';

@Injectable()
export class FocusingService {
  constructor(private store: Store<any>) {}

  /** Focuses resources specified in the passed object. @see FocusingResourcesMap */
  focusResources(focusingResourcesMap: FocusingResourcesMap): void {
    this.store.dispatch(FocusResourcesAction({ focusingResourcesMap }));
  }

  /** Focuses single resource */
  focusSingleResource(resourceName: string, resourceId: string): void {
    this.focusResources({ [resourceName]: resourceId });
  }

  /** Manually finishes focusing for a resource name */
  finishFocusing(resourceName: string): void {
    this.store.dispatch(FinishFocusingAction({ resourceName }));
  }

  /** Returns stream that emits ID of a resource that should be focused by a resource name */
  getFocusingStreamForResource(resourceName: string): Observable<string> {
    return this.store.select(featureSelector).pipe(
      filter((state) => resourceName in state.focusedResources),
      map((state) => state.focusedResources[resourceName]),
      debounceTime(500),
      distinctUntilChanged()
    );
  }

  /** Returns observable that emits resource id when resource with specified id is focused. In addition, it finishes focusing. */
  getFocusingStreamByResourceId(resourceName: string, resourceId: string): Observable<string> {
    return this.getFocusingStreamForResource(resourceName).pipe(
      filter((resId) => resId === resourceId),
      distinctUntilChanged(),
      tap(() => this.finishFocusing(resourceName))
    );
  }
}
