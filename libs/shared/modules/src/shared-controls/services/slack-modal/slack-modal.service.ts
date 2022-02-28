import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoadSpecificServiceAction } from 'core/modules/data/store/actions';
import { ServiceSelectors } from 'core/modules/data/store';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ServiceStatusEnum } from 'core/modules/data/models/domain';

export enum CheckSendSlackTaskRequestStatus {
  PROHIBITED,
  ALLOWED,
  INITIAL_REQUEST,
}

@Injectable()
export class SlackModalService {
  private slackModalCache$: Observable<CheckSendSlackTaskRequestStatus>;

  constructor(private store: Store) {
    this.slackModalCache$ = this.store
      .select(ServiceSelectors.SelectServiceState)
      .pipe(
        map((state) => {
          const slackPluginInStore = state.entities['slack'] ? state.entities['slack'].service : null;

          if (slackPluginInStore) {
            return slackPluginInStore.service_status === ServiceStatusEnum.INSTALLED
              ? CheckSendSlackTaskRequestStatus.ALLOWED
              : CheckSendSlackTaskRequestStatus.PROHIBITED;
          } else {
            this.store.dispatch(
              new LoadSpecificServiceAction({ service_id: 'slack' })
            );
            return CheckSendSlackTaskRequestStatus.INITIAL_REQUEST;
          }
        }),
        shareReplay()
      );
  }

  public isSlackModalAllowedToDisplay(): Observable<CheckSendSlackTaskRequestStatus> {
    return this.slackModalCache$;
  }
}
