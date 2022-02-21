import { selectDashboard } from './dashboard.selectors';
import { selectAllExtendedFrameworks, selectExtendedFramework } from './framework.selectors';
import { selectServices } from './service.selectors';
import { selectPluginNotifications } from './plugin-notification.selectors';
import { selectRequirements } from './requirement.selectors';
import { DefaultProjectorFn, MemoizedSelector, MemoizedSelectorWithProps, select } from '@ngrx/store';
import { Observable, pipe, UnaryFunction } from 'rxjs';
import { filter } from 'rxjs/operators';
import { State } from '../state';
import { CalculatedControl } from '../../models';

// ****** ALL MIGHTY PIPABLE UTILITY FUNCTIONS ******

// *** GENERIC ***

function selectEntitiesAfterInit<Result>(
  selector:
    | MemoizedSelector<State, Result, DefaultProjectorFn<Result>>
    | MemoizedSelectorWithProps<State, any, Result, DefaultProjectorFn<Result>>,
  props?: any
): UnaryFunction<Observable<State>, Observable<Result>> {
  return pipe(
    select(selector, props),
    filter((entities) => !!entities)
  );
}

function selectEntities<Result>(
  selector:
    | MemoizedSelector<State, Result, DefaultProjectorFn<Result>>
    | MemoizedSelectorWithProps<State, any, Result, DefaultProjectorFn<Result>>,
  props?: any
): UnaryFunction<Observable<State>, Observable<Result>> {
  return pipe(select(selector, props));
}

// *** SERVICES ***

export const selectServicesAfterInit = selectEntitiesAfterInit(selectServices);

// *** PLUGIN NOTIFICATIONS ***

export const selectPluginNotificationsAfterInit = selectEntitiesAfterInit(selectPluginNotifications);

// *** FRAMEWORKS ***

export const selectFrameworksAfterInit = (controls: { [frameworkId: string]: CalculatedControl[] }): any =>
  selectEntitiesAfterInit(selectAllExtendedFrameworks, { extendedControls: controls });
export const selectFrameworkAfterInit = (controls: CalculatedControl[], frameworkId: string): any =>
  selectEntitiesAfterInit(selectExtendedFramework, { extendedControls: controls, frameworkId: frameworkId });

// *** DASHBOARD ***

export const selectDashboardAfterInit = selectEntitiesAfterInit(selectDashboard);

// *** REQUIREMENTS ***

export const selectRequirementsAfterInit = selectEntitiesAfterInit(selectRequirements);
