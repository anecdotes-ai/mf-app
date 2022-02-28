/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { createSelector } from '@ngrx/store';
import { selectMany } from 'core/utils';
import { Control } from '../../models/domain';
import { dataFeatureSelector } from './feature.selector';

const SelectControlsState = createSelector(dataFeatureSelector, dataFeatureState => dataFeatureState.controlsState);
const SelectControlsDictionary = createSelector(SelectControlsState, (state) => state.controls.entities);
const SelectControls = createSelector(SelectControlsDictionary, (dictionary) => Object.values(dictionary));

const SelectControlRequirementMapping = createSelector(SelectControls, (controls) => {
  let result: { [evidenceId: string]: Control[] };

  if (controls) {
    result = {};

    controls.forEach((control) => {
      control.control_requirement_ids.forEach((requirementId) => {
        result[requirementId] = result[requirementId] ? [...result[requirementId], control] : [control];
      });
    });
  } else {
    result = null;
  }

  return result;
});

const CreateControlsByRequirementIdsSelector = (requirementIds: string[]) =>
  createSelector(SelectControlRequirementMapping, (mapping) => {
    const releatedControls = requirementIds.map((id) => mapping[id]);

    if (!releatedControls) {
      return [];
    }

    return selectMany(
      releatedControls.filter(controls => controls).map((controls) => controls.filter((control) => control)),
      (controls) => controls
    );
  });

export const ControlSelectors = {
  SelectControlsState,
  SelectControlRequirementMapping,
  CreateControlsByRequirementIdsSelector,
  SelectControls
};
