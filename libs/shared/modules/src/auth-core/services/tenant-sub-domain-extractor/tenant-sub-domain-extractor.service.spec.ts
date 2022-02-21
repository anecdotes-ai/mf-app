import { TestBed } from '@angular/core/testing';
import { AppConfigService, ConfigurationFile, WindowHelperService } from 'core';
import { TenantSubDomainExtractorService } from './tenant-sub-domain-extractor.service';

describe('Service: TenantSubDomainExtractorService', () => {
  let serviceUnderTest: TenantSubDomainExtractorService;
  let windowHelperMock: WindowHelperService;
  let appConfigMock: AppConfigService;

  let fakeLocation: Location;
  let fakeConfig: ConfigurationFile;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TenantSubDomainExtractorService,
        { provide: WindowHelperService, useValue: {} },
        { provide: AppConfigService, useValue: {} },
      ],
    });
  });

  beforeEach(() => {
    serviceUnderTest = TestBed.inject(TenantSubDomainExtractorService);
    windowHelperMock = TestBed.inject(WindowHelperService);
    fakeLocation = {} as any;
    windowHelperMock.getWindow = jasmine.createSpy('getWindow').and.callFake(() => ({
      location: fakeLocation,
    }));
    appConfigMock = TestBed.inject(AppConfigService);
    fakeConfig = {} as any;
    (appConfigMock.config as any) = fakeConfig;
  });

  describe('getTenantSubDomain()', () => {
    it(`should replace ${TenantSubDomainExtractorService.TenantSubdomainVariable} in tenantSubDomainFormat with subdomain from location.hostname`, () => {
      // Arrange
      const expected = 'expectedtenant';
      fakeLocation.hostname = `${expected}.fake.com`;
      fakeConfig.auth = {
        tenantSubDomainFormat: '{{tenant_sub_domain}}-fake',
      };

      // Act
      const actual = serviceUnderTest.getCurrentTenantSubDomain();

      // Assert
      expect(actual).toBe(`${expected}-fake`);
    });

    it('should replace query param template variables to queryparams from location in auth.tenantSubDomainFormat', () => {
      // Arrange
      const expected = 'expectedtenant';
      fakeLocation.hostname = `${expected}.fake.com`;
      fakeLocation.search = '?foo=bar&tort=cake';
      fakeConfig.auth = {
        tenantSubDomainFormat: '{{queryParam(foo)}}-{{queryParam(tort)}}',
      };

      // Act
      const actualCurrentTenant = serviceUnderTest.getCurrentTenantSubDomain();

      // Assert
      expect(actualCurrentTenant).toBe(`bar-cake`);
    });
  });

  describe('getTenantUrl()', () => {
    it(`should replace ${TenantSubDomainExtractorService.TenantSubdomainVariable} variable in auth.tenantRedirectUrlFormat with fakeTenantSubDomain`, () => {
      // Arrange
      const fakeTenantSubDomain = 'fakesubdomain';
      fakeConfig.auth = {
        tenantRedirectUrlFormat: `https://${TenantSubDomainExtractorService.TenantSubdomainVariable}.fake.com`,
      };

      // Act
      const actual = serviceUnderTest.getTenantUrl(fakeTenantSubDomain);

      // Assert
      expect(actual).toBe(`https://${fakeTenantSubDomain}.fake.com`);
    });

    it(`should replace ${TenantSubDomainExtractorService.LocationOriginVariable} variable in tenantRedirectUrlFormat with location.origin`, () => {
      // Arrange
      (fakeLocation as any).origin = 'https://fake.origin.com';
      fakeConfig.auth = {
        tenantRedirectUrlFormat: `some_${TenantSubDomainExtractorService.LocationOriginVariable}_string`,
      };

      const fakeTenantSubDomain = 'fakesubdomain';

      // Act
      const actualTenantUrl = serviceUnderTest.getTenantUrl(fakeTenantSubDomain);

      // Assert
      expect(actualTenantUrl).toBe('some_https://fake.origin.com_string');
    });

    it('should replace query param template variables to queryparams from location', () => {
      // Arrange
      fakeLocation.search = '?foo=bar&tort=cake';
      fakeConfig.auth = {
        tenantRedirectUrlFormat: 'https://stop.com/{{queryParam(foo)}}/{{queryParam(tort)}}',
      };

      const fakeTenantSubDomain = 'fakesubdomain';

      // Act
      const actualTenantUrl = serviceUnderTest.getTenantUrl(fakeTenantSubDomain);

      // Assert
      expect(actualTenantUrl).toBe('https://stop.com/bar/cake');
    });
  });

  describe('getTenantSignInUrl', () => {
    const tenantRedirectUrlFormat = `https://${TenantSubDomainExtractorService.TenantSubdomainVariable}.fake.com`;

    beforeEach(() => {
      fakeConfig.auth = {
        tenantRedirectUrlFormat,
      };
    });

    describe('tenantRedirectUrlFormat in config does not exist', () => {
      beforeEach(() => {
        fakeConfig.auth.tenantSignInUrlFormat = undefined;
      });

      it(`should return sign-in url based on tenant url with ${TenantSubDomainExtractorService.TenantSubdomainVariable} replaced with provided subdomain`, () => {
        // Arrange
        const fakeTenantSubDomain = 'fakesubdomain';

        // Act
        const actualSignInUrl = serviceUnderTest.getTenantSignInUrl(fakeTenantSubDomain);

        // Assert
        expect(actualSignInUrl).toBe(`https://${fakeTenantSubDomain}.fake.com/auth/sign-in`);
      });
    });

    describe('tenantRedirectUrlFormat exists', () => {
      beforeEach(() => {
        fakeConfig.auth.tenantSignInUrlFormat = `${TenantSubDomainExtractorService.TenantSignInRedirectPathVariable}?foo=bar`;
      });

      it(`should return sign-in url based on tenantSignInUrlFormat with replaced ${TenantSubDomainExtractorService.TenantSignInRedirectPathVariable} with sign-in path`, () => {
        // Arrange
        const fakeTenantSubDomain = 'fakesubdomain';

        // Act
        const actualSignInUrl = serviceUnderTest.getTenantSignInUrl(fakeTenantSubDomain);

        // Assert
        expect(actualSignInUrl).toBe(`https://${fakeTenantSubDomain}.fake.com/auth/sign-in?foo=bar`);
      });
    });
  });
});
