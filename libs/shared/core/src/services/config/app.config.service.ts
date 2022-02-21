import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConfigurationFile } from '../../models/index';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  public get config(): ConfigurationFile {
    return environment.config;
  }
}
