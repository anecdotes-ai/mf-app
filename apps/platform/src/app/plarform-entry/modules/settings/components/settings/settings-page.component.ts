import { AppRoutes, AppSettingsRoutesSegments } from 'core/constants/routes';
import { Component, HostBinding } from '@angular/core';
import { TabModel } from 'core/modules/dropdown-menu';
import { RoleEnum } from 'core/modules/auth-core/models/domain';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent {
  @HostBinding('class')
  private classes = 'flex flex-column h-full font-main';

  tabs: TabModel[] = [
    {
      tabId: 'user-management',
      routerLink: '/settings/user-management',
      translationKey: this.buildTranslationKey('manageUsers.tab'),
      visibleFor: [RoleEnum.Admin, RoleEnum.Collaborator]
    },
    {
      tabId: AppSettingsRoutesSegments.SetSSO,
      routerLink: `/${AppRoutes.Settings}/${AppSettingsRoutesSegments.SetSSO}`,
      translationKey: this.buildTranslationKey('setSso.tab'),
      visibleFor: [RoleEnum.Admin, RoleEnum.Collaborator]
    },
    {
      tabId: AppSettingsRoutesSegments.Connectors,
      routerLink: `/${AppRoutes.Settings}/${AppSettingsRoutesSegments.Connectors}`,
      translationKey: this.buildTranslationKey('agents.tab'),
      visibleFor: [RoleEnum.Admin, RoleEnum.It]
    },
    {
      tabId: AppSettingsRoutesSegments.DataDelegation,
      routerLink: `/${AppRoutes.Settings}/${AppSettingsRoutesSegments.DataDelegation}`,
      translationKey: this.buildTranslationKey('dataDelegation.tab'),
      visibleFor: [RoleEnum.Admin, RoleEnum.It]
    },
  ];

  buildTranslationKey(relativeKey: string): string {
    return `settings.${relativeKey}`;
  }
}
