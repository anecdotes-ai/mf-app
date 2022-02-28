import { Injectable } from '@angular/core';
import { RoleEnum, User } from '../../models/domain';
import { from, Observable, of } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class RoleService {
  private roleCache: Observable<{ role: string }>;

  constructor(private authService: AuthService) {
    this.buildCache();
  }

  getCurrentUserRole(): Observable<{ role: string }> {
    return this.roleCache;
  }

  mapRole(role: string): RoleEnum {
    return (role.split(':')[1] as RoleEnum) || null;
  }

  getAuditIdFromUserRole(): Observable<{ audit_id: string }> {
    return from(this.authService.getUserAsync()).pipe(
      map((_user) => ({
        audit_id: _user?.role.split(':')[2] || null,
      })),
      shareReplay()
    );
  }

  getAuditIdFromUserRoleOfSpecificUser(user: User): string {
    return user?.audit_id;
  }

  isAuditorZone(): Promise<boolean> {
    return this.getCurrentUserRole().
    pipe(
      take(1),
      map((x) => x.role === RoleEnum.Zone)
    ).toPromise();
  }

  isAuditor(): Observable<boolean> {
    return this.getCurrentUserRole()
      .pipe(
        take(1),
        map((x) => x.role === RoleEnum.Auditor)
      );
  }

  private async buildCache(): Promise<void> {
    const user = await this.authService.getUserAsync();

    if (user) {
      this.roleCache = of(user).pipe(
        map((_user) => ({
          role: _user?.role.split(':')[1] || null,
        })),
        shareReplay()
      );
    }
  }
}
