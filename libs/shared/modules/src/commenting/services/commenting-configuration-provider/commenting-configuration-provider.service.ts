import { Injectable } from '@angular/core';
import { AbstractConfigurationProvider, ConfigurationModel, UserModel } from '@anecdotes/commenting';
import { Observable } from 'rxjs';
import { AuthService } from 'core/modules/auth-core/services';
import { AppConfigService } from 'core/services';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { featureSelector } from '../../store/selectors';

@Injectable()
export class CommentingConfigurationProviderService extends AbstractConfigurationProvider {
  constructor(private authService: AuthService, private config: AppConfigService, private store: Store<any>) {
    super();
  }

  getConfiguration(): ConfigurationModel {
    return {
      baseUrl: this.config.config.commentsApi.baseUrl,
    } as ConfigurationModel;
  }

  async getCurrentUserAsync(): Promise<UserModel> {
    const userFromAuthService = await this.authService.getUserAsync();
    return {
      id: userFromAuthService.user_id,
      name: userFromAuthService.name,
      email: userFromAuthService.email,
    };
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.store.select(featureSelector).pipe(
      map((state) => state.users ?? []),
      map((users) =>
        users.map((u) => ({ id: u.uid, name: `${u.first_name} ${u.last_name}`, email: u.email } as UserModel))
      )
    );
  }
}
