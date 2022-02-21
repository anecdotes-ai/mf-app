/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EntityState } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import { selectMany } from 'core/utils';
import { Control, ControlRequirement, EvidenceInstance } from '../../models/domain';
import { State } from '../state';

// ** SELECTOR FUNCTIONS **

export const selectEntitiesFn = (entityState: EntityState<any>) => Object.values(entityState.entities) as Control[];

export const selectControlsEntitiesFn = (state: State): EntityState<Control> => state.controlsState.controls;

export const selectEvidenceEntitiesDictFn = (state: State): { [evidenceId: string]: EvidenceInstance } =>
  state.evidencesState?.evidences.entities;
export const selectControlAllLoadedFn = (state: State): boolean => state.controlsState.areAllLoaded;
export const selectRequirementsEntitiesDictFn = (state: State): { [requirementId: string]: ControlRequirement } =>
  state.requirementState?.controlRequirements.entities;
export const selectControlsByFrameworkFn = (state: State): { [key: string]: string[] } =>
  state.controlsState.controlsByFramework;

// ** SELECTORS **

export const selectIsControlByFrameworkLoaded = createSelector(
  selectControlsEntitiesFn,
  (controls, props: { frameworkId: string }) => !!controls && props.frameworkId in controls
);

const selectControlsState = (state: State) => state.controlsState;
export const selectControlsDictionary = createSelector(selectControlsState, (state) => state.controls.entities);
export const selectControls = createSelector(selectControlsDictionary, (dictionary) => Object.values(dictionary));

export const selectControlRequirementMapping = createSelector(selectControls, (controls) => {
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

export const createControlsByRequirementIdsSelector = (requirementIds: string[]) =>
  createSelector(selectControlRequirementMapping, (mapping) => {
    const releatedControls = requirementIds.map((id) => mapping[id]);

    if(!releatedControls) {
      return [];
    }

    return selectMany(
      releatedControls.filter(controls => controls).map((controls) => controls.filter((control) => control)),
      (controls) => controls
    );
  });
