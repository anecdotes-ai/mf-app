export interface SetSSOLinkRequestBody {
  saml_metadata_url: string;
}

export interface SAMLEntity {
  idp_id: string;
  idp_metadata_url: string;
  idp_type: IDPTypes;
}

export enum IDPTypes {
  Okta = 'okta',
  OneLogin = 'onelogin',
  Auth0 = 'auth0',
}
