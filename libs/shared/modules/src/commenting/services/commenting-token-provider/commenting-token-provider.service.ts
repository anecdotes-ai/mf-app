import { Injectable } from '@angular/core';
import { AbstractTokenProvider } from '@anecdotes/commenting';
import { AuthService } from 'core/modules/auth-core/services';
import { from, NEVER, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class CommentingTokenProviderService extends AbstractTokenProvider {
  constructor(private userProvider: AuthService) {
    super();
  }

  getJwtToken(): Observable<string> {
    return this.userProvider.getUser().pipe(switchMap((user) => {
      if(user) {
        return from(this.userProvider.getAccessTokenAsync());
      }

      return NEVER;
    }));
  }

  getUserClaims(): { [claimKey: string]: string } {
    throw new Error('Method not implemented.'); // TODO: It's temporary
  }
}
