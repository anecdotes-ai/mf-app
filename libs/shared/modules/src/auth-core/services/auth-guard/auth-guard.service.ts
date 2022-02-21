import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean | UrlTree> {
    // startsWith solves the bug with calling wrong authguard
    if (!this.router.routerState.snapshot.url.startsWith('/auth') && !(await this.authService.isAuthenticatedAsync())) {
      return this.router.createUrlTree(['auth', 'sign-in']);
    }

    return true;
  }
}
