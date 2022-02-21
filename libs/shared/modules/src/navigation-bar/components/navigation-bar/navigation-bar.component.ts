import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from 'core/constants';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { UserClaims } from 'core/modules/auth-core/models/user-claims';
import { AuthService } from 'core/modules/auth-core/services/auth/auth.service';
import { Customer } from 'core/modules/data/models/domain';
import { CustomerFacadeService } from 'core/modules/data/services/facades/customer-facade/customer-facade.service';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavigationModel, PositionX, SubMenuPositionY } from '../../models/navigation.model';
import { firstLettersRegExp } from './../../constants/user-profile.constants';
import { NavigationBarEventsTrackingService } from './../../services/navigation-bar-events-tracking.service';
import { SubscriptionDetacher } from 'core/utils';
import { AppConfigService } from 'core/services/config/app.config.service';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { UserEvents } from 'core/models';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationBarComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private windowHelperService: WindowHelperService,
    private authService: AuthService,
    private customerFacadeService: CustomerFacadeService,
    private appConfigService: AppConfigService,
    private navigationBarEventsTrackingService: NavigationBarEventsTrackingService,
    private userEventService: UserEventService
  ) {}

  private readonly complienceOverflow: string = 'https://www.anecdotes.ai/compliance-overflow';
  private readonly helpCenterUrl: string = 'https://intercom.help/anecdotes/en/';
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @Input()
  routes: NavigationModel[] = [];

  @Output()
  logoClick = new EventEmitter(true);

  @ViewChild('notificationsPanel', { static: true })
  notificationsPanel: TemplateRef<any>;

  isItUser: Observable<boolean>;
  isUserNew: Observable<boolean>;

  currentUser$: Promise<UserClaims>;
  currentCustomer$: Observable<Customer>;
  welcomePageRoute: string = AppRoutes.WelcomePage;
  userInitials$: Observable<string>;
  complienceOverflowNavModel: NavigationModel;
  notificationsNavModel: NavigationModel;
  userProfileMenuNavModel: NavigationModel;
  isOnboarded: boolean;

  async ngOnInit(): Promise<void> {
    this.currentCustomer$ = this.customerFacadeService.getCurrentCustomer();
    this.currentUser$ = this.authService.getUserAsync();
    this.userInitials$ = this.authService.getUser().pipe(
      map((userClaims) => userClaims.name.match(firstLettersRegExp).slice(0, 2)?.join('').toUpperCase()),
    );
    this.complienceOverflowNavModel = {
      icon: 'community_reference',
      key: 'complianceOverflow',
      visibleFor: [RoleEnum.Admin, RoleEnum.Collaborator],
      menuPositionY: SubMenuPositionY.ABOVE,
      iconColorMode: 'stroke',
      menuActions: [
        {
          translationKey: 'joinOurCommunity',
          action: this.joinCommunity.bind(this, this.complienceOverflow),
          icon: 'compliance-overflow',
        },
      ],
    } as NavigationModel;

    this.notificationsNavModel = {
      icon: 'notification',
      key: 'notifications',
      visibleFor: [RoleEnum.Admin, RoleEnum.Collaborator, RoleEnum.Auditor, RoleEnum.It, RoleEnum.User],
      menuPositionY: SubMenuPositionY.CENTER,
      iconColorMode: 'fill',
    notificationPositionX: PositionX.RIGHT,
      displayBadge: true,
      menuTemplate: this.notificationsPanel,
      notPaddedMenu: true
    } as NavigationModel;

    this.currentCustomer$
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((customer) => (this.isOnboarded = customer.is_onboarded));

    this.userProfileMenuNavModel = {
      icon: 'user-icon-logo',
      visibleFor: [RoleEnum.Admin, RoleEnum.Collaborator, RoleEnum.Auditor, RoleEnum.It],
      text: (await this.currentUser$).name,
      menuPositionY: SubMenuPositionY.ABOVE,
      iconColorMode: 'stroke',
      menuActions: [
        {
          translationKey: 'userMenu.settings',
          icon: 'settings',
          iconColorMode: 'fill',
          action: this.navigateToSettingsPage.bind(this),
          visibleFor: [RoleEnum.Admin, RoleEnum.Collaborator, RoleEnum.It],
          disabledCondition: () => !this.isOnboarded,
        },
        {
          translationKey: 'userMenu.auditors-portal',
          action: this.navigateToAuditorsPortal.bind(this),
          icon: 'user-menu/audit-portal',
          iconColorMode: 'stroke',
          visibleFor: [RoleEnum.Auditor],
        },
        {
          translationKey: 'userMenu.help',
          action: this.windowHelperService.openUrlInNewTab.bind(this, this.helpCenterUrl),
          icon: 'user-menu/help',
          iconColorMode: 'fill',
          visibleFor: [RoleEnum.Admin, RoleEnum.Collaborator, RoleEnum.Auditor, RoleEnum.It],
        },
        {
          translationKey: 'userMenu.logOut',
          action: this.logOut.bind(this),
          icon: 'user-menu/logout',
          iconColorMode: 'fill',
          visibleFor: [RoleEnum.Admin, RoleEnum.Collaborator, RoleEnum.Auditor, RoleEnum.It],
        },
      ],
    } as NavigationModel;
  }

  buildTranslationKey(relativeKey: string): string {
    return `navigation.${relativeKey}`;
  }

  onNavigationElementClick(item: NavigationModel): void {
    this.navigationBarEventsTrackingService.trackNavigationElementClick(item);
  }

  private async logOut(): Promise<any> {
    await this.authService.signOutAsync();
  }

  private navigateToSettingsPage(): void {
    this.router.navigate([`/${AppRoutes.Settings}`]);
  }

  private navigateToAuditorsPortal(): void {
    document.location.href = this.appConfigService.config.redirectUrls.auditorsPortal;
  }

  private joinCommunity(): void {
    this.userEventService.sendEvent(UserEvents.COMMUNITY);
    this.windowHelperService.openUrlInNewTab(this.complienceOverflow);
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }
}
