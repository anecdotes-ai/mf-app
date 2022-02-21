import {
  StatusModalWindowInputKeys,
  StatusType,
  StatusWindowModalComponent
} from 'core/modules/modals';
import { ComponentToSwitch } from '../../../component-switcher/models';
import { ItemEditModalComponent } from '../../components';
import { EditItemModalEnum } from '../../models';

export const EditItemSwitherModels: ComponentToSwitch[] = [
  {
    id: EditItemModalEnum.MainModal,
    componentType: ItemEditModalComponent,
  },
  {
    id: EditItemModalEnum.SuccessModal,
    componentType: StatusWindowModalComponent,
    contextData: {
      [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
      [StatusModalWindowInputKeys.closeModalOnClick]: true,
    },
  },
  {
    id: EditItemModalEnum.ErrorModal,
    componentType: StatusWindowModalComponent,
    contextData: {
      [StatusModalWindowInputKeys.statusType]: StatusType.ERROR,
      [StatusModalWindowInputKeys.closeModalOnClick]: false,
    },
  },
];
