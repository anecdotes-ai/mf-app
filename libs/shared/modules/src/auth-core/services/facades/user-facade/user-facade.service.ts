import { TrackOperations } from 'core/modules/data/services/operations-tracker/constants/track.operations.list.constant';
import { ActionDispatcherService } from './../../../../data/services/action-dispatcher/action-dispatcher.service';
import { Injectable } from '@angular/core';
import { RoleEnum, User} from '../../../models/domain';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState, featureKey } from '../../../store/state';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { RemoveUserAction } from '../../../store/actions';

export interface ExtendedUser extends User {
  is_current_user?: boolean;
}
@Injectable()
export class UserFacadeService {
  constructor(private store: Store<AuthState>, private actionDispatcher: ActionDispatcherService, private authService: AuthService) { }

  getUsers(): Observable<User[]> {
    return this.store
      .select((x) => x[featureKey].userState)
      .pipe(
        filter((x) => x.isLoaded),
        map((x) => Object.values(x.entities))
      );
  }

  getCurrentUser(): Observable<User> {
    return this.authService.getUser().pipe(switchMap(userClaims => {
      return this.getUser(userClaims.user_id);
    }));
  }

  getUser(userId: string): Observable<User> {
    return this.getUsers().pipe(
      map(users => users.find(user => user.uid === userId))
    );
  }

  removeUser(user_email: string): Promise<void> {
    return this.actionDispatcher.dispatchActionAsync(new RemoveUserAction({ email: user_email }), user_email, TrackOperations.REMOVE_USER);
  }

  auditorsExist(framework_id: string): Observable<boolean> {
    return this.getUsers().pipe(
      map((users) => users.some((user) => user.audit_frameworks.includes(framework_id))),
      shareReplay()
    );
  }

  async sortUsersWithCurrentFirst(groupedUsers: User[]): Promise<ExtendedUser[]> {
    let foundUserIndex;
    const currentUser = await this.authService.getUserAsync();
    const result: ExtendedUser[] = groupedUsers.map((user, indx) => {
      const isCurr = user.email === currentUser.email;
      if (isCurr) {
        foundUserIndex = indx;
      }
      return { ...user, is_current_user: isCurr };
    });

    if (foundUserIndex > 0) {
      const currUser: ExtendedUser = result[foundUserIndex];
      result.splice(foundUserIndex, 1);
      result.unshift(currUser);
    }
    return result;
  }

  getFrameworkAuditors(framework_id: string): Observable<User[]> {
    return this.getUsers().pipe(
      map(users => users.filter(user => user.role === RoleEnum.Auditor && user.audit_frameworks.includes(framework_id))),
    );
  }
}
