import { UserFacadeService } from 'core/modules/auth-core/services/facades/user-facade/user-facade.service';
import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { MenuAction } from 'core/modules/dropdown-menu';
import { UserStatus } from 'core/models/user-status';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { FrameworksFacadeService, OperationsTrackerService, TrackOperations } from 'core/modules/data/services';
import { ExtendedUser, RoleService } from 'core/modules/auth-core/services';
import { ResendUserInvitationAction } from 'core/modules/auth-core/store';
import { ModalWindowService } from 'core/modules/modals';
import { SubscriptionDetacher } from 'core/utils';
import { Observable, Subject } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
})
export class UserItemComponent implements OnInit, OnDestroy {
  @ViewChild('confirmationModal')
  private confirmationModalTemplate: TemplateRef<any>;

  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  private readonly userAvatarsPath = {
    DEFAULT: 'audit/profile_mask',
    AUDITOR: 'audit/profile_mask_auditor',
    EMPTY: 'audit/profile_mask_empty',
  };

  get userFullName(): string {
    return `${this.user.first_name} ${this.user.last_name}`;
  }

  @Input()
  user: ExtendedUser;

  get isCurrentUser(): boolean {
    return this.user?.is_current_user;
  }

  auditorFrameworkNames$: Observable<{ [frameworkName: string]: string[] }>;

  userStatus = UserStatus;
  role = RoleEnum;

  threeDotsMenuActions: MenuAction[] = [
    {
      translationKey: this.buildTranslationKey('button.remove'),
      action: this.openRemoveConfirmationModal.bind(this),
    },
  ];

  resendButtonLoader$ = new Subject<boolean>();

  constructor(
    private roleService: RoleService,
    private store: Store,
    private operationsTrackerService: OperationsTrackerService,
    protected modalWindowService: ModalWindowService,
    private frameworksFacade: FrameworksFacadeService,
    private userFacadeService: UserFacadeService
  ) {}

  async ngOnInit(): Promise<void> {
    this.setListenersForSendInviteOperationState();
    this.auditorFrameworkNames$ = this.frameworksFacade.getFrameworks().pipe(
      filter((frameworks) => frameworks?.length && this.user.role === this.role.Auditor),
      map((frameworks) => ({
        frameworks: frameworks.filter((f) => this.user.audit_frameworks.includes(f.framework_id)),
        userAuditId: this.roleService.getAuditIdFromUserRoleOfSpecificUser(this.user),
      })),
      map((accumulatedData) =>
        accumulatedData.frameworks
          .map((f) => f.framework_name)
      ),
      map((frameworkNames) => {
        const frameworkNamesAndRelatedControls: { [frameworkName: string]: string[] } = {};
        frameworkNames.forEach((fName) => {
          frameworkNamesAndRelatedControls[fName] = null;
        });

        return frameworkNamesAndRelatedControls;
      }),
      take(1)
    );
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  resolveUserIcon(): string {
    if (this.checkIsUserInPendingState()) {
      return this.userAvatarsPath.EMPTY;
    }
    return this.user.role === RoleEnum.Auditor ? this.userAvatarsPath.AUDITOR : this.userAvatarsPath.DEFAULT;
  }

  resolveUserTypeIconPath(): string {
    const userType = this.user.role;

    switch (userType) {
      case RoleEnum.Admin:
        return 'user-types/admin';
      case RoleEnum.It:
        return 'user-types/it';
      case RoleEnum.Auditor:
        return 'user-types/auditor';
      case RoleEnum.Collaborator:
        return 'user-types/collaborator';
    }
  }

  openRemoveConfirmationModal(): void {
    this.modalWindowService.open({ template: this.confirmationModalTemplate });
  }

  async removeUser(): Promise<void> {
    await this.userFacadeService.removeUser(this.user.email);
  }

  resendInvitation(): void {
    this.resendButtonLoader$.next(true);
    this.store.dispatch(new ResendUserInvitationAction(this.user.email));
  }

  checkIsUserInPendingState(): boolean {
    return this.user.status === this.userStatus.PROVISIONED || this.user.status === this.userStatus.STAGED;
  }

  buildTranslationKey(relativeKey: string): string {
    return `userManagement.item.${relativeKey}`;
  }

  rowTrackBy(user: ExtendedUser): string {
    return user?.email;
  }

  private setListenersForSendInviteOperationState(): void {
    this.operationsTrackerService
      .getOperationStatus(this.user.email, TrackOperations.UPDATE_USER)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe(() => {
        this.resendButtonLoader$.next(false);
      });
  }
}
