import { ComponentToSwitch } from 'core/modules/component-switcher';
import { PolicySettingModalInputKeys, PolicySettingsModalEnum } from '../../constants/modal-ids.constants';
import { PolicySettingsComponent } from '../../components/policy-settings/policy-settings.component';
import { StatusModalWindowInputKeys, StatusType } from 'core/modules/modals/components/status-window-modal/constants';
import { StatusWindowModalComponent } from 'core/modules/modals/components';

export const SettingsSwitcherModals: ComponentToSwitch[] = [
  {
    id: PolicySettingsModalEnum.Owner,
    componentType: PolicySettingsComponent,
    contextData: {
      [PolicySettingModalInputKeys.stage]: PolicySettingsModalEnum.Owner,
      [PolicySettingModalInputKeys.step]: 0
    }
  },
  {
    id: PolicySettingsModalEnum.Reviewers,
    componentType: PolicySettingsComponent,
    contextData: {
      [PolicySettingModalInputKeys.stage]: PolicySettingsModalEnum.Reviewers,
      [PolicySettingModalInputKeys.step]: 1
    }
  },
  {
    id: PolicySettingsModalEnum.Approvers,
    componentType: PolicySettingsComponent,
    contextData: {
      [PolicySettingModalInputKeys.stage]: PolicySettingsModalEnum.Approvers,
      [PolicySettingModalInputKeys.step]: 2
    }
  },
  {
    id: PolicySettingsModalEnum.Scheduling,
    componentType: PolicySettingsComponent,
    contextData: {
      [PolicySettingModalInputKeys.stage]: PolicySettingsModalEnum.Scheduling,
      [PolicySettingModalInputKeys.step]: 3
    }
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
