import { SAMLEntity } from './../../../models/domain';
import { AuthService } from './../../auth/auth.service';
import { SamlService } from '../../http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class SamlFacadeService {
  constructor(private samlHttpService: SamlService, private authService: AuthService) {}

  async getSAMLIds(): Promise<SAMLEntity[]> {
    const token = await this.authService.getAccessTokenAsync();
    return this.samlHttpService.getSAMLIds(token).toPromise();
  }

  async deleteSSOLink(saml_id: string): Promise<Observable<any>> {
    const token = await this.authService.getAccessTokenAsync();
    return this.samlHttpService.deleteSSOLink(saml_id, token).toPromise();
  }

  async setSSOLink(sso_url: string): Promise<any> {
    const token = await this.authService.getAccessTokenAsync();
    return this.samlHttpService.setSSOLink({ saml_metadata_url: sso_url }, token).toPromise();
  }
}
