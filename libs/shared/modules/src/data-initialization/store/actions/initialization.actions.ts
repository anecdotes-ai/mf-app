import { Action, createAction } from '@ngrx/store';

export const InitializationActionType = {
  InitApp: '[Initialization] Initialize app',
  AppInitialized: '[Initialization] App initialized',
};

export class InitializeAppAction implements Action {
  readonly type = InitializationActionType.InitApp;
}

export class AppInitializedAction implements Action {
  readonly type = InitializationActionType.AppInitialized;
}

export const InitAdapterActions = {
  appInitialized: createAction(InitializationActionType.AppInitialized),
};
