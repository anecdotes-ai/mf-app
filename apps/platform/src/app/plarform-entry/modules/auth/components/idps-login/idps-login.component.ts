import { Component, Input, NgZone } from '@angular/core';
import { LoggerService, WindowHelperService } from 'core';
import { AuthError } from 'core/modules/auth-core/models';
import { Idp } from 'core/modules/auth-core/models/domain';
import { AuthService } from 'core/modules/auth-core/services';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { take } from 'rxjs/operators';
import firebase from 'firebase/app';
import { SignInComponentIds, SignInContext } from '../../models';

@Component({
  selector: 'app-idps-login',
  templateUrl: './idps-login.component.html',
  styleUrls: ['./idps-login.component.scss'],
})
export class IdpsLoginComponent {
  private iconsMapping = {
    ['google']: 'gsuite',
    ['microsoft']: 'microsoft',
    ['github']: 'github',
    ['okta']: 'okta',
    ['onelogin']: 'onelogin',
  };

  @Input()
  idps: Idp[];

  constructor(
    private windowHelper: WindowHelperService,
    private authService: AuthService,
    private logger: LoggerService,
    private componentSwitcher: ComponentSwitcherDirective,
  ) {
    window['idpsLoginComponent'] = { loginFunction: this.loginUsingUsernamePassword };
  }

  buildTranslationKey(relativeKey: string): string {
    return `auth.${relativeKey}`;
  }

  buildIdpIconPath(idp: Idp): string {
    return `plugins/${this.iconsMapping[idp.idp_type]}`;
  }

  async loginUsingIdp(idp: Idp): Promise<void> {
    try {
      await this.authService.signInWithPopupAsync(idp.idp_id);
      this.windowHelper.redirectToOrigin();
    } catch (err) {
      if (err.code === AuthError.AccountExistsWithDifferentCredentials) {
        const currentContext = await this.componentSwitcher.sharedContext$.pipe(take(1)).toPromise();
        const newContext: SignInContext = {
          ...currentContext,
          accountLinking: {
            email: err.email,
            credential: err.credential,
            currentIdpId: idp.idp_id
          }
        };
        // try to implicitly link without pop-up
        const tenantId = firebase.auth().tenantId;
        const link = await this.authService.implicitLinkCredentials(err.email,  tenantId, err.credential);
        // if we get the link, redirect to the link
        if (link){
          this.windowHelper.openUrl(link);
        }
        // else, go to the attach link component
        this.componentSwitcher.changeContext(newContext);
        this.componentSwitcher.goById(SignInComponentIds.AccountLinking);
      } else if (err.code === AuthError.InternalServerError) {
        this.componentSwitcher.goById(SignInComponentIds.UserNotExistError);
      }

      this.logger.error(err);
    }
  }

  loginUsingUsernamePassword(email: string, password: string): void {
    /**
     * This is a hack so E2E tests will be able to login using username & password.
     * Tenant is already set when getting to here so no need to set it again.
     *
     * If you found this, contact us at rnd@anecdotes.ai and we might have a job for you ;)
     */
    firebase.auth().signInWithEmailAndPassword(email, password).then(() => location.reload());
  }
}
