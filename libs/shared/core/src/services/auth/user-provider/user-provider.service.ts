import { WindowHelperService } from './../../window-helper/window-helper.service';
import { Injectable } from '@angular/core';
import { Observable, Subject, pipe, ReplaySubject } from 'rxjs';
import { map, shareReplay, take, switchMapTo, switchMap, tap, startWith } from 'rxjs/operators';
import { AuthService } from 'core/modules/auth-core/services/auth/auth.service';
import { UserClaims } from 'core/modules/auth-core/models/user-claims';

@Injectable({
  providedIn: 'root',
})
export class UserProviderService {
  private userCache: Observable<UserClaims>;
  private updateSubject = new Subject();
  constructor(private authService: AuthService, private windowHelper: WindowHelperService) {
    this.userCache = this.buildCache();
  }

  getUserAsync(): Promise<UserClaims> {
    return this.userCache.pipe(take(1)).toPromise();
  }

  async setCurrentUserAsKnown(): Promise<void> {
    const currUser = await this.getUserAsync();
    this.windowHelper.getWindow().localStorage.setItem(currUser.email, 'known_user');
    this.updateSubject.next();
  }

  async isUserNew(): Promise<boolean> {
    return this.userCache
      .pipe(
        take(1),
        map((currUser) => !this.windowHelper.getWindow().localStorage.getItem(currUser.email))
      )
      .toPromise();
  }

  isUserNewObservable(): Observable<boolean> {
    return this.userCache.pipe(
      take(1),
      switchMap((user) =>
        this.updateSubject.pipe(
          startWith({}),
          map(() => user)
        )
      ),
      map((currUser) => !this.windowHelper.getWindow().localStorage.getItem(currUser.email))
    );
  }

  updateUserInformation(): void {
    this.updateSubject.next();
  }

  private buildCache(): Observable<UserClaims> {
    return new Observable<UserClaims>((subscriber) => {
      this.authService
        .getUserAsync()
        .then((user) => subscriber.next(user))
        .catch((err) => subscriber.error(err));
    }).pipe(shareReplay());
  }
}
