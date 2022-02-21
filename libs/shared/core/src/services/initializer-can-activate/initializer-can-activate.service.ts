import { Injectable, Injector, Type } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { PusherConfigService } from '../pusher-config/pusher-config.service';
import { AuthService } from 'core/modules/auth-core/services';
import { configureApmAgent, configureLogRocket } from '../../factories';
import { Initializable } from '../../interfaces';
import { IntercomService } from '../intercom/intercom.service';
import { UserFlowService } from '../userflow/user-flow.service';

@Injectable()
export class InitializerCanActivateService implements CanActivate {
  private static initializableInRowServices: Type<Initializable>[] = [/* nothing here yet */]; // Where order of initialization is important
  private static initializableInParallelServices: Type<Initializable>[] = [
    UserFlowService,
    IntercomService,
  ]; // Where order of initialization is not important

  constructor(private injector: Injector, private authService: AuthService, private pusherConfigService: PusherConfigService) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (!(await this.authService.getUserAsync())) {
      return false;
    }

    await configureApmAgent(this.injector);
    await this.pusherConfigService.initPusher();
    this.pusherConfigService.initListeners();

    configureLogRocket(this.injector);

    await this.initializeInRow();
    await this.initializeParrallel();
    return true;
  }

  private initializeParrallel(): Promise<any> {
    const promises = InitializerCanActivateService.initializableInParallelServices.map((type) =>
      this.injector.get(type).init()
    );

    return Promise.all(promises);
  }

  private async initializeInRow(): Promise<any> {
    for (const key in InitializerCanActivateService.initializableInRowServices) {
      if (InitializerCanActivateService.initializableInRowServices.hasOwnProperty(key)) {
        const type = InitializerCanActivateService.initializableInRowServices[key];

        const initializable = this.injector.get(type);
        await initializable.init();
      }
    }
  }
}
