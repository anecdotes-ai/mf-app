import { Injectable } from '@angular/core';
import { AbstractService } from '../abstract-http/abstract-service';
import { Observable } from 'rxjs';
import { ApplicabilitiesUpdate, Customer } from '../../models/domain';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'core/services/config/app.config.service';
import { ApplicabilityTypes, ChangeApplicability } from '../../models';

@Injectable()
export class CustomerService extends AbstractService {
  constructor(http: HttpClient, configService: AppConfigService) {
    super(http, configService);
  }

  getCustomer(): Observable<Customer> {
    return this.http.get<Customer>(this.buildUrl((t) => t.getCustomer));
  }

  // currently, we only changed the applicability of onboarding for this customer to true
  onBoardCustomer(): Observable<ApplicabilitiesUpdate> {
    return this.http.put<ApplicabilitiesUpdate>(
      this.buildUrl((t) => t.onBoardCustomer),
      [{
        applicability_id: '0',
        applicability_type: ApplicabilityTypes.ONBOARDING,
        is_applicable: true,
      }] as ChangeApplicability[]
    );
  }
}
