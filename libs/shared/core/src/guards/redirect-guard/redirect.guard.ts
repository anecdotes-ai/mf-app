import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { RoleService } from 'core/modules/auth-core/services';
import { Observable } from 'rxjs';
import { map, mergeMap, switchMap, take } from 'rxjs/operators';
import { AppRoutes } from '../../constants';
import { CustomerFacadeService } from 'core/modules/data/services';

@Injectable()
export class RedirectGuard implements CanActivate {
  constructor(
    private router: Router,
    private roleService: RoleService,
    private customerFacade: CustomerFacadeService
  ) {}

  canActivate(_: ActivatedRouteSnapshot, snapshot: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.customerFacade.getCurrentCustomer().pipe(
      take(1),
      switchMap(() => this.roleService.getCurrentUserRole()),
      mergeMap(async ({ role }) => {
        if (role === RoleEnum.Auditor || role === RoleEnum.It) {
          await this.customerFacade.markCustomerAsOnboarded(true);
        }
      }),
      mergeMap(_ => this.customerFacade.getCurrentCustomerIsOnboarded().pipe(take(1))),
      take(1),
      map((isOnBoarded) => {
        if (!isOnBoarded) {
          return snapshot.url === `/${AppRoutes.WelcomePage}`
            ? true
            : this.router.createUrlTree([AppRoutes.WelcomePage]);
        } else if (snapshot.url === '/') {
          return this.router.createUrlTree([AppRoutes.Frameworks]);
        } else {
          return true;
        }
      }),
    );
  }
}
