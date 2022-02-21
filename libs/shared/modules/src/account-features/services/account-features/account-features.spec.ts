import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { AccountFeatureEnum } from 'core/modules/data/models/domain';
import { CustomerFacadeService } from 'core/modules/data/services';
import { reducers } from 'core/modules/data/store';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { AccountFeaturesService } from './account-features.service';

describe('AccountFeaturesService', () => {
  let serviceUnderTest: AccountFeaturesService;
  let customerFacadeService: CustomerFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: CustomerFacadeService, useValue: {} }],
      imports: [StoreModule.forRoot(reducers)],
    });

    serviceUnderTest = TestBed.inject(AccountFeaturesService);
    customerFacadeService = TestBed.inject(CustomerFacadeService);
    customerFacadeService.getCurrentCustomerAccountFeatures = jasmine
      .createSpy('getCurrentCustomerAccountFeatures')
      .and.returnValue(of([AccountFeatureEnum.AdoptFramework]));
  });

  it('should be created', () => {
    expect(serviceUnderTest).toBeTruthy();
  });

  describe('#getAccountFeatures', () => {
    it('should return account features', async () => {
      // Act
      const accountFeatures = await serviceUnderTest.getAccountFeatures().pipe(take(1)).toPromise();

      // Assert
      expect(accountFeatures).toEqual([AccountFeatureEnum.AdoptFramework]);
    });
  });

  describe('#doesAccountHaveFeature', () => {
    it('should return true if account feature includes passed feature', async () => {
      // Act
      const doesAccountHaveFeature = await serviceUnderTest
        .doesAccountHaveFeature(AccountFeatureEnum.AdoptFramework)
        .pipe(take(1))
        .toPromise();

      // Assert
      expect(doesAccountHaveFeature).toBeTrue();
    });

    it('should return false if account feature does not include passed feature', async () => {
      // Act
      const doesAccountHaveFeature = await serviceUnderTest
        .doesAccountHaveFeature(AccountFeatureEnum.AuditZone)
        .pipe(take(1))
        .toPromise();

      // Assert
      expect(doesAccountHaveFeature).toBeFalse();
    });
  });
});
