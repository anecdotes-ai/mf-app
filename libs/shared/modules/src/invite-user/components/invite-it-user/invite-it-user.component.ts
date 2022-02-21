import { Service } from 'core/modules/data/models/domain';
import { Component, Input } from '@angular/core';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { InviteUserModalService } from 'core/modules/invite-user/services';
import { InviteUserSource } from 'core/models/user-events/user-event-data.model';

@Component({
  selector: 'app-invite-it-user',
  templateUrl: './invite-it-user.component.html',
  styleUrls: ['./invite-it-user.component.scss'],
})
export class InviteItUserComponent {

  @Input()
  translationRootKey = 'openedPlugin';

  @Input()
  plugin: Service;

  constructor(private inviteUserModalService: InviteUserModalService) { }

  buildTranslationKey(relativeKey: string): string {
    return `${this.translationRootKey}.inviteItUser.${relativeKey}`;
  }

  inviteItUser(): void {
    this.inviteUserModalService.openInviteUserModal(InviteUserSource.Plugins, RoleEnum.It, this.plugin);
  }
}
