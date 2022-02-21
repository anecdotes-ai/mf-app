import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { RoleEnum } from '../../models/domain';
import { map } from 'rxjs/operators';
import { AppRoutes } from 'core/constants';
import { RoleService } from '../../services';
import { AppSettingsRoutesSegments } from 'core/constants/routes';

@Injectable({
  providedIn: 'root',
})
export class SettingsGuard implements CanActivate {
  constructor(private router: Router, private roleService: RoleService) {}

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
        } else if (role === RoleEnum.It) {
          this.router.navigate([`${AppRoutes.Settings}/${AppSettingsRoutesSegments.Connectors}`]);
          return false;
        }
        return false;
      })
    );
  }
}
