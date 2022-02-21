import { InviteUserWindowInputKeys } from './../../components/invite-user-modal/constants/invite-user-modal-window.constants';
import { Service, Framework } from 'core/modules/data/models/domain';
import { Injectable } from '@angular/core';
import { StatusWindowModalComponent } from 'core/modules/modals/components';
import { StatusModalWindowInputKeys, StatusType } from 'core/modules/modals/components/status-window-modal/constants';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { ModalWindowService } from 'core/modules/modals/services';
import { InviteUserModalComponent } from '../../components/invite-user-modal/invite-user-modal.component';
import { InviteUserModalIds } from '../../models';
import { InviteUserSource } from 'core/models/user-events/user-event-data.model';

@Injectable()
export class InviteUserModalService {
  constructor(private modalWindowService: ModalWindowService) {}

  openInviteUserModal(source: InviteUserSource, selectedRole?: RoleEnum, plugin?: Service, selectedFramework?: Framework): void {
    this.modalWindowService.openInSwitcher({
      context: {
        selectedRole,
        selectedFramework
      },
      componentsToSwitch: [
        {
          id: InviteUserModalIds.InviteUser,
          componentType: InviteUserModalComponent,
          contextData: {
            [InviteUserWindowInputKeys.plugin]: plugin,
            [InviteUserWindowInputKeys.source]: source,
          },
        },
        {
          id: InviteUserModalIds.InviteUserGenericFailure,
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.ERROR,
            [StatusModalWindowInputKeys.translationKey]: 'audit.inviteAuditorsModal.failedModal',
            [StatusModalWindowInputKeys.closeModalOnClick]: false,
          },
        },
        {
          id: InviteUserModalIds.InviteUserFailureAlreadyExisting,
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.ERROR,
            [StatusModalWindowInputKeys.translationKey]: 'audit.inviteAuditorsModal.failedAlreadyInvitedModal',
            [StatusModalWindowInputKeys.closeModalOnClick]: false,
          },
        },
        {
          id: InviteUserModalIds.InviteUserSuccess,
          componentType: StatusWindowModalComponent,
          contextData: {
            [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
            [StatusModalWindowInputKeys.translationKey]: 'audit.inviteAuditorsModal.successModal',
          },
        },
      ],
    });
  }
}
