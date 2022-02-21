import { ComponentToSwitch } from 'core/modules/component-switcher';
import { ApproveOnBehalfEnum, PolicySettingsModalEnum } from '../../constants/modal-ids.constants';
import { StatusModalWindowInputKeys, StatusType } from 'core/modules/modals/components/status-window-modal/constants';
import { StatusWindowModalComponent } from 'core/modules/modals/components';
import { PolicyApproveOnBehalfComponent } from 'core/modules/shared-policies/components/policy-approve-on-behalf/policy-approve-on-behalf.component';

export const ApproveOnBehalfModals: ComponentToSwitch[] = [
  {
    id: ApproveOnBehalfEnum.approve,
    componentType: PolicyApproveOnBehalfComponent,
  },
  {
    id: PolicySettingsModalEnum.Success,
    componentType: StatusWindowModalComponent,
    contextData: {
      [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
      [StatusModalWindowInputKeys.closeModalOnClick]: true,
    },
  },
  {
    id: PolicySettingsModalEnum.Error,
    componentType: StatusWindowModalComponent,
    contextData: {
      [StatusModalWindowInputKeys.statusType]: StatusType.ERROR,
      [StatusModalWindowInputKeys.closeModalOnClick]: false,
    },
  },
];
