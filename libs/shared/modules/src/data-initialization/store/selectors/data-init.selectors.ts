import { State } from '@ngrx/store';
import { featureKey } from '../constants';
import { InitState } from '../reducers';

export function selectInitState(state: State<any>): InitState {
    return state[featureKey].initState;
}
