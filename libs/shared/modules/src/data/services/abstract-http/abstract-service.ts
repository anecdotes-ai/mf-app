import { SlackEndpoints, EndpointsConfiguration, SnapshotEndpoints, NotificationsEndpoints } from 'core/models/configuration-file.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'core/services/config/app.config.service';
import { trim } from 'core/utils';
import { environment } from 'src/environments/environment';

const defaultSeparator = '/';
const backSlash = '\\';

@Injectable()
export abstract class AbstractService {
  constructor(protected http: HttpClient, protected configService: AppConfigService) {}

  protected buildUrl(
    enpointSelector: (endpointConfig: EndpointsConfiguration) => string,
    params?: { [key: string]: number | string | boolean }
  ): string {
    return this.genericBuildUrl(enpointSelector, this.configService.config.api, params);
  }

  protected builSlackdUrl(
    enpointSelector: (endpointConfig: SlackEndpoints) => string,
    params?: { [key: string]: number | string | boolean }
  ): string {
    return this.genericBuildUrl(enpointSelector, this.configService.config.slackApi, params);
  }

  protected builNotificationsUrl(
    enpointSelector: (endpointConfig: NotificationsEndpoints) => string,
    params?: { [key: string]: number | string | boolean }
  ): string {
    return this.genericBuildUrl(enpointSelector, this.configService.config.notificationsApi, params);
  }

  private genericBuildUrl<T>(
    enpointSelector: (endpointConfig: T) => string,
    config: { baseUrl: string; endpoints: T },
    params?: { [key: string]: number | string | boolean }
  ): string {
    const baseUrl = trim(config.baseUrl.replace(backSlash, defaultSeparator), defaultSeparator);
    const endpoint = trim(enpointSelector(config.endpoints).replace(backSlash, defaultSeparator), defaultSeparator);

    return this.createResultUrl(baseUrl, endpoint, params);
  }

  protected builSnapshotUrl(
    enpointSelector: (endpointConfig: SnapshotEndpoints) => string,
    params?: { [key: string]: number | string | boolean }
  ): string {
    const baseUrl = trim(
      this.configService.config.snapshotApi.baseUrl.replace(backSlash, defaultSeparator),
      defaultSeparator
    );
    const endpoint = trim(
      enpointSelector(this.configService.config.snapshotApi.endpoints).replace(backSlash, defaultSeparator),
      defaultSeparator
    );

    return this.createResultUrl(baseUrl, endpoint, params);
  }

  private createResultUrl(
    baseUrl: string,
    endpoint: string,
    params?: { [key: string]: number | string | boolean }
  ): string {
    return `${baseUrl}${defaultSeparator}${this.setParams(endpoint, params)}`;
  }

  private setParams(endpoint: string, params: { [key: string]: number | string | boolean }): string {
    if (!environment.production) {
      if (endpoint.toLowerCase().endsWith('.json')) {
        return endpoint; // to support mock data during local development so that we don't depend on API (as the API is unstable currently)
      }
    }

    if (params) {
      Object.keys(params).forEach((key) => {
        endpoint = endpoint.replace(`{{${key}}}`, params[key].toString());
      });
    }

    return endpoint;
  }
}
