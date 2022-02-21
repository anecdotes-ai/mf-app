import { environment as devEnv } from './environment.develop';

const newEnv = { ...devEnv };

newEnv.config.auth.tenantSubDomainFormat = '{{queryParam(tenantSubDomain)}}';
newEnv.config.auth.tenantRedirectUrlFormat = '{{location_origin}}';
newEnv.config.auth.tenantSignInUrlFormat = `{{tenant_sign_in_redirect_path}}?tenantSubDomain={{tenant_sub_domain}}`;

export const environment = newEnv;
