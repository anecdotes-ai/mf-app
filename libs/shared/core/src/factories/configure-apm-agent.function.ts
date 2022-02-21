import { Injector, NgZone } from '@angular/core';
import { ApmService } from '@elastic/apm-rum-angular';
import { AuthService } from 'core/modules/auth-core/services';
import { environment } from 'src/environments/environment';

export async function configureApmAgent(injector: Injector): Promise<any> {
  const authService = injector.get(AuthService);
  const apmService = injector.get(ApmService);
  const ngZone = injector.get(NgZone);

  // This is because the code below causes constant change detection and slows down entire app
  ngZone.runOutsideAngular(async () => {
    const isAuth = await authService.isAuthenticatedAsync();

    if (isAuth) {
      const user = await authService.getUserAsync();
      // User is logged in and it is not an internal anecdotes employee
      if (user) {
        const config = environment.config;
        const v1 = '/v1';
        const api = config.api.baseUrl.split(v1)[0];
        const identity = config.identityApi.baseUrl.split(v1)[0];

        const apm = apmService.init({
          serviceName: environment.config.apm.serviceName,
          serverUrl: environment.config.apm.baseUrl,
          environment: environment.config.apm.env,
          distributedTracingOrigins: [identity, api],
          propagateTracestate: true,
        });

        apm.setUserContext({
          id: user.customer_id,
          username: user.name,
          email: user.email,
        });
      }
    }
  });
}
