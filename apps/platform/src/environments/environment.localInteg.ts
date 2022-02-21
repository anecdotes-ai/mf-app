import { environment as integEnv } from './environment.integ';

const newEnv = { ...integEnv };

newEnv.config.auth.tenantSubDomainFormat = '{{queryParam(tenantSubDomain)}}';
newEnv.config.auth.tenantRedirectUrlFormat = '{{location_origin}}/auth/sign-in?tenantSubDomain={{tenant_sub_domain}}';

export const environment = newEnv;
