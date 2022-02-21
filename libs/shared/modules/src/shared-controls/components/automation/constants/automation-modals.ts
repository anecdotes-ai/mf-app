import {
  StatusModalWindowInputKeys,
  StatusType,
} from 'core/modules/modals';
import { StatusWindowModalComponent } from 'core/modules/modals';
import { ComponentToSwitch } from 'core/modules/component-switcher';
import { LinkEntityIds } from './modal-ids.consts';

export const statusModals: ComponentToSwitch[] = [
  {
    id: LinkEntityIds.SuccessModal,
    componentType: StatusWindowModalComponent,
    contextData: {
      [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
      [StatusModalWindowInputKeys.closeModalOnClick]: true,
    },
  },
  {
    id: LinkEntityIds.ErrorModal,
    componentType: StatusWindowModalComponent,
    contextData: {
      [StatusModalWindowInputKeys.statusType]: StatusType.ERROR,
      [StatusModalWindowInputKeys.closeModalOnClick]: false,
    },
  },
];
