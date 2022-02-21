import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AppRoutes } from 'core/constants';
import { RoleEnum } from '../../models/domain';
import { RoleService } from '../role/role.service';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthRoleGuard implements CanActivate {
  constructor(private router: Router, private roleService: RoleService) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const roles = route.data.roles as RoleEnum[];
    return this.checkUserRole(roles);
  }

  canActivateChild(route: ActivatedRouteSnapshot): Observable<boolean> {
    const roles = route.data.roles as RoleEnum[];
    return this.checkUserRole(roles);
  }

  private checkUserRole(roles: RoleEnum[]): Observable<boolean> {
    return combineLatest([this.roleService.getCurrentUserRole(), this.roleService.getAuditIdFromUserRole()]).pipe(
      map(([{ role }, user]) => {
        if (roles.includes(role as RoleEnum)) {
          return true;
        } else if (role === RoleEnum.Auditor) {
          // This logic can be changes as we are going to add frameworks partition back, so auditor then has to be redirected to generic path
          this.router.navigate([AppRoutes.Frameworks]);
          return false;
        } else if (role === RoleEnum.It) {
          this.router.navigate([AppRoutes.Plugins]);
          return false;
        } else if (role === RoleEnum.Collaborator) {
          this.router.navigate([AppRoutes.Dashboard]);
          return false;
        }

        return false;
      })
    );
  }
}
