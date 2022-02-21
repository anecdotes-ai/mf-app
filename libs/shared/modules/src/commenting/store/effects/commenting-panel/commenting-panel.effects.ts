import { ThreadModel, ThreadService } from '@anecdotes/commenting';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { groupBy, toDictionary } from 'core/utils';
import { combineLatest, NEVER } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ThreadViewModel } from '../../../models';
import { createComposedResourceId } from '../../../utils';
import { SetResourceViewModelsAction } from '../../actions';
import { selectIsInitialized, selectResources, selectThreadCreationFor } from '../../selectors';

@Injectable()
export class CommentingPanelEffects {
  constructor(private store: Store, private threadService: ThreadService) {}

  @Effect({ dispatch: false })
  threadViewModels$ = this.store.select(selectIsInitialized).pipe(
    switchMap((isInitialized) => {
      if (isInitialized) {
        return combineLatest([
          this.store.select(selectResources),
          this.threadService.getAll(),
          this.store.select(selectThreadCreationFor),
        ]).pipe(
          tap(([resources, threads, resourceToCreateThreadFor]) => {
            const dictionary = toDictionary(
              groupBy(threads, (t) => createComposedResourceId(t.resourceType, t.resourceId)),
              (group) => group.key,
              (group) => group.values
            );

            const viewModels: ThreadViewModel[] = resources
              .map((resource) => {
                const currentTrackingId = createComposedResourceId(resource.resourceType, resource.resourceId);
                const threads: ThreadModel[] = dictionary[currentTrackingId];
                let result: ThreadViewModel[] = [];

                if (threads) {
                  result = threads.map(
                    (thread) => ({ ...resource, threadState: thread.state, threadId: thread.id } as ThreadViewModel)
                  );
                }

                // With this we can display thread creation placeholder in accordance with order of resources
                // It should append the placeholder after all available threads for a resource
                if (
                  resourceToCreateThreadFor &&
                  currentTrackingId ===
                    createComposedResourceId(
                      resourceToCreateThreadFor.resourceType,
                      resourceToCreateThreadFor.resourceId
                    )
                ) {
                  result = [
                    ...result,
                    {
                      ...resourceToCreateThreadFor,
                      threadId: undefined,
                      isCreation: true,
                    },
                  ];
                }

                return result;
              })
              .reduce((result, array) => [...result, ...array], []);
              
            this.store.dispatch(SetResourceViewModelsAction({ resources: viewModels }));
          })
        );
      }

      return NEVER;
    })
  );
}
