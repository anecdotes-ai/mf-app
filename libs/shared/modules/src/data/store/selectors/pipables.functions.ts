import { selectDashboard } from './dashboard.selectors';
import { ServiceSelectors } from './service.selectors';
import { PluginNotificationSelectors } from './plugin-notification.selectors';
import { RequirementSelectors } from './requirement.selectors';
import { DefaultProjectorFn, MemoizedSelector, MemoizedSelectorWithProps, select } from '@ngrx/store';
import { Observable, pipe, UnaryFunction } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DataFeatureState } from '../state';

// ****** ALL MIGHTY PIPABLE UTILITY FUNCTIONS ******

// *** GENERIC ***

function selectEntitiesAfterInit<Result>(
  selector:
    | MemoizedSelector<DataFeatureState, Result, DefaultProjectorFn<Result>>
    | MemoizedSelectorWithProps<DataFeatureState, any, Result, DefaultProjectorFn<Result>>,
  props?: any
): UnaryFunction<Observable<DataFeatureState>, Observable<Result>> {
  return pipe(
    select(selector, props),
    filter((entities) => !!entities)
  );
}
// *** SERVICES ***

export const selectServicesAfterInit = selectEntitiesAfterInit(ServiceSelectors.SelectServices);

// *** PLUGIN NOTIFICATIONS ***

export const selectPluginNotificationsAfterInit = selectEntitiesAfterInit(PluginNotificationSelectors.SelectPluginNotifications);

// *** DASHBOARD ***

export const selectDashboardAfterInit = selectEntitiesAfterInit(selectDashboard);

// *** REQUIREMENTS ***

export const selectRequirementsAfterInit = selectEntitiesAfterInit(RequirementSelectors.SelectRequirements);
