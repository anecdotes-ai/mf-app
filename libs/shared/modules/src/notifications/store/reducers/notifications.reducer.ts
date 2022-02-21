import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Notification } from '../../models/notification';
import { NotificationAdapterActions } from '../actions';

export interface NotificationsState extends EntityState<Notification> {
  areLoaded: boolean;
}

function selectId(c: Notification): string {
  return c.id;
}

const adapter: EntityAdapter<Notification> = createEntityAdapter<Notification>({
  selectId: selectId,
});

const initialState: NotificationsState = adapter.getInitialState({ areLoaded: false });

const adapterReducer = createReducer(
  initialState,
  on(NotificationAdapterActions.loaded, (state: NotificationsState, action) => {
    const newState = state.areLoaded ? state : { ...state, areLoaded: true };
    return adapter.upsertMany(action.notifications, newState);
  }),
  on(NotificationAdapterActions.updated, (state: NotificationsState, action) => {
    return adapter.updateOne(action, state);
  }),
  on(NotificationAdapterActions.removed, (state: NotificationsState, action) => {
    return action.id ? adapter.removeOne(action.id, state) : adapter.removeAll(state);
  })
);

export function notificationsReducer(state = initialState, action: Action): NotificationsState {
  return adapterReducer(state, action);
}
