import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserClaims } from 'core/modules/auth-core/models';
import { AppRoutes } from 'core/constants';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { AuthService } from 'core/modules/auth-core/services';
import { AppConfigService } from 'core/services/config/app.config.service';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';

export interface MenuItem {
  key: string;
  action: () => any;
  visible: boolean;
  visibleFor: RoleEnum[];
  icon: string;
}
@Component({
  selector: 'app-user-profile-menu',
  templateUrl: './user-profile-menu.component.html',
  styleUrls: ['./user-profile-menu.component.scss'],
})
export class UserProfileMenuComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private appConfig: AppConfigService,
    private windowService: WindowHelperService
  ) { }

  static helpCenterUrl = 'https://intercom.help/anecdotes/en/';
  @Input()
  placementPosition = 'right-bottom';
  @Input()
  iconWidthPx = 46;
  @Input()
  iconHeightPx = 46;
  @Input()
  profileAvatarSrc = 'assets/img/profile_mask.svg';
  @Input()
  isInAudit = false;

  currentUser$: Promise<UserClaims>;
  menuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.currentUser$ = this.authService.getUserAsync() as Promise<UserClaims>;

    this.menuItems = [
      {
        key: 'users',
        action: this.navigateToUsersManagementPage.bind(this),
        visible: !this.isInAudit,
        visibleFor: [RoleEnum.Admin, RoleEnum.Collaborator],
        icon: 'manage-users'
      },
      {
        key: 'auditors-portal',
        action: this.navigateToAuditorsPortal.bind(this),
        visible: true,
        visibleFor: [RoleEnum.Auditor],
        icon: 'audit-portal'
      },
      {
        key: 'help',
        action: this.openHelpCenter.bind(this),
        visible: true,
        visibleFor: [RoleEnum.Admin, RoleEnum.User, RoleEnum.It, RoleEnum.Collaborator],
        icon: 'help'
      },
      {
        key: 'logOut',
        action: this.logOut.bind(this),
        visible: true,
        visibleFor: [RoleEnum.Admin, RoleEnum.User, RoleEnum.It, RoleEnum.Auditor, RoleEnum.Collaborator],
        icon: 'logout'
      },
    ];
  }

  private async logOut(): Promise<any> {
    await this.authService.signOutAsync();
  }

  private openHelpCenter(): void {
    window.open(UserProfileMenuComponent.helpCenterUrl, '_blank');
  }

  private navigateToUsersManagementPage(): void {
    this.router.navigate([`/${AppRoutes.UserManagement}`]);
  }

  private navigateToAuditorsPortal(): void {
    this.windowService.openUrl(this.appConfig.config.redirectUrls.auditorsPortal);
  }

  buildTranslationKey(relativeKey: string): string {
    return `userMenu.${relativeKey}`;
  }
}
