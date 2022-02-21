import {
  StatusModalWindowInputKeys,
  StatusType,
  StatusWindowModalComponent
} from 'core/modules/modals';
import { ItemCreationModalComponent } from '../../components/item-creation-modal/item-creation-modal.component';
import { AddItemModalEnum } from '../../models/modal-ids.constants';
import { ComponentToSwitch } from '../../../component-switcher/models';
import { SelectFromExistingComponent } from '../../components/select-from-existing/select-from-existing.component';

export const AddExistingWithItemsSwitcherModals: ComponentToSwitch[] = [
  {
    id: AddItemModalEnum.SelectExisting,
    componentType: SelectFromExistingComponent,
  },
  {
    id: AddItemModalEnum.AddNew,
    componentType: ItemCreationModalComponent,
  },
  {
    id: AddItemModalEnum.Success,
    componentType: StatusWindowModalComponent,
    contextData: {
      [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
      [StatusModalWindowInputKeys.closeModalOnClick]: true,
    },
  },
  {
    id: AddItemModalEnum.Error,
    componentType: StatusWindowModalComponent,
    contextData: {
      [StatusModalWindowInputKeys.statusType]: StatusType.ERROR,
      [StatusModalWindowInputKeys.closeModalOnClick]: false,
    },
  },
];
