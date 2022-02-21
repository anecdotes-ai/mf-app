import {
  StatusWindowModalComponent, StatusModalWindowInputKeys,
  StatusType,
} from 'core/modules/modals';
import { RequirementCreationModalComponent } from './../../components/requirement-creation-modal/requirement-creation-modal.component';
import { AddRequirementModalEnum } from './../../models/modal-ids.constants';
import { ComponentToSwitch } from 'core/modules/component-switcher/models';
import { SelectFromExistingComponent } from '../../components/select-from-existing/select-from-existing.component';

export const AddRequirementsSwitcherModals: ComponentToSwitch[] = [
  {
    id: AddRequirementModalEnum.SelectExisting,
    componentType: SelectFromExistingComponent,
  },
  {
    id: AddRequirementModalEnum.AddNew,
    componentType: RequirementCreationModalComponent,
  },
  {
    id: AddRequirementModalEnum.Success,
    componentType: StatusWindowModalComponent,
    contextData: {
      [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
      [StatusModalWindowInputKeys.closeModalOnClick]: true,
    },
  },
  {
    id: AddRequirementModalEnum.Error,
    componentType: StatusWindowModalComponent,
    contextData: {
      [StatusModalWindowInputKeys.statusType]: StatusType.ERROR,
      [StatusModalWindowInputKeys.closeModalOnClick]: false,
    },
  },
];
