import { Injectable } from '@angular/core';
import userflow from 'userflow.js'; // https://getuserflow.com/docs/dev/userflow-js-installation#step-1-choose-installation-method
import { Initializable } from 'core/interfaces';
import { AppConfigService } from '../config/app.config.service';
import { 
  AuthService,
  RoleService, 
  TenantSubDomainExtractorService 
} from 'core/modules/auth-core/services';

@Injectable()
export class UserFlowService implements Initializable {

  constructor(
    private configService: AppConfigService,
    private userProvider: AuthService,
    private tenantService: TenantSubDomainExtractorService,
    private roleService: RoleService
  ) {}

  async init(): Promise<any> {
    const token = this.configService.config.userflow?.token;

    if (token) {
      userflow.init(token);
      const user = await this.userProvider.getUserAsync();
      const getUser = await this.roleService.getCurrentUserRole().toPromise();
      userflow.identify(user.email, {
        name: user.name,
        email: user.email,
        subdomain: this.tenantService.getCurrentTenantSubDomain(),
        'User Role':  getUser.role,
      });
    }
  }
}
