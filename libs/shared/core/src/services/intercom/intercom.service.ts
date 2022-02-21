import { Injectable } from '@angular/core';
import { AuthService } from 'core/modules/auth-core/services';
import { Initializable } from 'core/interfaces';
import { AppConfigService } from '../config/app.config.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable()
export class IntercomService implements Initializable {
  private windowRefWithIntercom: any;
  private currentUser: { [key: string]: any };

  constructor(
    private configService: AppConfigService,
    private userProvider: AuthService,
    private router: Router
  ) { }

  async init(): Promise<any> {
    const appId = this.configService.config.intercom?.appId;

    if (appId) {
      this.windowRefWithIntercom = window;
      await this.setIntercomSettings(appId);
      this.setIntercomScript(appId);
      this.listenToRouterEvents();
    }
  }

  openMessanger(): void {
    this.windowRefWithIntercom.Intercom('show');
  }

  showNewMessage(message?: string): void {
    message
      ? this.windowRefWithIntercom.Intercom('showNewMessage', message)
      : this.windowRefWithIntercom.Intercom('showNewMessage');
  }

  showMessages(): void {
    this.windowRefWithIntercom.Intercom('showMessages');
  }

  private listenToRouterEvents(): void {
    this.router.events.pipe(filter((routerEvent) => routerEvent instanceof NavigationEnd)).subscribe(() => {
      if (typeof this.windowRefWithIntercom.Intercom === 'function') {
        this.windowRefWithIntercom.Intercom('update', { last_request_at: new Date().getTime() / 1000 });
      }
    });
  }

  private async setIntercomSettings(appId: string): Promise<any> {
    this.currentUser = await this.userProvider.getUserAsync();

    this.windowRefWithIntercom.intercomSettings = {
      app_id: appId,
      name: this.currentUser.name,
      email: this.currentUser.email,
      // created_at: null, // okta doesn't send info when the user signed up
    };
  }

  private setIntercomScript(appId: string): void {
    const scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.async = true;
    scriptElement.src = `https://widget.intercom.io/widget/${appId}`;
    const scriptElements = document.getElementsByTagName('script')[0];
    scriptElements.parentNode.insertBefore(scriptElement, scriptElements);
  }
}
