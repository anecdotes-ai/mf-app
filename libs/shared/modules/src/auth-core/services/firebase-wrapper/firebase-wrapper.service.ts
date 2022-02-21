import { Injectable } from '@angular/core';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';
import firebase from 'firebase/app';
import { userEmailQueryParam } from '../../constants';

@Injectable()
export class FirebaseWrapperService {
  constructor(private windowHelper: WindowHelperService) { }

  setTenantId(tenantId: string): void {
    firebase.auth().tenantId = tenantId;
  }

  getCurrentUser(): firebase.User {
    return firebase.auth().currentUser;
  }

  isSignInWithEmailLinkByQueryParams(queryParams: { [param: string]: any }): boolean {
    if (userEmailQueryParam in queryParams) {
      return firebase.auth().isSignInWithEmailLink(this.windowHelper.getWindow().location.href);
    }

    return false;
  }

  isSignInWithEmailLink(link: string): boolean {
    return firebase.auth().isSignInWithEmailLink(link);
  }

  async signInWithEmailLinkAsync(email: string, link?: string): Promise<firebase.auth.UserCredential> {
    return link
      ? firebase.auth().signInWithEmailLink(email, link)
      : firebase.auth().signInWithEmailLink(email, window.location.href);
  }

  async signInWithToken(token: string): Promise<firebase.auth.UserCredential> {
    return firebase.auth().signInWithCustomToken(token);
  }

  async signInWithPopupAsync(providerId: string): Promise<firebase.auth.UserCredential> {
    return await firebase.auth().signInWithPopup(this.getProvider(providerId));
  }

  fetchSignInMethodsForEmailAsync(email: string): Promise<string[]> {
    return firebase.auth().fetchSignInMethodsForEmail(email);
  }

  private getProvider(providerId: string): firebase.auth.AuthProvider {
    switch (providerId) {
      case 'google.com':
        {
          const provider = new firebase.auth.GoogleAuthProvider();
          // Always prompt for account selection with GoogleAuthProvider
          provider.setCustomParameters({ prompt: 'select_account' });
          return provider;
        }
      case 'microsoft.com':
        return new firebase.auth.OAuthProvider('microsoft.com');
      case 'github.com':
        return new firebase.auth.GithubAuthProvider();
      default: {
        if (providerId.includes('saml')) {
          return new firebase.auth.SAMLAuthProvider(providerId);
        }
      }
    }
  }
}
