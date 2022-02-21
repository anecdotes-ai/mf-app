import { IdentityEndpoints } from 'core';

export const identityEndpoints: IdentityEndpoints = {
  getUser: '/user',
  deleteUser: '/user/{{user_email}}',
  updateUser: '/user/{{user_email}}',
  addUser: '/user',
  getTenant: '/tenant',
  exchange: '/user/exchange',
  sendSignInEmail: '/tenant/sign_in_link?user_email={{user_email}}&tenant_subdomain={{tenant_subdomain}}',
  sendSSOLink: '/customer/saml',
  deleteSSOLink: '/customer/saml?saml_id={{saml_id}}',
  getSAMLIds: '/customer/saml',
  forgotAccount: '/tenant/login_help_submit',
  linkCredential: '/user/link',
  auditorTenants: '/auditor/tenant',
  auditorTenantExchange: '/auditor/tenant/{{tenant_subdomain}}/token',
};
