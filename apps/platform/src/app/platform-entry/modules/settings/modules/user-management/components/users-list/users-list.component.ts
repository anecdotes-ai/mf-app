import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ExtendedUser, UserFacadeService } from 'core/modules/auth-core/services/facades';
import { RoleEnum, User } from 'core/modules/auth-core/models/domain';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent implements OnChanges, OnInit {
  readonly roleEnum = RoleEnum;

  @Input()
  users: User[];

  extendedUsers: ExtendedUser[];

  @Input() parentScroller: PerfectScrollbarComponent;

  @Output()
  inviteUser = new EventEmitter(true);

  currentUser: { [key: string]: any };

  constructor(private userFacade: UserFacadeService, private cd: ChangeDetectorRef) {}

  async ngOnInit(): Promise<void> {}

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if ('users' in changes && this.users?.length) {
      this.extendedUsers = await this.userFacade.sortUsersWithCurrentFirst(this.users);
      this.cd.detectChanges();
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `userManagement.list.${relativeKey}`;
  }

  trackByUser(_: number, user: User): string {
    return user?.email;
  }
}
