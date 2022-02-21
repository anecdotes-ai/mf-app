import { SAMLEntity, SetSSOLinkRequestBody } from './../../../models/domain';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from 'core/services/config/app.config.service';
import { Observable } from 'rxjs';
import { AbstractService } from '../abstract-http/abstract-service';

@Injectable()
export class SamlService extends AbstractService {
  constructor(httpBackend: HttpBackend, configService: AppConfigService) {
    super(new HttpClient(httpBackend), configService);
  }

  getSAMLIds(token: string): Observable<SAMLEntity[]> {
    return this.http.get<SAMLEntity[]>(
      this.buildUrl((a) => a.getSAMLIds),
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
  }

  deleteSSOLink(saml_id: string, token: string): Observable<any> {
    return this.http.delete<any>(
      this.buildUrl((a) => a.deleteSSOLink, { saml_id }),
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
  }

  setSSOLink(requestBody: SetSSOLinkRequestBody, token: string): Observable<any> {
    return this.http.post<any>(
      this.buildUrl((a) => a.sendSSOLink),
      requestBody,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
  }
}
