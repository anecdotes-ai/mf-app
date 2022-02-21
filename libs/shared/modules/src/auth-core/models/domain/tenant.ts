export interface Tenant {
  /**
   * Idps the customer can log in with
   */
  idps?: Idp[];

  /**
   * The id of the tenant
   */
  tenant_id?: string;

  /**
   * The tenant logo url
   */
  tenant_logo?: string;

  number_of_tenants?: number;

  subdomain?: string;
}

export interface Idp {
  idp_id: string;
  idp_type: string;
}
