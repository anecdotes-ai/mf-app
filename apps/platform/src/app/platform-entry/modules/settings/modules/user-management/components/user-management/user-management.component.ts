import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { InviteUserSource,  MessageBusService, SearchMessageBusMessages } from 'core';
import { User } from 'core/modules/auth-core/models/domain';
import { UserFacadeService } from 'core/modules/auth-core/services';
import { InviteUserModalService } from 'core/modules/invite-user';
import { SubscriptionDetacher } from 'core/utils';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { delay, map, skip, take } from 'rxjs/operators';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private modifyDataSubject = new Subject<User[]>();

  isNotFoundState$: Observable<any>;
  isEmptyState$: Observable<any>;
  usersStream$: Observable<User[]>;
  isLoading$ = new BehaviorSubject(true);

  filteredUsers: User[];

  dataDisplay: { [key: string]: boolean };

  constructor(
    private messageBus: MessageBusService,
    private inviteUserModalService: InviteUserModalService,
    private cd: ChangeDetectorRef,
    private userFacade: UserFacadeService
  ) {}

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  ngAfterViewInit(): void {
    this.usersStream$.pipe(take(1), delay(1000), this.detacher.takeUntilDetach()).subscribe(() => {
      this.isLoading$.next(false);
    });
  }

  ngOnInit(): void {
    this.usersStream$ = this.userFacade.getUsers();

    this.isNotFoundState$ = this.modifyDataSubject.pipe(
      skip(1),
      map((users) => !users.length)
    );

    this.isEmptyState$ = this.usersStream$.pipe(map((users) => users?.length === 1));

    this.modifyDataSubject.pipe(this.detacher.takeUntilDetach()).subscribe((users) => {
      this.filteredUsers = users;

      if (users?.length) {
        this.dataDisplay = {};
        users.forEach((x) => (this.dataDisplay[x.email] = true));
      } else {
        delete this.dataDisplay;
      }
      this.cd.detectChanges();
    });
  }

  inviteUser(): void {
    this.inviteUserModalService.openInviteUserModal(InviteUserSource.UserManagement);
  }

  resetUsersFiltration(): void {
    this.messageBus.sendMessage(SearchMessageBusMessages.CLEAR_SEARCH, null);
  }

  modifyDataList(users: User[]): void {
    this.modifyDataSubject.next(users);
  }
}
