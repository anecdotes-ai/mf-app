import { inject, TestBed } from '@angular/core/testing';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';
import { TenantService } from '../../http';
import { TenantSubDomainExtractorService } from '../../tenant-sub-domain-extractor/tenant-sub-domain-extractor.service';
import { TenantFacadeService } from './tenant-facade.service';

describe('Service: TenantFacade', () => {
  let serviceUnderTest: TenantFacadeService;
  let tenantSubDomainExtractorServiceMock: TenantSubDomainExtractorService;
  let windowHelperServiceMock: WindowHelperService;

  let fakeTenantUrl: string;
  let fakeTenantSubDomain: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TenantFacadeService,
        { provide: TenantService, useValue: {} },
        { provide: TenantSubDomainExtractorService, useValue: {} },
        { provide: WindowHelperService, useValue: {} },
      ],
    });
  });

  beforeEach(() => {
    serviceUnderTest = TestBed.inject(TenantFacadeService);
    tenantSubDomainExtractorServiceMock = TestBed.inject(TenantSubDomainExtractorService);
    windowHelperServiceMock = TestBed.inject(WindowHelperService);
    windowHelperServiceMock.openUrl = jasmine.createSpy('openUrl');
    tenantSubDomainExtractorServiceMock.getTenantUrl = jasmine
      .createSpy('getTenantUrl')
      .and.callFake(() => fakeTenantUrl);
    fakeTenantUrl = 'https://fake.com';
    fakeTenantSubDomain = 'fakesubdomain';
  });

  it('should ...', inject([TenantFacadeService], (service: TenantFacadeService) => {
    expect(service).toBeTruthy();
  }));

  describe('redirectToTenantSignIn', () => {
    let fakeTenantSignInUrl: string;

    beforeEach(() => {
      fakeTenantSignInUrl = 'https://fake.com/auth/sign-in';
      tenantSubDomainExtractorServiceMock.getTenantSignInUrl = jasmine.createSpy('getTenantSignInUrl').and.callFake(() => fakeTenantSignInUrl);
    });

    describe('no extra query params', () => {
      it('should call getTenantUrl', () => {
        // Arrange
        // Act
        serviceUnderTest.redirectToTenantSignIn(fakeTenantSubDomain);

        // Assert
        expect(tenantSubDomainExtractorServiceMock.getTenantSignInUrl).toHaveBeenCalled();
      });

      it('should open tenant url', () => {
        // Arrange
        // Act
        serviceUnderTest.redirectToTenantSignIn(fakeTenantSubDomain);

        // Assert
        expect(windowHelperServiceMock.openUrl).toHaveBeenCalledWith(fakeTenantSignInUrl);
      });
    });

    describe('there are extra queryParams', () => {
      const extraQueryParams = {
        foo: 'bar',
        qq: 'val',
      };

      describe('tenant url has query params', () => {
        it('should keep query params from tenant url and add extra query params', () => {
          // Arrange
          fakeTenantSignInUrl = 'https://fake.com?userId=123';

          // Act
          serviceUnderTest.redirectToTenantSignIn(fakeTenantSubDomain, extraQueryParams);

          // Assert
          expect(windowHelperServiceMock.openUrl).toHaveBeenCalledWith(`${fakeTenantSignInUrl}&foo=bar&qq=val`);
        });
      });

      describe('tenant url does not have query params', () => {
        it('should add extra query params', () => {
          // Arrange
          fakeTenantSignInUrl = 'https://fake.com';

          // Act
          serviceUnderTest.redirectToTenantSignIn(fakeTenantSubDomain, extraQueryParams);

          // Assert
          expect(windowHelperServiceMock.openUrl).toHaveBeenCalledWith(`${fakeTenantSignInUrl}?foo=bar&qq=val`);
        });
      });
    });
  });
});
