import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchDefinitionModel } from 'core/modules/data-manipulation/search';
import { RoleEnum, User } from 'core/modules/auth-core/models/domain';

@Component({
  selector: 'app-user-management-header',
  templateUrl: './user-management-header.component.html',
  styleUrls: ['./user-management-header.component.scss'],
})
export class UserManagementHeaderComponent {
  @Output()
  modifiedDataList = new EventEmitter<User[]>();

  @Input()
  users: User[];

  @Output()
  inviteUser = new EventEmitter(true);

  foundUsersCount: number;

  role = RoleEnum;

  searchDefinitions: SearchDefinitionModel<User>[] = [
    {
      propertySelector: (u) => u.email,
    },
    {
      propertySelector: (u) => `${u.first_name} ${u.last_name}`,
    },
  ];

  buildTranslationKey(relativeKey: string): string {
    return `userManagement.header.${relativeKey}`;
  }

  buildUserManagementTranslationKey(relativeKey: string): string {
    return `userManagement.${relativeKey}`;
  }

  searchData(data: User[]): void {
    this.foundUsersCount = data.length;
    this.modifiedDataList.emit(data);
  }
}
