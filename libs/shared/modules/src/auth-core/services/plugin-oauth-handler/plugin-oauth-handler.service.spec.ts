/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { origStateKey, PluginOauthHandlerService, redirectOriginKey, stateKey } from './plugin-oauth-handler.service';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';

describe('Service: PluginOauthHandlerService', () => {
  let serviceUnderTest: PluginOauthHandlerService;

  let windowHelperServiceMock: WindowHelperService;

  let fakeWindow: Window;
  let fakeLocation: Location;
  let fakeStateObject: { redirectOrigin: string; origState?: string };
  const fakeRedirectOrigin = 'https://fake.redirect.origin';
  const fakeState = 'fakeState';
  let fakeQueryParams;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PluginOauthHandlerService, { provide: WindowHelperService, useValue: {} }],
    });
  });

  beforeEach(() => {
    serviceUnderTest = TestBed.inject(PluginOauthHandlerService);
    windowHelperServiceMock = TestBed.inject(WindowHelperService);
    fakeWindow = {} as any;
    fakeLocation = {} as Location;
    fakeWindow.location = fakeLocation;
    fakeWindow.open = jasmine.createSpy('open');
    fakeWindow.atob = jasmine.createSpy('atob').and.callFake(() => JSON.stringify(fakeStateObject));
    fakeLocation.pathname = '/fake/path';
    fakeQueryParams = {
      [stateKey]: fakeState,
      someQueryParam: 'xyz',
      oneMoreQueryParam: 'foo',
    };

    windowHelperServiceMock.getWindow = jasmine.createSpy('getWindow').and.returnValue(fakeWindow);
    windowHelperServiceMock.openUrl = jasmine.createSpy('openUrl');
  });

  function stringifyQueryParams(queryParams): string {
    return `?${Object.keys(queryParams)
      .map((key) => `${key}=${queryParams[key]}`)
      .join('&')}`;
  }

  describe('handlePluginRedirection()', () => {
    describe('original state provided', () => {
      it('should decode state and open url with redirectOriginKey with passing query params and original state', () => {
        // Arrange
        const fakeOrigState = 'fakeorigstate';

        fakeStateObject = {
          [origStateKey]: fakeOrigState,
          [redirectOriginKey]: fakeRedirectOrigin,
        };
        const expectedQueryParams = {
          ...fakeQueryParams,
          [stateKey]: fakeOrigState,
        };

        // Act
        serviceUnderTest.handlePluginRedirection(fakeQueryParams);

        // Assert
        expect(fakeWindow.atob).toHaveBeenCalledWith(fakeState);
        expect(windowHelperServiceMock.openUrl).toHaveBeenCalledWith(
          `${fakeRedirectOrigin}${fakeLocation.pathname}${stringifyQueryParams(expectedQueryParams)}`
        );
      });
    });

    describe('original state is not provided', () => {
      it('should decode state and open url with redirectOriginKey with passing query params', () => {
        // Arrange
        fakeStateObject = {
          [redirectOriginKey]: fakeRedirectOrigin,
        };

        const expectedQueryParams = {
          ...fakeQueryParams,
        };
        delete expectedQueryParams[stateKey];

        // Act
        serviceUnderTest.handlePluginRedirection(fakeQueryParams);

        // Assert
        expect(fakeWindow.atob).toHaveBeenCalledWith(fakeState);
        expect(windowHelperServiceMock.openUrl).toHaveBeenCalledWith(
          `${fakeRedirectOrigin}${fakeLocation.pathname}${stringifyQueryParams(expectedQueryParams)}`
        );
      });
    });
  });

  describe('isNewRedirection()', () => {
    it('should return true if query params contain state key that is encoded state object', () => {
      // Arrange
      fakeStateObject = {
        [origStateKey]: 'foo',
        [redirectOriginKey]: fakeRedirectOrigin,
      };
      fakeQueryParams = {
        [stateKey]: fakeState,
      };
      fakeWindow.atob = jasmine.createSpy('atob').and.returnValue(JSON.stringify(fakeStateObject));

      // Act
      const actual = serviceUnderTest.isNewRedirection(fakeQueryParams);

      // Assert
      expect(fakeWindow.atob).toHaveBeenCalledWith(fakeState);
      expect(actual).toBeTrue();
    });

    it('should return false when query params does not have state param', () => {
      // Arrange
      fakeQueryParams = {
        foo: 'bar',
      };
      // Act
      const actual = serviceUnderTest.isNewRedirection(fakeQueryParams);

      // Assert
      expect(actual).toBeFalse();
    });

    it('should return false when state in query params is not base64 string', () => {
      // Arrange
      fakeQueryParams = {
        foo: 'bar',
      };
      fakeWindow.atob = jasmine.createSpy('atob').and.throwError(new Error());

      // Act
      const actual = serviceUnderTest.isNewRedirection(fakeQueryParams);

      // Assert
      expect(actual).toBeFalse();
    });

    it('should return false when state in query params is not state object', () => {
      // Arrange
      fakeQueryParams = {
        [stateKey]: fakeState,
        foo: 'bar',
      };
      fakeWindow.atob = jasmine.createSpy('atob').and.returnValue(JSON.stringify({}));

      // Act
      const actual = serviceUnderTest.isNewRedirection(fakeQueryParams);

      // Assert
      expect(fakeWindow.atob).toHaveBeenCalledWith(fakeState);
      expect(actual).toBeFalse();
    });
  });
});
