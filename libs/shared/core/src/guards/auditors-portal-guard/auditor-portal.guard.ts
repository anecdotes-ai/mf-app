import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { RoleService } from 'core/modules/auth-core/services';
import { Observable } from 'rxjs';
import { map, mergeMap, switchMap, take } from 'rxjs/operators';
import { AppRoutes } from '../../constants';

@Injectable()
export class AuditorPortalGuard implements CanActivate {
    constructor(
        private router: Router,
        private roleService: RoleService,
    ) { }

    canActivate(_: ActivatedRouteSnapshot, snapshot: RouterStateSnapshot): Observable<boolean | UrlTree> {
        return this.roleService.getCurrentUserRole().pipe(
            take(1),
            map(role => {
                if (role.role === RoleEnum.Zone) {
                    return snapshot.url === `/${AppRoutes.AuditorsPortal}` ? true : this.router.createUrlTree([AppRoutes.AuditorsPortal]);
                } else {
                    return snapshot.url === `/${AppRoutes.AuditorsPortal}` ? false : true;
                }
            })
        );
    }
}
