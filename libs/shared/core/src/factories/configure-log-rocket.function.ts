import { Injector, NgZone } from '@angular/core';
import LogRocket from 'logrocket';
import { environment } from 'src/environments/environment';
import { AuthService } from 'core/modules/auth-core/services';
import { AppConfigService } from '../services/config/app.config.service';

export async function configureLogRocket(injector: Injector): Promise<any> {
  const authService = injector.get(AuthService);
  const configService = injector.get(AppConfigService);
  const ngZone = injector.get(NgZone);

  // This is because the code below causes constant change detection and slows down entire app
  if (environment.production) {
    ngZone.runOutsideAngular(() => {
      authService.getUserAsync().then(async (isAuthenticated) => {
        if (isAuthenticated) {
          const user = await authService.getUserAsync();
          // User is logged in and it is not an internal anecdotes employee
          if (!!user && user.email.includes('anecdotes.ai') === false) {
            LogRocket.init(configService.config.logRocket.projectId, {
              network: {
                requestSanitizer: (request) => {
                  request.headers['Authorization'] = null;
                  return request;
                },
                responseSanitizer: (response) => {
                  response.body = null;
                  return response;
                },
              },
            });
            LogRocket.identify(`${user.customer_id}`, {
              name: `${user.name}`,
              email: `${user.email}`,
            });
          }
        }
      });
    });
  }
}
