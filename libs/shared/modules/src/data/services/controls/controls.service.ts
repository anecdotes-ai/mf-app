import { CustomControlFormData } from './models/add-customer-control.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Control, ApplicabilitiesUpdate, ControlStatus, CustomControl} from '../../models/domain';
import { AbstractService } from '../abstract-http/abstract-service';
import { AppConfigService } from 'core/services/config/app.config.service';
import { ApplicabilityTypes, ChangeApplicability } from '../../models';

@Injectable()
export class ControlsService extends AbstractService {
  constructor(http: HttpClient, configService: AppConfigService) {
    super(http, configService);
  }

  getControls(): Observable<Control[]> {
    return this.http.get<Control[]>(this.buildUrl((t) => t.getControls));
  }

  getControlsByFramework(framework_id: string): Observable<Control[]> {
    return this.http.get<Control[]>(this.buildUrl((t) => t.getControlsByFramework, { framework_id }));
  }

  changeApplicabilityState(control_ids: string[], control_is_applicable: boolean): Observable<ApplicabilitiesUpdate> {
    const requestBody: ChangeApplicability[] = control_ids.map((control_id) => ({
      applicability_id: control_id,
      applicability_type: ApplicabilityTypes.CONTROL,
      is_applicable: control_is_applicable,
    }));

    return this.http.put<ApplicabilitiesUpdate>(
      this.buildUrl((t) => t.changeApplicability),
      requestBody
    );
  }

  addNewCustomControl(framework_id: string, formData: CustomControlFormData): Observable<CustomControlFormData> {
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        delete formData[key];
      }
    });

    return this.http.post<CustomControlFormData>(
      this.buildUrl((a) => a.addCustomControl, {
        control_framework: framework_id,
      }),
      formData
    );
  }

  updateCustomControl(control_id: string, requestModel: CustomControlFormData): Observable<CustomControlFormData> {
    requestModel.control_description = requestModel.control_description ?? '';
    return this.http.put<CustomControlFormData>(
      this.buildUrl((a) => a.updateCustomControl, {
        control_id,
      }),
      requestModel
    );
  }

  getControl(control_id: string): Observable<Control> {
    return this.http.get<Control>(this.buildUrl((t) => t.getControl, { control_id }));
  }

  removeCustomControl(control_id: string): Observable<any> {
    return this.http.delete(this.buildUrl((t) => t.removeCustomControl, { control_id }));
  }
  
  patchControl(control_id: string, requestModel: CustomControl): Observable<any>{
    return this.http.patch<CustomControl>(
      this.buildUrl((a) => a.patchControl,{
        control_id,
      }),
      requestModel
    );
  }
}
