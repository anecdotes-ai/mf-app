import { SendForApprovalComponent } from '../../components/send-for-approval/send-for-approval.component';
import { ComponentToSwitch } from 'core/modules/component-switcher';
import { StatusWindowModalComponent } from 'core/modules/modals/components';
import { StatusModalWindowInputKeys, StatusType } from 'core/modules/modals/components/status-window-modal/constants';
import { SendForApproval } from '../../constants/modal-ids.constants';

export const SendForApprovalModals: ComponentToSwitch[] = [
  {
    id: SendForApproval.Share,
    componentType: SendForApprovalComponent,
    contextData: {
      [StatusModalWindowInputKeys.closeModalOnClick]: false
    }
  },
  {
    id: SendForApproval.Shared,
    componentType: StatusWindowModalComponent,
    contextData: {
      [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
      [StatusModalWindowInputKeys.closeModalOnClick]: true,
    },
  },
  {
    id: SendForApproval.Error,
    componentType: StatusWindowModalComponent,
    contextData: {
      [StatusModalWindowInputKeys.statusType]: StatusType.ERROR,
      [StatusModalWindowInputKeys.closeModalOnClick]: false,
    },
  },
];
