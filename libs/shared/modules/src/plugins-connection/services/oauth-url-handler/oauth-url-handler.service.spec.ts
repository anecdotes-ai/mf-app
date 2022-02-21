/* tslint:disable:no-unused-variable */
import { TestBed } from '@angular/core/testing';
import { TenantSubDomainExtractorService } from 'core/modules/auth-core/services';
import { OAuthUrlHandlerService } from './oauth-url-handler.service';

describe('Service: OauthUrlHandler', () => {
  let serviceUnderTest: OAuthUrlHandlerService;
  let tenantSubDomainExtractorMock: TenantSubDomainExtractorService;

  const fakeCurrentSubdomain = 'https://subdomain.domain.com';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OAuthUrlHandlerService, { provide: TenantSubDomainExtractorService, useValue: {} }],
    });
  });

  beforeEach(() => {
    serviceUnderTest = TestBed.inject(OAuthUrlHandlerService);
    tenantSubDomainExtractorMock = TestBed.inject(TenantSubDomainExtractorService);
    tenantSubDomainExtractorMock.getCurrentTenantUrl = jasmine
      .createSpy('getCurrentTenantUrl')
      .and.returnValue(fakeCurrentSubdomain);
  });

  function getInputUrlWithoutState(): string {
    return `https://auth.fake.com/authorize?audience=api.fake.com&client_id=3bJbfA1NXbZdVi5W0lGsUeINTZ6WgnKT&scope=offline_access read:jira-work manage:jira-project manage:jira-configuration write:jira-work read:jira-user&redirect_uri=https://fake-sub-domain.fake-domain.com/fake-route/fake&response_type=code&prompt=consent`;
  }

  function getInputUrlWithState(state: string): string {
    return getInputUrlWithoutState() + `&state=${state}`;
  }

  describe('modifyRedirectUri()', () => {
    describe('input url has state in redirect_uri', () => {
      it('should modify state with JSON object containing redirectOrigin and origState encoded to base64', () => {
        // Arrange
        const fakeOrigState = 'fakeOrigState';
        const modifiedState = {
          redirectOrigin: fakeCurrentSubdomain,
          origState: fakeOrigState,
        };
        const expectedEncodedState = window.btoa(JSON.stringify(modifiedState));

        // Act
        const actual = serviceUnderTest.modifyRedirectUri(getInputUrlWithState(fakeOrigState));

        // Assert
        expect(actual).toBe(getInputUrlWithState(expectedEncodedState));
      });
    });

    describe('input url does not have state in redirect_uri', () => {
      it('should add state param with JSON object containing redirectOrigin encoded to base64', () => {
        // Arrange
        const modifiedState = {
          redirectOrigin: fakeCurrentSubdomain,
        };
        const expectedEncodedState = window.btoa(JSON.stringify(modifiedState));

        // Act
        const actual = serviceUnderTest.modifyRedirectUri(getInputUrlWithoutState());

        // Assert
        expect(actual).toBe(getInputUrlWithState(expectedEncodedState));
      });
    });
  });
});
