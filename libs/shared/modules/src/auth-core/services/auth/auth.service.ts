import { AuthEventService } from './auth-event-service/auth-event.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserClaims } from '../../models';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';
import { Observable } from 'rxjs';
import { shareReplay, switchMap, take } from 'rxjs/operators';
import { FirebaseWrapperService } from '../firebase-wrapper/firebase-wrapper.service';
import { TenantFacadeService } from '../facades/tenant-facade/tenant-facade.service';
import firebase from 'firebase/app';
import { userEmailQueryParam } from '../../constants';

@Injectable()
export class AuthService {
  private userCache: Observable<UserClaims>;

  constructor(
    private authService: AngularFireAuth,
    private windowHelper: WindowHelperService,
    private authEventService: AuthEventService,
    private firebaseWrapper: FirebaseWrapperService,
    private tenantFacade: TenantFacadeService
  ) {
    this.userCache = this.buildCache();
  }

  getUserAsync(): Promise<UserClaims> {
    return this.userCache.pipe(take(1)).toPromise();
  }

  getUser(): Observable<UserClaims> {
    return this.userCache;
  }

  getAccessTokenAsync(): Promise<string> {
    return this.authService.idToken.pipe(take(1)).toPromise();
  }

  async signInWithEmailLinkAsync(queryParams: { [param: string]: any }): Promise<void> {
    const email = queryParams[userEmailQueryParam];

    this.firebaseWrapper.setTenantId((await this.tenantFacade.getCurrentTenantAsync()).tenant_id);
    await this.firebaseWrapper.signInWithEmailLinkAsync(email);
    this.authEventService.trackLogin();
  }

  async signInWithTokenAsync(token: string, tenantSubdomain?: string): Promise<void> {
    if (tenantSubdomain) {
      const tenantId = (await this.tenantFacade.getTenantBySubdomain(tenantSubdomain).toPromise()).tenant_id;
      this.firebaseWrapper.setTenantId(tenantId);
    } else {
      this.firebaseWrapper.setTenantId((await this.tenantFacade.getCurrentTenantAsync()).tenant_id);
    }
    await this.firebaseWrapper.signInWithToken(token);
    this.authEventService.trackLogin();
  }

  async signInWithPopupAsync(providerId: string): Promise<firebase.auth.UserCredential> {
    //Here we tracking login event before actual login because redirection after successful login may interrupt tracking
    this.authEventService.trackLogin();

    return await this.firebaseWrapper.signInWithPopupAsync(providerId);
  }

  async signOutAsync(): Promise<any> {
    await this.signOutWithoutRedirectAsync();
    this.windowHelper.redirectToOrigin();
  }

  async signOutWithoutRedirectAsync(): Promise<any> {
    this.authEventService.trackLogout();

    await this.authService.signOut();
  }

  async isAuthenticatedAsync(): Promise<boolean> {
    const user = await this.getUserAsync();
    return !!user;
  }

  async implicitLinkCredentials(
    email: string,
    tenant_id: string,
    credentials: firebase.auth.AuthCredential
  ): Promise<string> {
    const methods = await this.firebaseWrapper.fetchSignInMethodsForEmailAsync(email);
    // implicit is ok
    if (!methods.length || (methods.length === 1 && methods[0] !== 'google.com')) {
      try {
        const json_creds = credentials.toJSON();
        return await this.tenantFacade.linkCredentialsAndGetSignInLink(email, tenant_id, json_creds);
      } catch (err) {
        // do nothing
      }
    }
    return null;
  }

  async linkWithCredentialAsync(email: string, credentials: firebase.auth.AuthCredential): Promise<void> {
    const methods = await this.firebaseWrapper.fetchSignInMethodsForEmailAsync(email);
    const method = methods[0];
    const result = await this.firebaseWrapper.signInWithPopupAsync(method);
    await result.user.linkWithCredential(credentials);
  }

  private buildCache(): Observable<UserClaims> {
    return this.authService.authState.pipe(
      take(1),
      switchMap(async (authState) => {
        if (authState) {
          const token = await authState.getIdTokenResult();
          if (!token.claims.name) {
            token.claims.name = `${token.claims.first_name} ${token.claims.last_name}`;
          }
          return token.claims as UserClaims;
        }
      }),
      shareReplay()
    );
  }
}
