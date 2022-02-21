import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Injector,
  Input,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { sortCallback } from 'core/utils';
import { MakeProvider } from 'core/modules/form-controls';
import { DropdownControlComponent, MenuAction } from 'core/modules/dropdown-menu';
import { InviteUserModalService } from '../../services';
import { InviteUserSource } from 'core/models/user-events/user-event-data.model';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
export const LIST_MIN_WIDTH = 200;
export const SEARCH_ENABLED = true;
export const SELECT_FIRST_VALUE = false;

export interface User {
  first_name: string;
  last_name: string;
  email: string;
  photo: string;
}

@Component({
  selector: 'app-user-dropdown-control',
  templateUrl: './user-dropdown-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MakeProvider(UserDropdownControlComponent)],
})
export class UserDropdownControlComponent extends DropdownControlComponent {
  private filteredUsers: User[];

  listMinWidth = LIST_MIN_WIDTH;
  searchEnabled = SEARCH_ENABLED;
  selectFirstValue = SELECT_FIRST_VALUE;
  role = RoleEnum;

  get selectedEmail(): string {
    return this.value as string;
  }

  get selectedUser(): User {
    if (this.selectedEmail && this.users) {
      return this.users.find((u) => u.email === this.selectedEmail);
    }

    return null;
  }

  get currentUser(): User {
    if (this.currentUserEmail && this.users) {
      return this.users.find((u) => u.email === this.currentUserEmail);
    }

    return null;
  }

  get isCurrentUserSelected(): boolean {
    return this.selectedEmail === this.currentUserEmail;
  }

  get displayedUsers(): User[] {
    return this.searchField.value ? this.filteredUsers : this.getDisplayedUsers();
  }

  get isInSearch(): boolean {
    return !!this.searchField.value;
  }

  readonly inviteAction: MenuAction = {
    icon: 'user-management',
    translationKey: this.buildTranslationKey('inviteUser'),
    action: () => this.inviteUser(),
  };

  @Input()
  users: (User | any)[];

  @Input()
  currentUserEmail: string;

  @Input()
  source: InviteUserSource;

  @Input()
  tooltipDisabled: string;

  @HostBinding('class.pointer-events-none')
  @Input()
  loading: boolean;

  @Input()
  readonly: boolean;

  constructor(
    injector: Injector,
    translate: TranslateService,
    hostElementRef: ElementRef<HTMLElement>,
    cd: ChangeDetectorRef,
    private inviteUserModalService: InviteUserModalService
  ) {
    super(injector, translate, hostElementRef, cd);
  }

  writeValue(email: string): void {
    super.writeValue(email);
    this.cd.detectChanges();
  }

  selectUser(user: User): void {
    const newValue = user ? user.email : null;

    if (this.value !== newValue) {
      this.value = newValue;
    }

    this.close();
  }

  search(searchValue: string): void {
    this.filteredUsers = this.getDisplayedUsers().filter((item) => {
      return this.getDisplayValue(item).toLocaleLowerCase().includes(searchValue.toLocaleLowerCase());
    });
  }

  isSelected(user: User): boolean {
    return user.email === this.selectedEmail;
  }

  isCurrentUser(user: User): boolean {
    return user.email === this.currentUserEmail;
  }

  getDisplayValue(user: User): string {
    return `${user.first_name} ${user.last_name}`;
  }

  buildTranslationKey(relativeKey: string): string {
    return `components.sharedControls.owner.${relativeKey}`;
  }

  /** we want still want to stop propagation even if the button is disabled */
  dropdownClick(event: MouseEvent): void {
    event.stopPropagation();
    if(!this.isDisabled) {
      this.toggleDropdown(event);
    }
  }

  private inviteUser(): void {
    this.inviteUserModalService.openInviteUserModal(this.source);
    this.close();
  }

  /** Sorts users by name and excludes current user from the list */
  private getDisplayedUsers(): User[] {
    if (this.currentUserEmail && this.users) {
      const newUsersList = [...this.users];
      const currentUserIndex = this.users.findIndex((user) => user.email === this.currentUserEmail);
      const currentUser = newUsersList.splice(currentUserIndex, 1)[0]; // since we splice 1 element, we get it by the first index (0)
      newUsersList.sort((f, s) => sortCallback(f, s, (u) => this.getDisplayValue(u)));
      newUsersList.unshift(currentUser);
      return newUsersList;
    }

    return this.users;
  }
}
