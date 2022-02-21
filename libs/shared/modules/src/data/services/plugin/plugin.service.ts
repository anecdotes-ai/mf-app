import { MultipleAccountsFieldsEnum } from './../../../plugins-connection/models/multiple-accounts-fields.enum';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Service, ServiceLog, ZendeskMetadata } from '../../models/domain';
import { PluginInstruction } from '../../models';
import { AbstractService } from '../abstract-http/abstract-service';
import { AppConfigService } from 'core/services/config/app.config.service';
import { InstallPluginRequestBody, ServiceInstanceRequestEntity } from './models/install-plugin-request-body.model';
import { Operation } from 'fast-json-patch';
import { SvgRegistryService } from 'core/modules/svg-icons';
import { OnPremFieldsEnum } from 'core/modules/plugins-connection/models/on-prem-fields.enum';
import { v4 as uuidv4 } from 'uuid';
import { Dictionary } from '@ngrx/entity';

const defaultPluginIconPath = 'plugins/default';

@Injectable()
export class PluginService extends AbstractService {
  private readonly resourcesHttpClient: HttpClient;

  constructor(
    http: HttpClient,
    configService: AppConfigService,
    httpBackend: HttpBackend,
    private svgRegistryService: SvgRegistryService
  ) {
    super(http, configService);
    this.resourcesHttpClient = new HttpClient(httpBackend);
  }

  getAvailableServices(control_id: string, requirement: string): Observable<Service[]> {
    return this.http.get<Service[]>(this.buildUrl((a) => a.getAvailableServices, { control_id, requirement }));
  }

  getAllServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.buildUrl((a) => a.getAllServices));
  }

  getSpecificService(service_id: string): Observable<Service> {
    return this.http.get<Service>(this.buildUrl((a) => a.getSpecificService, { service_id }));
  }

  getSpecificServiceInstance(service_id: string, service_instance_id: string): Observable<Service> {
    return this.http.get<Service>(
      this.buildUrl((a) => a.getSpecificServiceInstance, { service_id, service_instance_id })
    );
  }

  deleteService(service_id: string): Observable<Service> {
    return this.http.delete<Service>(
      this.buildUrl((a) => a.deleteService, { service_id })
    );
  }

  deleteServiceInstance(service_id: string, selectedServiceInstance: string): Observable<Service> {
    return this.http.delete<Service>(
      this.buildUrl((a) => a.deleteServiceInstance, { service_id, service_instance_ids: selectedServiceInstance })
    );
  }

  getServiceMetadata(service_id: string, selectedServiceInstance: string): Observable<any | ZendeskMetadata> {
    return this.http.get<any>(this.buildUrl((a) => a.getServiceMetadata, { service_id, service_instance_id: selectedServiceInstance }));
  }

  getServiceLogs(service_id: string): Observable<Dictionary<ServiceLog[]>> {
    return this.http.get<Dictionary<ServiceLog[]>>(this.buildUrl((a) => a.getServiceLogs, { service_id }));
  }

  getServiceInstanceLogs(service_id: string, service_instance_id: string): Observable<Dictionary<ServiceLog[]>> {
    return this.http.get<Dictionary<ServiceLog[]>>(
      this.buildUrl((a) => a.getServiceInstanceLogs, { service_id, service_instance_ids: service_instance_id })
    );
  }

  installService(serviceBody: InstallPluginRequestBody): Observable<Service> {
    const formData = new FormData();
    const instancesRequestObjectArray: ServiceInstanceRequestEntity[] = [];

    serviceBody.pending_connection_instances.forEach((instance) => {
      const instanceRequestObject: ServiceInstanceRequestEntity = {};
      const params = { ...instance.connection_form_values };

      if (
        instance.instance_id &&
        serviceBody.service.service_instances_list?.find((s) => s.service_instance_id === instance.instance_id)
      ) {
        instanceRequestObject.service_instance_id = instance.instance_id;
      }

      if (this.isOnPremService(params)) {
        instanceRequestObject.tunnel_params = {
          service_agent_id: params[OnPremFieldsEnum.AgentID],
          service_host: params[OnPremFieldsEnum.Hostname],
          service_port: params[OnPremFieldsEnum.Port],
        };

        delete params[OnPremFieldsEnum.AgentID];
        delete params[OnPremFieldsEnum.Hostname];
        delete params[OnPremFieldsEnum.Port];
      }

      if (instance.connection_form_values[MultipleAccountsFieldsEnum.AccountName]) {
        instanceRequestObject.service_instance_display_name = params[MultipleAccountsFieldsEnum.AccountName];
        delete params[MultipleAccountsFieldsEnum.AccountName];
      }

      const files: { file: File; fieldName: string }[] = [];

      // Extract files and remove them from 'params' source dictionary;
      Object.keys(params).forEach((key) => {
        const value = params[key];

        if (value instanceof File) {
          files.push({ file: value, fieldName: key });
          delete params[key];
        }
      });

      if (files.length) {
        instanceRequestObject.service_files_details = files.map((fileMapObj) => {
          const fileId = uuidv4();
          formData.append(fileId, fileMapObj.file);

          return {
            file_id: fileId,
            file_field_name: fileMapObj.fieldName,
          };
        });
      }

      instanceRequestObject.service_secrets = params;

      instancesRequestObjectArray.push(instanceRequestObject);
    });

    formData.append('service_id', serviceBody.service.service_id);
    formData.append('service_instances', JSON.stringify(instancesRequestObjectArray));

    return this.http.post<Service>(
      this.buildUrl((a) => a.installService),
      formData
    );
  }

  private isOnPremService(secrets: { [key: string]: any }): boolean {
    return (
      secrets?.[OnPremFieldsEnum.AgentID] && secrets?.[OnPremFieldsEnum.Hostname] && secrets?.[OnPremFieldsEnum.Port]
    );
  }

  // Operation
  reconnectService(
    service_id: string,
    service_instance_id: string,
    service_secrets_operations: Operation[]
  ): Observable<void> {
    const formData = new FormData();
    const secrets = [];

    service_secrets_operations.forEach((patch) => {
      if (patch['value'] instanceof File) {
        formData.append(patch.path, patch['value']);
      } else {
        secrets.push(patch);
      }
    });

    if (secrets.length) {
      formData.append('patch_ops', JSON.stringify(secrets));
    }

    return this.http.patch<void>(
      this.buildUrl((a) => a.reconnectService, { service_id, service_instance_id }),
      formData
    );
  }

  createTask(service_id: string): Observable<any> {
    return this.http.post(
      this.buildUrl((a) => a.createServiceTask, { service_id }),
      null
    );
  }

  getPluginRoute(serviceId: string): string {
    return `/plugins/${serviceId}`;
  }

  getServiceIconLink(serviceId: string, isLarge = false): Observable<string> {
    return of(this.getServiceIconLinkSync(serviceId));
  }

  getServiceIconLinkSync(serviceId: string): string {
    const lowerCasedPluginId = serviceId.toLowerCase();
    const pluginIconPath = `plugins/${lowerCasedPluginId}`;
    return this.svgRegistryService.doesIconExist(pluginIconPath) ? pluginIconPath : defaultPluginIconPath;
  }

  getPluginInstruction(serviceId: string): Observable<PluginInstruction> {
    return this.resourcesHttpClient.get<PluginInstruction>(
      `assets/plugins/instructions/${serviceId.toLowerCase()}.json`
    );
  }

  addPluginToFavourites(service_id: string): Observable<any> {
    return this.http.post<Service>(
      this.buildUrl((a) => a.addServiceToFavourites, { service_id }),
      null
    );
  }

  removePluginFromfavourites(service_id: string): Observable<any> {
    return this.http.delete<Service>(this.buildUrl((a) => a.removeServiceFromFavourites, { service_id }));
  }
}
