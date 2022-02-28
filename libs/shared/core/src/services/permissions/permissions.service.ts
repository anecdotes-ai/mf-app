import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Permissions } from '../../models';

@Injectable(
  // TODO: Must be removed. Currently cannot be removed since it breaks lots of tests
  {
    providedIn: 'root' 
  }
)
export class PermissionsService {
  private httpClient: HttpClient;

  constructor(httpBackend: HttpBackend) {
    this.httpClient = new HttpClient(httpBackend);
  }

  getPermissions(serviceId: string): Observable<Permissions> {
    return this.httpClient.get<Permissions>(`assets/plugins/permissions/${serviceId}.json`);
  }
}
