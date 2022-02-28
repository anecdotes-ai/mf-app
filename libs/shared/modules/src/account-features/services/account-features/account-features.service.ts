import { Injectable } from '@angular/core';
import { AccountFeatureEnum } from 'core/modules/data/models/domain';
import { CustomerFacadeService } from 'core/modules/data/services';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class AccountFeaturesService {
  constructor(private customerFacadeService: CustomerFacadeService) {}

  getAccountFeatures(): Observable<AccountFeatureEnum[]> {
    return this.customerFacadeService.getCurrentCustomerAccountFeatures();
  }

  doesAccountHaveFeature(feature: AccountFeatureEnum): Observable<boolean> {
    return this.getAccountFeatures().pipe(
      filter((features) => !!features),
      map((features) => features.includes(feature))
    );
  }
}
