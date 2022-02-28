import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConfigurationFile } from '../../models/index';

@Injectable(
  // TODO: Must be removed. Currently cannot be removed since it breaks lots of tests
  {
    providedIn: 'root' 
  }
)
export class AppConfigService {
  public get config(): ConfigurationFile {
    return environment.config;
  }
}
